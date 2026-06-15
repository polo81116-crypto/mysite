# Worklog

This file tracks project changes, deployment notes, and version updates.

## 2026-05-24

### Current Version

- Latest synced site commit: `33e4a17 Update site assets and documentation`
- Checkout minimum update commit: `cedd285 Add checkout minimum order validation`
- Previous closeout commit: `956ba42 Update worklog and close out the day`
- Previous backend updates:
  - `7eb9b96 Prevent duplicate MyShip exports`
  - `8792cbc Add MyShip import sheet export`
  - `fc4635d Style order notification emails`
  - `d178e38 Send order email notifications`
- Previous frontend image/layout updates:
  - `8589daf Enlarge product image display`
  - `26dc4f5 Update one-pound product image`
  - `0797414 Add Coffee Review award image`
- Previous frontend update: `bf37aef Require checkout contact fields`
- Repository: `https://github.com/polo81116-crypto/mysite.git`
- Local working changes: none after final sync.
- Working tree note: `src/App.jsx` now includes the 7-11 cash-on-delivery checkout notice and minimum checkout total validation; GitHub `main` is synced through `33e4a17`.

### Checkout Minimum

- Added a minimum checkout total:
  - `100`
- Checkout is blocked when the cart total is below the minimum.
- The checkout sidebar now shows how much remains before the customer can place the order.
- The guard is enforced before opening the order confirmation modal and again before submitting the order payload.
- Pushed to GitHub as:
  - `cedd285 Add checkout minimum order validation`

### Final GitHub Sync

- Committed and pushed all remaining workspace updates to GitHub:
  - `33e4a17 Update site assets and documentation`
- Included updates:
  - README updates
  - Apps Script backend updates
  - `index.html` metadata updates
  - image source files under `Imgea/`
  - exported inventory/schema/worklog files under `exports/`
  - `public/robots.txt`
  - `public/sitemap.xml`
  - `賣貨便_訂單匯入 (2).xlsm`
- Verification:
  - `npm.cmd run build` passed.
  - `git status --short` was clean after push.

### Shipment Slip And Sales Reports

- Added a print-ready sheet for each order:
  - `?箄疏?桀??躬
- Added sales report sheets:
  - `???瑕??`
  - `??敦`
- Frontend now sends structured `lineItems` so the backend can calculate rankings and monthly quantities reliably.
- The backend also keeps appending new orders to the print sheet on submission.
- `rebuildAllReports()` can be run in Apps Script to regenerate the print sheet and sales reports from `摰雯銝鞈?`.
- GitHub push completed successfully.

### Formula Blend Category

- Added a new product category:
  - `?鞊??`
- Added two grouped products with four selectable options each:
  - `350`
  - `400`
  - `450`
  - `500`
- Half-pound grouped product uses the same four options with half-size pricing.
- Updated the frontend validation to expect the extra category and grouped product structure.

### Current Shipping Export Status

- MyShip export sheet generation is handled by `google-apps-script/order-backend.gs`.
- New orders are written to:
  - `摰雯銝鞈?`
  - MyShip import tab, configured as `CONFIG.MYSHIP_SHEET_NAME`
- Duplicate shipment prevention is active through `摰雯銝鞈?.鞈?疏靘踹?箸??.
- Pickup phone numbers are written as text so leading zeroes are preserved.
- Latest backend file must be pasted into Google Apps Script and redeployed before the live Web App uses these updates.

### Order Sheet Localization

- Renamed the order sheet tab from `Orders` to `摰雯銝鞈?`.
- Renamed the spreadsheet file title to `摰雯銝鞈?`.
- Converted order sheet headers from English to Chinese.
- Added a visible status column:
  - `?臬撌脣鞎灼
- The shipment status now displays as:
  - `?芸鞎灼
  - `撌脣鞎灼
- The technical export timestamp remains in:
  - `鞈?疏靘踹?箸??
- Existing export and rebuild logic now uses the localized sheet and column names.

### Checkout COD Notice

- Added a clear checkout reminder that 7-11 MyShip is cash on delivery.
- The reminder appears in the checkout sidebar and again in the order confirmation modal.
- Pushed to GitHub as:
  - `606dd11 Add COD notice to checkout`

### End Of Day

- Today's work is complete.
- All current workspace changes were committed and pushed.
- Future updates can continue from `main` after `33e4a17`.

### Store Data Auto Update

- Updated frontend store lookup source from external raw GitHub URL to local deployed JSON:

```txt
public/stores.json
```

## 2026-06-16

### Version

- Version: special sale exclusions
- Updated by: Codex

### Changes

- Added product-level controls for special sale items:
  - `excludeGlobalDiscount`: skips the sitewide 9-discount calculation.
  - `excludeFreeShipping`: excludes the item from the free-shipping threshold.
- Added matching checkboxes and preview notes in `商品管理工具.html`.
- Updated cart totals to show the actual sitewide discount amount after exclusions.
- Updated `商品更新上傳說明.md` with special sale instructions.

### Verification

