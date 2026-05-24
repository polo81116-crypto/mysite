# 進銷存 結構整理

- Source: C:\Users\Z170\ID\進銷存.accdb
- Backup: C:\Users\Z170\mysite\backups\ID\進銷存-20260524-111528.accdb
- Exported at: 2026-05-24T11:15:32

## Tables

### 名稱自動校正儲存失敗
- 物件名稱 | Type: 10 | Size: 255
- 物件類型 | Type: 10 | Size: 255
- 失敗原因 | Type: 10 | Size: 255
- 時間 | Type: 8 | Size: 8

### 供應商基本資料
- CODE | Type: 4 | Size: 4
- 公司名稱 | Type: 10 | Size: 50
- 公司簡稱 | Type: 10 | Size: 50
- 聯絡人 | Type: 10 | Size: 50
- 部署 | Type: 10 | Size: 50
- 職稱 | Type: 10 | Size: 50
- 國家 | Type: 10 | Size: 50
- 住址 | Type: 10 | Size: 100
- 電話 | Type: 10 | Size: 30
- 傳真 | Type: 10 | Size: 30
- 大哥大 | Type: 10 | Size: 50
- 備註 | Type: 12 | Size: 0
- 區分 | Type: 10 | Size: 50

### 客戶地區分類表
- 地區編號 | Type: 4 | Size: 4
- 地區名稱 | Type: 10 | Size: 50
- 備註 | Type: 10 | Size: 50

### 客戶訂貨主檔
- 識別碼 | Type: 4 | Size: 4
- 訂貨日期 | Type: 8 | Size: 8
- 客戶編號 | Type: 10 | Size: 50
- 客戶簡稱 | Type: 10 | Size: 255
- LINE | Type: 1 | Size: 1
- 電話 | Type: 1 | Size: 1
- Email | Type: 1 | Size: 1
- FB | Type: 1 | Size: 1
- 傳真 | Type: 1 | Size: 1
- 貨到付款 | Type: 1 | Size: 1
- 匯款金額 | Type: 7 | Size: 8
- 代收金額 | Type: 7 | Size: 8
- 備註 | Type: 12 | Size: 0

### 客戶訂貨副檔
- 識別碼 | Type: 4 | Size: 4
- 商品名稱 | Type: 10 | Size: 255
- 數量 | Type: 7 | Size: 8
- 單位 | Type: 10 | Size: 255
- 單價 | Type: 5 | Size: 8
- 交貨日期 | Type: 8 | Size: 8
- 缺貨待出 | Type: 1 | Size: 1
- 備註 | Type: 12 | Size: 0

### 客戶基本資料
- 地區編號 | Type: 4 | Size: 4
- 客戶編號 | Type: 10 | Size: 50
- 客戶名稱 | Type: 10 | Size: 50
- 客戶簡稱 | Type: 10 | Size: 50
- 區分 | Type: 10 | Size: 50
- 出貨資訊 | Type: 10 | Size: 255
- 結帳日 | Type: 10 | Size: 255
- 統一編號 | Type: 10 | Size: 20
- 發票資訊 | Type: 10 | Size: 100
- 發票方式 | Type: 10 | Size: 255
- 聯絡人1 | Type: 10 | Size: 30
- 大哥大1 | Type: 10 | Size: 255
- 電郵1 | Type: 10 | Size: 255
- 分機1 | Type: 10 | Size: 50
- 聯絡人2 | Type: 10 | Size: 30
- 大哥大2 | Type: 10 | Size: 255
- 電郵2 | Type: 10 | Size: 255
- 分機2 | Type: 10 | Size: 50
- 聯絡人3 | Type: 10 | Size: 30
- 大哥大3 | Type: 10 | Size: 255
- 電郵3 | Type: 10 | Size: 255
- 分機3 | Type: 10 | Size: 50
- 部署 | Type: 10 | Size: 20
- 職稱 | Type: 10 | Size: 20
- 公司電話 | Type: 10 | Size: 50
- 分機 | Type: 4 | Size: 4
- 公司傳真 | Type: 10 | Size: 50
- 公司地址 | Type: 10 | Size: 255
- 送貨電話1 | Type: 10 | Size: 50
- 送貨傳真1 | Type: 10 | Size: 50
- 送貨地址1 | Type: 10 | Size: 255
- 送貨電話2 | Type: 10 | Size: 50
- 送貨傳真2 | Type: 10 | Size: 50
- 送貨地址2 | Type: 10 | Size: 255
- 大哥大 | Type: 10 | Size: 50
- E-MAIL | Type: 12 | Size: 0
- 列印 | Type: 10 | Size: 50
- 備註 | Type: 12 | Size: 0
- 發票資訊備註 | Type: 12 | Size: 0
- 銀行資訊備註 | Type: 12 | Size: 0

