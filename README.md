# 佰客官網

GitHub Pages 靜態網站。首頁預設繁體中文；英文、簡體中文、日本語分別使用 `en/`、`zh-cn/`、`ja/`，不會依瀏覽器或 localStorage 自動換掉網址所代表的語言。

## 修改與產生頁面

- 版面：`templates/home.html`、`templates/product.html`、`templates/journal.html`。
- 車款、規格與車色：`js/products.js`。未知售價或規格保持空白，不推測庫存。
- 原有四語文字：`js/i18n.js`；搜尋與選車段落：`scripts/seo-copy.mjs`（同名項目以此為準）。
- 文章資料：`js/journal.js`。圖片仍使用原本 `assets/`，不重複複製到語系資料夾。
- 網域與實際內容更新日期：`site.config.mjs`。

使用 Node.js 18 或以上，無須安裝套件：

```sh
node scripts/build.mjs
node scripts/build.mjs --check
node tests/seo.test.mjs
```

產出的根目錄 HTML、各語系資料夾與 sitemap 必須一起提交；不要只手動改產出檔。GitHub Pages 保留原部署方式，`_config.yml` 排除建置來源資料夾。

每個商品頁均有完整靜態正文、正確 canonical、五組 alternate（含 x-default）、社群 metadata 與 Product/Breadcrumb 結構化資料。未提供售價或真實評論前不產生 offers、評分或庫存標記。舊 `product.html?model=…`、`journal.html?id=…` 以受限 JavaScript 轉向新頁，停用 JavaScript 時仍有可點擊連結。

## 上線後

在 Google Search Console 檢查首頁、`youth.html`、`skyline.html`、`nano.html` 的實際網頁與標準網址，請求建立索引，並重新提交 `sitemap.xml`。HTML 驗證檔保留。搜尋顯示與排名由 Google 決定。

目前仍是 GitHub Pages 的子資料夾網站；搜尋站名與 favicon 的網域層級問題，需要另行確認品牌網域或帳號根網站安排，這次未更動網域或 DNS。
