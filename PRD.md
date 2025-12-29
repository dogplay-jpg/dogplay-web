# 产品需求文档 (PRD) - Dogplay 代理引流自动化平台

**PRD-ID**: `DOGPLAY-AGENT-SEO-PRD`  
**文档版本**: `v1.1.0`  
**创建日期**: 2025-12-29  
**最后更新**: 2025-12-29  
**状态**: 规划中  
**核心关键词**: `Dogplay代理` (Dogplay Agent)

---

## 0. 变更记录 (Changelog)

| 版本 | 日期 | 变更摘要 |
| :--- | :--- | :--- |
| `v1.1.0` | 2025-12-29 | 补齐可验收的 SEO/CWV/合规口径；明确 GitHub + GitHub Actions 自动化；部署切换为 Cloudflare（优先 Pages）。 |
| `v1.0.0` | 2025-12-29 | 初版 PRD。 |

## 1. 项目概述 (Project Overview)

### 1.1 背景与目标
基于**第一性原理**，代理商的核心诉求是**“高收益”**与**“信任安全”**。本项目旨在构建一个针对**印度市场**的高性能SEO引流站，通过“静态高转化落地页”与“动态自动化内容引擎”的双轮驱动，解决单页站流量枯竭的问题，建立“Dogplay代理”在印度市场的品牌权威，并最终引导用户前往 **[Dogplay 官方首页](https://www.dogplay.io/)** 进行注册和转化。
代码将托管在 **GitHub**，由 **GitHub Actions** 定时触发内容生成与发布流程；站点部署选择 **Cloudflare（优先 Cloudflare Pages）**。

### 1.2 核心策略 (The Strategy)
*   **流量获取 (Acquisition)**：利用 **GitHub Actions + LLM** 搭建全自动内容工厂，每日捕捉印度本地博彩/体育新闻（IPL, Cricket, iGaming），自动生成多语言内容，覆盖长尾词。
*   **用户转化 (Conversion)**：通过本地化设计（印地语/英语）、可视化的佣金计算器、以及清晰的信任背书，降低注册门槛。所有指向 `https://www.dogplay.io/` 的 CTA (Call to Action) 按钮及文本链接必须严格添加 `rel="sponsored nofollow"` 属性，并在页面显著位置提供 **Affiliate/推广披露 (Affiliate Disclosure)**，以满足 Google 对付费/推广链接的合规要求并降低被判定为链接操纵的风险。

### 1.3 SEO 与性能第一原则 (Non-Negotiables)
为确保严格符合 Google SEO 与页面体验要求，本项目的所有实现必须满足以下不可妥协原则：
1. **可索引前置**：抓取/索引能力（`robots.txt` / `sitemap.xml` / `canonical` / `hreflang`）优先于“内容产量”。
2. **避免薄内容与重复**：即使是广告/引流站，也必须避免规模化重复、纯改写与信息空洞；疑似薄内容或高度重复内容必须可控（必要时 `noindex`）。
3. **合规透明**：推广关系披露、责任博彩、年龄限制、主体信息与联系方式必须可见且一致。
4. **Core Web Vitals 导向**：以 CWV 作为最终验收指标，Lighthouse 仅作辅助。

---

## 2. 用户角色 (User Personas)

| 角色 | 语言偏好 | 核心诉求 | 行为特征 |
| :--- | :--- | :--- | :--- |
| **印度本地代理 (头部)** | 英语 (English) | 高CPA/RevShare，支付稳定 | 关注平台信誉，搜索 "Best betting affiliate program India" |
| **印度下沉代理 (长尾)** | 印地语 (Hindi) | 操作简单，带单容易 | 关注热门赛事(Cricket)，搜索 "Dogplay partner" |
| **运营管理人员** | 繁体中文 (TC) | 监控舆情，确认内容质量 | 每日查看自动生成的内容摘要 |

---

## 3. 功能架构 (Functional Architecture)

### 3.1 静态核心模块 (Static Core) - Next.js
*部署于根路径，作为转化收口。*

1.  **Hero Section (首屏)**
    *   文案：直击痛点，强调 "Dogplay Agent" 的高收益。
    *   CTA：双语对照的“立即加入”按钮。
2.  **优势展示 (Value Proposition)**
    *   内容：透明佣金 (CPA + RevShare)、全球支持、加密货币支付。
3.  **佣金计算器 (Interactive Calculator)**
    *   功能：滑块选择“月活跃玩家数”，实时计算预计收益 (INR/USD)。
    *   目的：增加页面停留时长 (Dwell Time)，提升SEO权重。
4.  **代理注册引导 (Onboarding)**
    *   3步流程图：注册 -> 获取链接 -> 开始赚钱。
5.  **FAQ**
    *   针对印度市场的特定问答（如：提现方式、合规性）。
6.  **信任与合规模块 (Trust & Compliance)**
    *   内容：Affiliate/推广披露、责任博彩 (Responsible Gambling)、18+ 年龄提示、风险提示、隐私政策/条款入口、联系信息。
    *   目标：提升可信度（E‑E‑A‑T）并降低博彩/赚钱类内容的政策风险。

### 3.2 自动化内容引擎 (Automation Engine) - Python + GitHub Actions
*后台自动运行，每日产出内容。*

#### 流程图
`Cron Schedule (Daily)` -> `Brave Search (News)` -> `Chutes.ai (LLM Analysis & Writing)` -> `Chutes.ai (Image Gen)` -> `Git Commit` -> `Cloudflare Deploy`

#### 详细逻辑
1.  **话题发现 (Discovery)**
    *   **API**: Brave Search API
    *   **Keywords**: "India iGaming news", "Cricket betting updates", "Online casino regulation India".
    *   **筛选**: 取 Top 3 相关性最高且时间在24h内的结果。

2.  **内容生成 (Content Generation)**
    *   **API**: Chutes.ai (LLM)
    *   **策略**:
        *   **英文版**: 针对国际化/高端代理，专业语气。植入 "Join Dogplay Agent Program" 作为解决方案。
        *   **印地语版**: 针对本地市场，亲切语气。重点关联热门板球赛事。
        *   **繁中版**: 简报形式，供运营快速审阅今日话题。
    *   **SEO处理**: 自动生成 H1/Title/Meta Description，并将 "Dogplay代理" 关键词自然融入；所有 SEO 元素必须与页面可见内容一致，避免关键词堆砌。

    **发布门槛（必须满足，否则不进入索引）**
    1. **来源透明**：正文必须包含“来源列表”（外部新闻链接），不得无来源陈述具体事实/数据。
    2. **事实与安全**：禁止编造、禁止伪造引用；对不确定信息必须用“不确定”表述或不写。
    3. **薄内容控制**：未满足信息密度/独特性阈值的内容自动标记为 `noindex`（例如：只有新闻复述或与既有文章高度重复）。
    4. **多语言一致性**：英文与印地语版本必须为“本地化改写 + 本地语境补充”，不允许机械直译导致近重复。

3.  **多媒体生成 (Asset Generation)**
    *   **API**: Chutes.ai (Image Generation Model)
    *   **Prompt**: 基于新闻摘要，生成符合印度审美（色彩鲜艳、板球元素、商务场景）的 Blog Cover。
    *   **可访问性**：每张图必须生成 `alt` 文本（与图片语义一致），并以 WebP/AVIF 优先输出，严格控制尺寸与体积。

4.  **发布与部署 (Publishing)**
    *   生成 Markdown/MDX 文件，存储于 `/posts/YYYY-MM-DD-slug/`。
    *   自动 Git Commit & Push。
    *   **Cloudflare Pages** 关联 GitHub 仓库：检测到 Push 后自动构建与部署（或由 GitHub Actions 调用 Cloudflare 部署接口进行发布，二选一并保持一致）。
    *   **索引控制**：对未达发布门槛的内容输出 `noindex`；对运营简报与内部页面强制 `noindex, nofollow` 并从 sitemap 排除。

---

## 4. 页面结构与路由 (Sitemap)

*   `/` (English Homepage)
*   `/hi` (Hindi Homepage)
*   `/blog` (English Blog Index)
    *   `/blog/topic-slug` (Article Page)
*   `/hi/blog` (Hindi Blog Index)
    *   `/hi/blog/topic-slug` (Article Page)
*   `/ops/daily-brief` (繁中运营简报列表 - 隐藏入口)
*   `/about` (主体与团队/编辑方针)
*   `/contact` (联系信息)
*   `/privacy` (隐私政策)
*   `/terms` (条款)
*   `/affiliate-disclosure` (推广/联盟披露)
*   `/responsible-gambling` (责任博彩与 18+ 提示)
*   `/sitemap.xml`、`/robots.txt`

### 4.1 国际化与重复内容控制 (i18n Requirements)
1. **hreflang**：所有可索引页面必须输出 `hreflang`（建议 `en-IN`、`hi-IN`、`x-default`），并保证互相引用。
2. **canonical**：每个页面必须为自引用 canonical；分页/筛选页必须有明确 canonical 规则。
3. **HTML lang**：`<html lang="en-IN">` / `<html lang="hi-IN">` 等与路由严格一致。
4. **索引隔离**：`/ops/*` 一律 `noindex` 且从站点地图移除；必要时在 `robots.txt` 中 `Disallow: /ops/`。

---

## 5. 关键技术指标 (Technical KPIs)

### 5.1 性能与体验 (Performance & CWV)
*   **Core Web Vitals（目标）**：`LCP < 2.5s`、`INP < 200ms`、`CLS < 0.1`（以真实用户数据/RUM 为主，实验室数据为辅）。
*   **性能预算（移动端优先）**：
    *   首页首屏关键资源尽量少；避免不必要的 Client Components 与第三方脚本。
    *   图片：首屏主图必须响应式 + 现代格式（AVIF/WebP）+ 正确尺寸；非首屏图片懒加载。
    *   字体：自托管 + `font-display: swap`，控制字体文件数量与子集化。
*   **Lighthouse（辅助指标）**：Performance > 95、SEO > 95、Accessibility > 95（不作为唯一验收依据）。

### 5.2 技术 SEO (Indexability & Rendering)
*   **可抓取性**：提供 `robots.txt` 与 `sitemap.xml`；站点地图仅包含可索引 URL。
*   **渲染一致性**：首屏关键内容必须 SSR/SSG 可见（避免仅客户端渲染导致抓取空白）。
*   **元信息完整**：每页唯一 `title`/`description`，并生成 Open Graph/Twitter 元数据与分享图。
*   **结构化数据**：按页面类型输出 Schema（`Organization`、`WebSite`、`BreadcrumbList`、`Article/BlogPosting`），并确保与可见内容一致（日期、作者、图片等）。

### 5.3 内容质量与合规 (Quality & Compliance)
*   **索引内容占比**：索引文章中“未达门槛而 noindex”的比例 < 20%（用于倒逼质量）。
*   **披露可见**：Affiliate/推广披露在可索引页面必须可见（非仅 footer 隐藏），且与链接 `rel="sponsored nofollow"` 一致。
*   **责任博彩**：18+ 与风险提示在关键入口页面可见；包含 Responsible Gambling 页面。

### 5.4 自动化稳定性 (Automation)
*   **自动更新成功率**：每日自动更新成功率 > 99%。
*   **失败可观测**：任务失败必须告警（邮件/IM），并保留可追踪日志。

## 6. API 需求清单

| 服务 | 用途 | 状态 |
| :--- | :--- | :--- |
| **Brave Search API** | 搜索最新行业新闻 | 待配置 |
| **Chutes.ai (LLM)** | 文本生成、翻译、SEO优化 | 待配置 |
| **Chutes.ai (Image)** | 配图生成 | 待配置 |
| **GitHub Actions** | 任务调度 | 待配置 |
| **Cloudflare Pages** | 构建与部署托管 | 待配置 |
| **Google Search Console** | 收录/覆盖率/查询数据监控 | 待配置 |
| **RUM/性能监控（可选）** | 真实用户 CWV 监控（如 Cloudflare/自建） | 待定 |

---

## 7. 下一步实施计划

1.  **项目重构**: 配置 Next.js i18n 路由。
2.  **技术 SEO 落地**: 实现 `sitemap.xml`、`robots.txt`、`canonical`、`hreflang`、`noindex` 策略（尤其 `/ops/*`）。
3.  **合规页面与披露**: 补齐 `affiliate-disclosure`、`responsible-gambling`、`privacy`、`terms`、`contact`、`about`。
4.  **脚本编写**: 开发 `daily_news_generator.py`（含发布门槛、来源引用、重复检测、失败告警）。
5.  **模板开发**: 设计博客文章页模板（Schema、作者/日期、内链、目录、分享元信息）。
6.  **CI/CD**: 配置 `.github/workflows/daily-content.yml`（含质量检查、构建检查、失败告警）。
7.  **Cloudflare 部署**: 创建 Cloudflare Pages 项目并连接 GitHub 仓库，配置构建命令/输出目录/环境变量与自定义域名（如需要）。

---

## 8. 验收口径 (Acceptance Criteria)

### 8.1 SEO 验收
1. **Indexability**：`/sitemap.xml` 仅包含可索引 URL；`/ops/*` 不在 sitemap 且页面 `noindex`。
2. **i18n**：所有可索引页面具备正确的 `hreflang` 集合与自引用 `canonical`。
3. **结构化数据**：Schema 可通过测试工具校验（字段完整且与页面可见内容一致）。
4. **站内信息架构**：博客文章必须能从列表页通过 HTML 链接访问（不依赖客户端脚本注入）。

### 8.2 性能验收
1. **CWV 目标**：达到 `LCP/INP/CLS` 目标阈值（优先以真实用户数据为准）。
2. **资源控制**：首屏不引入非必要第三方脚本；图片/字体满足性能预算策略。

### 8.3 内容与合规验收
1. **事实与来源**：每篇索引文章提供来源链接，不得伪造引用或编造事实。
2. **推广披露**：推广/联盟披露可见；所有推广链接 `rel="sponsored nofollow"`。
3. **责任博彩**：18+ 与风险提示可见，Responsible Gambling 页面可访问且可索引（或按合规要求配置）。