### 客戶標籤臨時表
- 客戶編號 | Type: 10 | Size: 50
- 客戶名稱 | Type: 10 | Size: 50
- 聯絡人1 | Type: 10 | Size: 50
- 公司地址 | Type: 10 | Size: 50
- 公司電話 | Type: 10 | Size: 50

### 借入基本資料
- 日期 | Type: 8 | Size: 8
- 客戶編號 | Type: 10 | Size: 50
- 商品名稱 | Type: 10 | Size: 50
- 批號 | Type: 10 | Size: 50
- 倉庫批號 | Type: 10 | Size: 50
- 公司-瑞湖 | Type: 6 | Size: 4
- 協同 | Type: 6 | Size: 4
- 聖隆 | Type: 6 | Size: 4
- 八德 | Type: 6 | Size: 4
- 平鎮 | Type: 6 | Size: 4
- 平鎮-真空 | Type: 6 | Size: 4
- 行家 | Type: 6 | Size: 4
- 處理 | Type: 10 | Size: 6
- CODE | Type: 10 | Size: 50
- 還 | Type: 10 | Size: 50
- ZN | Type: 6 | Size: 4
- LY | Type: 6 | Size: 4
- 公司-復北 | Type: 6 | Size: 4

### 倉庫基本資料表
- 倉庫編號 | Type: 4 | Size: 4
- 倉庫名稱 | Type: 10 | Size: 50
- 倉庫簡稱 | Type: 10 | Size: 50
- 倉庫地址 | Type: 10 | Size: 50
- 倉庫電話 | Type: 10 | Size: 50
- 倉庫傳真 | Type: 10 | Size: 50

### 庫存待扣一覽表
- 日期 | Type: 8 | Size: 8
- 客戶編號 | Type: 10 | Size: 50
- 批號 | Type: 10 | Size: 50
- 公司-瑞湖 | Type: 10 | Size: 50
- 協同 | Type: 10 | Size: 50
- 聖隆 | Type: 10 | Size: 50
- 八德 | Type: 10 | Size: 50
- 平鎮 | Type: 10 | Size: 50
- 平鎮-真空 | Type: 10 | Size: 50
- 行家 | Type: 10 | Size: 50
- 處理 | Type: 10 | Size: 50
- LY | Type: 10 | Size: 50
- ZN | Type: 10 | Size: 50
- 公司-復北 | Type: 10 | Size: 50

### 商品基本資料
- 商品類別編號 | Type: 4 | Size: 4
- 商品名稱 | Type: 10 | Size: 50
- 商品代碼 | Type: 10 | Size: 255
- 外包裝 | Type: 10 | Size: 50
- 內容 | Type: 7 | Size: 8
- 單位 | Type: 10 | Size: 4
- 安全數量 | Type: 6 | Size: 4
- 商品發票名稱 | Type: 10 | Size: 255
- 備註 | Type: 12 | Size: 0

