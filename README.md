# Online Tools

基于纯 `HTML + CSS + JavaScript` 的前端工具集，适合直接部署到 GitHub Pages。

## 已实现工具

- `SSIM / PSNR / MSE` 计算器：上传一张 Ground Truth 图像，再批量上传待评估图像进行指标计算。
- `Abs Error Map / Heatmap` 生成器：上传 Ground Truth 与目标图像，生成绝对误差图与热力图（Plotly CDN）。

## i18n

- 根据系统偏好语言自动切换文案：当前支持 `zh_CN` 与 `en`（默认回退到 `zh_CN`）。

## 目录结构

- `index.html`：工具集主页
- `tools/image-metrics/index.html`：图像指标工具页面
- `tools/abs-heatmap/index.html`：Abs/Heatmap 生成工具页面
- `assets/css/styles.css`：样式文件
- `assets/js/i18n.js`：通用 i18n 工具
- `assets/js/home-i18n.js`：主页 i18n 初始化
- `assets/js/image-metrics.js`：指标计算逻辑与 i18n
- `assets/js/abs-heatmap.js`：Abs/Heatmap 计算与绘图逻辑
- `.github/workflows/deploy-pages.yml`：提交后自动发布到 `gh-pages` 分支

## 自动部署

已配置 GitHub Actions：当你推送到 `main` 或 `master` 分支时，会自动把仓库静态内容发布到 `gh-pages` 分支。
