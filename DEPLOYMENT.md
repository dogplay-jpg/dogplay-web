# 部署指南

## 1. 推送代码到 GitHub

```bash
# 如果还没有创建 GitHub 仓库，先去 github.com/new 创建
# 然后运行以下命令：

cd E:/dpy1
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## 2. 配置 GitHub Secrets

在 GitHub 仓库中设置以下 Secrets：
- 进入 Settings → Secrets and variables → Actions
- 点击 "New repository secret"

| Secret 名称 | 值 |
|------------|---|
| `GROQ_API_KEY` | `FROM_GROQ_CONSOLE` |
| `BRAVE_SEARCH_API_KEY` | `FROM_BRAVE_CONSOLE` |
| `CLOUDFLARE_API_TOKEN` | 从 https://dash.cloudflare.com/profile/api-tokens 获取 |
| `CLOUDFLARE_ACCOUNT_ID` | 从 Cloudflare dashboard 获取 |

## 3. 获取 Cloudflare 凭证

### API Token
1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 "Create Token"
3. 选择 "Edit Cloudflare Workers" 模板
4. 权限设置：
   - Account > Cloudflare Pages > Edit
5. 创建并复制 token

### Account ID
- 在 Cloudflare dashboard 右侧可以看到 Account ID
- 或从 URL 中获取: `https://dash.cloudflare.com/<ACCOUNT_ID>/pages`

## 4. 启用 GitHub Actions

推送代码后，GitHub Actions 会自动运行。

### 手动触发内容生成
1. 进入仓库的 Actions 页面
2. 选择 "Daily Content Generation"
3. 点击 "Run workflow"
4. 可选择主题索引 (0-6) 或留空随机

### 查看部署状态
1. 进入 Actions 页面
2. 选择 "Deploy to Cloudflare Pages"
3. 查看部署日志

## 5. 访问网站

部署成功后，您的网站将在以下地址可用：
- Cloudflare Pages: `https://dogplay-agent.pages.dev`
- 自定义域名: `https://dogplay.io` (需要配置)

## 6. 配置自定义域名

1. 在 Cloudflare Pages 项目中
2. 进入 Custom domains
3. 添加 `dogplay.io`
4. 更新 DNS 记录指向 Cloudflare