### 商品轉換基本資料
- 日期 | Type: 8 | Size: 8
- 商品批號 | Type: 10 | Size: 50
- 公司-瑞湖1 | Type: 7 | Size: 8
- 協同1 | Type: 6 | Size: 4
- 聖隆1 | Type: 4 | Size: 4
- 八德1 | Type: 6 | Size: 4
- 平鎮1 | Type: 6 | Size: 4
- 平鎮-真空1 | Type: 6 | Size: 4
- 行家1 | Type: 6 | Size: 4
- 商品名稱 | Type: 10 | Size: 50
- 批號2 | Type: 10 | Size: 50
- 公司-瑞湖2 | Type: 7 | Size: 8
- 協同2 | Type: 6 | Size: 4
- 聖隆2 | Type: 4 | Size: 4
- 八德2 | Type: 6 | Size: 4
- 平鎮2 | Type: 6 | Size: 4
- 平鎮-真空2 | Type: 6 | Size: 4
- 行家2 | Type: 6 | Size: 4
- 處理 | Type: 10 | Size: 50
- ZN1 | Type: 6 | Size: 4
- LY1 | Type: 6 | Size: 4
- ZN2 | Type: 6 | Size: 4
- LY2 | Type: 6 | Size: 4
- 公司-復北1 | Type: 6 | Size: 4
- 公司-復北2 | Type: 6 | Size: 4

### 商品類別表
- 商品類別編號 | Type: 4 | Size: 4
- 商品類別 | Type: 10 | Size: 50
- 備註 | Type: 10 | Size: 50

### 商品變更副表
- 日期 | Type: 8 | Size: 8
- 原批號 | Type: 10 | Size: 50
- 新商品名稱 | Type: 10 | Size: 50
- 新商品批號 | Type: 10 | Size: 50
- 公司-瑞湖 | Type: 7 | Size: 8
- 協同 | Type: 7 | Size: 8
- 聖隆 | Type: 7 | Size: 8
- 八德 | Type: 6 | Size: 4
- 平鎮 | Type: 6 | Size: 4
- 平鎮-真空 | Type: 7 | Size: 8
- 行家 | Type: 7 | Size: 8
- 成本 | Type: 7 | Size: 8
- 處理 | Type: 10 | Size: 50
- ZN | Type: 7 | Size: 8
- LY | Type: 6 | Size: 4
- 公司-復北 | Type: 7 | Size: 8

### 商品變更副表1
- 日期 | Type: 8 | Size: 8
- 商品名稱 | Type: 10 | Size: 50
- 批號 | Type: 10 | Size: 50
- 公司-瑞湖 | Type: 7 | Size: 8
- 協同 | Type: 7 | Size: 8
- 聖隆 | Type: 4 | Size: 4
- 八德 | Type: 6 | Size: 4
- 平鎮 | Type: 6 | Size: 4
- 平鎮-真空 | Type: 7 | Size: 8
- 行家 | Type: 7 | Size: 8
- 成本 | Type: 7 | Size: 8
- 處理 | Type: 10 | Size: 50
- ZN | Type: 7 | Size: 8
- LY | Type: 6 | Size: 4
- 公司-復北 | Type: 7 | Size: 8

### 國外訂貨基本資料
- 日期 | Type: 8 | Size: 8
- 商品名稱 | Type: 10 | Size: 50
- 供應商編號 | Type: 4 | Size: 4
- 預交日 | Type: 10 | Size: 50
- 數量 | Type: 4 | Size: 4
- C&F | Type: 5 | Size: 8
- 進倉 | Type: 10 | Size: 50
- 備註 | Type: 12 | Size: 0

### 國際咖啡行情基本資料
- DATE | Type: 8 | Size: 8
- NY1 | Type: 7 | Size: 8
- NY2 | Type: 7 | Size: 8
- NY3 | Type: 7 | Size: 8
- NY4 | Type: 7 | Size: 8
- NY5 | Type: 7 | Size: 8
- NY6 | Type: 7 | Size: 8
- LDN1 | Type: 7 | Size: 8
- LDN2 | Type: 7 | Size: 8
- LDN3 | Type: 7 | Size: 8
- FNC | Type: 7 | Size: 8

