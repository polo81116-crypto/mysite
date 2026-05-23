/**
 * Google Apps Script order backend for the coffee shop frontend.
 *
 * Setup:
 * 1. Create a Google Sheet.
 * 2. Paste this file into Apps Script.
 * 3. Run setupProperties() once.
 * 4. Deploy as Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Paste the deployed /exec URL into orderApiUrl in src/App.jsx.
 */

const CONFIG = {
  SPREADSHEET_ID: "1H_hP3TLB4PQb2rVRD-iqn71z7-sPc0pOgtttX4r39v4",
  ORDERS_SHEET_NAME: "Orders",
  MYSHIP_SHEET_NAME: "\u8a02\u55ae\u532f\u5165",
  LOGS_SHEET_NAME: "ErrorLogs",
  ADMIN_EMAIL: "CAOBANCOFFEE@GMAIL.COM",
};

const ORDER_HEADERS = [
  "order_id",
  "created_at",
  "recipient",
  "phone",
  "email",
  "pickup_store",
  "store_id",
  "store_name",
  "store_address",
  "items",
  "item_summary",
  "subtotal",
  "discount",
  "shipping_fee",
  "total",
  "tax_id",
  "company_title",
  "social_account",
  "note",
  "myship_recipient_name",
  "myship_recipient_phone",
  "myship_store_id",
  "myship_store_name",
  "myship_store_address",
  "myship_remark",
  "myship_exported_at",
  "raw_payload",
];

const MYSHIP_HEADERS = [
  "\uff0a\u53d6\u4ef6\u4eba\u59d3\u540d",
  "\uff0a\u53d6\u4ef6\u4eba\u624b\u6a5f",
  "\uff0a\u53d6\u4ef6\u9580\u5e02",
  "* \u6eab\u5c64",
  "\uff0a\u5546\u54c1",
  "\uff0a\u8a02\u55ae\u91d1\u984d",
  "\uff0a\u904b\u8cbb\u91d1\u984d",
  "\u8cb7\u5bb6\u4e0b\u8a02\u65e5\u671f",
  "\u5546\u54c1\u5099\u8a3b",
  "\u5176\u4ed6\u8cc7\u8a0a(FB/LINE/IG\u5e33\u865f)",
];

function setupProperties() {
  PropertiesService.getScriptProperties().setProperties({
    SPREADSHEET_ID: CONFIG.SPREADSHEET_ID,
    ADMIN_EMAIL: CONFIG.ADMIN_EMAIL,
  });
}

