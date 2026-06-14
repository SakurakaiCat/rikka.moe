export type BookLang = 'zh-CN' | 'zh-TW' | 'en' | 'ja';

export interface BookCopy {
  title: string;
  description: string;
  lead: string;
  chips: string[];
  downloadLabel: string;
  afdianLabel: string;
  buttons: { explore: string; errata: string; versions: string; preview: string };
  nav: { overview: string; errata: string; design: string; versions: string; notes: string; support: string };
  update: { eyebrow: string; title: string; body: string; errataCount: string };
  seriesTabs: { func: string; journey: string };
  errataTabs: { journey: string; func: string };
  overview: {
    eyebrow: string;
    title: string;
    lead: string;
    funcTitle: string;
    funcBadge: string;
    funcBody: string;
    journeyTitle: string;
    journeyBadge: string;
    journeyBody: string;
    latest: string;
    loading: string;
  };
  design: {
    eyebrow: string;
    title: string;
    lead: string;
    stats: { value: string; label: string; desc: string }[];
    features: { icon: string; title: string; desc: string }[];
  };
  versions: {
    eyebrow: string;
    title: string;
    lead: string;
    freeTitle: string;
    freeItems: string[];
    premiumTitle: string;
    premiumChip: string;
    premiumItems: string[];
  };
  preview: { eyebrow: string; title: string; lead: string; func: string; journey: string };
  notes: { eyebrow: string; title: string; lead: string; originTitle: string; origin: string[]; practiceTitle: string; practice: string[]; pausedTitle: string; paused: string[] };
  support: { eyebrow: string; title: string; lead: string; cardTitle: string; cardBody: string; akariTitle: string; akariBody: string[] };
  aria: { chips: string; nav: string };
  dateLocale: string;
}