### 移動基本資料
- 日期 | Type: 8 | Size: 8
- 商品批號 | Type: 10 | Size: 50
- 公司-瑞湖 | Type: 7 | Size: 8
- 協同 | Type: 6 | Size: 4
- 聖隆 | Type: 6 | Size: 4
- 八德 | Type: 6 | Size: 4
- 平鎮 | Type: 6 | Size: 4
- 行家 | Type: 6 | Size: 4
- 平鎮-真空 | Type: 6 | Size: 4
- 處理 | Type: 10 | Size: 6
- ZN | Type: 6 | Size: 4
- LY | Type: 6 | Size: 4
- 公司-復北 | Type: 6 | Size: 4

### 提貨單主資料表
- 提貨單號碼 | Type: 4 | Size: 4
- 日期 | Type: 8 | Size: 8
- 倉庫 | Type: 4 | Size: 4
- 寄託人 | Type: 10 | Size: 50
- 客戶編號 | Type: 10 | Size: 50
- 送貨地點 | Type: 10 | Size: 50

### 提貨單副資料表
- 提貨單號碼 | Type: 4 | Size: 4
- 商品名稱 | Type: 10 | Size: 50
- 規格 | Type: 10 | Size: 50
- 單位 | Type: 10 | Size: 50
- 數量 | Type: 4 | Size: 4
- 倉號 | Type: 10 | Size: 50
- 承運車行 | Type: 10 | Size: 50

### 發票庫存入庫基本表
- 商品名稱 | Type: 10 | Size: 255
- 入庫日期 | Type: 8 | Size: 8
- 供應商 | Type: 10 | Size: 255
- 入庫數量 | Type: 7 | Size: 8
- 入庫單價 | Type: 7 | Size: 8
- 總金額 | Type: 7 | Size: 8
- 備註 | Type: 10 | Size: 255

### 發票庫存出庫基本表
- 出庫日期 | Type: 8 | Size: 8
- 發票號碼 | Type: 10 | Size: 255
- LC號碼 | Type: 10 | Size: 255
- 出庫數量 | Type: 7 | Size: 8
- 出庫單價 | Type: 7 | Size: 8
- 總金額 | Type: 7 | Size: 8
- 備註 | Type: 10 | Size: 255

### 發票庫存產品名稱副表
- 商品名稱 | Type: 10 | Size: 255
- 銷貨號碼 | Type: 10 | Size: 10
- 發票日期 | Type: 8 | Size: 8
- 客戶編號 | Type: 10 | Size: 50
- 發票號碼 | Type: 10 | Size: 255
- 出庫數量 | Type: 4 | Size: 4
- 含稅總金額 | Type: 4 | Size: 4

### 發票庫存產品基本主表
- 商品名稱 | Type: 10 | Size: 255
- 規格 | Type: 10 | Size: 255
- 期初數量 | Type: 4 | Size: 4

### 進貨基本資料
- 日期 | Type: 8 | Size: 8
- 商品名稱 | Type: 10 | Size: 50
- 批號 | Type: 10 | Size: 50
- 倉庫批號 | Type: 10 | Size: 50
- 數量 | Type: 6 | Size: 4
- 公司-瑞湖 | Type: 7 | Size: 8
- 協同 | Type: 6 | Size: 4
- 聖隆 | Type: 6 | Size: 4
- 八德 | Type: 6 | Size: 4
- 平鎮 | Type: 6 | Size: 4
- 平鎮-真空 | Type: 6 | Size: 4
- 行家 | Type: 6 | Size: 4
- 供應商名稱 | Type: 10 | Size: 50
- 進價(C&F) | Type: 5 | Size: 8
- 成本 | Type: 5 | Size: 8
- 處理 | Type: 10 | Size: 50
- ZN | Type: 6 | Size: 4
- LY | Type: 6 | Size: 4
- 公司-復北 | Type: 7 | Size: 8

### 會計庫存基本主表
- 產品名稱 | Type: 10 | Size: 255
- 期初出庫存數量 | Type: 4 | Size: 4

