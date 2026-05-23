# Worklog

This file tracks project changes, deployment notes, and version updates.

## 2026-05-23

### Checkout Validation

- Made checkout fields required before opening the order confirmation modal:
  - recipient
  - phone
  - email
  - pickup store
- Added inline validation messages and required input attributes.
- `npm.cmd run build` passed after the validation update.

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
