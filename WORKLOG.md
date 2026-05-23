# Worklog

This file tracks project changes, deployment notes, and version updates.

## 2026-05-24

### Current Version

- Latest commit: `d178e38 Send order email notifications`
- Previous deployed frontend update: `bf37aef Require checkout contact fields`
- Repository: `https://github.com/polo81116-crypto/mysite.git`

### Order Email Notification Status

- Backend script updated:

```txt
google-apps-script/order-backend.gs
```

- Email behavior after a successful order:
  - Customer receives an order confirmation at the checkout email address.
  - Store admin receives a shipment notification at `CAOBANCOFFEE@GMAIL.COM`.
  - Both emails include order ID, recipient, phone, email, pickup store, item details, total, and note.

- Test helper added:

```txt
testSendOrderEmails()
```

- Purpose:
  - Authorize `MailApp`.
  - Send a test email to confirm Apps Script mail permissions.

### Required Manual Apps Script Deployment

The email notification update is in the repository, but it will not run on live orders until Google Apps Script is updated manually.

Steps:

1. Open the Google Apps Script project.
2. Replace the script content with `google-apps-script/order-backend.gs`.
3. Save the script.
4. Run `testSendOrderEmails()` once.
5. Complete Google authorization for email sending.
6. Confirm `CAOBANCOFFEE@GMAIL.COM` receives the test email.
7. Deploy a new Web App version.
8. Keep the Web App URL connected in `src/App.jsx`.

### Current Connected Services

- Google Sheet ID:

```txt
1H_hP3TLB4PQb2rVRD-iqn71z7-sPc0pOgtttX4r39v4
```

- Current frontend Apps Script Web App URL:

```txt
https://script.google.com/macros/s/AKfycbzfN28njwcJeZssEQV5HJnZ7Z9Z-dPmIVP0WNLBZNQz7VUG9VewI6hl29-0ivpJ_DiPQA/exec
```

### Notes

- Frontend checkout required fields are already deployed:
  - recipient
  - phone
  - email
  - pickup store
- The frontend still uses `fetch(..., { mode: "no-cors" })`, so order success must be verified through:
  - Google Sheet `Orders` tab
  - Apps Script `Executions`
  - customer/admin email inboxes after the mail deployment is complete

### Email Template Update

- Updated Apps Script emails from plain text only to styled HTML emails.
- Both customer and admin notifications now include:
  - branded coffee color palette
  - order header card
  - customer information section
  - item detail section
  - payment summary section
  - additional information section
- Plain text fallback remains available for email clients that do not render HTML.
- Static template text is kept ASCII-safe in Apps Script to avoid local encoding corruption; submitted Chinese customer/order data is still rendered in the email.
- `google-apps-script/order-backend.gs` syntax check passed after the HTML email update.
- Manual Apps Script redeploy is required before live orders use the new email design.

### MyShip Import Format

- Reference file found in the workspace:

```txt
賣貨便_訂單匯入 (2).xlsm
```

- Template workbook sheets:
  - `訂單匯入`
  - `填寫說明`

- Required import columns identified from the template:
  - `＊取件人姓名`
  - `＊取件人手機`
  - `＊取件門市`
  - `* 溫層`
  - `＊商品`
  - `＊訂單金額`
  - `＊運費金額`
  - `買家下訂日期`
  - `商品備註`
  - `其他資訊(FB/LINE/IG帳號)`

- Updated `google-apps-script/order-backend.gs` so each successful order now also appends a row to a Google Sheet tab named `訂單匯入`.
- `訂單匯入` columns A:J are set to text format to preserve phone numbers and 7-ELEVEN store IDs.
- Added `rebuildMyShipImportSheet()` to rebuild the import sheet from existing `Orders` rows using `raw_payload`.
- Apps Script syntax check passed after the MyShip export update.
- Manual Apps Script redeploy is required before live orders generate `訂單匯入` rows.

### Duplicate Shipment Prevention

- Added `myship_exported_at` to the `Orders` sheet.
- When a new order is appended to `訂單匯入`, the related `Orders` row is immediately marked with an export timestamp.
- `rebuildMyShipImportSheet()` now exports only rows where `myship_exported_at` is empty.
- Added `resetMyShipExportStatus(orderId)` for exceptional cases where an order must be exported again.
- Operational rule:
  - If `myship_exported_at` has a timestamp, do not ship/export that order again.
  - If a re-export is genuinely needed, run `resetMyShipExportStatus("ORDER_ID")`, then run `rebuildMyShipImportSheet()`.