### 會計庫存基本副表
- 產品名稱 | Type: 10 | Size: 255
- 客戶編號 | Type: 10 | Size: 50
- 發票日期 | Type: 8 | Size: 8
- 發票號碼 | Type: 10 | Size: 255
- 發票金額 | Type: 4 | Size: 4
- 發票數量 | Type: 4 | Size: 4
- 新增數量 | Type: 4 | Size: 4
- 數量小計 | Type: 4 | Size: 4
- 備註 | Type: 12 | Size: 0

### 會計產品基本表
- 會計產品名稱 | Type: 10 | Size: 255
- 單位 | Type: 10 | Size: 255

### 銀行進口還款資料表
- 還款日期 | Type: 8 | Size: 8
- 銀行名稱 | Type: 10 | Size: 255
- 開立公司 | Type: 10 | Size: 255
- 種類 | Type: 10 | Size: 255
- 號碼 | Type: 10 | Size: 50
- 幣別 | Type: 10 | Size: 255
- 當時匯率 | Type: 6 | Size: 4
- 還款本金 | Type: 6 | Size: 4
- 還款利息 | Type: 6 | Size: 4
- 備常比率 | Type: 6 | Size: 4
- 備常金額 | Type: 6 | Size: 4
- 還請與否 | Type: 10 | Size: 255

### 銷貨表
- 銷貨號碼 | Type: 10 | Size: 50
- 日期 | Type: 8 | Size: 8
- 客戶編號 | Type: 10 | Size: 50
- 客戶簡稱 | Type: 10 | Size: 50
- 倉庫 | Type: 10 | Size: 50
- 發票方式 | Type: 10 | Size: 255
- 商品名稱 | Type: 10 | Size: 50
- 批號 | Type: 10 | Size: 50
- 數量 | Type: 6 | Size: 4
- 單價 | Type: 6 | Size: 4
- 處理1 | Type: 10 | Size: 50

### 銷貨基本主檔
- 銷貨號碼 | Type: 10 | Size: 10
- 日期 | Type: 8 | Size: 8
- 客戶編號 | Type: 10 | Size: 50
- 表單種類 | Type: 10 | Size: 50
- 貨運公司 | Type: 10 | Size: 50
- 倉庫 | Type: 10 | Size: 50
- 送貨地點 | Type: 10 | Size: 50
- 處理 | Type: 10 | Size: 50
- 備註 | Type: 10 | Size: 50
- 發票方式 | Type: 10 | Size: 50
- 發票種類 | Type: 10 | Size: 255
- 發票號碼 | Type: 10 | Size: 255
- 發票日期 | Type: 8 | Size: 8
- 發票種類-2 | Type: 10 | Size: 255
- 發票號碼-2 | Type: 10 | Size: 255
- 發票日期-2 | Type: 8 | Size: 8
- 發票公司 | Type: 10 | Size: 255
- 發票公司-2 | Type: 10 | Size: 255
- 此單是否或到付款 | Type: 1 | Size: 1

### 銷貨基本副檔
- 銷貨號碼 | Type: 10 | Size: 15
- 商品名稱 | Type: 10 | Size: 50
- 數量 | Type: 7 | Size: 8
- 單價 | Type: 5 | Size: 8
- 處理 | Type: 10 | Size: 6
- 沖銷金額 | Type: 5 | Size: 8
- 調撥處理 | Type: 10 | Size: 6
- 消帳日期 | Type: 8 | Size: 8

### 銷貨會計發票副表
- 銷貨號碼 | Type: 10 | Size: 15
- 商品名稱 | Type: 10 | Size: 255
- 數量 | Type: 7 | Size: 8
- 單位 | Type: 10 | Size: 255
- 單價 | Type: 7 | Size: 8
- 小計 | Type: 7 | Size: 8

### 銷貨會計發票副表-2
- 銷貨號碼 | Type: 10 | Size: 15
- 商品名稱 | Type: 10 | Size: 255
- 數量 | Type: 7 | Size: 8
- 單位 | Type: 10 | Size: 255
- 單價 | Type: 7 | Size: 8
- 小計 | Type: 7 | Size: 8

