# 长持 · 交互资产看板

TypeScript + CSS + 原生 SVG，无图表运行时依赖。仓库使用演示数据；个人持仓数据只保存在本机的 `src/local-data.ts`，专属行情序列只保存在 `src/local-market-data.ts`。

## 本地运行

```bash
npm install
npm run build
npm run dev
```

浏览器打开 <http://127.0.0.1:4173>。`npm test` 验证资产计算、情景模型、计划线和收益曲线。

第一次构建时，`scripts/prepare-local-data.mjs` 会从两个 `.example.ts` 文件创建本地数据文件。`src/local-data.ts` 与 `src/local-market-data.ts` 都受到 `.gitignore` 保护，可以在本机填写真实持仓、账户记录和专属行情；以后构建不会覆盖它们。

构建会生成 `dist/standalone.html`。它会嵌入当前本机数据，因此 `dist/`、根目录的 `资产看板.html`、截图、表格和 macOS 应用构建目录都不会进入 Git。

## 功能

- 全账户 / 仅证券口径的交互配置饼图。
- 编辑股数、价格与现金估算，搜索持仓并导出 CSV。
- 全体证券或单项证券的涨跌情景模拟。
- 每只资产与账户整体的收盘收益曲线。
- 实际净资产与年化 10% 计划线，支持缩放、平移和数据点提示。
- 核心—卫星配置、现金缓冲与分批投入计划。
- 本地净资产记录和每周配置观察。

## 隐私边界

以下内容仅保存在本机，不应提交或推送：

- `src/local-data.ts`：代码、股数、金额、盈亏、净资产历史与个人观察。
- `src/local-market-data.ts`：当前关注资产的正式收盘序列。
- `snapshots/`、根目录的 `最新持仓照片/`：券商截图。
- `dist/`、根目录的 `资产看板.html`、`macos-app/build/`：已经嵌入本地数据的构建结果。
- 根目录的 `outputs/`：包含资产信息的导出文件。

公开的两个 `.example.ts` 文件只提供虚构演示数据。`.gitignore` 像一道出门前的门禁：私有文件仍在电脑里供应用使用，但 Git 不会把它们装进将要上传的提交。