- JSON parse: passed.
- Lint: passed.
- Build: passed when run outside the sandbox with Windows native dependency access.

- Added GitHub Actions workflow:

```txt
.github/workflows/update-stores.yml
```

- Schedule:
  - Runs every day at 14:00 Asia/Taipei.
  - Cron: `0 6 * * *` UTC.

- Workflow behavior:
  - Downloads the latest source data from `Cojad/taiwan-7Eleven-store`.
  - Validates the JSON.
  - Replaces `public/stores.json` only when valid.
  - Commits and pushes changes only if the store data changed.
  - The push triggers the existing GitHub Pages deploy workflow.

- Initial `public/stores.json` downloaded and validated.
- Current initial store count: `7292`.
- `npm.cmd run build` passed after switching to local store data.

### Coffee Review Award Image

- Added Coffee Review award visual asset:

```txt
public/images/coffee-review-award.png
```

- Source file in workspace:

```txt
Imgea/ChatGPT Image 1.png
```

- Updated `CoffeeReviewAwardCard` to show the award image inside the Coffee Review section.
- Updated the `Coffee Review 璁桃鞈?` carousel slide to use the same local image.
- `npm.cmd run build` passed after the image integration.

### Product Image Update

- Added one-pound medium-dark product visual asset:

```txt
public/images/medium-dark-1lb.jpg
```

- Source file in workspace:

```txt
Imgea/ChatGPT2.jpg
```

- Updated product `shopee-medium-dark-1lb` / `銝剜楛???銝蝤?` to use the local image.
- `npm.cmd run build` passed after the product image update.

- Added half-pound medium-dark product visual asset:

```txt
public/images/medium-dark-half-lb.jpg
```

- Source file in workspace:

```txt
Imgea/ChatGPT3.jpg
```

- Updated product `shopee-medium-dark-half-lb` / `銝剜楛?????鋆 to use the local image.
- `npm.cmd run build` passed after the half-pound product image update.

### Product Image Layout Update

- Enlarged product list image column from `96px` to `180px`.
- Updated product image rendering from cropped `object-cover` to full `object-contain`.
- Added white background and padding to product images so portrait product cards display completely.
- `npm.cmd run build` passed after the layout update.

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

### Email Label Localization

- Updated customer and admin email labels from English to Traditional Chinese.
- Localized:
  - email subjects
  - plain text fallback labels
  - HTML card titles
  - order status labels
  - customer/store/payment/additional information section labels
- Static Chinese text is written with Unicode escape sequences in Apps Script to avoid local encoding corruption.
- Submitted customer/order data remains unchanged and displays normally.
- Apps Script syntax check passed after the email localization update.
- Manual Apps Script redeploy is required before live emails use the localized labels.

### MyShip Import Format

- Reference file found in the workspace:

```txt
鞈?疏靘甍閮?臬 (2).xlsm
```

- Template workbook sheets:
  - `閮?臬`
  - `憛怠神隤芣?`

- Required import columns identified from the template:
  - `嚗?隞嗡犖憪?`
  - `嚗?隞嗡犖??`
  - `嚗?隞園?撣
  - `* 皞怠惜`
  - `嚗??
  - `嚗??桅?憿
  - `嚗?鞎駁?憿
  - `鞎瑕振銝??交?`
  - `???酉`
  - `?嗡?鞈?(FB/LINE/IG撣唾?)`

- Updated `google-apps-script/order-backend.gs` so each successful order now also appends a row to a Google Sheet tab named `閮?臬`.
- `閮?臬` columns A:J are set to text format to preserve phone numbers and 7-ELEVEN store IDs.
- Added `rebuildMyShipImportSheet()` to rebuild the import sheet from existing `Orders` rows using `raw_payload`.
- Apps Script syntax check passed after the MyShip export update.
- Manual Apps Script redeploy is required before live orders generate `閮?臬` rows.

### Duplicate Shipment Prevention

- Added `myship_exported_at` to the `Orders` sheet.
- When a new order is appended to `閮?臬`, the related `Orders` row is immediately marked with an export timestamp.
- `rebuildMyShipImportSheet()` now exports only rows where `myship_exported_at` is empty.
- Added `resetMyShipExportStatus(orderId)` for exceptional cases where an order must be exported again.
- Operational rule:
  - If `myship_exported_at` has a timestamp, do not ship/export that order again.
  - If a re-export is genuinely needed, run `resetMyShipExportStatus("ORDER_ID")`, then run `rebuildMyShipImportSheet()`.
- Apps Script syntax check passed after the duplicate shipment prevention update.

### MyShip Phone Number Formatting

- Updated `閮?臬` row writing to preserve leading zeroes in pickup phone numbers.
- Replaced direct `appendRow()` for MyShip rows with text-first range writing:
  - Set row number format to text.
  - Write all A:J values as strings with `setValues()`.
- This prevents Google Sheets from converting values like `0912345678` into numbers.
- Apps Script syntax check passed after the phone formatting update.

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
  - `蝡銝`: opens the order confirmation modal.
  - `蝣箄??閮`: calls `submitOrder()`.
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