### 歷史資料基本表
- 客戶地區 | Type: 4 | Size: 4
- 銷貨號碼 | Type: 10 | Size: 10
- 客戶編號 | Type: 10 | Size: 50
- 客戶簡稱 | Type: 10 | Size: 50
- 日期 | Type: 8 | Size: 8
- 商品編號 | Type: 4 | Size: 4
- 商品名稱 | Type: 10 | Size: 50
- 批號 | Type: 10 | Size: 50
- 數量 | Type: 6 | Size: 4
- 單價 | Type: 5 | Size: 8
- 小計 | Type: 5 | Size: 8

## Relations
- 商品基本資料 -> 商品轉換基本資料 [商品名稱->商品名稱]
- 銷貨基本主檔 -> 銷貨會計發票副表 [銷貨號碼->銷貨號碼]
- 提貨單主資料表 -> 提貨單副資料表 [提貨單號碼->提貨單號碼]
- 客戶地區分類表 -> 客戶基本資料 [地區編號->地區編號]
- 發票庫存產品基本主表 -> 發票庫存產品名稱副表 [商品名稱->商品名稱]
- 進貨基本資料 -> 庫存待扣一覽表 [批號->批號]
- 進貨基本資料 -> 移動基本資料 [批號->商品批號]
- 會計庫存基本主表 -> 會計庫存基本副表 [產品名稱->產品名稱]
- 客戶基本資料 -> 發票庫存產品名稱副表 [客戶編號->客戶編號]
- 商品基本資料 -> 進貨基本資料 [商品名稱->商品名稱]
- 發票庫存產品基本主表 -> 發票庫存入庫基本表 [商品名稱->商品名稱]
- 發票庫存產品基本主表 -> 銷貨會計發票副表-2 [商品名稱->商品名稱]
- 商品基本資料 -> 商品變更副表 [商品名稱->新商品名稱]
- 進貨基本資料 -> 商品轉換基本資料 [批號->商品批號]
- 進貨基本資料 -> 銷貨基本副檔 [批號->商品名稱]
- 發票庫存產品基本主表 -> 銷貨會計發票副表 [商品名稱->商品名稱]
- 倉庫基本資料表 -> 提貨單主資料表 [倉庫編號->倉庫]
- 進貨基本資料 -> 商品變更副表 [批號->原批號]
- 供應商基本資料 -> 國外訂貨基本資料 [CODE->供應商編號]
- 商品基本資料 -> 國外訂貨基本資料 [商品名稱->商品名稱]
- 發票庫存產品基本主表 -> 銷貨會計發票副表 [商品名稱->商品名稱]
- 商品基本資料 -> 商品基本資料 [商品名稱->商品名稱]
- 客戶基本資料 -> 借入基本資料 [客戶編號->客戶編號]
- 客戶基本資料 -> 歷史資料基本表 [客戶編號->客戶編號]
- 進貨基本資料 -> 進貨基本資料 [批號->批號]
- 發票庫存產品基本主表 -> 發票庫存入庫基本表 [商品名稱->商品名稱]
- 客戶訂貨主檔 -> 客戶訂貨副檔 [識別碼->識別碼]
- 發票庫存產品基本主表 -> 銷貨會計發票副表-2 [商品名稱->商品名稱]
- 商品基本資料 -> 提貨單副資料表 [商品名稱->商品名稱]
- 商品基本資料 -> 借入基本資料 [商品名稱->商品名稱]
- 銷貨基本主檔 -> 銷貨會計發票副表-2 [銷貨號碼->銷貨號碼]
- 客戶基本資料 -> 會計庫存基本副表 [客戶編號->客戶編號]
- 進貨基本資料 -> 商品變更副表1 [批號->批號]
- 客戶地區分類表 -> 客戶基本資料 [地區編號->地區編號]
- 商品類別表 -> 商品基本資料 [商品類別編號->商品類別編號]
- 客戶基本資料 -> 提貨單主資料表 [客戶編號->客戶編號]
- 客戶基本資料 -> 客戶訂貨主檔 [客戶編號->客戶編號]
- 客戶基本資料 -> 銷貨基本主檔 [客戶編號->客戶編號]
- 客戶基本資料 -> 銷貨基本主檔 [客戶編號->發票方式]

