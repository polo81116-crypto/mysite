/**
 * Google Apps Script order backend for the coffee shop frontend.
 *
 * Setup:
 * 1. Create a Google Sheet.
 * 2. Paste this file into Apps Script.
 * 3. Set CONFIG.SPREADSHEET_ID.
 * 4. Optional: set CONFIG.ADMIN_EMAIL.
 * 5. Run setupProperties() once.
 * 6. Deploy as Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Paste the deployed /exec URL into orderApiUrl in src/App.jsx.
 */

const CONFIG = {
  SPREADSHEET_ID: "1H_hP3TLB4PQb2rVRD-iqn71z7-sPc0pOgtttX4r39v4",
  ORDERS_SHEET_NAME: "Orders",
  LOGS_SHEET_NAME: "ErrorLogs",
  ADMIN_EMAIL: "",
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
  "raw_payload",
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
    sheet.appendRow(buildOrderRow(orderId, createdAt, payload));

    notifyAdmin(orderId, createdAt, payload);

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
    JSON.stringify(payload),
  ];
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

function testWriteOrder() {
  const payload = {
    recipient: "Test User",
    phone: "0912345678",
    email: "test@example.com",
    pickupStore: "Test Store",
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
    note: "Manual Apps Script test",
  };

  const orderId = createOrderId();
  const createdAt = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy/MM/dd HH:mm:ss");
  const sheet = getOrCreateSheet(getSpreadsheet(), CONFIG.ORDERS_SHEET_NAME, ORDER_HEADERS);

  sheet.appendRow(buildOrderRow(orderId, createdAt, payload));

  return orderId;
}

function getOrCreateSheet(spreadsheet, sheetName, headers) {
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function notifyAdmin(orderId, createdAt, payload) {
  const email =
    PropertiesService.getScriptProperties().getProperty("ADMIN_EMAIL") ||
    CONFIG.ADMIN_EMAIL;

  if (!email) {
    return;
  }

  const subject = "New order: " + orderId;
  const body = [
    "Order ID: " + orderId,
    "Created at: " + createdAt,
    "Recipient: " + cleanText(payload.recipient),
    "Phone: " + cleanText(payload.phone),
    "Email: " + cleanText(payload.email),
    "Pickup store: " + cleanText(payload.pickupStore),
    "Total: " + cleanText(payload.total || payload.totalNumber),
    "",
    "Items:",
    cleanText(payload.items),
    "",
    "Note:",
    cleanText(payload.note),
  ].join("\n");

  MailApp.sendEmail(email, subject, body);
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
