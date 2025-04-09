# 2025雙北程式設計節

> 這是一個基於 **Nuxt 3.16.0** 的前端專案，使用 Vue 3、Pinia、Tailwind CSS，並支援 i18n。

## 系統需求

請確保你的環境符合以下要求：

| **需求**   | **最低版本**  | **建議版本**  |
|------------|-------------|-------------|
| **Node.js** | `>=18.14.0` | `18 LTS` (`18.17.0` 以上) |
| **NPM**    | `>=8.0.0`   | `8.x` 或 `9.x` |
| **Nuxt**   | `3.16.0`    | `3.16.0` |

## 專案設定

請確保已經安裝 Node.js 和 npm，並執行執行以下指令：

```sh
npm install
```

### 開發模式

```bash
npm run dev
```

啟動後，請在瀏覽器開啟：`http://localhost:3000`

### 專案打包

```bash
npm run generate
```

### 專案部署

專案使用 CI/CD 自動部署，只需將程式碼推送至 main 分支，即可觸發自動部署流程。

## 開發規範與工具

### 格式與 Lint

- **ESLint**：程式碼檢查
- **Prettier**：程式碼格式化
- **Stylelint**：樣式檢查

### 檢查指令

```bash
npm run lint:js     # JavaScript / TypeScript / Vue 檢查
npm run lint:style  # SCSS / Style 檢查
```

## 修改檔案方式

## 專案結構

components 元件管理採用 [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)。

- atom: 不可分割元件，通常為 base 類型元件，ex: `button`, `input`。
- molecule: 由 atom 元件組成，具有單一功能性，ex: search bar (`input` + `button`)。
- organism: 由 atom 與 molecule 元件組成，多功能性的元件，ex: header。

元件命名規則採 UpperCamelCase，引用元件時需帶上分類 prefix，ex: \<AtomButton />。

結構規則採用 Nuxt3 結構 [Diectory Structure](https://nuxt.com/docs/guide/directory-structure/nuxt)。