const copies: Record<BookLang, BookCopy> = {
  'zh-CN': {
    title: '数学之旅',
    description: 'ProjectA 书籍落地页：展示《数学之旅：函数与导数》与《高中数学之旅》的目录、预览、版本对比、下载与支持入口。6 月 12 日重大更新：附完整勘误表。',
    lead: '为中学数学而写的现代数学读物。函数、极限、导数一脉贯通，用 LaTeX 与 TikZ 把每一页都做成艺术品。',
    chips: ['LaTeX / XeLaTeX', 'TikZ 矢量图形', '免费版内容完整', '付费版仅去水印'],
    downloadLabel: '前往网盘下载',
    afdianLabel: '前往爱发电支持',
    buttons: { explore: '探索书稿', errata: '勘误表', versions: '版本对比', preview: '内页预览' },
    nav: { overview: '书稿总览', errata: '勘误表', design: '设计哲学', versions: '下载版本', notes: '写作说明', support: '支持作者' },
    update: {
      eyebrow: '6 月 12 日重大更新',
      title: '2026 届高考落幕，本书迎来重大修订',
      body: '经过最近几个月断断续续的修订和 review，并将模板更换为 Elegantbook 后，《高中数学之旅》终于又出了新版本！下方附有完整的勘误表，涵盖两本书共计 200+ 项修正。',
      errataCount: '200+',
    },
    seriesTabs: { func: '数学之旅 · 函数与导数', journey: '高中数学之旅 · 旧版五册' },
    errataTabs: { journey: '高中数学之旅', func: '函数与导数' },
    overview: {
      eyebrow: '书稿总览',
      title: '两个系列，一脉相承',
      lead: '两个系列内容互相独立。免费版与付费版的内容完全一致，付费版仅去除了页面水印，阅读体验更纯净。',
      funcTitle: '数学之旅：函数与导数',
      funcBadge: '新系列 · 第一册',
      funcBody: '本书围绕中学阶段的「函数与导数」展开，按专题分册编排，呈现由函数观念通向极限思想、再延伸至导数方法的数学脉络。前半部分依次讨论函数的概念、定义域、单调性、奇偶性、周期性、图像变换以及若干常见函数模型，强调图像、性质与解析式之间的联系。后半部分进入极限、连续、导数、中值定理、高阶导数与相关应用。',
      journeyTitle: '高中数学之旅',
      journeyBadge: '旧版 · 完整五册',
      journeyBody: '本系列覆盖中学数学的大部分专题与常见题型，并对若干进阶内容进行了介绍与论述。从集合与逻辑用语出发，最终于概率一章结束，适合从基础到中档的学生阅读。该书面向对中学数学抱有兴趣，以及正在学习或复习中学数学的读者。',
      latest: '最近更新：',
      loading: '加载中…',
    },
    design: {
      eyebrow: '设计哲学',
      title: '理念与特征',
      lead: '知识自由是我的起源。书稿以开放方式呈现，也用尽可能精细的排版保留数学内容的结构美。',
      stats: [
        { value: '21', label: '章', desc: '完整覆盖中学数学核心专题' },
        { value: '100%', label: '矢量', desc: 'TikZ 驱动的精确图形渲染' },
        { value: '∞', label: '精度', desc: 'LaTeX 排版，像素级数学公式' },
      ],
      features: [
        { icon: 'file-pdf', title: '纯净阅读体验', desc: '付费版 PDF 完全无水印，每一页都保持完整的视觉与版心比例。' },
        { icon: 'pen-nib', title: '排版即艺术', desc: 'LaTeX 级精细驱动，公式、图形、间距、字体的每一处细节都经过推敲。' },
        { icon: 'globe', title: '开源与知识自由', desc: '书稿以开放方式呈现，让每个人都能接触高质量的数学内容。' },
        { icon: 'code', title: '代码生成精度', desc: '所有图形由 TikZ 代码驱动，保证数学图形的精确性与可复现性。' },
        { icon: 'shield-check', title: '质量门禁', desc: 'GitHub Actions 持续集成、自动化编译校验、PDF 质量检查保障每一次提交。' },
        { icon: 'books', title: '专题分册编排', desc: '按数学专题独立分册，便于围绕不同主题独立阅读与查阅。' },
      ],
    },
    versions: {
      eyebrow: '版本对比',
      title: '选择你的版本',
      lead: '免费版与付费版的内容完全一致。付费版仅去除页面水印，并作为对作者的一份支持。',
      freeTitle: '免费版',
      freeItems: ['完整章节内容（含水印）', '全部图形与公式', '全部目录与内容提要', '作者简介与前言'],
      premiumTitle: '无水印版',
      premiumChip: '内容相同 · 仅去水印',
      premiumItems: ['与免费版内容完全相同', '去除页面水印，阅读纯净', 'TikZ 矢量图形源文件', '终身版本更新', '所有专题分册独立下载'],
    },
    preview: { eyebrow: '内页预览', title: '翻阅书页', lead: '随机抽取两本书的一些页面，提前感受排版风格。', func: '《函数与导数》', journey: '《高中数学之旅》' },
    notes: {
      eyebrow: 'Origin / Practice / Paused',
      title: '写作缘起、学习方式与暂停说明',
      lead: '这一部分保留原书籍说明页中的背景文字，解释为什么写这本书，以及项目当前的状态。',
      originTitle: '写作缘起与方法论',
      origin: ['本书的起点源自我在高中三年学习数学期间使用 Obsidian 软件记的笔记，书稿最终使用 LaTeX 编排。写这本书的初衷很简单：我觉得市面上没有一本教辅可以真正满足我。', '我观察到目前大部分教辅的形式，要不就是总结加一堆例题，有些比较良心的教辅，无非是在解析和答案上多下点功夫。直到我读了 Springer 出版社的《初等数学之旅》之后，我突然有感而发：为什么国内就没有一本这种能从初中一直讲到本科数学的大部头书呢？于是我写了这本书。', '我更想强调的是：拥有另一种模式的学生，看到一道题，不是先去 Matching 是什么题型，而是看到整道题背后的逻辑流：从哪个定义或定理出发，经历哪些分支，最后如何收敛到答案。'],
      practiceTitle: '关于习题册、AI 与学习方式',
      practice: ['许多人问我为什么不继续编一个习题册：一是没时间且回报太少；二是我确实懒；三是市面上的习题与专题资源已经很多。', '以前我也觉得解析册里的思路引导很重要，但现在我渐渐改变了想法。很多 AI 配合学习模式的一步步交互性引导，在效率上明显超过纸面答案。', '我在高三后期就经常把错题思路交给模型继续推演，让它顺着我的错误路径解释"为什么错、为什么这个方法好而那个不好"。把真实思考过程交给可交互系统，效率更高。'],
      pausedTitle: '为什么暂停更新',
      paused: ['这个项目曾进入无限期暂停，但经过最近几个月的修订，于 6 月 12 日发布了重大更新版本。模板已更换为 Elegantbook，并附有完整勘误表。此前的暂停原因包括：新增内容没有形成可持续回报；书稿被改名、拆分、低价倒卖持续消耗精力；大部头写作需要连续的大块时间且过于单向；以及有新的软件开发项目要做。', '接下来：把内容逐步迁移到软件中；继续开发软件；继续观察有没有新的写作切入点；先实现可持续收益，再谈更长期目标。'],
    },
    support: {
      eyebrow: '支持作者',
      title: '在爱发电支持我',
      lead: '每一份支持都是持续写作与开发的动力。付费版与免费版内容完全一致，付费仅去除水印。',
      cardTitle: '感谢友情支持',
      cardBody: '前往爱发电主页获取无水印版并支持作者。',
      akariTitle: 'Illuminating the Path of Learning',
      akariBody: ['Project Akari 致力于重塑学习体验，提供更高效、更具亲和力的学习范式。', '《高中数学之旅》以旅程为线索重构知识体系，《数学之旅》系列延伸广度与深度；配套软件提供个性化学习辅助。'],
    },
    aria: { chips: '书籍关键词', nav: '书籍页导航' },
    dateLocale: 'zh-CN',
  },
  'zh-TW': {
    title: '數學之旅',
    description: 'ProjectA 書籍介紹頁：介紹《數學之旅：函數與導數》與《高中數學之旅》，並引導讀者前往 app.rikka.moe 書庫查看。',
    lead: '為中學數學而寫的現代數學讀物。函數、極限、導數一脈貫通，用 LaTeX 與 TikZ 把每一頁都做成藝術品。',
    chips: ['LaTeX / XeLaTeX', 'TikZ 向量圖形', '免費版內容完整', '付費版僅去水印'],
    downloadLabel: '前往網盤下載',
    afdianLabel: '前往愛發電支持',
    buttons: { explore: '探索書稿', errata: '勘誤表', versions: '版本對比', preview: '內頁預覽' },
    nav: { overview: '書稿總覽', errata: '勘誤表', design: '設計哲學', versions: '下載版本', notes: '寫作說明', support: '支持作者' },
    update: {
      eyebrow: '6 月 12 日重大更新',
      title: '本書迎來重大修訂',
      body: '經過最近幾個月的修訂並將模板更換為 Elegantbook 後，《高中數學之旅》終於又出了新版本！下方附有完整的勘誤表，涵蓋兩本書共計 200+ 項修正。',
      errataCount: '200+',
    },
    seriesTabs: { func: '數學之旅 · 函數與導數', journey: '高中數學之旅 · 舊版五冊' },
    errataTabs: { journey: '高中數學之旅', func: '函數與導數' },
    overview: {
      eyebrow: '書稿總覽',
      title: '兩個系列，一脈相承',
      lead: '兩個系列內容互相獨立。免費版與付約版內容完全一致，付費版僅去除頁面水印。',
      funcTitle: '數學之旅：函數與導數',
      funcBadge: '新系列 · 第一冊',
      funcBody: '新啟動的獨立系列，作為《高中數學之旅》的精神續作全面重寫。第一冊圍繞函數、極限與導數展開，呈現從概念到方法的數學脈絡。',
      journeyTitle: '高中數學之旅',
      journeyBadge: '舊版 · 完整五冊',
      journeyBody: '舊版系列覆蓋中學數學的主要專題與常見題型，也包含若干進階內容。項目目前暫緩更新。',
      latest: '最近更新：',
      loading: '載入中…',
    },
    design: {
      eyebrow: '設計哲學',
      title: '理念與特徵',
      lead: '知識自由是我的起源。書稿以開放方式呈現，也用盡可能精細的排版保留數學內容的結構美。',
      stats: [
        { value: '21', label: '章', desc: '完整覆蓋中學數學核心專題' },
        { value: '100%', label: '向量', desc: 'TikZ 驅動的精確圖形渲染' },
        { value: '∞', label: '精度', desc: 'LaTeX 排版，像素級數學公式' },
      ],
      features: [
        { icon: 'file-pdf', title: '純淨閱讀體驗', desc: '付費版 PDF 完全無水印，每一頁都保持完整的視覺與版心比例。' },
        { icon: 'pen-nib', title: '排版即藝術', desc: '公式、圖形、間距與字體都經過細緻推敲。' },
        { icon: 'globe', title: '開源與知識自由', desc: '書稿以開放方式呈現，讓更多人能接觸高品質的數學內容。' },
        { icon: 'code', title: '程式生成精度', desc: '所有圖形由 TikZ 程式碼驅動，保證精確性與可重現性。' },
      ],
    },
    versions: {
      eyebrow: '版本對比',
      title: '選擇你的版本',
      lead: '免費版與付費版內容完全一致。付費版僅去除頁面水印，並作為對作者的一份支持。',
      freeTitle: '免費版',
      freeItems: ['完整章節內容（含水印）', '全部圖形與公式', '全部目錄與內容提要', '作者簡介與前言'],
      premiumTitle: '無水印版',
      premiumChip: '內容相同 · 僅去水印',
      premiumItems: ['與免費版內容完全相同', '去除頁面水印，閱讀純淨', 'TikZ 向量圖形源文件', '終身版本更新'],
    },
    preview: { eyebrow: '內頁預覽', title: '翻閱書頁', lead: '隨機抽取兩本書的一些頁面，提前感受排版風格。', func: '《函數與導數》', journey: '《高中數學之旅》' },
    notes: {
      eyebrow: 'Origin / Practice / Paused',
      title: '寫作緣起、學習方式與暫停說明',
      lead: '這一部分保留原書籍說明頁中的背景文字，說明為什麼寫這本書，以及項目目前的狀態。',
      originTitle: '寫作緣起與方法論',
      origin: ['本書的起點源自我在高中三年學習數學期間使用 Obsidian 記下的筆記，書稿最終使用 LaTeX 編排。', '我想做的不是單純羅列題型與例題，而是呈現從定義、定理、推理分支到答案收束的邏輯流。'],
      practiceTitle: '關於習題冊、AI 與學習方式',
      practice: ['以前我也覺得解析冊裡的思路引導很重要，但現在漸漸改變了想法。很多 AI 配合學習模式的互動性引導，在效率上明顯超過紙面答案。', '把真實思考過程交給可互動系統，效率更高。'],
      pausedTitle: '為什麼暫停更新',
      paused: ['項目已進入無限期暫停，目前看到的可能就是最後版本。新增內容沒有形成可持續回報，二次販賣與大部頭寫作也持續消耗精力。', '接下來會把一部分內容逐步遷移到軟體中，也會繼續觀察是否有新的寫作切入點。'],
    },
    support: {
      eyebrow: '支持作者',
      title: '在愛發電支持我',
      lead: '每一份支持都是持續寫作與開發的動力。付費版與免費版內容完全一致，付費僅去除水印。',
      cardTitle: '感謝友情支持',
      cardBody: '前往愛發電主頁取得無水印版並支持作者。',
      akariTitle: 'Illuminating the Path of Learning',
      akariBody: ['Project Akari 致力於重塑學習體驗，提供更高效、更具親和力的學習範式。', '書籍與配套軟體共同服務於更自由、更可持續的學習方式。'],
    },
    aria: { chips: '書籍關鍵詞', nav: '書籍頁導航' },
    dateLocale: 'zh-TW',
  },
  en: {
    title: 'Journey of Mathematics',
    description: 'ProjectA book introduction page for Journey of Mathematics and Secondary Math Journey, now pointing readers to the app.rikka.moe library.',
    lead: 'A modern mathematics reader for secondary-school math. Functions, limits, and derivatives are connected into one path, with every page shaped through LaTeX and TikZ.',
    chips: ['LaTeX / XeLaTeX', 'TikZ vector graphics', 'Complete free edition', 'Paid edition only removes watermark'],
    downloadLabel: 'Download from cloud',
    afdianLabel: 'Support on Afdian',
    buttons: { explore: 'Explore the manuscripts', errata: 'Errata', versions: 'Version comparison', preview: 'Page previews' },
    nav: { overview: 'Overview', errata: 'Errata', design: 'Design', versions: 'Download', notes: 'Notes', support: 'Support' },
    update: {
      eyebrow: 'June 12 major update',
      title: 'Major revision released',
      body: 'After months of revision and a template switch to Elegantbook, Secondary Math Journey has a new version! A full errata table with 200+ corrections for both books is included below.',
      errataCount: '200+',
    },
    seriesTabs: { func: 'Journey of Mathematics · Functions and Derivatives', journey: 'Secondary Math Journey · Legacy series' },
    errataTabs: { journey: 'Secondary Math Journey', func: 'Functions and Derivatives' },
    overview: {
      eyebrow: 'Overview',
      title: 'Two series, one continuous idea',
      lead: 'The two series are independent. The free and paid editions contain the same content; the paid edition only removes page watermarks for a cleaner reading experience.',
      funcTitle: 'Journey of Mathematics: Functions and Derivatives',
      funcBadge: 'New series · Volume 1',
      funcBody: 'A new standalone series and a full rewrite of the older project. The first volume follows functions, limits, and derivatives as one mathematical path from concepts to methods.',
      journeyTitle: 'Secondary Math Journey',
      journeyBadge: 'Legacy series · Five volumes',
      journeyBody: 'The older five-volume series covers the main topics and common problem types of secondary-school mathematics, with several advanced discussions. It is currently paused.',
      latest: 'Latest update:',
      loading: 'Loading…',
    },
    design: {
      eyebrow: 'Design',
      title: 'Principles and features',
      lead: 'The project began from a belief in open knowledge. The manuscripts are shared openly, while the typography preserves the structure and beauty of the mathematics.',
      stats: [
        { value: '21', label: 'chapters', desc: 'Core topics across secondary mathematics' },
        { value: '100%', label: 'vector', desc: 'Precise figures generated with TikZ' },
        { value: '∞', label: 'precision', desc: 'LaTeX typesetting for formulas and layout' },
      ],
      features: [
        { icon: 'file-pdf', title: 'Clean reading', desc: 'The paid PDF removes watermarks while keeping the same content and layout.' },
        { icon: 'pen-nib', title: 'Typesetting as craft', desc: 'Formulas, figures, spacing, and type are adjusted with LaTeX-level care.' },
        { icon: 'globe', title: 'Open knowledge', desc: 'The manuscripts are presented openly so more learners can access high-quality math material.' },
        { icon: 'code', title: 'Generated precision', desc: 'Figures are driven by TikZ source code, making diagrams precise and reproducible.' },
      ],
    },
    versions: {
      eyebrow: 'Version comparison',
      title: 'Choose your edition',
      lead: 'The free and paid editions contain the same content. The paid edition only removes page watermarks and serves as a way to support the author.',
      freeTitle: 'Free edition',
      freeItems: ['Full chapters with watermark', 'All figures and formulas', 'Full table of contents and summaries', 'Author notes and preface'],
      premiumTitle: 'Watermark-free edition',
      premiumChip: 'Same content · watermark removed',
      premiumItems: ['Exactly the same content as the free edition', 'Cleaner pages without watermarks', 'TikZ vector source files', 'Lifetime version updates'],
    },
    preview: { eyebrow: 'Page previews', title: 'Flip through the pages', lead: 'A few sample pages from the two books, showing the visual style before you download or read them.', func: 'Functions and Derivatives', journey: 'Secondary Math Journey' },
    notes: {
      eyebrow: 'Origin / Practice / Paused',
      title: 'Why it exists and why it is paused',
      lead: 'This section keeps the background of the original book page: why I wrote it, how I think about learning, and the current project status.',
      originTitle: 'Origin and method',
      origin: ['The manuscript began as Obsidian notes from three years of high-school mathematics study, and was later typeset in LaTeX.', 'Rather than listing problem templates, I wanted to show the logical flow from definitions and theorems through branches of reasoning to a final answer.'],
      practiceTitle: 'Problem sets, AI, and learning',
      practice: ['I used to think that guided solutions in exercise books were essential, but I have gradually changed my mind. Interactive AI-guided learning is more efficient than paper-based answers.', 'Handing real thinking processes to interactive systems is more efficient.'],
      pausedTitle: 'Why updates are paused',
      paused: ['The project is paused indefinitely, and the current version may remain the final version for quite a while. Low return, reposting/reselling, and the cost of long-form writing all contributed to this decision.', 'Some material may gradually move into software, and I will keep watching for a better structure if I ever rewrite it.'],
    },
    support: {
      eyebrow: 'Support',
      title: 'Support me on Afdian',
      lead: 'Every contribution helps future writing and development. The paid edition has the same content as the free edition and only removes watermarks.',
      cardTitle: 'Thank you for supporting',
      cardBody: 'Visit Afdian to get the watermark-free edition and support the author.',
      akariTitle: 'Illuminating the Path of Learning',
      akariBody: ['Project Akari is about reshaping learning experiences with tools that feel efficient, accessible, and kind.', 'The books and the companion software work together toward a freer and more sustainable way to learn.'],
    },
    aria: { chips: 'Book keywords', nav: 'Book page navigation' },
    dateLocale: 'en-US',
  },
  ja: {
    title: '数学の旅',
    description: 'ProjectA の書籍紹介ページ。『数学の旅：関数と導数』と『高校数学の旅』を紹介し、app.rikka.moe の書庫へ案内します。',
    lead: '中学・高校数学のために書いた現代的な数学読本です。関数、極限、導数をひと続きの流れとして扱い、LaTeX と TikZ で一ページずつ丁寧に組んでいます。',
    chips: ['LaTeX / XeLaTeX', 'TikZ ベクター図形', '無料版も本文は完全', '有料版は透かしのみ削除'],
    downloadLabel: 'クラウドからダウンロード',
    afdianLabel: '愛発電で支援する',
    buttons: { explore: '原稿を見る', errata: '正誤表', versions: '版の比較', preview: '紙面プレビュー' },
    nav: { overview: '概要', errata: '正誤表', design: '設計思想', versions: 'ダウンロード', notes: '執筆メモ', support: '支援' },
    update: {
      eyebrow: '6月12日 大規模更新',
      title: '大幅な改訂版を公開',
      body: '数ヶ月の改訂と Elegantbook テンプレートへの移行を経て、『高校数学の旅』に新しいバージョンがでました！両書あわせて 200+ 項目の修正を含む正誤表を以下に掲載しています。',
      errataCount: '200+',
    },
    seriesTabs: { func: '数学の旅 · 関数と導数', journey: '高校数学の旅 · 旧版' },
    errataTabs: { journey: '高校数学の旅', func: '関数と導数' },
    overview: {
      eyebrow: '概要',
      title: '二つのシリーズ、一つの流れ',
      lead: '二つのシリーズはそれぞれ独立しています。無料版と有料版の本文は同じで、有料版はページの透かしだけを削除した版です。',
      funcTitle: '数学の旅：関数と導数',
      funcBadge: '新シリーズ · 第一冊',
      funcBody: '新しく始めた独立シリーズで、旧プロジェクトを全面的に書き直しています。第一冊は関数、極限、導数を一つの流れとして扱います。',
      journeyTitle: '高校数学の旅',
      journeyBadge: '旧版 · 全五冊',
      journeyBody: '旧シリーズは中学・高校数学の主要な話題と典型問題を扱い、いくつかの発展的な内容も紹介しています。現在は更新停止中です。',
      latest: '最終更新：',
      loading: '読み込み中…',
    },
    design: {
      eyebrow: '設計思想',
      title: '理念と特徴',
      lead: 'このプロジェクトの原点には、知識を開いて届けたいという思いがあります。原稿は公開しつつ、数式と構造の美しさを丁寧な組版で残しています。',
      stats: [
        { value: '21', label: '章', desc: '中学・高校数学の中心テーマをカバー' },
        { value: '100%', label: 'ベクター', desc: 'TikZ による精密な図形描画' },
        { value: '∞', label: '精度', desc: 'LaTeX 組版による数式とレイアウト' },
      ],
      features: [
        { icon: 'file-pdf', title: 'すっきり読める PDF', desc: '有料版は透かしを削除し、本文とレイアウトは無料版と同じです。' },
        { icon: 'pen-nib', title: '組版も表現', desc: '数式、図形、余白、フォントまで細かく調整しています。' },
        { icon: 'globe', title: '開かれた知識', desc: '質の高い数学コンテンツに誰でも触れられるよう、原稿を公開しています。' },
        { icon: 'code', title: 'コードによる精度', desc: '図形は TikZ のソースコードから生成し、正確さと再現性を保っています。' },
      ],
    },
    versions: {
      eyebrow: '版の比較',
      title: '版を選ぶ',
      lead: '無料版と有料版の本文は同じです。有料版は透かしを削除するだけで、作者への支援でもあります。',
      freeTitle: '無料版',
      freeItems: ['透かし付きの全章本文', 'すべての図形と数式', '目次と内容概要', '著者紹介と前書き'],
      premiumTitle: '透かしなし版',
      premiumChip: '本文は同じ · 透かしのみ削除',
      premiumItems: ['無料版と本文は完全に同じ', '透かしを削除した読みやすいページ', 'TikZ ベクター図形のソース', '今後の更新も利用可能'],
    },
    preview: { eyebrow: '紙面プレビュー', title: 'ページを少しだけ見る', lead: '二つの本からいくつかのページを抜き出し、組版の雰囲気を先に確認できるようにしました。', func: '『関数と導数』', journey: '『高校数学の旅』' },
    notes: {
      eyebrow: 'Origin / Practice / Paused',
      title: '執筆のきっかけと更新停止について',
      lead: 'ここでは、もとの書籍説明ページにあった背景を残し、なぜ書いたのか、現在の状態を説明します。',
      originTitle: '執筆のきっかけと方法',
      origin: ['この本の出発点は、高校三年間に Obsidian で書いていた数学ノートです。最終的には LaTeX で組版しました。', '単に問題パターンと例題を並べるのではなく、定義や定理から推論の分岐をたどり、答えへ収束していく論理の流れを見せたいと思いました。'],
      practiceTitle: '問題集、AI、学習方法について',
      practice: ['以前は解答集の考え方のガイドが重要だと思っていましたが、次第に考えを変えました。AI と協働する対話的な学習は、紙の解答より明らかに効率的です。', '本物の思考プロセスをインタラクティブなシステムに任せる方が効率的です。'],
      pausedTitle: 'なぜ更新を止めているのか',
      paused: ['このプロジェクトは無期限で更新停止中で、現在見えているものが最終版になる可能性があります。収益性の低さ、無断転載や転売、大部な執筆に必要な時間が大きな負担になりました。', '今後は一部の内容をソフトウェアへ移すことを考えつつ、よりよい構成で書き直せる機会があるかを見ています。'],
    },
    support: {
      eyebrow: '支援',
      title: '愛発電で支援する',
      lead: '支援は今後の執筆と開発の力になります。有料版と無料版の本文は同じで、支援版は透かしのみ削除されています。',
      cardTitle: '支援ありがとうございます',
      cardBody: '愛発電のページから透かしなし版を入手し、作者を支援できます。',
      akariTitle: 'Illuminating the Path of Learning',
      akariBody: ['Project Akari は、より効率的で親しみやすい学習体験を作るためのプロジェクトです。', '書籍と関連ソフトウェアを通じて、より自由で続けやすい学び方を目指しています。'],
    },
    aria: { chips: '書籍キーワード', nav: '書籍ページナビゲーション' },
    dateLocale: 'ja-JP',
  },
};

export function getBookCopy(lang: BookLang): BookCopy {
  return copies[lang] || copies['zh-CN'];
}
