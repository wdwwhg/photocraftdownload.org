# PhotoCraft Download website

基于已有 ShipAny / TanStack Start 模板制作。默认首页为英文，`/zh` 为中文。

## 本地启动

```text
pnpm install
pnpm dev
```

打开 http://localhost:3000。首页无需账号、数据库或第三方密钥。

## 内容维护

- 页面组件：`src/components/photocraft/home.tsx`
- 样式：`src/styles/photocraft.css`
- 下载文件与版本快照：`src/components/photocraft/downloads.ts`
- 中英双语文案：`scripts/photocraft-copy.mjs`，修改后运行 `node scripts/photocraft-copy.mjs`，将文案合并到 `messages/en.json`、`messages/zh.json`
- 搜索元信息与结构化数据：`src/routes/index.tsx`

下载快照在 2026-10-12 通过 `https://api.github.com/repos/storytold/photocraft/releases/latest` 核对，为 v0.7.0。页面明确显示版本和核对日期，附官方最新版本链接。上线后请按发布更新下载快照、文案内版本、安装命令、结构化数据与核对日期。不要直接修改版本号而不核对官方文件名。

## 资料与图片来源

- 官方产品页：https://getartcraft.com/apps/photocraft
- v0.7.0 发布页：https://github.com/storytold/photocraft/releases/tag/v0.7.0
- 版本 README：https://github.com/storytold/photocraft/blob/v0.7.0/README.md
- Adobe 对比来源：https://www.adobe.com/products/photoshop.html
- 界面截图来自官方仓库 `docs/images/`：PhotoCraft 界面 © ArtCraft 与贡献者；画作分别为葛饰北斋《神奈川冲浪里》、莫奈《印象·日出》，公有领域作品。图片来源和归属：https://github.com/storytold/photocraft/blob/v0.7.0/docs/images/SOURCES.md
- 项目许可与归属：https://github.com/storytold/photocraft/blob/v0.7.0/ATTRIBUTION.md

本站是独立下载指南，与 ArtCraft 或 Adobe 无隶属关系，不分发或修改软件安装包。站点所用橙色光圈标识为本指南的导航图形，不使用 ArtCraft 官方商标图形。

## 部署

运行 `pnpm build`，随后 `pnpm start` 可启动生成的 Node 服务。保留模板已有部署能力；本次制作未部署到公网。

默认站点地址为 `https://photocraftdownload.org`。若改用其他域名，配置 `VITE_APP_URL` 并同步修改 `public/robots.txt` 和 `public/sitemap.xml`。模板后台、认证、定价与示例博客入口不出现在首页，且 robots.txt 排除这些示例页面。正式启用模板的账号或后台模块时，按模板文档配置数据库和认证环境变量。
