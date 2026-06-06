# rikka.moe-next

> 🌸 **Akari** — 篠崎香澄的个人博客新版，使用 Astro 构建。

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Astro](https://img.shields.io/badge/Astro-6.x-BC52EE?logo=astro)](https://astro.build)

## 简介

这是 [rikka.moe](https://rikka.moe) 的新版站点，使用 [Astro](https://astro.build) 框架重新构建，替代了旧版基于 Hexo 的实现。

## 特性

- 🌍 **多语言支持**：简体中文、繁体中文、英语、日语
- 🎨 **现代 UI 设计**：Material You 风格，支持暗色/亮色模式
- 📱 **响应式布局**：完美适配桌面端和移动端
- ⚡ **静态生成**：基于 Astro 的静态站点生成，性能优异
- 🔍 **SEO 友好**：完整的 Open Graph、Twitter Card、结构化数据支持
- 💬 **Twikoo 评论**：集成 Twikoo 评论系统
- ❄️ **雪花特效**：冬季主题雪花飘落动画
- 🏠 **赞助者墙**：感谢通过爱发电支持的朋友们

## 技术栈

- [Astro](https://astro.build) — 静态站点生成器
- [TypeScript](https://www.typescriptlang.org/) — 类型安全
- [MDUI](https://www.mdui.org/) — Material Design UI 组件
- [Phosphor Icons](https://phosphoricons.com/) — 图标库
- [Cloudflare Pages](https://pages.cloudflare.com/) — 部署和托管
- [Twikoo](https://twikoo.js.org/) — 评论系统

## 项目结构

```
/
├── public/                 # 静态资源
│   ├── fonts/             # 字体文件
│   └── images/            # 图片资源
├── src/
│   ├── components/        # Astro 组件
│   ├── content/          # 内容集合（文章、页面）
│   ├── data/             # 数据文件
│   ├── layouts/          # 布局模板
│   ├── lib/              # 工具函数
│   ├── pages/            # 路由页面
│   ├── styles/           # 全局样式
│   └── content.config.ts # 内容集合配置
├── functions/             # Cloudflare Functions
├── migrations/            # D1 数据库迁移
├── astro.config.mjs       # Astro 配置
├── wrangler.toml          # Wrangler 配置
└── package.json
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 部署

本项目使用 Cloudflare Pages 进行部署：

```bash
# 部署到 Cloudflare Pages
npm run deploy:cloudflare
```

## 环境变量

创建 `.dev.vars` 文件（本地开发）或在 Cloudflare Dashboard 中设置：

```
AifadianAPIToken=your_token
AifadianUserID=your_user_id
```

## 开源协议

本项目采用 [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0) 开源协议。

```
Copyright (C) 2025 篠崎香澄 (Shinozaki Kasumi)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

## 致谢

- [Astro](https://astro.build) — 优秀的静态站点生成器
- [MDUI](https://www.mdui.org/) — 优雅的 Material Design 组件库
- [LXGW WenKai](https://github.com/lxgw/LxgwWenKai) — 霞鹜文楷字体
- [PingFang](https://developer.apple.com/fonts/) — 苹方字体

---

Made with ❤️ by [篠崎香澄](https://rikka.moe)
