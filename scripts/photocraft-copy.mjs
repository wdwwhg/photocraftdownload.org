import { readFileSync, writeFileSync } from 'node:fs';

// Editable bilingual site copy. Run once to merge into the template's Paraglide catalogs.
const copy = {
  'guides.photocraft-version-history.title': [
    'PhotoCraft Version History',
    'PhotoCraft 版本历史',
  ],
  'guides.photocraft-version-history.description': [
    'Release dates, everyday changes and official downloads from v0.7.0 through v0.9.0.',
    '查看 v0.7.0 至 v0.9.0 的发布日期、日常使用变化与各版官方下载。',
  ],
  'topicNav.photocraft-version-history': [
    'PhotoCraft Version History',
    'PhotoCraft 版本历史与旧版下载',
  ],
  'downloads.history': ['Version history', '版本历史与旧版下载'],
  'chooser.title': ['Which file should I download?', '我该下哪个？'],
  'chooser.description': [
    'Answer three questions. Get the exact file for your computer.',
    '回答三个问题，直接找到适合你电脑的文件。',
  ],
  'chooser.system': ['What is your operating system?', '你的系统是？'],
  'chooser.chip': ['What chip does your computer use?', '你的电脑用什么芯片？'],
  'chooser.delivery': [
    'How would you like to use it?',
    '你要装完就用，还是要便携版？',
  ],
  'chooser.chip.x64': ['Intel / AMD · 64-bit', 'Intel / AMD · 64 位'],
  'chooser.chip.x86': ['Intel / AMD · 32-bit', 'Intel / AMD · 32 位'],
  'chooser.chip.arm64': ['ARM64', 'ARM64'],
  'chooser.chip.windowsArm': [
    'ARM64 · Snapdragon / ARM PC',
    'ARM64 · 骁龙 / ARM 电脑',
  ],
  'chooser.chip.intel': ['Intel', 'Intel 芯片'],
  'chooser.chip.apple': ['Apple silicon · M series', 'Apple 芯片 · M 系列'],
  'chooser.chip.riscv64': ['RISC-V 64', 'RISC-V 64'],
  'chooser.chip.unknown': ['Not sure', '不确定'],
  'chooser.help.windows': [
    'Open Settings → System → About → System type. Most Intel/AMD PCs are 64-bit; Snapdragon PCs use ARM64. Match the system type shown on your computer.',
    '打开「设置 → 系统 → 系统信息」，查看「系统类型」。大多数 Intel/AMD 电脑是 64 位；骁龙电脑使用 ARM64。以电脑显示的系统类型为准。',
  ],
  'chooser.help.macos': [
    'Open Apple menu → About This Mac. “Chip: Apple M…” means Apple silicon; “Processor: Intel…” means Intel.',
    '打开「苹果菜单 → 关于本机」。「芯片：Apple M…」选 Apple 芯片；「处理器：Intel…」选 Intel 芯片。',
  ],
  'chooser.help.linux': [
    'Run uname -m in a terminal: x86_64 = Intel/AMD 64-bit, aarch64 = ARM64, riscv64 = RISC-V 64.',
    '在终端运行 uname -m：x86_64 选 Intel/AMD 64 位，aarch64 选 ARM64，riscv64 选 RISC-V 64。',
  ],
  'chooser.mode.install': ['Install and use', '装完就用'],
  'chooser.mode.portable': ['Portable / no installer', '便携版 / 免安装'],
  'chooser.modeHelp.windows': [
    'MSI installs the app. For the portable ZIP, extract the entire folder before launching.',
    'MSI 用来安装应用；便携 ZIP 需要先完整解压，再运行里面的程序。',
  ],
  'chooser.modeHelp.macos': [
    'macOS uses one Universal DMG for both Intel and Apple silicon. This release has no portable desktop ZIP; the CLI ZIP is a command-line tool.',
    'macOS 的 Intel 和 Apple 芯片使用同一个 Universal DMG。此版本没有桌面便携 ZIP；CLI ZIP 是命令行工具。',
  ],
  'chooser.modeHelp.linux': [
    'Install: Flatpak, which needs Flatpak support. Portable: AppImage; allow it to run as a program before launching.',
    '安装版推荐 Flatpak，需要系统支持 Flatpak；便携版使用 AppImage，需要先允许文件作为程序执行。',
  ],
  'chooser.modeHelp.riscv64': [
    'This release provides a tar.gz desktop archive for RISC-V 64. Extract it and follow the official Linux instructions for dependencies and launch steps.',
    '此版本为 RISC-V 64 提供 tar.gz 桌面压缩包。解压后按官方 Linux 说明检查依赖并启动。',
  ],
  'chooser.chooseSystem': [
    'Start by selecting your operating system.',
    '先选你的操作系统。',
  ],
  'chooser.chooseChip': [
    'Check your chip using the tip above, then choose the matching option. We will not guess a file for you.',
    '按上方提示确认芯片，再选择对应选项，就能继续推荐。',
  ],
  'chooser.chooseMode': [
    'Choose installation or portable use to see your file.',
    '再选一下使用方式，就能看到该下载的文件。',
  ],
  'chooser.unavailable': [
    'No matching file is listed for this combination. Check the official release files below.',
    '当前组合没有匹配的文件，请查看下方官方发布文件。',
  ],
  'chooser.result': ['Download this file', '你该下载这个文件'],
  'chooser.result.windows.install': [
    'Run this MSI and follow the setup steps to install the desktop app.',
    '双击这个 MSI 文件，按提示安装桌面应用。',
  ],
  'chooser.result.windows.portable': [
    'Extract the entire ZIP into a folder, then launch the app inside it. No MSI installation is needed.',
    '把 ZIP 完整解压到一个文件夹，再运行里面的应用，无需 MSI 安装。',
  ],
  'chooser.result.macos': [
    'Open the DMG and drag the app into Applications. This Universal file supports both Intel and Apple silicon Macs.',
    '打开 DMG，将应用拖入「应用程序」。这个 Universal 文件同时适用于 Intel 和 Apple 芯片的 Mac。',
  ],
  'chooser.result.linux.install': [
    'Install this package with Flatpak. If your system does not have Flatpak support, follow the Linux guide first or choose the AppImage.',
    '使用 Flatpak 安装此文件。如果系统尚未支持 Flatpak，请先看 Linux 指南，或改选 AppImage 便携版。',
  ],
  'chooser.result.linux.portable': [
    'Allow this AppImage to run as a program, then launch it. See the Linux guide if your distribution needs additional dependencies.',
    '允许此 AppImage 作为程序执行后启动；如果发行版需要额外依赖，请查看 Linux 指南。',
  ],
  'chooser.result.riscv64': [
    'Extract the full archive and follow the official Linux instructions to launch it. This is the desktop archive, not a source-code download.',
    '完整解压后，按官方 Linux 说明启动。这是桌面应用压缩包，不是源码下载。',
  ],
  'chooser.download': ['Download recommended file', '下载推荐文件'],
  'chooser.guide': ['Installation help', '查看安装说明'],
  'chooser.source': [
    'Direct download from the official GitHub release. More builds and formats are listed below.',
    '直接从官方 GitHub 发布页下载，其他版本与格式可在下方选择。',
  ],
  'guides.photocraft-vs-vectorcraft.title': [
    'PhotoCraft vs VectorCraft',
    'PhotoCraft 与 VectorCraft 对比',
  ],
  'guides.photocraft-vs-vectorcraft.description': [
    'Compare PhotoCraft and VectorCraft by pixels, paths, file handoff and editing tasks. Learn how the two ArtCraft apps fit a mixed design workflow.',
    '比较 PhotoCraft 和 VectorCraft 的像素、路径与文件交接流程，了解两款 ArtCraft 应用如何配合完成图像与矢量设计。',
  ],
  'topicNav.photocraft-vs-vectorcraft': [
    'PhotoCraft vs VectorCraft',
    'PhotoCraft 与 VectorCraft 对比',
  ],
  'guides.photocraft-github.title': ['PhotoCraft GitHub', 'PhotoCraft GitHub'],
  'guides.photocraft-github.description': [
    'Find the official PhotoCraft GitHub repository, download release assets, distinguish installers from source archives and report reproducible issues.',
    '确认 PhotoCraft 官方 GitHub 仓库，区分发布安装包和源码压缩包，获取固定版本代码，并提交可复现的问题。',
  ],
  'topicNav.photocraft-github': ['PhotoCraft GitHub', 'PhotoCraft GitHub'],
  'guides.photocraft-tutorial.title': [
    'PhotoCraft Tutorial',
    'PhotoCraft 入门教程',
  ],
  'guides.photocraft-tutorial.description': [
    'Follow a beginner PhotoCraft tutorial to create a photo caption card with separate text and adjustment layers, then save and verify an editable project.',
    '通过一个完整的小项目学习 PhotoCraft：为照片加入独立文字与调整层，保存可编辑文档，导出图片并重新打开检查。',
  ],
  'topicNav.photocraft-tutorial': [
    'PhotoCraft Tutorial',
    'PhotoCraft 入门教程',
  ],
  'guides.photocraft-artcraft.title': [
    'PhotoCraft and ArtCraft',
    'PhotoCraft 与 ArtCraft',
  ],
  'guides.photocraft-artcraft.description': [
    'Understand the relationship between PhotoCraft, ArtCraft, the ArtCraft Launcher and sibling apps, with official product and repository links.',
    '解释 PhotoCraft、ArtCraft、ArtCraft Launcher 和同系列应用的关系，提供官方产品、源码和发布入口。',
  ],
  'topicNav.photocraft-artcraft': [
    'PhotoCraft and ArtCraft',
    'PhotoCraft 与 ArtCraft',
  ],
  'guides.photocraft-review.title': ['PhotoCraft Review', 'PhotoCraft 评测'],
  'guides.photocraft-review.description': [
    'Our Windows screenshots, version and system evidence, a three-layer PSD save and reopen test, and practical limitations.',
    '查看本站 Windows 实拍、版本与系统信息、三图层 PSD 保存重开记录，以及实际使用局限。',
  ],
  'topicNav.photocraft-review': ['PhotoCraft Review', 'PhotoCraft 评测'],
  'guides.photocraft-windows.title': [
    'PhotoCraft Windows Installation',
    'PhotoCraft Windows 安装指南',
  ],
  'guides.photocraft-windows.description': [
    'Find your x64, x86 or ARM64 build, compare MSI and portable settings, and troubleshoot missing DLLs and startup errors.',
    '查清 x64、x86 与 ARM64，比较 MSI 与便携设置，排查缺少 DLL、运行库和启动报错。',
  ],
  'topicNav.photocraft-windows': ['PhotoCraft Windows', 'PhotoCraft Windows'],
  'guides.photocraft-macos.title': [
    'PhotoCraft macOS Installation',
    'PhotoCraft macOS 安装指南',
  ],
  'guides.photocraft-macos.description': [
    'Install the Universal DMG, handle Gatekeeper warnings and diagnose a damaged app with source and signature checks.',
    '安装 Universal DMG，区分 Gatekeeper 提示与 App 已损坏，按步骤核对来源、签名并排查启动问题。',
  ],
  'topicNav.photocraft-macos': [
    'PhotoCraft macOS',
    'PhotoCraft macOS 安装指南',
  ],
  'guides.photocraft-web.title': ['PhotoCraft Web', 'PhotoCraft Web'],
  'guides.photocraft-web.description': [
    'Learn what the PhotoCraft web ZIP contains, how to run the browser build locally or host it, and how saving, fonts and graphics differ from desktop.',
    '说明 PhotoCraft 网页 ZIP 的内容、本机启动与静态托管方法，以及浏览器中的保存、字体和图形能力边界。',
  ],
  'topicNav.photocraft-web': ['PhotoCraft Web', 'PhotoCraft Web'],
  'guides.what-is-photocraft.title': [
    'What Is PhotoCraft?',
    'PhotoCraft 是什么？',
  ],
  'guides.what-is-photocraft.description': [
    'PhotoCraft is an open-source ArtCraft image editor. Learn what layers, PSD support, desktop and web builds mean, and where the early-alpha limits apply.',
    '了解 ArtCraft 的免费开源图像编辑器 PhotoCraft，认识图层、PSD、桌面与网页构建，以及早期 Alpha 的适用边界。',
  ],
  'topicNav.what-is-photocraft': ['What Is PhotoCraft?', 'PhotoCraft 是什么？'],
  'guides.photocraft-free.title': ['PhotoCraft Free', 'PhotoCraft 免费说明'],
  'guides.photocraft-free.description': [
    'Understand what is free in PhotoCraft, how official releases differ from source code and why fonts, artwork, hosting and external services have separate terms.',
    '区分 PhotoCraft 免费应用、开源授权与素材、字体、托管和外部服务的独立条件，正确选择官方发布包。',
  ],
  'topicNav.photocraft-free': ['PhotoCraft Free', 'PhotoCraft 免费说明'],
  'guides.photocraft-rust.title': ['PhotoCraft Rust', 'PhotoCraft Rust'],
  'guides.photocraft-rust.description': [
    'Explore PhotoCraft’s Rust, egui and wgpu architecture, follow versioned source-build prerequisites and distinguish desktop, browser and test workflows.',
    '了解 PhotoCraft 的 Rust、egui 和 wgpu 架构，按固定版本核对桌面与 Wasm 构建要求，并区分开发命令和实际验证。',
  ],
  'topicNav.photocraft-rust': ['PhotoCraft Rust', 'PhotoCraft Rust'],
  'meta.title': [
    'PhotoCraft Download v%VERSION% — Free Photo Editor (%YEAR%)',
    'PhotoCraft 下载 v%VERSION% — 免费照片编辑器（%YEAR%）',
  ],
  'meta.description': [
    'Download PhotoCraft for Windows, macOS and Linux. Find official installers, verified release links, PSD support details and clear steps to get started.',
    '下载适用于 Windows、macOS 和 Linux 的 PhotoCraft 免费编辑器。获取官方安装包、自动核对的发布链接、安装步骤及 PSD 兼容说明。',
  ],
  'brand.tag': ['Independent download guide', '独立下载与上手指南'],
  skip: ['Skip to content', '跳转到正文'],
  announcement: [
    'Free to create. Open source by ArtCraft.',
    '来自 ArtCraft 的免费开源图像编辑器',
  ],
  'nav.label': ['Main navigation', '主导航'],
  'nav.downloads': ['Downloads', '下载'],
  'nav.install': ['Installation', '安装指南'],
  'nav.features': ['Features', '功能介绍'],
  'nav.compare': ['vs. Photoshop', '对比 Photoshop'],
  'nav.guides': ['Guides', '使用指南'],
  'guides.eyebrow': ['Explore the guides', '按主题了解'],
  'guides.title': ['A guide for your next step.', '找到你需要的下一步。'],
  'guides.description': [
    'Installation help, editing workflows and independent product comparisons.',
    '安装帮助、编辑流程与独立产品对比。',
  ],
  'guides.updated': ['Last reviewed:', '最近核实：'],
  'guides.toc': ['On this page', '本页内容'],
  'guides.related': ['Continue exploring', '继续了解'],
  'guides.download': ['PhotoCraft Download', 'PhotoCraft 下载'],
  'guides.downloadDescription': [
    'Ready to start? Choose an official PhotoCraft build for your computer.',
    '准备开始？为你的电脑选择官方 PhotoCraft 构建。',
  ],
  'guides.photocraft-vs-photoshop.title': [
    'PhotoCraft vs Photoshop',
    'PhotoCraft vs Photoshop',
  ],
  'guides.photocraft-vs-photoshop.description': [
    'Compare features, PSD handoff and real workflow requirements.',
    '比较功能、PSD 交接与实际工作流要求。',
  ],
  'guides.photocraft-open-source.title': [
    'PhotoCraft Open Source',
    'PhotoCraft 开源说明',
  ],
  'guides.photocraft-open-source.description': [
    'Find the Rust source, understand licenses and contribute.',
    '找到 Rust 源码，了解授权并参与开发。',
  ],
  'guides.photocraft-linux.title': [
    'PhotoCraft on Linux',
    'PhotoCraft Linux 安装',
  ],
  'guides.photocraft-linux.description': [
    'Choose AppImage, Flatpak, DEB, RPM or tar.gz and troubleshoot FUSE, runtimes and dependencies.',
    '选择 AppImage、Flatpak、DEB、RPM 或 tar.gz，处理 FUSE、运行时、依赖和更新问题。',
  ],
  'guides.photocraft-reddit.title': [
    'PhotoCraft on Reddit',
    'PhotoCraft Reddit 讨论',
  ],
  'guides.photocraft-reddit.description': [
    'Read launch discussions and evaluate community feedback.',
    '阅读发布讨论，判断社区反馈的适用范围。',
  ],
  'guides.photocraft-alternative.title': [
    'PhotoCraft Alternatives',
    'PhotoCraft 替代软件',
  ],
  'guides.photocraft-alternative.description': [
    'Choose an image editor around the task you need to finish.',
    '根据实际需要完成的任务选择图像编辑器。',
  ],
  'guides.photocraft-app.title': [
    'PhotoCraft App Guide',
    'PhotoCraft 应用上手',
  ],
  'guides.photocraft-app.description': [
    'Meet the interface and complete a first editing session.',
    '认识界面并完成第一次图像编辑。',
  ],
  'guides.vectorcraft.title': ['VectorCraft', 'VectorCraft'],
  'guides.vectorcraft.description': [
    'Explore paths, shapes and editable vector artwork.',
    '了解路径、形状与可编辑矢量作品。',
  ],
  'guides.filmcraft.title': ['FilmCraft', 'FilmCraft'],
  'guides.filmcraft.description': [
    'Get started with timeline editing, sound and video exports.',
    '了解时间线剪辑、声音与视频导出。',
  ],
  'guides.lightcraft.title': ['LightCraft', 'LightCraft'],
  'guides.lightcraft.description': [
    'Organize a photo library and evaluate raw development.',
    '整理照片图库，评估 RAW 开发流程。',
  ],
  'nav.open': ['Open navigation', '展开导航'],
  'nav.close': ['Close navigation', '关闭导航'],
  'downloads.alpha': ['Early alpha', '早期 Alpha'],
  'footer.privacy': ['Privacy Policy', '隐私政策'],
  'footer.terms': ['Terms of Use', '使用条款'],
  'hero.eyebrow': ['Your next creative starting point', '从这里，开始你的创作'],
  'hero.title1': ['PhotoCraft Download', 'PhotoCraft 下载'],
  'hero.title2': [
    '— Free Image Editor for Windows, macOS & Linux',
    '— Windows、macOS、Linux 免费图像编辑器',
  ],
  'hero.description': [
    'Download PhotoCraft, the free, open-source image editor from ArtCraft. Find official download links for Windows, macOS and Linux, then get started with layers, masks and native PSD support.',
    '下载 PhotoCraft，来自 ArtCraft 的免费开源图像编辑器。这里整理 Windows、macOS 和 Linux 官方下载链接，帮助你安装并上手图层、蒙版与原生 PSD 编辑。',
  ],
  'hero.download': ['Download PhotoCraft', '下载 PhotoCraft'],
  'hero.explore': ['Meet the editor', '了解编辑器'],
  'hero.noSubscription': ['No subscription', '无需订阅'],
  'hero.psdTitle': ['Explore layered PSD editing.', '探索分层 PSD 编辑。'],
  'hero.psdText': [
    'Open, edit & save layered PSD files',
    '打开、编辑、保存分层 PSD',
  ],
  'hero.caption': [
    'Captured by this site · Windows 11 · v0.9.0 · 15 Oct 2026',
    '本站实拍 · Windows 11 · v0.9.0 · 2026-10-15',
  ],
  'images.interface': [
    'Our Windows 11 capture of PhotoCraft with the About dialog showing version 0.9.0 and commit c699e3cda over our original COAST test document.',
    '本站 Windows 11 真机截图：PhotoCraft「关于」对话框显示版本 0.9.0、提交 c699e3cda，背景为本站原创 COAST 测试文档。',
  ],
  'images.adjustments': [
    'Our PhotoCraft 0.9.0 Windows capture after reopening coast-layers.psd, showing three layers and a Levels midtone value of 1.1.',
    '本站 PhotoCraft 0.9.0 Windows 实拍：重开 coast-layers.psd 后，三个图层与色阶中间调 1.1 仍保留。',
  ],
  'proof.open': ['Free & open source', '免费且开源'],
  'proof.psd': ['Native PSD & PSB support', '原生支持 PSD 与 PSB'],
  'proof.offline': ['Edit offline, on your machine', '本地编辑，支持离线使用'],
  'proof.platforms': ['Windows, macOS & Linux', 'Windows、macOS 与 Linux'],
  'downloads.eyebrow': ['Get PhotoCraft', '获取 PhotoCraft'],
  'downloads.title': [
    'PhotoCraft download links for your system.',
    '选择系统，获取 PhotoCraft 下载链接。',
  ],
  'downloads.description': [
    'Choose your operating system and architecture. Each direct download link below points to the original installer or release build on the official GitHub release page.',
    '选择你的操作系统和处理器架构。下方每个直达下载链接均指向官方 GitHub 发布页的原始安装包或发行文件。',
  ],
  'downloads.detected': ['Your detected system', '检测到你的系统'],
  'downloads.windows.subtitle': [
    'Windows 10 / 11 · Intel & AMD 64-bit',
    'Windows 10 / 11 · Intel 与 AMD 64 位',
  ],
  'downloads.windows.format': ['MSI installer · x64', 'MSI 安装包 · x64'],
  'downloads.macos.subtitle': [
    'Apple silicon & Intel · Universal app',
    'Apple 芯片与 Intel · 通用版本',
  ],
  'downloads.macos.format': [
    'Disk image · Universal',
    'DMG 磁盘映像 · Universal',
  ],
  'downloads.linux.subtitle': ['Linux desktop · x86_64', 'Linux 桌面 · x86_64'],
  'downloads.linux.format': ['AppImage · x86_64', 'AppImage · x86_64'],
  'downloads.button': ['Get it for', '下载'],
  'downloads.install': ['Installation guide', '查看安装步骤'],
  'downloads.more': ['Other builds & architectures', '其他格式与处理器架构'],
  'downloads.original': [
    'Official files. No repackaging. No mirrors.',
    '官方原始文件，不重新打包，不提供镜像。',
  ],
  'downloads.checksum': ['SHA-256 checksums', 'SHA-256 校验文件'],
  'downloads.releases': ['Latest official release', '最新官方版本'],
  'downloads.checked': ['Release links checked:', '下载链接核对时间：'],
  'hero.currentVersion': ['Current version', '当前版本'],
  'hero.updated': ['Updated & verified:', '更新核验时间：'],
  'hero.directDownloads': [
    'Official downloads by platform',
    '按平台直接下载官方版本',
  ],
  'hero.directDownload': ['Download', '下载'],
  'hero.allBuilds': ['View all builds', '查看全部版本格式'],
  'downloads.monitor': ['View the daily check', '查看每日自动检查'],
  'downloads.report': ['View this check report', '查看本次检查报告'],
  'downloads.checkMethod': [
    'Links are verified automatically before publication. A daily monitor also checks for missing files and newer official releases.',
    '每次发布前自动验证下载链接，每日巡检还会检查文件缺失与官方新版本。',
  ],
  'downloads.updateNote': [
    'These PhotoCraft download links are pinned to version %VERSION%. File sizes come from the official release and are shown in MiB.',
    '这些 PhotoCraft 下载链接固定为 %VERSION% 版本。文件大小取自官方发布数据，按 MiB 显示。',
  ],
  'features.eyebrow': ['Inside the editor', '认识编辑器'],
  'features.title': [
    'Familiar tools. A fresh start.',
    '熟悉的工具，全新的开始。',
  ],
  'features.description': [
    'Layers, masks, type and color. A native workspace built around the way you create.',
    '图层、蒙版、文字与色彩。原生桌面工作区，让创作顺着你的习惯展开。',
  ],
  'features.imageCaption': [
    'Our Windows capture · PSD reopened · Levels 1.10',
    '本站 Windows 实拍 · PSD 重开后 · 色阶 1.10',
  ],
  'features.imageSource': ['Our test record', '本站实测记录'],
  'captures.title': [
    'The machine behind these screenshots',
    '这些截图，在哪台电脑上拍的？',
  ],
  'captures.description': [
    'Captured on 15 Oct 2026: PhotoCraft 0.9.0 x64 Portable on Windows 11 25H2, with an RTX 4060 Laptop GPU and Vulkan. We opened our original artwork, duplicated a layer, added Levels at 1.10, then saved and reopened this simple PSD. This check covers this file and this Windows build.',
    '2026-10-15，Windows 11 25H2、RTX 4060 Laptop GPU、Vulkan，运行 PhotoCraft 0.9.0 x64 便携版。打开本站原创画布，复制图层，添加色阶并设为 1.10，再保存、关闭并重开 PSD。本次验证范围为这个简单文件与这款 Windows 构建。',
  ],
  'captures.open': ['View original PNG', '查看原始 PNG'],
  'captures.systemAlt': [
    'Our real PhotoCraft System Info screenshot showing version 0.9.0, windows x86_64, NVIDIA RTX 4060 Laptop GPU and Vulkan, with the reopened PSD behind it.',
    '本站 PhotoCraft 系统信息实拍：显示 0.9.0、windows x86_64、NVIDIA RTX 4060 Laptop GPU、Vulkan，背景为重开后的 PSD。',
  ],
  'captures.systemCaption': [
    'System Info · actual app dialog',
    '系统信息 · 应用内实际对话框',
  ],
  'captures.record': [
    'See the steps and all three captures',
    '查看操作步骤与三张实拍图',
  ],
  'captures.file': [
    'Download our test PSD (439 KB)',
    '下载本站测试 PSD（439 KB）',
  ],
  'captures.credit': ['Captured by this independent guide', '本站独立拍摄'],
  'features.layers.title': [
    'Layers that keep your options open',
    '图层，让修改保留余地',
  ],
  'features.layers.description': [
    'Build with groups, masks, adjustment layers and smart objects. Keep your edits separate from the original image.',
    '利用图层组、蒙版、调整图层和智能对象处理图像，让修改与原始图像分开保存。',
  ],
  'features.psd.title': ['Keep working with your PSDs', '继续编辑你的 PSD'],
  'features.psd.description': [
    'Open and save layered PSD and PSB documents. Test a copy of complex files before moving a whole workflow.',
    '打开与保存分层 PSD、PSB 文件。迁移整套工作流程前，先用复杂文件的副本测试兼容性。',
  ],
  'features.color.title': [
    'A little more control over color',
    '细致掌控画面色彩',
  ],
  'features.color.description': [
    'Shape the image with Curves, Levels and Vibrance. Work with ICC profiles and 8, 16 or 32-bit documents.',
    '用曲线、色阶与自然饱和度调整画面，支持 ICC 色彩配置及 8、16、32 位文档。',
  ],
  'features.native.title': ['Made for your desktop', '为你的桌面而生'],
  'features.native.description': [
    'Written in Rust, with a GPU canvas and local editing. Available for all three major desktop platforms.',
    '使用 Rust 构建，提供 GPU 画布与本地编辑，覆盖 Windows、macOS 和 Linux 三大桌面平台。',
  ],
  'interface.title': ['Find your way around', '快速认识工作区'],
  'interface.toolbar.title': ['The toolbar', '左侧工具栏'],
  'interface.toolbar.description': [
    'Select, crop, paint and add text from the left side.',
    '选择、裁剪、绘画和添加文字。',
  ],
  'interface.canvas.title': ['The canvas', '中央画布'],
  'interface.canvas.description': [
    'Your document lives in the center. Zoom in for details.',
    '文档位于中央，可缩放查看细节。',
  ],
  'interface.panels.title': ['The panels', '右侧面板'],
  'interface.panels.description': [
    'Manage layers and adjust properties on the right.',
    '管理图层，修改属性与调整参数。',
  ],
  'install.eyebrow': ['Start creating', '开始使用'],
  'install.title': ['From download to first edit.', '从下载，到第一次编辑。'],
  'install.description': [
    'Use the official download for your system, then follow these three steps to install PhotoCraft and open your first image.',
    '获取适合你系统的官方安装包，再按照三个步骤安装 PhotoCraft 并打开第一张图片。',
  ],
  'install.tabs': ['Installation operating system', '选择安装系统'],
  'install.getFile': ['Get the official file', '下载官方文件'],
  'install.fullGuide': [
    'Full installation and troubleshooting guide',
    '查看完整安装与故障排查指南',
  ],
  'install.windows.1.title': ['Download the installer', '下载安装包'],
  'install.windows.1.text': [
    'Use the Windows download link to get the x64 MSI installer for most Intel and AMD PCs. On a Snapdragon PC, choose the ARM64 release build under other architectures.',
    '多数 Intel、AMD 电脑通过 Windows 下载链接获取 x64 MSI 安装包。Snapdragon 等 ARM 电脑请在其他架构中选择 ARM64 发行版本。',
  ],
  'install.windows.2.title': ['Run the setup', '运行安装程序'],
  'install.windows.2.text': [
    'Double-click the .msi file and follow the setup prompts. Prefer no installation? Unzip the matching portable ZIP instead.',
    '双击 .msi 文件，按照提示完成安装。想免安装使用，可下载对应便携 ZIP，解压后运行。',
  ],
  'install.windows.3.title': ['Open your first image', '打开第一张图片'],
  'install.windows.3.text': [
    'Launch PhotoCraft from the Start menu. Use File → Open to choose an image or a copy of your PSD document.',
    '从开始菜单启动 PhotoCraft，通过 File → Open 打开图片或 PSD 文档副本。',
  ],
  'install.windows.tip': [
    'If Windows shows a security warning, confirm the file came from storytold/photocraft and check its signature before continuing.',
    '如果 Windows 显示安全提示，请先确认文件来自 storytold/photocraft 官方项目，并检查签名。',
  ],
  'install.macos.1.title': ['Get the Universal DMG', '下载通用 DMG'],
  'install.macos.1.text': [
    'The official macOS download is a Universal DMG for both Apple silicon and Intel Macs. Save the disk image using the download link above.',
    'macOS 官方下载提供 Universal DMG，同时支持 Apple 芯片与 Intel Mac。通过上方下载链接保存磁盘映像。',
  ],
  'install.macos.2.title': ['Move it to Applications', '拖入应用程序文件夹'],
  'install.macos.2.text': [
    'Open the disk image and drag PhotoCraft to your Applications folder. Eject the disk image when finished.',
    '打开磁盘映像，将 PhotoCraft 拖入 Applications（应用程序）文件夹，完成后推出磁盘映像。',
  ],
  'install.macos.3.title': ['Launch and start editing', '启动并开始编辑'],
  'install.macos.3.text': [
    'Open PhotoCraft from Applications or Spotlight. Choose File → Open and select a picture or PSD copy to explore.',
    '从应用程序文件夹或 Spotlight 启动，通过 File → Open 选择图片或 PSD 副本开始探索。',
  ],
  'install.macos.tip': [
    'The official DMG is signed and notarized. If macOS blocks the app, verify its source and consult the project’s release documentation.',
    '官方 DMG 已签名并经过公证。若 macOS 阻止启动，请核对下载来源，并查看项目发布文档。',
  ],
  'install.linux.1.title': ['Choose the right build', '选择对应架构'],
  'install.linux.1.text': [
    'For Linux, download the x86_64 AppImage release build for most desktop PCs. ARM64 builds, Flatpak, DEB and RPM packages are available in the download section above.',
    'Linux 桌面电脑通常下载 x86_64 AppImage 发行文件。ARM64、Flatpak、DEB 与 RPM 安装包可在上方下载区展开选择。',
  ],
  'install.linux.2.title': ['Make it executable', '添加执行权限'],
  'install.linux.2.text': [
    'Open a terminal in the download folder. Run the chmod command below, or allow execution in the file’s Properties dialog.',
    '在下载文件所在文件夹打开终端，运行下方 chmod 命令，或在文件属性中允许作为程序执行。',
  ],
  'install.linux.3.title': ['Run PhotoCraft', '运行 PhotoCraft'],
  'install.linux.3.text': [
    'Run the AppImage using the second command below. Open an image with File → Open. Use your package manager for DEB or RPM.',
    '使用下方第二条命令启动 AppImage，通过 File → Open 打开图片。DEB、RPM 可使用系统软件包管理器安装。',
  ],
  'install.linux.tip': [
    'Wayland drag-and-drop is not supported in this release. Use File → Open or paste an image. The commands in this section are for x86_64 AppImage.',
    '此版本暂不支持 Wayland 拖放文件，可用 File → Open 或粘贴图片。本节命令针对 x86_64 AppImage。',
  ],
  'install.tip': ['Good to know.', '小提示：'],
  'install.command': [
    'Terminal · run in your download folder',
    '终端 · 在下载文件夹执行',
  ],
  'install.copy': ['Copy commands', '复制命令'],
  'install.copied': ['Copied!', '已复制！'],
  'install.copyFailed': [
    'Select and copy the commands manually; clipboard access is unavailable.',
    '暂时无法访问剪贴板，请选中命令手动复制。',
  ],
  'firstEdit.eyebrow': ['Your first five minutes', '上手后的前五分钟'],
  'firstEdit.title': ['Try a small, reversible edit.', '先试一次简单的修改。'],
  'firstEdit.text': [
    'Open an image, duplicate its layer, then try a Curves adjustment. Save a new PSD to keep layers editable; export a PNG or JPEG to share.',
    '打开图片，复制图层，再试试曲线调整。保存为新的 PSD 以保留可编辑图层；导出 PNG 或 JPEG 方便分享。',
  ],
  'firstEdit.docs': ['Explore the docs', '查看项目文档'],
  'compare.eyebrow': ['An honest comparison', '了解实际差异'],
  'compare.title': ['PhotoCraft vs. Photoshop', 'PhotoCraft 与 Photoshop'],
  'compare.description': [
    'A promising open-source alternative. Know what you get, and where it is still growing.',
    '值得探索的开源替代选择。了解它能做什么，以及哪些地方仍在发展。',
  ],
  'compare.feature': ['What matters', '比较项目'],
  'compare.open': ['FREE & OPEN SOURCE', '免费开源'],
  'compare.cost.label': ['Cost & license', '费用与许可'],
  'compare.cost.pc': ['Free · MIT or Apache-2.0', '免费 · MIT 或 Apache-2.0'],
  'compare.cost.ps': ['Paid subscription · proprietary', '付费订阅 · 专有软件'],
  'compare.systems.label': ['Desktop platforms', '桌面平台'],
  'compare.systems.pc': ['Windows, macOS & Linux', 'Windows、macOS 与 Linux'],
  'compare.systems.ps': ['Windows & macOS', 'Windows 与 macOS'],
  'compare.psd.label': ['Layered PSD files', '分层 PSD 文件'],
  'compare.psd.pc': [
    'Read & write · compatibility varies',
    '支持读写 · 兼容性因文件而异',
  ],
  'compare.psd.ps': [
    'Native format & full editing workflow',
    '原生格式与完整编辑流程',
  ],
  'compare.editing.label': ['Layers, masks & adjustments', '图层、蒙版与调整'],
  'compare.editing.pc': [
    'Supported · test your workflow',
    '已支持 · 建议验证你的流程',
  ],
  'compare.editing.ps': [
    'Established professional toolset',
    '成熟的专业工具集',
  ],
  'compare.ai.label': ['Generative AI', '生成式 AI'],
  'compare.ai.pc': ['A current development gap', '目前仍有功能缺口'],
  'compare.ai.ps': [
    'Generative Fill & Firefly features',
    '生成式填充与 Firefly 功能',
  ],
  'compare.plugins.label': ['Plug-in compatibility', '插件兼容性'],
  'compare.plugins.pc': [
    'Limited · Photoshop parity not complete',
    '有限 · 尚未全面兼容 Photoshop',
  ],
  'compare.plugins.ps': ['Established plug-in ecosystem', '成熟的插件生态'],
  'compare.maturity.label': ['Best fit today', '当前适用场景'],
  'compare.maturity.pc': [
    'Exploring, learning & testing · early alpha',
    '探索、学习与测试 · 早期 alpha',
  ],
  'compare.maturity.ps': [
    'Production & professional daily work',
    '生产环境与专业日常工作',
  ],
  'compare.note': [
    'Based on the PhotoCraft v%VERSION% README and Adobe product information. The developers do not yet recommend PhotoCraft as a replacement for daily professional work.',
    '依据 PhotoCraft v%VERSION% README 与 Adobe 产品信息整理。开发者明确表示，现阶段尚不能替代 Photoshop 用于专业日常工作。',
  ],
  'compare.pcSource': ['PhotoCraft source', 'PhotoCraft 来源'],
  'compare.psSource': ['Adobe source', 'Adobe 来源'],
  'faq.eyebrow': ['A few useful answers', '常见问题'],
  'faq.title': ['Before you download.', '下载之前，你可能想知道。'],
  'faq.description': [
    'A little context to help you choose your next image editor.',
    '帮助你了解这款图像编辑器，做出适合自己的选择。',
  ],
  'faq.officialLink': ['Visit the official project', '访问官方项目'],
  'faq.free.q': ['Is PhotoCraft free?', 'PhotoCraft 免费吗？'],
  'faq.free.a': [
    'Yes. PhotoCraft is a free, open-source image editor, and the official standalone builds do not require a subscription. The project includes MIT and Apache-2.0 license files. Bundled fonts, artwork and other assets can have separate terms, so consult the project’s attribution files if you plan to redistribute them. You can start with one desktop installer; the ArtCraft Launcher is another installation option, not a purchase required to unlock the download links on this page.',
    '是的。PhotoCraft 是免费开源图像编辑器，官方独立版本无需订阅。项目提供 MIT 和 Apache-2.0 许可文件；内置字体、图片等素材可能有各自条款，重新分发素材前应查阅项目归属说明。你可以直接选择一个桌面安装包，ArtCraft Launcher 是另一种安装方式，不是解锁本站下载链接所需的付费产品。',
  ],
  'faq.safe.q': ['Is PhotoCraft safe to download?', '下载 PhotoCraft 安全吗？'],
  'faq.safe.a': [
    'Use the official storytold/photocraft GitHub release or the ArtCraft product page. Our buttons link directly to those release files, without repackaging the installer. Before opening a file, confirm its name, version and architecture, then compare its SHA-256 value with the official checksum list. Keep your system’s security checks enabled. Our automated link check confirms availability and release metadata; it does not scan the software for malware or guarantee its behavior. An open-source license alone is not a security certification.',
    '请使用官方 storytold/photocraft GitHub 发布页或 ArtCraft 产品页。本站按钮直接指向原始发布文件，不重新打包安装程序。打开文件前，确认名称、版本和处理器架构，并将 SHA-256 值与官方校验清单比较，同时保留系统安全检查。本站自动检查验证链接可用性及发布数据，不进行恶意软件扫描，也不保证软件行为；开源许可本身不等于安全认证。',
  ],
  'faq.psd.q': [
    'Does PhotoCraft open PSD files?',
    'PhotoCraft 能打开 PSD 文件吗？',
  ],
  'faq.psd.a': [
    'The project documents reading and writing layered PSD and PSB files. That is useful when you want to try an existing image, but it does not promise identical handling of every Photoshop feature. Begin with a duplicate and inspect fonts, masks, effects and layer structure. Make a small change, save under a new name, then reopen the result in the application used for delivery. Keep the original file until you have checked the edited document and a flat reference export.',
    '项目文档说明支持分层 PSD 与 PSB 的读写，方便你用现有图片试用，但不代表每项 Photoshop 功能都能完全一致地处理。先打开副本，检查字体、蒙版、效果及图层结构。做一个小修改后另存为新文件，再用实际交付的软件重新打开。确认编辑后的文档及平面参考图之前，请保留原文件。',
  ],
  'faq.replacement.q': [
    'PhotoCraft vs Photoshop: which should I download?',
    'PhotoCraft vs Photoshop：应该下载哪个？',
  ],
  'faq.replacement.a': [
    'Try PhotoCraft if you want a free desktop editor, access to its source code or a native Linux build. If your work depends on a specific Adobe feature, plugin or team handoff, test that requirement before switching. A familiar interface and PSD support do not establish complete compatibility. Our dedicated comparison covers licensing, platforms and a practical migration test, so you can evaluate the workflow you actually use before making a commitment.',
    '如果你想使用免费桌面编辑器、查看源码或在 Linux 原生运行，可以尝试 PhotoCraft。如果工作依赖特定 Adobe 功能、插件或团队交接要求，应先测试这些需求。熟悉的界面和 PSD 支持并不代表完整兼容。独立对比页整理了授权、平台差异和迁移检查方法，帮助你按实际工作流判断是否适用。',
  ],
  'faq.installer.q': [
    'Which PhotoCraft installer should I choose?',
    '应该选择哪个 PhotoCraft 安装包？',
  ],
  'faq.installer.a': [
    'Match both your operating system and processor. Most Intel or AMD Windows PCs use x64, while Windows on ARM needs ARM64; the portable ZIP is an alternative to the MSI installer. The macOS Universal DMG covers the architectures listed by the project. On Linux, choose a matching AppImage or a package supported by your distribution. A CLI archive is intended for command-line use, so it is not the usual starting point for someone who wants the graphical editor. Check the architecture in your system settings if you are unsure.',
    '安装包需要同时匹配系统与处理器。大多数 Intel 或 AMD Windows 电脑使用 x64，Windows on ARM 使用 ARM64；便携 ZIP 是 MSI 安装包之外的选择。macOS Universal DMG 对应项目列出的 Mac 架构。Linux 应选择匹配架构的 AppImage 或发行版支持的软件包。CLI 压缩包用于命令行，想使用图形界面时通常不选它。不确定架构时，先查看系统设置。',
  ],
  'faq.account.q': [
    'Do I need an account or internet connection?',
    '需要账号或网络连接吗？',
  ],
  'faq.account.a': [
    'The standalone editor is designed to run locally without an account. You need a connection to download its installer, consult online documentation and obtain updates. After installation, begin with a local image and confirm the editing and export tasks you need. The desktop package, ArtCraft Launcher and downloadable web build have different setup steps; choose the desktop installer if your goal is simply to edit files on your computer.',
    '独立编辑器设计为无需账号在本地运行。下载安装包、查看在线文档及获取更新时需要网络。安装后可以先打开本地图片，检查所需的编辑与导出功能。桌面包、ArtCraft Launcher 与可下载的网页构建有不同的安装流程；如果只是想在电脑上编辑文件，请选择桌面安装包。',
  ],
  'faq.checksum.q': [
    'How do I verify a downloaded file?',
    '如何核对已下载的文件？',
  ],
  'faq.checksum.a': [
    'Open SHA256SUMS.txt from the same official release as your installer and find the line with the exact filename. Calculate a SHA-256 checksum locally using Get-FileHash on Windows, shasum -a 256 on macOS or sha256sum on Linux. Compare the complete value, not just its beginning. If the values differ, do not run that copy: confirm you selected the matching release and download it again. A matching checksum helps verify file integrity; it does not replace checking the source or your system’s security controls.',
    '打开与安装包同一官方版本的 SHA256SUMS.txt，找到完全相同文件名对应的一行。在 Windows 使用 Get-FileHash、macOS 使用 shasum -a 256、Linux 使用 sha256sum 计算本地 SHA-256，并比较完整数值。若不一致，先不要运行该副本，确认版本匹配后重新下载。校验一致有助于确认文件完整性，但不能替代来源核实和系统安全检查。',
  ],
  'faq.updates.q': [
    'Where can I download a newer PhotoCraft version?',
    '在哪里下载更新版本的 PhotoCraft？',
  ],
  'faq.updates.a': [
    'Use “Latest official release” above to see the current upstream release. This page lists version %VERSION%, with an automatic check timestamp beside the links. Our daily monitor checks for newer versions and missing files; a version change requires a review of the listed packages and installation instructions. Before installing an update, read its release notes and keep copies of ongoing projects. ArtCraft also offers a launcher for managing installations and updates from its official product page.',
    '点击上方“最新官方版本”查看当前上游发布。本页列出 %VERSION% 版本，并在链接旁显示自动核对时间。每日巡检会检查新版本与文件缺失；升级版本前还需复核安装包及安装说明。安装更新前请阅读发布说明，并保留正在编辑的项目副本。ArtCraft 官方产品页还提供用于管理安装和更新的启动器。',
  ],
  'faq.failed.q': [
    'What if a download or first launch fails?',
    '下载或首次启动失败怎么办？',
  ],
  'faq.failed.a': [
    'Retry from the official release page and check whether the file finished downloading. Confirm the operating system, architecture and available disk space before treating a launch error as an application bug. For Linux, also check executable permissions or the package’s required runtime. Keep the exact error message and version number when asking for help. Avoid changing file extensions, disabling security checks or trying an unrelated mirror as a shortcut. The Linux guide includes package-specific steps, while the app guide covers a simple first editing session.',
    '先从官方发布页重试，确认文件已完整下载，并检查系统、处理器架构与可用磁盘空间。Linux 还需检查可执行权限或软件包所需运行时。求助时保留完整报错和版本号。不要通过改文件扩展名、关闭安全检查或使用不相关镜像来绕过问题。Linux 专题提供不同包格式的步骤，应用上手页则介绍第一次编辑流程。',
  ],
  'faq.official.q': [
    'Is this the official PhotoCraft website?',
    '这里是 PhotoCraft 官方网站吗？',
  ],
  'faq.official.a': [
    'No. This is an independent download and getting-started guide. PhotoCraft is made by ArtCraft, and the download buttons lead to the official storytold/photocraft releases. We do not host modified installers or sell access to the software. For developer announcements, release notes and bug reports, use the official project. The guides linked here add installation explanations and workflow comparisons; they are not statements issued by ArtCraft or Adobe.',
    '不是。本站是独立下载与上手指南。PhotoCraft 由 ArtCraft 开发，下载按钮指向官方 storytold/photocraft 发布源。本站不托管修改版安装包，也不出售软件访问资格。开发者公告、发布说明和问题反馈请以官方项目为准。本站专题提供安装解释与工作流比较，不代表 ArtCraft 或 Adobe 的官方声明。',
  ],
  'cta.eyebrow': ['The next idea is yours', '下一个创意，由你开始'],
  'cta.title': ['Make something your own.', '把灵感，变成你的作品。'],
  'cta.description': [
    'Get PhotoCraft. Open an image. See where it takes you.',
    '下载 PhotoCraft，打开图片，探索你的创作可能。',
  ],
  'topicNav.title': ['PhotoCraft guides by topic', 'PhotoCraft 专题导航'],
  'topicNav.comparisons': ['Comparisons', '软件对比'],
  'topicNav.tutorials': ['Tutorials & community', '教程与社区'],
  'topicNav.platforms': ['Platform installation', '平台安装'],
  'topicNav.alternatives': ['Alternatives', '替代方案'],
  'topicNav.related': ['Related creative apps', '相关创作软件'],
  'topicNav.photocraft-vs-photoshop': [
    'PhotoCraft vs Photoshop',
    'PhotoCraft vs Photoshop',
  ],
  'topicNav.photocraft-app': ['PhotoCraft App', 'PhotoCraft App 使用教程'],
  'topicNav.photocraft-open-source': [
    'PhotoCraft Open Source',
    'PhotoCraft 开源说明',
  ],
  'topicNav.photocraft-reddit': [
    'PhotoCraft Reddit',
    'PhotoCraft Reddit 社区讨论',
  ],
  'topicNav.photocraft-linux': [
    'PhotoCraft Linux',
    'PhotoCraft Linux 安装指南',
  ],
  'topicNav.photocraft-alternative': [
    'PhotoCraft Alternative',
    'PhotoCraft 替代方案',
  ],
  'footer.independent': [
    'An independent guide to downloading and getting started with PhotoCraft. All downloads point to official sources.',
    'PhotoCraft 独立下载与上手指南。所有下载均指向官方来源。',
  ],
  'footer.disclaimer': [
    'Not affiliated with ArtCraft or Adobe. Product names belong to their respective owners.',
    '与 ArtCraft 或 Adobe 无隶属关系。产品名称归各自所有者所有。',
  ],
  'footer.credit': ['Interface screenshots:', '软件界面截图：'],
  'footer.top': ['Back to top', '返回顶部'],
};

for (const [index, locale] of ['en', 'zh'].entries()) {
  const path = new URL(`../messages/${locale}.json`, import.meta.url);
  const messages = JSON.parse(readFileSync(path, 'utf8'));
  for (const [key, values] of Object.entries(copy))
    messages[`photocraft.${key}`] = values[index];
  writeFileSync(path, JSON.stringify(messages, null, 2) + '\n');
}
console.log(
  `Updated ${Object.keys(copy).length} PhotoCraft messages in both languages.`
);