## Forms
- 庫存表-分批
- 支票代收表單
- 收款列印篩選-多匯少匯 子表單
- 收款查詢-多匯少匯 子表單
- 利潤顯示表單
- 商品變更主表單
- 發票庫存入庫基本表單
- 消帳表單
- 庫存表-不分批
- 銷貨基本主檔
- 名次排列
- 發票庫存出庫基本表單
- 商品借入表單
- 客戶訂貨一覽副表單
- 客戶訂貨一覽主表單
- 客戶訂貨一覽表-待交
- 會計產品基本表
- 銷售統計表示方法
- 銷貨利潤圖表其他
- 消帳表單-銷貨用
- 國際咖啡行情表
- 咖啡行情畫面
- 歷史資料查詢-銷貨用
- 豐潤進銷存首頁
- 標籤列印地點選擇
- 日期區間
- 對帳單列印方式
- 日期區間單一客戶
- 歷史資料-批號查詢客戶
- 提貨單副表單
- 提貨單主表單
- 商品變更副表單
- 訂貨一覽表單
- 會計庫存副表單
- 會計庫存主表單
- 發票庫存產品名稱主表單
- 商品基本資料表單
- 客戶基本資料
- 銷貨副表單
- 銷貨主表單
- 麻袋明細副表單
- 麻袋主表單
- 商品進貨成本表單
- 客戶資料主表單
- 利潤表示方法
- 客戶名稱查詢(單一帳單)
- 銷貨會計發票副表
- 庫存表示方法
- 名次表示方法
- 銷售統計商品別數字
- 商品類別主表
- 歷史資料查詢-客戶用
- 銷貨會計發票副表-2
- 銷售統計商品別圖表
- 提貨單列印對話方塊
- 銷貨基本主檔1
- 銷貨利潤圖表綜合
- 日期-訂貨一覽日期選擇
- 銷貨利潤圖表咖啡

## Reports
- 請款報表單一客戶
- 客戶訂貨一覽日報表
- 客戶訂貨一覽列印-小紙張
- 送貨單標籤報表
- 發票明細單報表
- 請款報表
- 收款列印篩選-多匯少匯 子表單
- 標籤報表-郵寄帳單用
- 客戶信封報表
- 庫存表-不分批報表
- 發票明細單報表-2
- 客戶訂貨一覽列印
- 標籤 客戶基本資料
- 提貨單報表朝瑞
- 客戶訂貨一覽列印(點陣)-大紙
- 提貨單報表
- 送貨單報表
- 收款列印篩選
- 收款查詢 子報表
- 標籤報表-郵寄帳單用(小標籤)
- 庫存表-分批報表
- 利潤成本報表
- 客戶訂貨一覽日報表日期選擇
- 請款報表-多匯少匯
- 請款報表過期
- 客戶標籤單一客戶

## Macros
- 標籤結束
- 庫存處理調撥入八德
- 庫存處理-1
- 出貨單列印
- 移動處理
- 庫存處理銷貨聖隆
- 庫存處理
- 提貨單列印
- 重新整理
- 庫存處理銷貨平鎮
- 庫存處理調撥入公司
- 庫存處理調撥入行家
- 庫存處理調撥入協同
- 商品變更第二次處理
- 商品變更第一次處理
- 庫存處理銷貨八德
- 借入處理
- 標籤直接列印
- 一覽
- 庫存處理調撥入聖隆
- 提貨單列印對話方塊
- 標籤
- 庫存處理調撥入平鎮
- 庫存處理銷貨公司
- 庫存處理銷貨行家
- 庫存處理銷貨協同