function doGet() {
  return jsonResponse({
    ok: true,
    service: "order-backend",
    message: "Order backend is running.",
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const payload = parsePayload(e);
    validatePayload(payload);

    const orderId = createOrderId();
    const createdAt = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy/MM/dd HH:mm:ss");

    const sheet = getOrCreateSheet(getSpreadsheet(), CONFIG.ORDERS_SHEET_NAME, ORDER_HEADERS);
    const orderRow = buildOrderRow(orderId, createdAt, payload);
    sheet.appendRow(orderRow);
    appendMyShipImportRow(orderId, createdAt, payload);
    markOrderMyShipExported(sheet, sheet.getLastRow());

    sendOrderEmails(orderId, createdAt, payload);

    return jsonResponse({
      ok: true,
      orderId,
      message: "Order received.",
    });
  } catch (error) {
    logError(error, e);

    return jsonResponse({
      ok: false,
      message: error.message || String(error),
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (error) {
      // The lock may not have been acquired if Apps Script failed early.
    }
  }
}

function parsePayload(e) {
  if (!e) {
    throw new Error("Missing request event.");
  }

  if (e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }

  if (e.postData && e.postData.contents) {
    const contents = e.postData.contents;

    try {
      return JSON.parse(contents);
    } catch (error) {
      const params = parseFormEncoded(contents);
      if (params.payload) {
        return JSON.parse(params.payload);
      }
    }
  }

  throw new Error("Missing payload.");
}

function parseFormEncoded(contents) {
  return contents.split("&").reduce((params, pair) => {
    const parts = pair.split("=");
    const key = decodeURIComponent((parts[0] || "").replace(/\+/g, " "));
    const value = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));

    if (key) {
      params[key] = value;
    }

    return params;
  }, {});
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const requiredFields = [
    ["recipient", "recipient"],
    ["phone", "phone"],
    ["email", "email"],
    ["pickupStore", "pickupStore"],
    ["items", "items"],
  ];

  const missingFields = requiredFields
    .filter(([key]) => !String(payload[key] || "").trim())
    .map(([, label]) => label);

  if (missingFields.length > 0) {
    throw new Error("Missing required fields: " + missingFields.join(", "));
  }
}

function buildOrderRow(orderId, createdAt, payload) {
  return [
    orderId,
    createdAt,
    cleanText(payload.recipient),
    cleanText(payload.phone),
    cleanText(payload.email),
    cleanText(payload.pickupStore),
    cleanText(payload.storeId),
    cleanText(payload.storeName),
    cleanText(payload.storeAddress),
    cleanText(payload.items),
    cleanText(payload.itemSummary),
    cleanText(payload.subtotal),
    cleanText(payload.discount),
    cleanText(payload.shippingFee),
    cleanText(payload.total || payload.totalNumber),
    cleanText(payload.taxId),
    cleanText(payload.companyTitle),
    cleanText(payload.socialAccount),
    cleanText(payload.note),
    cleanText(payload.myshipRecipientName || payload.recipient),
    cleanText(payload.myshipRecipientPhone || payload.phone),
    cleanText(payload.myshipStoreId || payload.storeId),
    cleanText(payload.myshipStoreName || payload.storeName),
    cleanText(payload.myshipStoreAddress || payload.storeAddress),
    cleanText(payload.myshipRemark),
    "",
    JSON.stringify(payload),
  ];
}

function appendMyShipImportRow(orderId, createdAt, payload) {
  const sheet = getOrCreateSheet(getSpreadsheet(), CONFIG.MYSHIP_SHEET_NAME, MYSHIP_HEADERS);
  prepareMyShipSheet(sheet);
  appendTextRow(sheet, buildMyShipImportRow(orderId, createdAt, payload), MYSHIP_HEADERS.length);
}

function rebuildMyShipImportSheet() {
  const spreadsheet = getSpreadsheet();
  const ordersSheet = spreadsheet.getSheetByName(CONFIG.ORDERS_SHEET_NAME);

  if (!ordersSheet || ordersSheet.getLastRow() < 2) {
    throw new Error("No orders found.");
  }

  const values = ordersSheet.getDataRange().getValues();
  const headers = values[0];
  const rawPayloadIndex = headers.indexOf("raw_payload");
  const orderIdIndex = headers.indexOf("order_id");
  const createdAtIndex = headers.indexOf("created_at");
  const exportedAtIndex = ensureOrderColumn(ordersSheet, headers, "myship_exported_at");

  if (rawPayloadIndex === -1) {
    throw new Error("Orders sheet is missing raw_payload.");
  }

  const sheet = getOrCreateSheet(spreadsheet, CONFIG.MYSHIP_SHEET_NAME, MYSHIP_HEADERS);
  sheet.clearContents();
  sheet.appendRow(MYSHIP_HEADERS);
  prepareMyShipSheet(sheet);

  let exportedCount = 0;
  values.slice(1).forEach((row, rowIndex) => {
    const rawPayload = row[rawPayloadIndex];
    const exportedAt = row[exportedAtIndex];

    if (!rawPayload) return;
    if (cleanText(exportedAt)) return;

    const payload = JSON.parse(rawPayload);
    const orderId = row[orderIdIndex] || createOrderId();
    const createdAt = row[createdAtIndex] || "";
    appendTextRow(sheet, buildMyShipImportRow(orderId, createdAt, payload), MYSHIP_HEADERS.length);
    markOrderMyShipExported(ordersSheet, rowIndex + 2);
    exportedCount += 1;
  });

  return exportedCount;
}

function buildMyShipImportRow(orderId, createdAt, payload) {
  const shippingFee = amountNumber(payload.shippingFee);
  const total = amountNumber(payload.totalNumber || payload.total);
  const orderAmount = Math.max(total - shippingFee, 0);
  const itemText = truncateText(cleanText(payload.itemSummary || payload.items), 200);
  const itemNote = truncateText(cleanText(payload.myshipRemark || payload.note || orderId), 200);

  return [
    truncateText(cleanText(payload.recipient), 10),
    normalizePhone(payload.phone),
    getStoreId(payload),
    "\u5e38\u6eab",
    itemText,
    String(orderAmount),
    String(shippingFee),
    formatMyShipDate(createdAt || payload.orderTime),
    itemNote,
    truncateText(cleanText(payload.socialAccount), 200),
  ];
}

function prepareMyShipSheet(sheet) {
  sheet.setFrozenRows(1);
  sheet.getRange("A:J").setNumberFormat("@");
}

function appendTextRow(sheet, rowValues, columnCount) {
  const rowNumber = sheet.getLastRow() + 1;
  const values = rowValues.slice(0, columnCount).map((value) => cleanText(value));
  const range = sheet.getRange(rowNumber, 1, 1, columnCount);

  range.setNumberFormat("@");
  range.setValues([values]);
}

function markOrderMyShipExported(sheet, rowNumber) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const exportedAtIndex = ensureOrderColumn(sheet, headers, "myship_exported_at");
  const exportedAt = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy/MM/dd HH:mm:ss");

  sheet.getRange(rowNumber, exportedAtIndex + 1).setValue(exportedAt);
}

