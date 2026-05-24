# Extracted Worklog

Source: `WORKLOG.md` and local Git history in `C:\Users\Z170\mysite`
Extracted on: 2026-05-24

Note: Some Chinese labels in `WORKLOG.md` are mojibake/corrupted in the local file. This extract keeps only entries that are still readable or can be verified from Git commit messages and file paths.

## 2026-05-24

### Current Version

- Latest worklog commit: `956ba42 Update worklog and close out the day`
- Latest deployed/site commit noted in worklog: `606dd11 Add COD notice to checkout`
- Repository: `https://github.com/polo81116-crypto/mysite.git`
- Local untracked items at extraction time:
  - `Imgea/`
  - `exports/`
  - `賣貨便_訂單匯入 (2).xlsm`

### Checkout COD Notice

- Added a clear checkout reminder that 7-11 MyShip is cash on delivery.
- Reminder appears in the checkout sidebar and the order confirmation modal.
- Related commit: `606dd11 Add COD notice to checkout`

### Formula Blend Category

- Added a new formula blend product category.
- Added grouped products with selectable options priced at:
  - `350`
  - `400`
  - `450`
  - `500`
- Added/restored half-pound grouped product with half-size pricing.
- Updated frontend validation for the additional category and grouped product structure.
- Related commits:
  - `63b7841 Add formula blend category and sales reports`
  - `559b9af Group formula blend options`
  - `f4e5ebf Rename formula blend raw bean option`
  - `ebc8375 Add half-pound formula blend grouped product`
  - `75044b5 Restore formula blend half-pound product`

### Shipment Slip And Sales Reports

- Added print-sheet generation for orders.
- Added sales report sheets.
- Frontend now sends structured `lineItems`.
- Backend can calculate rankings and monthly quantities from structured item data.
- Backend appends new orders to the print sheet on order submission.
- Added `rebuildAllReports()` in Apps Script to regenerate print and report sheets from the order sheet.

### Store Data Auto Update

- Switched frontend store lookup source to local deployed JSON:
  - `public/stores.json`
- Added GitHub Actions workflow:
  - `.github/workflows/update-stores.yml`
- Workflow runs daily at 14:00 Asia/Taipei.
- Cron: `0 6 * * *` UTC.
- Workflow downloads latest 7-ELEVEN store data, validates JSON, updates `public/stores.json` only when valid, and commits changed data.
- Initial validated store count: `7292`.
- Build passed after switching to local store data.
- Related commit: `e02766a Schedule daily store data updates`

### Product Images And Layout

- Added Coffee Review award image:
  - `public/images/coffee-review-award.png`
- Added one-pound medium-dark product image:
  - `public/images/medium-dark-1lb.jpg`
- Added half-pound medium-dark product image:
  - `public/images/medium-dark-half-lb.jpg`
- Enlarged product list image column from `96px` to `180px`.
- Changed product image rendering from cropped `object-cover` to full `object-contain`.
- Added white background and padding for product images.
- Builds passed after image and layout updates.
- Related commits:
  - `0797414 Add Coffee Review award image`
  - `26dc4f5 Update one-pound product image`
  - `8589daf Enlarge product image display`
  - `5f2b54a Update half-pound product image`

### Order Sheet Localization

- Renamed order sheet tab from `Orders` to a Chinese localized name.
- Renamed spreadsheet title to the localized order-management name.
- Converted order sheet headers from English to Chinese.
- Added visible shipment/status columns.
- Export timestamp remains in a technical timestamp column.
- Existing export and rebuild logic was updated to use localized sheet and column names.
- Related commit: `7c686bf Localize order sheet and shipment status`

### Email Notifications

- Backend script updated:
  - `google-apps-script/order-backend.gs`
- Customer receives order confirmation at checkout email address.
- Store admin receives shipment notification at:
  - `CAOBANCOFFEE@GMAIL.COM`
- Emails include order ID, recipient, phone, email, pickup store, item details, total, and note.
- Added `testSendOrderEmails()` helper for Apps Script authorization/testing.
- Updated emails from plain text to styled HTML.
- Localized email labels to Traditional Chinese using Unicode escape sequences to avoid local encoding corruption.
- Plain text fallback remains available.
- Manual Apps Script redeploy is required before live emails use the latest design/localization.
- Related commits:
  - `d178e38 Send order email notifications`
  - `fc4635d Style order notification emails`
  - `47d3d4f Localize order email labels`

### MyShip Import And Duplicate Prevention

- Reference workbook found:
  - `賣貨便_訂單匯入 (2).xlsm`
- Updated `google-apps-script/order-backend.gs` so each successful order also appends a row to the MyShip import sheet.
- MyShip columns A:J are set to text format to preserve phone numbers and 7-ELEVEN store IDs.
- Added `rebuildMyShipImportSheet()` to rebuild import rows from existing order rows.
- Added duplicate prevention with `myship_exported_at`.
- Added `resetMyShipExportStatus(orderId)` for exceptional re-export cases.
- Replaced direct `appendRow()` with text-first range writing via `setValues()`.
- Apps Script syntax checks passed after related updates.
- Manual Apps Script redeploy is required before live orders generate the latest MyShip rows.
- Related commits:
  - `8792cbc Add MyShip import sheet export`
  - `7eb9b96 Prevent duplicate MyShip exports`
  - `8c7054b Preserve MyShip phone leading zero`

