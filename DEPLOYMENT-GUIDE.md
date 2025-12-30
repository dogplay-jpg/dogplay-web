# 🚀 Dogplay Agent 部署指南

完整步骤指南，将网站从本地部署到生产环境。

---

## 📋 部署前检查清单

- [ ] 17 篇博客文章已生成
- [ ] 本地构建测试通过
- [ ] Git 仓库已初始化
- [ ] Groq API 密钥已配置

---

## 第 1 步：创建 GitHub 仓库

### 1.1 创建新仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `dogplay-agent` (或你喜欢的名称)
   - **Description**: `Dogplay Agent - SEO Automation Platform for Indian Market`
   - **Visibility**: ✅ Private (私有) 或 Public (公开)
3. **不要**勾选 "Add a README file"
4. 点击 **Create repository**

### 1.2 推送代码到 GitHub

在项目目录执行以下命令：

```bash
cd E:/dpy1

# 添加 GitHub 远程仓库 (替换 YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/dogplay-agent.git

# 重命名分支为 main
git branch -M main

# 推送代码到 GitHub
git push -u origin main
```

**如果提示输入用户名和密码：**
- 用户名：你的 GitHub 用户名
- 密码：使用 GitHub Personal Access Token (不是登录密码)

#### 获取 GitHub Personal Access Token (如果需要)

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 设置：
   - **Note**: `dogplay-agent deploy`
   - **Expiration**: 90 days
   - **Scopes**: 勾选 `repo`
4. 点击 **Generate token**
5. 复制 token (只显示一次)
6. 推送时用 token 代替密码

---

## 第 2 步：部署到 Cloudflare Pages

### 2.1 获取 Cloudflare API 凭证

#### 方法 A: 通过 Cloudflare Dashboard (推荐)

1. 访问 https://dash.cloudflare.com/sign-up (注册) 或 https://dash.cloudflare.com/login (登录)

2. 获取 **Account ID**:
   - 在 Dashboard 右侧可以看到 "Account ID"
   - 点击复制

3. 创建 **API Token**:
   - 访问 https://dash.cloudflare.com/profile/api-tokens
   - 点击 **Create Token**
   - 选择 **Cloudflare Pages** 模板
   - 或使用 **Edit Cloudflare Workers** 模板，权限设置：
     - Account > Cloudflare Pages > Edit
   - 点击 **Continue to summary** → **Create Token**
   - **复制 token** (只显示一次，保存好！)

### 2.2 配置 GitHub Secrets

1. 打开你的 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 secrets：

| Secret 名称 | 值 |
|------------|---|
| `CLOUDFLARE_API_TOKEN` | 上一步复制的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | 你的 Cloudflare Account ID |
| `GROQ_API_KEY` | 从 https://console.groq.com/ 获取（免费） |

### 2.3 启用 GitHub Actions 自动部署

推送代码后，GitHub Actions 会自动运行：

1. 访问你的 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看 **Deploy to Cloudflare Pages** 工作流
4. 等待部署完成（约 3-5 分钟）

部署成功后，网站将在以下地址可用：
- **临时域名**: `https://dogplay-agent.pages.dev` 或类似

### 2.4 手动部署 (备选方案)

如果 GitHub Actions 部署失败，可以手动部署：

#### 方法 A: 使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
cd E:/dpy1
npm run build

# 部署到 Cloudflare Pages
wrangler pages deploy .next --project-name=dogplay-agent
```

#### 方法 B: 通过 Cloudflare Dashboard 直接部署

1. 访问 https://dash.cloudflare.com
2. 选择 **Workers & Pages**
3. 点击 **Create application** → **Pages**
4. 选择 **Upload assets**
5. 项目名称: `dogplay-agent`
6. 上传构建后的 `.next` 文件夹
7. 点击 **Deploy**

---

## 第 3 步：配置自定义域名

### 3.1 添加域名到 Cloudflare Pages

1. 在 Cloudflare Pages 项目中
2. 点击 **Custom domains**
3. 点击 **Set up a custom domain**
4. 输入域名: `dogplay.io`
5. 点击 **Continue**

### 3.2 配置 DNS 记录

**如果你的域名已经在 Cloudflare：**

1. 进入 DNS 设置
2. 添加 CNAME 记录：
   - **Type**: CNAME
   - **Name**: `@` (或 `dogplay.io`)
   - **Target**: `dogplay-agent.pages.dev`
   - **Proxy status**: ✅ Proxied (橙色云朵)

**如果你的域名在其他注册商：**

1. 登录域名注册商 (如 GoDaddy, Namecheap)
2. 找到 DNS 设置
3. 添加 CNAME 记录：
   - **Type**: CNAME
   - **Host**: `@`
   - **Value**: `dogplay-agent.pages.dev`
   - **TTL**: 3600 (或默认)

### 3.3 等待 DNS 生效

- DNS 更新通常需要 **5-30 分钟**
- 可用 `nslookup dogplay.io` 检查是否生效

---

## 第 4 步：配置 Google Search Console

### 4.1 验证网站所有权

1. 访问 https://search.google.com/search-console
2. 点击 **添加资源**
3. 选择 **网址前缀**
4. 输入: `https://dogplay.io`
5. 点击 **继续**