function resetMyShipExportStatus(orderId) {
  const sheet = getSpreadsheet().getSheetByName(CONFIG.ORDERS_SHEET_NAME);

  if (!sheet) {
    throw new Error("Orders sheet not found.");
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const orderIdIndex = headers.indexOf("order_id");
  const exportedAtIndex = ensureOrderColumn(sheet, headers, "myship_exported_at");

  if (orderIdIndex === -1) {
    throw new Error("Orders sheet is missing order_id.");
  }

  for (let index = 1; index < values.length; index += 1) {
    if (cleanText(values[index][orderIdIndex]) === cleanText(orderId)) {
      sheet.getRange(index + 1, exportedAtIndex + 1).clearContent();
      return orderId;
    }
  }

  throw new Error("Order not found: " + orderId);
}

function ensureOrderColumn(sheet, headers, columnName) {
  let index = headers.indexOf(columnName);

  if (index !== -1) {
    return index;
  }

  index = headers.length;
  sheet.getRange(1, index + 1).setValue(columnName);

  return index;
}

function getSpreadsheet() {
  const spreadsheetId =
    CONFIG.SPREADSHEET_ID ||
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");

  if (!spreadsheetId || spreadsheetId === "PASTE_YOUR_GOOGLE_SHEET_ID_HERE") {
    throw new Error("Please set SPREADSHEET_ID first.");
  }

  return SpreadsheetApp.openById(spreadsheetId);
}

function getOrCreateSheet(spreadsheet, sheetName, headers) {
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function sendOrderEmails(orderId, createdAt, payload) {
  notifyCustomer(orderId, createdAt, payload);
  notifyAdmin(orderId, createdAt, payload);
}

function notifyCustomer(orderId, createdAt, payload) {
  const email = cleanText(payload.email);

  if (!email) {
    return;
  }

  const subject = "\u652a\u62cc\u5496\u5561\u5546\u884c\u8a02\u55ae\u660e\u7d30\uff1a" + orderId;
  const body = buildCustomerTextEmail(orderId, createdAt, payload);
  const htmlBody = buildCustomerHtmlEmail(orderId, createdAt, payload);

  MailApp.sendEmail(email, subject, body, { htmlBody });
}

function notifyAdmin(orderId, createdAt, payload) {
  const email =
    PropertiesService.getScriptProperties().getProperty("ADMIN_EMAIL") ||
    CONFIG.ADMIN_EMAIL;

  if (!email) {
    return;
  }

  const subject = "\u65b0\u8a02\u55ae\u901a\u77e5\uff0c\u8acb\u5b89\u6392\u51fa\u8ca8\uff1a" + orderId;
  const body = buildAdminTextEmail(orderId, createdAt, payload);
  const htmlBody = buildAdminHtmlEmail(orderId, createdAt, payload);

  MailApp.sendEmail(email, subject, body, { htmlBody });
}

function buildCustomerTextEmail(orderId, createdAt, payload) {
  return [
    cleanText(payload.recipient) + " \u60a8\u597d\uff0c",
    "",
    "\u611f\u8b1d\u60a8\u7684\u8a02\u8cfc\uff0c\u6211\u5011\u5df2\u6536\u5230\u60a8\u7684\u8a02\u55ae\u660e\u7d30\u5982\u4e0b\u3002",
    "",
    "\u8a02\u55ae\u7de8\u865f\uff1a" + orderId,
    "\u8a02\u8cfc\u6642\u9593\uff1a" + createdAt,
    "\u6536\u4ef6\u4eba\uff1a" + cleanText(payload.recipient),
    "\u624b\u6a5f\uff1a" + cleanText(payload.phone),
    "Email: " + cleanText(payload.email),
    "\u53d6\u4ef6\u9580\u5e02\uff1a" + cleanText(payload.pickupStore),
    "",
    "\u5546\u54c1\u660e\u7d30\uff1a",
    cleanText(payload.items),
    "",
    "\u5c0f\u8a08\uff1a" + cleanText(payload.subtotal),
    "\u6298\u6263\uff1a" + cleanText(payload.discount),
    "\u904b\u8cbb\uff1a" + cleanText(payload.shippingFee),
    "\u7e3d\u91d1\u984d\uff1a" + cleanText(payload.total || payload.totalNumber),
    "",
    "\u5099\u8a3b\uff1a",
    cleanText(payload.note) || "\u7121",
    "",
    "\u6211\u5011\u6703\u76e1\u5feb\u70ba\u60a8\u5b89\u6392\u51fa\u8ca8\u3002",
    "",
    "\u652a\u62cc\u5496\u5561\u5546\u884c",
  ].join("\n");
}

function buildAdminTextEmail(orderId, createdAt, payload) {
  return [
    "\u6709\u4e00\u7b46\u65b0\u8a02\u55ae\uff0c\u8acb\u5b89\u6392\u51fa\u8ca8\u3002",
    "",
    "\u8a02\u55ae\u7de8\u865f\uff1a" + orderId,
    "\u8a02\u8cfc\u6642\u9593\uff1a" + createdAt,
    "\u6536\u4ef6\u4eba\uff1a" + cleanText(payload.recipient),
    "\u624b\u6a5f\uff1a" + cleanText(payload.phone),
    "Email: " + cleanText(payload.email),
    "\u53d6\u4ef6\u9580\u5e02\uff1a" + cleanText(payload.pickupStore),
    "\u9580\u5e02\u5e97\u865f\uff1a" + cleanText(payload.storeId),
    "\u9580\u5e02\u540d\u7a31\uff1a" + cleanText(payload.storeName),
    "\u9580\u5e02\u5730\u5740\uff1a" + cleanText(payload.storeAddress),
    "",
    "\u5546\u54c1\u660e\u7d30\uff1a",
    cleanText(payload.items),
    "",
    "\u5c0f\u8a08\uff1a" + cleanText(payload.subtotal),
    "\u6298\u6263\uff1a" + cleanText(payload.discount),
    "\u904b\u8cbb\uff1a" + cleanText(payload.shippingFee),
    "\u7e3d\u91d1\u984d\uff1a" + cleanText(payload.total || payload.totalNumber),
    "",
    "\u7d71\u4e00\u7de8\u865f\uff1a" + cleanText(payload.taxId),
    "\u516c\u53f8\u62ac\u982d\uff1a" + cleanText(payload.companyTitle),
    "\u5176\u4ed6\u8cc7\u8a0a\uff1a" + cleanText(payload.socialAccount),
    "\u5099\u8a3b\uff1a" + (cleanText(payload.note) || "\u7121"),
  ].join("\n");
}

function buildCustomerHtmlEmail(orderId, createdAt, payload) {
  return buildOrderHtmlEmail({
    preheader: "\u60a8\u7684\u652a\u62cc\u5496\u5561\u8a02\u55ae\u5df2\u6536\u5230\u3002",
    eyebrow: "\u8a02\u55ae\u78ba\u8a8d",
    title: "\u8b1d\u8b1d\u60a8\u7684\u8a02\u8cfc",
    intro: "\u6211\u5011\u5df2\u6536\u5230\u8a02\u55ae\uff0c\u6703\u7528\u5fc3\u70ba\u60a8\u6e96\u5099\u3002",
    orderId,
    createdAt,
    payload,
    actionLabel: "\u5df2\u6536\u5230\u8a02\u55ae",
    showStoreDetails: false,
  });
}

function buildAdminHtmlEmail(orderId, createdAt, payload) {
  return buildOrderHtmlEmail({
    preheader: "\u6709\u4e00\u7b46\u65b0\u8a02\u55ae\u9700\u8981\u5b89\u6392\u51fa\u8ca8\u3002",
    eyebrow: "\u65b0\u8a02\u55ae",
    title: "\u8acb\u5b89\u6392\u51fa\u8ca8",
    intro: "\u5ba2\u6236\u5df2\u5b8c\u6210\u4e0b\u55ae\uff0c\u8acb\u78ba\u8a8d\u4ee5\u4e0b\u8cc7\u8a0a\u3002",
    orderId,
    createdAt,
    payload,
    actionLabel: "\u5f85\u51fa\u8ca8",
    showStoreDetails: true,
  });
}

function buildOrderHtmlEmail(options) {
  const payload = options.payload;
  const recipientRows = [
    ["\u6536\u4ef6\u4eba", payload.recipient],
    ["\u624b\u6a5f", payload.phone],
    ["Email", payload.email],
    ["\u53d6\u4ef6\u9580\u5e02", payload.pickupStore],
  ];
  const storeRows = options.showStoreDetails
    ? [
        ["\u9580\u5e02\u5e97\u865f", payload.storeId],
        ["\u9580\u5e02\u540d\u7a31", payload.storeName],
        ["\u9580\u5e02\u5730\u5740", payload.storeAddress],
      ]
    : [];
  const summaryRows = [
    ["\u5c0f\u8a08", payload.subtotal],
    ["\u6298\u6263", payload.discount],
    ["\u904b\u8cbb", payload.shippingFee],
    ["\u7e3d\u91d1\u984d", payload.total || payload.totalNumber],
  ];
  const extraRows = [
    ["\u7d71\u4e00\u7de8\u865f", payload.taxId],
    ["\u516c\u53f8\u62ac\u982d", payload.companyTitle],
    ["\u5176\u4ed6\u8cc7\u8a0a", payload.socialAccount],
    ["\u5099\u8a3b", cleanText(payload.note) || "\u7121"],
  ];

  return [
    '<div style="display:none;max-height:0;overflow:hidden;color:#f6efe4;">',
    escapeHtml(options.preheader),
    "</div>",
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6efe4;margin:0;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#2a1a10;">',
    "<tr><td align=\"center\">",
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#fff8ec;border-radius:28px;overflow:hidden;border:1px solid #dccbb2;box-shadow:0 18px 50px rgba(42,26,16,0.16);">',
    '<tr><td style="background:#2a1a10;padding:34px 32px;color:#fff8ec;">',
    '<div style="font-size:12px;letter-spacing:3px;font-weight:700;color:#f3c178;">' + escapeHtml(options.eyebrow) + "</div>",
    '<h1 style="margin:10px 0 8px;font-size:30px;line-height:1.2;color:#fff8ec;">' + escapeHtml(options.title) + "</h1>",
    '<p style="margin:0;font-size:15px;line-height:1.7;color:#ead8bf;">' + escapeHtml(options.intro) + "</p>",
    "</td></tr>",
    '<tr><td style="padding:28px 32px 8px;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>',
    '<td style="padding:14px 16px;background:#efe2cf;border-radius:16px;"><div style="font-size:12px;color:#8a603b;font-weight:700;">\u8a02\u55ae\u7de8\u865f</div><div style="margin-top:5px;font-size:17px;font-weight:800;">' + escapeHtml(options.orderId) + "</div></td>",
    '<td style="width:12px;"></td>',
    '<td style="padding:14px 16px;background:#efe2cf;border-radius:16px;"><div style="font-size:12px;color:#8a603b;font-weight:700;">\u72c0\u614b</div><div style="margin-top:5px;font-size:17px;font-weight:800;">' + escapeHtml(options.actionLabel) + "</div></td>",
    "</tr></table>",
    '<div style="margin-top:12px;font-size:13px;color:#66513f;">\u8a02\u8cfc\u6642\u9593\uff1a' + escapeHtml(options.createdAt) + "</div>",
    "</td></tr>",
    sectionHtml("\u6536\u4ef6\u8cc7\u6599", recipientRows),
    options.showStoreDetails ? sectionHtml("\u9580\u5e02\u8cc7\u8a0a", storeRows) : "",
    itemsHtml(payload.items),
    sectionHtml("\u91d1\u984d\u6458\u8981", summaryRows, true),
    sectionHtml("\u5176\u4ed6\u8cc7\u8a0a", extraRows),
    '<tr><td style="padding:8px 32px 32px;">',
    '<div style="border-top:1px solid #dccbb2;padding-top:18px;font-size:13px;line-height:1.7;color:#66513f;">\u652a\u62cc\u5496\u5561\u5546\u884c<br>\u6b64\u4fe1\u4ef6\u7531\u8a02\u55ae\u7cfb\u7d71\u81ea\u52d5\u7522\u751f\u3002</div>',
    "</td></tr>",
    "</table>",
    "</td></tr>",
    "</table>",
  ].join("");
}

function sectionHtml(title, rows, emphasizeLastRow) {
  const rowHtml = rows
    .filter((row) => cleanText(row[1]))
    .map((row, index, filteredRows) => {
      const isLast = emphasizeLastRow && index === filteredRows.length - 1;
      const valueStyle = isLast ? "font-size:22px;font-weight:900;color:#2a1a10;" : "font-weight:700;color:#2a1a10;";
      return [
        '<tr><td style="padding:10px 0;border-bottom:1px solid #efe2cf;color:#8a603b;font-size:13px;">',
        escapeHtml(row[0]),
        '</td><td align="right" style="padding:10px 0;border-bottom:1px solid #efe2cf;',
        valueStyle,
        '">',
        escapeHtml(row[1]),
        "</td></tr>",
      ].join("");
    })
    .join("");

  return [
    '<tr><td style="padding:20px 32px 0;">',
    '<h2 style="margin:0 0 10px;font-size:18px;color:#5a341d;">' + escapeHtml(title) + "</h2>",
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:18px;padding:6px 16px;border:1px solid #efe2cf;">',
    rowHtml,
    "</table>",
    "</td></tr>",
  ].join("");
}

function itemsHtml(items) {
  const lines = cleanText(items).split("\n").filter(Boolean);
  const itemRows = lines.length > 0 ? lines : ["\u7121\u5546\u54c1\u660e\u7d30"];
  const html = itemRows
    .map((line) => '<div style="padding:12px 0;border-bottom:1px solid #efe2cf;font-size:14px;line-height:1.6;color:#2a1a10;">' + escapeHtml(line) + "</div>")
    .join("");

  return [
    '<tr><td style="padding:20px 32px 0;">',
    '<h2 style="margin:0 0 10px;font-size:18px;color:#5a341d;">\u5546\u54c1\u660e\u7d30</h2>',
    '<div style="background:#ffffff;border-radius:18px;padding:6px 16px;border:1px solid #efe2cf;">',
    html,
    "</div>",
    "</td></tr>",
  ].join("");
}

function escapeHtml(value) {
  return cleanText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function logError(error, e) {
  try {
    const sheet = getOrCreateSheet(getSpreadsheet(), CONFIG.LOGS_SHEET_NAME, [
      "created_at",
      "message",
      "stack",
      "request_body",
    ]);

    sheet.appendRow([
      Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy/MM/dd HH:mm:ss"),
      error.message || String(error),
      error.stack || "",
      e && e.postData ? e.postData.contents : "",
    ]);
  } catch (loggingError) {
    console.error(loggingError);
  }
}

function testWriteOrder() {
  const payload = buildTestPayload("test@example.com");
  const orderId = createOrderId();
  const createdAt = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy/MM/dd HH:mm:ss");
  const sheet = getOrCreateSheet(getSpreadsheet(), CONFIG.ORDERS_SHEET_NAME, ORDER_HEADERS);

  sheet.appendRow(buildOrderRow(orderId, createdAt, payload));

  return orderId;
}

function testSendOrderEmails() {
  const payload = buildTestPayload(CONFIG.ADMIN_EMAIL);
  const orderId = createOrderId();
  const createdAt = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy/MM/dd HH:mm:ss");

  sendOrderEmails(orderId, createdAt, payload);

  return orderId;
}

function buildTestPayload(email) {
  return {
    recipient: "Test User",
    phone: "0912345678",
    email,
    pickupStore: "Test Store | TEST001 | Test Address",
    storeId: "TEST001",
    storeName: "Test Store",
    storeAddress: "Test Address",
    items: "Test Item x1",
    itemSummary: "Test Item x1",
    subtotal: "$100",
    discount: "$0",
    shippingFee: "$0",
    total: "$100",
    totalNumber: 100,
    taxId: "",
    companyTitle: "",
    socialAccount: "",
    note: "Manual Apps Script test",
  };
}

function getStoreId(payload) {
  const explicitStoreId = cleanText(payload.storeId || payload.myshipStoreId);
  if (explicitStoreId) {
    return explicitStoreId;
  }

  const parts = cleanText(payload.pickupStore).split(/\||\uFF5C/).map((part) => part.trim());
  const numericPart = parts.find((part) => /^\d{6}$/.test(part));

  return numericPart || "";
}

function normalizePhone(value) {
  return cleanText(value).replace(/\D/g, "").slice(0, 10);
}

function amountNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }

  const numeric = cleanText(value).replace(/[^\d.-]/g, "");
  const parsed = Number(numeric);

  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function formatMyShipDate(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, "Asia/Taipei", "yyyy/M/d");
  }

  const text = cleanText(value);
  if (!text) {
    return Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy/M/d");
  }

  const dateText = text.split(" ")[0].replace(/-/g, "/");
  const parts = dateText.split("/");

  if (parts.length >= 3) {
    return [parts[0], String(Number(parts[1])), String(Number(parts[2]))].join("/");
  }

  return Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy/M/d");
}

function truncateText(value, maxLength) {
  const text = cleanText(value);

  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function createOrderId() {
  const timestamp = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyyMMddHHmmss");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");

  return "ORD-" + timestamp + "-" + random;
}

function cleanText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/\r\n/g, "\n").trim();
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
