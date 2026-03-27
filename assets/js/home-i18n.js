(function () {
  const dictionary = {
    zh_CN: {
      pageTitle: '在线工具集',
      metaDescription: '前端在线工具集主页',
      homeTitle: '在线工具集',
      toolsHeading: '可用工具',
      metricsToolTitle: 'SSIM / PSNR / MSE 计算器',
      metricsToolDesc: '上传 Ground Truth 图片后，批量上传待评估图像，自动计算并展示图像质量指标。',
      metricsToolLink: '进入工具',
      absToolTitle: 'Abs Error Map / Heatmap 生成器',
      absToolDesc: '上传 Ground Truth 与目标图像，生成绝对误差图与热力图，可用于图形学误差分析。',
      absToolLink: '进入工具'
    },
    en: {
      pageTitle: 'Online Tools',
      metaDescription: 'Homepage for frontend online tools',
      homeTitle: 'Online Tools',
      toolsHeading: 'Available Tools',
      metricsToolTitle: 'SSIM / PSNR / MSE Calculator',
      metricsToolDesc: 'Upload a ground truth image, then batch upload target images to evaluate quality metrics.',
      metricsToolLink: 'Open Tool',
      absToolTitle: 'Abs Error Map / Heatmap Generator',
      absToolDesc: 'Upload a ground truth image and target images to generate abs error maps and heatmaps for graphics analysis.',
      absToolLink: 'Open Tool'
    }
  };

  const locale = window.AppI18n.detectLocale();
  const t = window.AppI18n.createTranslator(dictionary, locale);

  document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
  document.title = t('pageTitle');

  const metaDescription = document.getElementById('metaDescription');
  if (metaDescription) {
    metaDescription.setAttribute('content', t('metaDescription'));
  }

  const textKeys = [
    'homeTitle',
    'toolsHeading',
    'metricsToolTitle',
    'metricsToolDesc',
    'metricsToolLink',
    'absToolTitle',
    'absToolDesc',
    'absToolLink'
  ];

  for (const key of textKeys) {
    const el = document.getElementById(key);
    if (el) {
      el.textContent = t(key);
    }
  }
})();