### 4.2 验证方式

**方法 A: HTML 文件验证 (推荐)**

1. 下载验证 HTML 文件
2. 添加到 `public/` 目录：
   ```
   E:/dpy1/public/google验证文件名.html
   ```
3. 重新部署网站
4. 点击 **验证**

**方法 B: DNS 验证**

1. 选择 **DNS 记录** 验证方式
2. 复制 TXT 记录
3. 在域名 DNS 设置中添加
4. 点击 **验证**

### 4.3 提交 Sitemap

验证成功后：

1. 在左侧菜单选择 **站点地图**
2. 输入 sitemap URL: `https://dogplay.io/sitemap.xml`
3. 点击 **提交**

### 4.4 请求编入索引

为了快速让 Google 发现新内容：

1. 在 Search Console 中选择 **网址检查**
2. 输入博客页面 URL (如 `https://dogplay.io/blog`)
3. 点击 **请求编入索引**

---

## 第 5 步：验证部署

### 5.1 检查清单

- [ ] 网站可以访问: `https://dogplay.io`
- [ ] 所有页面正常加载
- [ ] 博客文章列表显示正常
- [ ] 单篇文章页面正常
- [ ] SSL 证书有效 (HTTPS)
- [ ] 移动端显示正常

### 5.2 SEO 检查

使用以下工具检查 SEO：

- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Sitemap 提交**: https://dogplay.io/sitemap.xml

---

## 第 6 步：配置自动内容生成 (可选)

### 6.1 GitHub Secrets 已配置

确保以下 secrets 已添加：
- ✅ `GROQ_API_KEY`
- ✅ `BRAVE_SEARCH_API_KEY` (可选)

### 6.2 手动触发内容生成

1. 访问 GitHub 仓库
2. 点击 **Actions** → **Daily Content Generation**
3. 点击 **Run workflow**
4. 可选择主题索引 (0-6) 或留空随机
5. 点击 **Run workflow** 确认

### 6.3 定时任务

每日自动生成配置在 `.github/workflows/daily-content.yml`:
- 每天上午 9:00 IST (3:30 AM UTC) 自动运行
- 无需手动干预

---

## 📊 部署后监控

### 关键指标

| 指标 | 工具 | 目标 |
|------|------|------|
| 流量 | Google Search Console | 持续增长 |
| 排名 | Google Search Console | 目标关键词前10 |
| 性能 | PageSpeed Insights | 移动端 >80 |
| 索引 | Search Console | 17篇文章全部索引 |

### 每周检查

- [ ] 查看搜索流量变化
- [ ] 检查索引状态
- [ ] 分析用户搜索查询
- [ ] 优化表现不佳的页面

---

## 🆘 常见问题

### Q1: 推送 GitHub 时认证失败

**解决**: 使用 Personal Access Token 代替密码
1. 生成 token: https://github.com/settings/tokens
2. 推送时用 token 作为密码

### Q2: Cloudflare Pages 部署失败

**解决**: 检查 build 命令和 API token
```bash
# 本地测试构建
npm run build

# 检查 .next 文件夹是否生成
ls .next
```

### Q3: 自定义域名无法访问

**解决**: 检查 DNS 配置
```bash
# 检查 DNS 解析
nslookup dogplay.io

# 应该指向 dogplay-agent.pages.dev
```

### Q4: Google 没有索引网站

**解决**:
1. 确认 sitemap 可访问: https://dogplay.io/sitemap.xml
2. 在 Search Console 请求编入索引
3. 获取外部链接指向网站
4. 耐心等待 (新网站可能需要 1-2 周)

---

## 📞 需要帮助？

如果遇到问题：

1. **检查日志**: GitHub Actions → 点击失败的工作流 → 查看详细日志
2. **Cloudflare 状态**: https://www.cloudflarestatus.com/
3. **GitHub 状态**: https://www.githubstatus.com/

---

## ✅ 部署完成后

你的网站将具备：

- ✅ 17 篇 SEO 优化文章
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 自动内容生成
- ✅ Google 友好结构
- ✅ 移动端优化

**下一步**: 开始 SEO 推广，获取流量！

---

*生成时间: 2025-12-29*
*版本: 1.0*