### Connected Services

- Google Sheet ID:
  - `1H_hP3TLB4PQb2rVRD-iqn71z7-sPc0pOgtttX4r39v4`
- Current frontend Apps Script Web App URL:
  - `https://script.google.com/macros/s/AKfycbzfN28njwcJeZssEQV5HJnZ7Z9Z-dPmIVP0WNLBZNQz7VUG9VewI6hl29-0ivpJ_DiPQA/exec`

### Manual Apps Script Deployment Required

1. Open the Google Apps Script project.
2. Replace script content with `google-apps-script/order-backend.gs`.
3. Save the script.
4. Run `testSendOrderEmails()` once.
5. Complete Google authorization for email sending.
6. Confirm `CAOBANCOFFEE@GMAIL.COM` receives the test email.
7. Deploy a new Web App version.
8. Keep the Web App URL connected in `src/App.jsx`.

## 2026-05-23

### Checkout Validation

- Made checkout fields required before opening the order confirmation modal:
  - recipient
  - phone
  - email
  - pickup store
- Added inline validation messages and required input attributes.
- Build passed after the validation update.
- Related commit: `bf37aef Require checkout contact fields`

### Backend Connection

- Updated frontend order endpoint in `src/App.jsx`.
- Added optimized backend script:
  - `google-apps-script/order-backend.gs`
- Backend features:
  - Receives frontend order payload.
  - Validates required fields.
  - Writes orders into Google Sheets.
  - Creates `Orders` and `ErrorLogs` sheets automatically.
  - Generates order IDs.
  - Uses `LockService` to reduce concurrent write conflicts.
  - Supports optional admin email notifications.
  - Stores raw payload for debugging and future migration.
- Related commits:
  - `a5eeb11 Connect order form to Google Apps Script`

### Verification

- Apps Script syntax check passed with Node.
- `npm.cmd run build` passed when run outside the sandbox.
- Direct POST test to Apps Script returned:
  - `{"ok":true,"orderId":"ORD-20260523234352-2725","message":"Order received."}`
- Direct POST test to the later deployment returned:
  - `{"ok":true,"orderId":"ORD-20260523234624-4817","message":"Order received."}`

### Deployment Notes

- Source Sheet URL:
  - `https://docs.google.com/spreadsheets/d/1H_hP3TLB4PQb2rVRD-iqn71z7-sPc0pOgtttX4r39v4/edit?gid=0#gid=0`
- The frontend uses `fetch(..., { mode: "no-cors" })`, so browser-side success cannot read backend errors.
- Failed backend requests may still appear successful in the UI.
- If Apps Script returns success but no row appears, check whether Script Properties contains an old `SPREADSHEET_ID`.

## Git Commit Timeline

```txt
956ba42  2026-05-24 11:47:54 +0800  Update worklog and close out the day
606dd11  2026-05-24 11:45:07 +0800  Add COD notice to checkout
834f8ed  2026-05-24 11:11:07 +0800  Update worklog for formula blend deployment
75044b5  2026-05-24 11:09:48 +0800  Restore formula blend half-pound product
83d3cf9  2026-05-24 10:57:57 +0800  Sync worklog after rebase
60d74a6  2026-05-24 10:53:14 +0800  Update worklog for half-pound formula blend
ebc8375  2026-05-24 10:52:56 +0800  Add half-pound formula blend grouped product
4cc0ee4  2026-05-24 10:49:39 +0800  Update App.jsx
f4e5ebf  2026-05-24 10:46:51 +0800  Rename formula blend raw bean option
559b9af  2026-05-24 10:44:50 +0800  Group formula blend options
3f711de  2026-05-24 10:42:17 +0800  Update worklog for formula blend category
63b7841  2026-05-24 10:41:07 +0800  Add formula blend category and sales reports
4e5bf6b  2026-05-24 10:31:22 +0800  Update App.jsx
fe45d80  2026-05-24 01:32:43 +0800  Add new coffee product details to App.jsx
89f2cfd  2026-05-24 01:02:56 +0800  Update worklog for localized order sheet
7c686bf  2026-05-24 01:02:27 +0800  Localize order sheet and shipment status
5f2b54a  2026-05-24 00:54:30 +0800  Update half-pound product image
8589daf  2026-05-24 00:49:36 +0800  Enlarge product image display
26dc4f5  2026-05-24 00:45:06 +0800  Update one-pound product image
0797414  2026-05-24 00:37:32 +0800  Add Coffee Review award image
e02766a  2026-05-24 00:31:56 +0800  Schedule daily store data updates
47d3d4f  2026-05-24 00:27:00 +0800  Localize order email labels
07de23d  2026-05-24 00:23:31 +0800  Update worklog for MyShip export status
8c7054b  2026-05-24 00:22:18 +0800  Preserve MyShip phone leading zero
7eb9b96  2026-05-24 00:17:34 +0800  Prevent duplicate MyShip exports
8792cbc  2026-05-24 00:12:37 +0800  Add MyShip import sheet export
fc4635d  2026-05-24 00:05:50 +0800  Style order notification emails
d178e38  2026-05-24 00:00:02 +0800  Send order email notifications
bf37aef  2026-05-23 23:54:15 +0800  Require checkout contact fields
a5eeb11  2026-05-23 23:50:36 +0800  Connect order form to Google Apps Script
```
