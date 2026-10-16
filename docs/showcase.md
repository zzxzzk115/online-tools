# Showcase capture

Captured on 2026-10-16 in a newly created independent workspace. Source checkout: `960a9d016f109446f6074a860e83f56d97a69755`.

从仓库根目录启动静态服务器：

```sh
python3 -m http.server 4335 --bind 127.0.0.1
```

访问 `http://127.0.0.1:4335/tools/image-metrics/`，将 `showcase/reference.png` 上传为 Ground Truth，将 `target-light.png`、`target-noisy.png`、`target-shifted.png` 批量上传为 Target Images，然后点击 Calculate。

四张 512×320 的输入均为自制图案及其噪声/位移变体，没有使用第三方照片或真实用户数据。输入保存在 `docs/showcase/`，可以直接复算。结果为：

| Target | MSE | PSNR (dB) | SSIM |
| --- | --- | --- | --- |
| target-light.png | 0.000112 | 39.5228 | 0.996975 |
| target-noisy.png | 0.001336 | 28.7410 | 0.964824 |
| target-shifted.png | 0.001050 | 29.7867 | 0.971521 |

截图裁剪为实际预览和结果区域；保留应用已有的卡片样式，没有添加展示外框或圆角装饰。
