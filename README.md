# PhotoCraft Download

PhotoCraft 下载指南网站，基于 ShipAny / TanStack Start 模板制作，提供 Windows、macOS、Linux 官方下载链接、安装说明、界面介绍和 Photoshop 功能对比。

- 英文首页：`/`
- 中文首页：`/zh`
- 下载版本：v0.7.0，官方文件核对日期：2026-10-12

## 本地运行

需要 Node.js 22 或更高版本、pnpm 10。

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000。首页无需账号或第三方密钥。

## 构建与启动

```bash
pnpm build
pnpm start
```

Docker 镜像发布工作流需在 GitHub Actions 中手动触发。上传代码不会自动发布网站。

## 维护说明

内容、下载快照、图片归属和部署配置见 [PHOTOCRAFT-SITE.md](PHOTOCRAFT-SITE.md)。环境配置模板见 [.env.example](.env.example)，本地环境文件不应提交。

本站是独立下载指南，与 ArtCraft 或 Adobe 无隶属关系。安装包直接链接至 [PhotoCraft 官方发布页](https://github.com/storytold/photocraft/releases)，本站不托管安装包。