- Apps Script syntax check passed after the duplicate shipment prevention update.

## 2026-05-23

### Checkout Validation

- Made checkout fields required before opening the order confirmation modal:
  - recipient
  - phone
  - email
  - pickup store
- Added inline validation messages and required input attributes.
- `npm.cmd run build` passed after the validation update.

### Email Notifications

- Updated `google-apps-script/order-backend.gs` to send email after a successful order write.
- Customer receives an order confirmation email at the submitted checkout email address.
- Store admin receives a shipment notification at `CAOBANCOFFEE@GMAIL.COM`.
- Added `testSendOrderEmails()` for authorizing and testing Apps Script email sending.
- Apps Script syntax check passed after the email update.

### Backend connection

- Updated the frontend order endpoint in `src/App.jsx`.
- Current Google Apps Script Web App URL:

```txt
https://script.google.com/macros/s/AKfycbxvLScQRHevIsjx01HlP6oNDkHM8SyIKRwohXGKU5JrAec5RCWxaFkhKp05qN6NxD3qog/exec
```

### Google Apps Script

- Added optimized backend script:

```txt
google-apps-script/order-backend.gs
```

- Backend features:
  - Receives frontend order payload.
  - Validates required fields.
  - Writes orders into Google Sheets.
  - Creates `Orders` sheet automatically.
  - Creates `ErrorLogs` sheet automatically.
  - Generates order IDs.
  - Uses `LockService` to reduce concurrent write conflicts.
  - Supports optional admin email notifications.
  - Stores raw payload for debugging and future migration.

### Google Sheet

- Connected Sheet ID:

```txt
1H_hP3TLB4PQb2rVRD-iqn71z7-sPc0pOgtttX4r39v4
```

- Source Sheet URL:

```txt
https://docs.google.com/spreadsheets/d/1H_hP3TLB4PQb2rVRD-iqn71z7-sPc0pOgtttX4r39v4/edit?gid=0#gid=0
```

### Verification

- `google-apps-script/order-backend.gs` syntax check passed with Node.
- `npm.cmd run build` passed when run outside the sandbox.
- Direct POST test to Apps Script returned success:

```json
{"ok":true,"orderId":"ORD-20260523234352-2725","message":"Order received."}
```

- Initial sandboxed build failed because of local permission/native dependency loading issues:
  - Tailwind native package load error.
  - `spawn EPERM`.
  - The issue was environment permission related, not caused by the Apps Script URL change.

### Troubleshooting Notes

- If Apps Script returns `ok:true` but the target Sheet has no row, check whether Apps Script `Script Properties` contains an old `SPREADSHEET_ID`.
- `google-apps-script/order-backend.gs` was updated so `CONFIG.SPREADSHEET_ID` is preferred over `Script Properties`.
- Added `testWriteOrder()` for manual Apps Script testing. Run it inside Apps Script and check whether a row appears in `Orders`.
- The frontend currently uses `fetch(..., { mode: "no-cors" })`, so the browser cannot read backend errors. A failed backend request can still appear successful in the UI.

### Deployment Update

- Updated frontend Apps Script Web App URL:

```txt
https://script.google.com/macros/s/AKfycbzfN28njwcJeZssEQV5HJnZ7Z9Z-dPmIVP0WNLBZNQz7VUG9VewI6hl29-0ivpJ_DiPQA/exec
```

- Direct POST test to the new deployment returned success:

```json
{"ok":true,"orderId":"ORD-20260523234624-4817","message":"Order received."}
```

- `npm.cmd run build` passed after updating the frontend URL.
- Order submission page is connected through:
  - `立即下單`: opens the order confirmation modal.
  - `確認送出訂單`: calls `submitOrder()`.
  - `submitOrder()`: POSTs the order payload to the current Apps Script `/exec` URL.

### Manual deployment steps

1. Open Google Apps Script.
2. Paste the full content from `google-apps-script/order-backend.gs`.
3. Run `setupProperties()` once.
4. Deploy as Web App.
5. Use these deployment settings:
   - Execute as: `Me`
   - Who has access: `Anyone`
6. Send one test order from the website.
7. Confirm the order appears in the `Orders` sheet.

## Version Update Template

Copy this section when making future updates.

```md
## YYYY-MM-DD

### Version

- Version:
- Updated by:

### Changes

- 

### Backend / API

- Apps Script deployment ID:
- Web App URL:
- Google Sheet ID:
- Changed files:

### Verification

- Build:
- Test order:
- Google Sheet write:
- Known issues:

### Deployment Notes

- 
```
