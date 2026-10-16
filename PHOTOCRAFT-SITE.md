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

Google Analytics 4 通过根布局的现有 `GoogleAnalytics` 组件在全站加载一次，默认统计编号为 `G-RRGBXP8SN7`，位于 `src/config/index.ts`。可通过 `VITE_GOOGLE_ANALYTICS_ID` 覆盖默认值（空值关闭），后台数据库中的 `google_analytics_id` 配置优先。无需在各页面重复粘贴脚本；修改编号后重新构建并推送 GitHub。中英文隐私页已说明启用 GA4。

下载清单现为 v0.9.0，2026-10-15 已核对官方发布文件名。构建会通过官方 Release 元数据和每个文件的 HTTP HEAD 请求重新验证可用性、体积及最新版本。页面显示版本、核对日期与官方最新版本链接。更新版本时同步检查下载清单、安装指南中的命令与版本来源；不要只修改版本号。

下载区最上方的决策模块位于 `src/components/photocraft/download-chooser.tsx`，通过系统、芯片和安装方式从同一份下载清单中选择文件，不单独拼接文件名。macOS 的 Intel 和 Apple 芯片都匹配 Universal DMG；CLI ZIP 不作为桌面便携版。新增架构或包格式后，应同步核对该模块的选择规则及中英文文案。

## 资料与图片来源

### 版本历史页维护

版本数据与中英文摘要在 `src/content/photocraft-version-history.json`。页面为 `/photocraft-version-history` 与 `/zh/photocraft-version-history`，桌面显示表格、手机显示卡片；日期使用 GitHub 正式发布时间并统一显示为 Asia/Singapore（UTC+8）。

增补版本时从官方 API 核对 `published_at`、实际上传文件、完整变更对比范围，以及每项摘要对应的 PR。不要给没有正式 Release 记录的补丁号补写日期或链接。更新数据及两种语言页面的核对日期和范围后，运行 `node scripts/check-version-history.mjs`：它会核对历史发布日期、摘要来源和所有历史下载链接，并输出 `artifacts/version-history-check.json`。这个命令是维护检查，不会自动编写更新摘要或修改版本数据。

- 官方产品页：https://getartcraft.com/apps/photocraft
- v0.7.0 发布页：https://github.com/storytold/photocraft/releases/tag/v0.7.0
- 版本 README：https://github.com/storytold/photocraft/blob/v0.7.0/README.md
- Adobe 对比来源：https://www.adobe.com/products/photoshop.html
- 首页和评测页使用本站在 Windows 11 真机上拍摄的三张 PhotoCraft 0.9.0 截图，位于 `public/imgs/photocraft/captures/`：关于对话框、PSD 重开后的色阶与图层、系统信息。PNG 为未改动原图，WebP 仅压缩。机器、日期、安装包校验值、截图摘要和操作范围见同目录 `capture-record.json`，读者入口为评测页 `#hands-on`。版本号和拍摄日期属于固定记录，不能跟随最新下载版本自动替换；更新截图必须重新实际运行并拍摄。
- COAST 测试画布由本站制作并以 CC0 提供，SVG、导入的 PNG 和本次保存的三图层 PSD 随记录提供。文字与图形在导入前已栅格化，不代表测试了可编辑文字。软件界面 © ArtCraft 与贡献者，截图由本站独立拍摄。原先引用的官方示例画作已不再用于页面和分享图。
- 项目许可与归属：https://github.com/storytold/photocraft/blob/v0.7.0/ATTRIBUTION.md

本站是独立下载指南，与 ArtCraft 或 Adobe 无隶属关系，不分发或修改软件安装包。站点所用橙色光圈标识为本指南的导航图形，不使用 ArtCraft 官方商标图形。

## 部署

本站使用 Cloudflare Pages 项目 `photocraftdownload-org`，生产分支为 `main`，正式域名为 `https://photocraftdownload.org`。

在 PowerShell 中重新发布：

```powershell
node node_modules/wrangler/bin/wrangler.js whoami
$env:NITRO_PRESET = 'cloudflare_pages'
pnpm build
node node_modules/wrangler/bin/wrangler.js pages deploy dist --project-name photocraftdownload-org --branch main --no-bundle --commit-dirty=true
Remove-Item Env:NITRO_PRESET
```

必须保留 `--no-bundle`：框架已经生成完整的 Worker 模块；Wrangler 再次打包会向 next-themes 序列化的主题初始化函数加入 `__name` 辅助调用，导致浏览器报错。不要在 Pages 配置中设置 `keep_names`，该字段不受 Pages 发布配置支持。发布后应在正式域名检查中英文首页、下载指南、隐私页、旧定价与博客入口跳转及浏览器脚本错误。

需要本地 Node 预览时，在未设置 `NITRO_PRESET` 的终端运行 `pnpm build` 和 `pnpm start`。

默认站点地址为 `https://photocraftdownload.org`。若改用其他域名，配置 `VITE_APP_URL` 并同步修改 `public/robots.txt` 和 `public/sitemap.xml`。模板后台、认证、定价与示例博客入口不出现在首页，且 robots.txt 排除这些示例页面。正式启用模板的账号或后台模块时，按模板文档配置数据库和认证环境变量。
