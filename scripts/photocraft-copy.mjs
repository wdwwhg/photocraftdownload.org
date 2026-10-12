import { readFileSync, writeFileSync } from 'node:fs';

// Editable bilingual site copy. Run once to merge into the template's Paraglide catalogs.
const copy = {
  'meta.title': [
    'PhotoCraft Download — Free Image Editor for Windows, macOS & Linux',
    'PhotoCraft 下载 — Windows、macOS、Linux 免费开源图像编辑器',
  ],
  'meta.description': [
    'Download PhotoCraft from official GitHub releases. Find Windows, macOS and Linux builds, installation steps, a tour of the editor and a practical Photoshop comparison.',
    '整理 PhotoCraft Windows、macOS、Linux 官方安装包下载链接，提供安装教程、编辑器界面介绍及 Photoshop 功能对比。免费开源，支持分层 PSD 文件。',
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
  'nav.open': ['Open navigation', '展开导航'],
  'nav.close': ['Close navigation', '关闭导航'],
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
  'hero.realInterface': ['REAL APP SCREENSHOT', '真实软件界面'],
  'hero.psdTitle': ['Your layers come with you.', '你的图层，完整同行。'],
  'hero.psdText': [
    'Open, edit & save layered PSD files',
    '打开、编辑、保存分层 PSD',
  ],
  'hero.caption': [
    'Official screenshot · ArtCraft / The Great Wave, Hokusai',
    '官方截图 · ArtCraft / 葛饰北斋《神奈川冲浪里》',
  ],
  'images.interface': [
    'Official PhotoCraft interface editing Hokusai’s Great Wave with a Curves adjustment, editable text and a Layers panel.',
    'PhotoCraft 官方界面：编辑葛饰北斋《神奈川冲浪里》，显示曲线调整、文字与图层面板。',
  ],
  'images.adjustments': [
    'PhotoCraft editing Monet’s Impression, Sunrise with Levels, Vibrance, a histogram and the Layers panel.',
    'PhotoCraft 编辑莫奈《印象·日出》，显示色阶、自然饱和度、直方图与图层面板。',
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
  'downloads.checked': ['Release links checked:', '下载链接核对日期：'],
  'downloads.updateNote': [
    'These PhotoCraft download links are pinned to version 0.7.0. Check the official release page for newer builds; file sizes are shown in MiB.',
    '这些 PhotoCraft 下载链接固定为 0.7.0 版本。更新版本请查看官方发布页；文件大小按 MiB 换算。',
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
    'Levels & Vibrance · Monet, Impression, Sunrise',
    '色阶与自然饱和度 · 莫奈《印象·日出》',
  ],
  'features.imageSource': ['Official screenshot', '官方截图来源'],
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
    'Wayland drag-and-drop is not supported in this release. Use File → Open or paste an image. The commands below are for x86_64 AppImage.',
    '此版本暂不支持 Wayland 拖放文件，可用 File → Open 或粘贴图片。下方命令针对 x86_64 AppImage。',
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
    'Based on the PhotoCraft v0.7.0 README and Adobe product information. The developers do not yet recommend PhotoCraft as a replacement for daily professional work.',
    '依据 PhotoCraft v0.7.0 README 与 Adobe 产品信息整理。开发者明确表示，现阶段尚不能替代 Photoshop 用于专业日常工作。',
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
  'faq.free.q': ['Is PhotoCraft really free?', 'PhotoCraft 真的免费吗？'],
  'faq.free.a': [
    'Yes. The app is open source under MIT or Apache-2.0, with no subscription. Bundled assets have their own licenses; check the project’s attribution file for details.',
    '是的。应用代码采用 MIT 或 Apache-2.0 开源许可，无需订阅。内置素材可能采用单独许可，详情请查看项目的归属说明。',
  ],
  'faq.psd.q': [
    'Can I open and save Photoshop PSD files?',
    '可以打开与保存 Photoshop PSD 文件吗？',
  ],
  'faq.psd.a': [
    'PhotoCraft reads and writes layered PSD and PSB files. Complex documents can differ after re-saving, and files are not byte-identical. Keep your original and test a copy first.',
    'PhotoCraft 支持分层 PSD 与 PSB 的读写。复杂文档重新保存后可能有差异，文件并非逐字节一致。建议保留原文件，先用副本测试。',
  ],
  'faq.replacement.q': [
    'Can it replace Photoshop for my daily work?',
    '目前能替代 Photoshop 日常工作吗？',
  ],
  'faq.replacement.a': [
    'It is still early alpha. The team explicitly says it is not yet a replacement for daily professional Photoshop work. Try small projects first, especially if you rely on plug-ins, typography or generative tools.',
    '项目仍处于 early alpha。开发团队明确表示，尚不能替代 Photoshop 用于专业日常工作。建议先在小项目中试用，特别是依赖插件、专业排版或生成式工具时。',
  ],
  'faq.account.q': [
    'Do I need an account or internet connection?',
    '需要账号或网络连接吗？',
  ],
  'faq.account.a': [
    'The standalone editor works locally and offline without an account. You need an internet connection to download the app and obtain updates.',
    '独立编辑器在本地运行，可离线使用，无需账号。下载安装包与获取更新时需要网络连接。',
  ],
  'faq.updates.q': [
    'Where can I download a newer PhotoCraft version?',
    '在哪里下载更新版本的 PhotoCraft？',
  ],
  'faq.updates.a': [
    'Follow the latest official release link in the download section to check for a newer installer or release build. This guide lists version 0.7.0, so use that release page to confirm the version before downloading. ArtCraft also offers a launcher for installs and updates on the official PhotoCraft product page.',
    '通过下载区的最新官方版本链接查找更新的安装包或发行文件。本指南列出 0.7.0 版本，下载前可到发布页确认版本。ArtCraft 也在官方 PhotoCraft 产品页提供管理安装与更新的启动器。',
  ],
  'faq.official.q': [
    'Is this the official PhotoCraft website?',
    '这里是 PhotoCraft 官方网站吗？',
  ],
  'faq.official.a': [
    'This is an independent download and getting-started guide. PhotoCraft is made by ArtCraft. We link to the official storytold/photocraft releases and are not affiliated with ArtCraft or Adobe.',
    '本站是独立的下载与上手指南。PhotoCraft 由 ArtCraft 开发，本站链接至官方 storytold/photocraft 发布源，与 ArtCraft 或 Adobe 无隶属关系。',
  ],
  'cta.eyebrow': ['The next idea is yours', '下一个创意，由你开始'],
  'cta.title': ['Make something your own.', '把灵感，变成你的作品。'],
  'cta.description': [
    'Get PhotoCraft. Open an image. See where it takes you.',
    '下载 PhotoCraft，打开图片，探索你的创作可能。',
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
