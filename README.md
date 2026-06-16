# 攪拌咖啡商行官網

React + Vite 前台，部署到 GitHub Pages。訂單送到 Google Apps Script Web App，後台寫入 Google Sheet，並產生賣貨便匯入表、出貨列印表與銷售報表。

## 常用指令

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## 前台維護

- 主要畫面與商品資料在 `src/App.jsx`。
- 7-11 門市資料在 `public/stores.json`，前台會以這份 JSON 搜尋門市。
- GitHub Actions 每天 14:00 Asia/Taipei 更新 `public/stores.json`，設定在 `.github/workflows/update-stores.yml`。
- GitHub Pages 部署設定在 `.github/workflows/deploy.yml`，push 到 `main` 後會自動 build 並部署。

## 訂單後台

- Apps Script 原始碼在 `google-apps-script/order-backend.gs`。
- 修改後台邏輯後，需要把檔案內容貼到 Google Apps Script，並重新部署 Web App。
- Web App `/exec` URL 設在 `src/App.jsx` 的 `orderApiUrl`。
- 新訂單會寫入訂單主表、賣貨便匯入表、出貨單列印表、出貨分類總表，並更新銷售報表。
- 管理者通知信標題格式為 `官網客戶下單（配送方式）`，內容包含訂購明細、金額摘要、門市或收件地址。

## 出貨狀態

- `是否已出貨` 表示實際是否已安排出貨，預設為 `未出貨`。
- `賣貨便匯出狀態` 表示該訂單是否已寫入賣貨便匯入表。
- `賣貨便匯出時間` 記錄寫入賣貨便匯入表的時間。
- `出貨分類總表` 會用物流分類整理 7-11 賣貨便、全家店到店、順豐快遞貨到付款，並以不同底色標示，方便篩選與出貨。

## 重要驗證

- 前台送出前會要求收件人、手機、Email、取件門市。
- 取件門市必須包含 6 碼 7-11 店號，避免賣貨便匯入資料空白。
- Apps Script 後台也會再次驗證 6 碼店號。

## 發布檢查

1. 執行 `npm run lint`。
2. 執行 `npm run build`。
3. 若改到 `google-apps-script/order-backend.gs`，同步更新 Apps Script 並重新部署。
4. 用測試訂單確認 Google Sheet、賣貨便匯入表、出貨單列印表、Email 通知都正常。

## 後續建議

- 將商品資料與計價邏輯從 `src/App.jsx` 拆出，降低維護風險。
- 補上價格、免運、訂單 payload、賣貨便匯入列的自動化測試。
- 改善 Apps Script 提交成功回報機制；目前前台因 `no-cors` 無法直接讀取後台回傳內容。
