(function () {
  const dictionary = {
    zh_CN: {
      pageTitle: 'SSIM / PSNR / MSE 计算器',
      metaDescription: '图像质量评估工具',
      backLink: '← 返回工具集',
      pageHeading: 'SSIM / PSNR / MSE 计算器',
      pageSubheading: '先上传 Ground Truth，再上传待评估图像（支持多张）。',
      infoTitle: '指标说明',
      gtLabel: 'Ground Truth 图像',
      gtHelp: '仅支持一张，作为基准图像。',
      targetsLabel: '待评估图像',
      targetsHelp: '可批量上传，会逐张计算。',
      calculateBtn: '开始计算',
      calculating: '计算中...',
      clearBtn: '清空',
      gtPreviewTitle: 'Ground Truth 预览',
      gtPreviewEmpty: '尚未上传',
      targetsCountTitle: '待评估图像数量',
      resultsTitle: '计算结果',
      colFile: '文件名',
      colSize: '尺寸',
      colMse: 'MSE (0-1)',
      colPsnr: 'PSNR (dB)',
      colSsim: 'SSIM (0-1)',
      colStatus: '状态',
      noResults: '暂无结果',
      unreadableImage: '无法读取图像：',
      fileLabel: '文件：',
      sizeLabel: '尺寸：',
      statusDone: '完成',
      statusSizeMismatch: '尺寸不一致',
      statusReadFailed: '读取失败',
      needGroundTruth: '请先上传 Ground Truth 图像。',
      needTargets: '请至少上传一张待评估图像。',
      calcFinished: '计算完成，共处理 {count} 张图像。',
      calcFailed: '计算失败，请检查图像后重试。',
      gtPreviewAlt: 'Ground Truth 预览'
    },
    en: {
      pageTitle: 'SSIM / PSNR / MSE Calculator',
      metaDescription: 'Image quality evaluation tool',
      backLink: '← Back to Tools',
      pageHeading: 'SSIM / PSNR / MSE Calculator',
      pageSubheading: 'Upload a ground truth image, then upload one or more target images for evaluation.',
      infoTitle: 'Metric Guide',
      gtLabel: 'Ground Truth Image',
      gtHelp: 'Upload one image as the reference.',
      targetsLabel: 'Target Images',
      targetsHelp: 'Multiple files are supported and evaluated one by one.',
      calculateBtn: 'Calculate',
      calculating: 'Calculating...',
      clearBtn: 'Clear',
      gtPreviewTitle: 'Ground Truth Preview',
      gtPreviewEmpty: 'No image uploaded yet',
      targetsCountTitle: 'Target Image Count',
      resultsTitle: 'Results',
      colFile: 'Filename',
      colSize: 'Size',
      colMse: 'MSE (0-1)',
      colPsnr: 'PSNR (dB)',
      colSsim: 'SSIM (0-1)',
      colStatus: 'Status',
      noResults: 'No results yet',
      unreadableImage: 'Unable to read image: ',
      fileLabel: 'File: ',
      sizeLabel: 'Size: ',
      statusDone: 'Done',
      statusSizeMismatch: 'Size mismatch',
      statusReadFailed: 'Read failed',
      needGroundTruth: 'Please upload a ground truth image first.',
      needTargets: 'Please upload at least one target image.',
      calcFinished: 'Calculation completed. Processed {count} images.',
      calcFailed: 'Calculation failed. Please check the images and try again.',
      gtPreviewAlt: 'Ground Truth Preview'
    }
  };

  const i18nFallback = {
    detectLocale: function () {
      const raw = (navigator.language || '').toLowerCase();
      if (raw.startsWith('en')) {
        return 'en';
      }
      if (raw === 'zh-cn' || raw.startsWith('zh')) {
        return 'zh_CN';
      }
      return 'zh_CN';
    },
    createTranslator: function (dict, loc) {
      return function (key) {
        const primary = dict[loc] || {};
        const fallback = dict.zh_CN || {};
        return primary[key] || fallback[key] || key;
      };
    }
  };

  const i18n = window.AppI18n || i18nFallback;
  const locale = i18n.detectLocale();
  const t = i18n.createTranslator(dictionary, locale);

  document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
  document.title = t('pageTitle');

  const metaDescription = document.getElementById('metaDescription');
  if (metaDescription) {
    metaDescription.setAttribute('content', t('metaDescription'));
  }

  const groundTruthInput = document.getElementById('groundTruthInput');
  const targetsInput = document.getElementById('targetsInput');
  const calculateBtn = document.getElementById('calculateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const alertBox = document.getElementById('alertBox');
  const gtPreview = document.getElementById('gtPreview');
  const targetsCount = document.getElementById('targetsCount');
  const resultBody = document.getElementById('resultBody');
  const conceptInfo = document.getElementById('conceptInfo');

  function localizeStaticTexts() {
    const ids = [
      'backLink',
      'pageHeading',
      'pageSubheading',
      'infoTitle',
      'gtLabel',
      'gtHelp',
      'targetsLabel',
      'targetsHelp',
      'calculateBtn',
      'clearBtn',
      'gtPreviewTitle',
      'targetsCountTitle',
      'resultsTitle',
      'colFile',
      'colSize',
      'colMse',
      'colPsnr',
      'colSsim',
      'colStatus'
    ];

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = t(id);
      }
    }
  }

  function typesetMath(target, retryCount) {
    const retry = typeof retryCount === 'number' ? retryCount : 0;
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([target]).catch(function () {});
      return;
    }
    if (retry < 20) {
      window.setTimeout(function () {
        typesetMath(target, retry + 1);
      }, 120);
    }
  }

  function renderConceptInfo() {
    if (!conceptInfo) {
      return;
    }

    if (locale === 'en') {
      conceptInfo.innerHTML = [
        '<p class="mb-2"><strong>Units in this tool</strong></p>',
        '<p class="mb-2">1) <strong>MSE (0-1)</strong>: normalized MSE, lower is better.</p>',
        '<p class="mb-2">2) <strong>PSNR (dB)</strong>: logarithmic decibel scale, higher is better.</p>',
        '<p class="mb-2">3) <strong>SSIM (0-1)</strong>: structural similarity, closer to 1 is better.</p>',
        '<p class="mb-2"><strong>Formulas</strong></p>',
        '<p class="mb-2">\\( \\mathrm{MSE}=\\frac{1}{N}\\sum_{i=1}^{N}(x_i-y_i)^2 \\), \\( \\mathrm{MSE}_{norm}=\\frac{\\mathrm{MSE}}{255^2} \\)</p>',
        '<p class="mb-2">\\( \\mathrm{PSNR}=10\\log_{10}(\\frac{255^2}{\\mathrm{MSE}}) \\)</p>',
        '<p class="mb-2">\\( \\mathrm{SSIM}(x,y)=\\frac{(2\\mu_x\\mu_y+C_1)(2\\sigma_{xy}+C_2)}{(\\mu_x^2+\\mu_y^2+C_1)(\\sigma_x^2+\\sigma_y^2+C_2)} \\)</p>',
        '<p class="mb-2"><strong>Computation pipeline used here</strong></p>',
        '<p class="mb-2">1) Convert RGB to grayscale luminance: \\(Y=0.299R+0.587G+0.114B\\).</p>',
        '<p class="mb-2">2) Compute pixel-wise differences on luminance.</p>',
        '<p class="mb-2">3) Derive MSE/PSNR/SSIM from full-image statistics.</p>',
        '<p class="mb-2"><strong>How to interpret quality</strong></p>',
        '<p class="mb-2">- PSNR: &lt;20 dB poor, 20-30 fair, 30-40 good, &gt;40 very good.</p>',
        '<p class="mb-2">- SSIM: &lt;0.80 poor, 0.80-0.90 fair, 0.90-0.97 good, &gt;0.97 excellent.</p>',
        '<p class="mb-0">- MSE(0-1): closer to 0 is better; values near 0 indicate low error.</p>'
      ].join('');
    } else {
      conceptInfo.innerHTML = [
        '<p class="mb-2"><strong>本工具的单位约定</strong></p>',
        '<p class="mb-2">1) <strong>MSE (0-1)</strong>：展示归一化 MSE，越小越好。</p>',
        '<p class="mb-2">2) <strong>PSNR (dB)</strong>：对数分贝尺度，越大越好。</p>',
        '<p class="mb-2">3) <strong>SSIM (0-1)</strong>：结构相似度，越接近 1 越好。</p>',
        '<p class="mb-2"><strong>数学公式</strong></p>',
        '<p class="mb-2">\\( \\mathrm{MSE}=\\frac{1}{N}\\sum_{i=1}^{N}(x_i-y_i)^2 \\)，\\( \\mathrm{MSE}_{norm}=\\frac{\\mathrm{MSE}}{255^2} \\)</p>',
        '<p class="mb-2">\\( \\mathrm{PSNR}=10\\log_{10}(\\frac{255^2}{\\mathrm{MSE}}) \\)</p>',
        '<p class="mb-2">\\( \\mathrm{SSIM}(x,y)=\\frac{(2\\mu_x\\mu_y+C_1)(2\\sigma_{xy}+C_2)}{(\\mu_x^2+\\mu_y^2+C_1)(\\sigma_x^2+\\sigma_y^2+C_2)} \\)</p>',
        '<p class="mb-2"><strong>本工具计算流程</strong></p>',
        '<p class="mb-2">1) 先将 RGB 转灰度亮度：\\(Y=0.299R+0.587G+0.114B\\)。</p>',
        '<p class="mb-2">2) 在灰度亮度上逐像素计算误差。</p>',
        '<p class="mb-2">3) 基于全图统计量计算 MSE/PSNR/SSIM。</p>',
        '<p class="mb-2"><strong>好坏评估建议</strong></p>',
        '<p class="mb-2">- PSNR：&lt;20 差，20-30 一般，30-40 好，&gt;40 很好。</p>',
        '<p class="mb-2">- SSIM：&lt;0.80 差，0.80-0.90 一般，0.90-0.97 好，&gt;0.97 很好。</p>',
        '<p class="mb-0">- MSE(0-1)：越接近 0 越好，接近 0 表示误差很小。</p>'
      ].join('');
    }

    typesetMath(conceptInfo, 0);
  }

  function showAlert(message, type) {
    alertBox.className = 'alert mt-3';
    alertBox.classList.add(type || 'alert-warning');
    alertBox.textContent = message;
    alertBox.classList.remove('d-none');
  }

  function hideAlert() {
    alertBox.classList.add('d-none');
    alertBox.textContent = '';
  }

  function setEmptyResults() {
    resultBody.innerHTML = '<tr><td colspan="6" class="text-secondary">' + t('noResults') + '</td></tr>';
  }

  function resetPage() {
    groundTruthInput.value = '';
    targetsInput.value = '';
    gtPreview.innerHTML = '<span class="text-secondary small">' + t('gtPreviewEmpty') + '</span>';
    targetsCount.textContent = '0';
    hideAlert();
    setEmptyResults();
    calculateBtn.textContent = t('calculateBtn');
  }

  function formatMetric(value, digits) {
    if (!Number.isFinite(value)) {
      return value === Infinity ? 'Infinity' : '-';
    }
    return value.toFixed(digits);
  }

  function getImageElement(file) {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = function () {
        URL.revokeObjectURL(objectUrl);
        resolve(img);
      };

      img.onerror = function () {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(t('unreadableImage') + file.name));
      };

      img.src = objectUrl;
    });
  }

  function getImageDataFromImage(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function rgbToGray(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  function calculateMetrics(baseImageData, targetImageData) {
    const baseData = baseImageData.data;
    const targetData = targetImageData.data;

    const pixelCount = baseImageData.width * baseImageData.height;
    if (pixelCount === 0) {
      return { mse: NaN, mseNorm: NaN, psnr: NaN, ssim: NaN };
    }

    let mseSum = 0;
    let meanX = 0;
    let meanY = 0;

    for (let i = 0; i < baseData.length; i += 4) {
      const x = rgbToGray(baseData[i], baseData[i + 1], baseData[i + 2]);
      const y = rgbToGray(targetData[i], targetData[i + 1], targetData[i + 2]);

      const diff = x - y;
      mseSum += diff * diff;
      meanX += x;
      meanY += y;
    }

    const mse = mseSum / pixelCount;
    const mseNorm = mse / (255 * 255);
    const psnr = mse === 0 ? Infinity : 10 * Math.log10((255 * 255) / mse);

    meanX /= pixelCount;
    meanY /= pixelCount;

    let varianceX = 0;
    let varianceY = 0;
    let covariance = 0;

    for (let i = 0; i < baseData.length; i += 4) {
      const x = rgbToGray(baseData[i], baseData[i + 1], baseData[i + 2]);
      const y = rgbToGray(targetData[i], targetData[i + 1], targetData[i + 2]);

      const dx = x - meanX;
      const dy = y - meanY;

      varianceX += dx * dx;
      varianceY += dy * dy;
      covariance += dx * dy;
    }

    const denominator = Math.max(pixelCount - 1, 1);
    varianceX /= denominator;
    varianceY /= denominator;
    covariance /= denominator;

    const c1 = Math.pow(0.01 * 255, 2);
    const c2 = Math.pow(0.03 * 255, 2);

    const ssimNumerator = (2 * meanX * meanY + c1) * (2 * covariance + c2);
    const ssimDenominator =
      (meanX * meanX + meanY * meanY + c1) *
      (varianceX + varianceY + c2);

    const ssim = ssimDenominator === 0 ? NaN : ssimNumerator / ssimDenominator;

    return { mse: mse, mseNorm: mseNorm, psnr: psnr, ssim: ssim };
  }

  function renderGroundTruthPreview(file, image) {
    const objectUrl = URL.createObjectURL(file);
    gtPreview.innerHTML =
      '<div class="d-flex align-items-start gap-3">' +
      '<img class="preview-thumb" src="' + objectUrl + '" alt="' + t('gtPreviewAlt') + '">' +
      '<div class="small">' +
      '<div><strong>' + t('fileLabel') + '</strong>' + file.name + '</div>' +
      '<div><strong>' + t('sizeLabel') + '</strong>' + image.naturalWidth + ' x ' + image.naturalHeight + '</div>' +
      '</div>' +
      '</div>';

    const imgEl = gtPreview.querySelector('img');
    if (imgEl) {
      imgEl.addEventListener('load', function () {
        URL.revokeObjectURL(objectUrl);
      });
      imgEl.addEventListener('error', function () {
        URL.revokeObjectURL(objectUrl);
      });
    }
  }

  async function runCalculation() {
    hideAlert();

    const gtFile = groundTruthInput.files && groundTruthInput.files[0];
    const targetFiles = targetsInput.files ? Array.from(targetsInput.files) : [];

    if (!gtFile) {
      showAlert(t('needGroundTruth'), 'alert-warning');
      return;
    }

    if (targetFiles.length === 0) {
      showAlert(t('needTargets'), 'alert-warning');
      return;
    }

    calculateBtn.disabled = true;
    calculateBtn.textContent = t('calculating');

    try {
      const gtImage = await getImageElement(gtFile);
      const gtData = getImageDataFromImage(gtImage);
      renderGroundTruthPreview(gtFile, gtImage);

      const rows = [];

      for (const file of targetFiles) {
        let status = t('statusDone');
        let mse = '-';
        let psnr = '-';
        let ssim = '-';
        let sizeText = '-';

        try {
          const targetImage = await getImageElement(file);
          sizeText = targetImage.naturalWidth + ' x ' + targetImage.naturalHeight;

          if (
            targetImage.naturalWidth !== gtImage.naturalWidth ||
            targetImage.naturalHeight !== gtImage.naturalHeight
          ) {
            status = t('statusSizeMismatch');
          } else {
            const targetData = getImageDataFromImage(targetImage);
            const metrics = calculateMetrics(gtData, targetData);
            mse = formatMetric(metrics.mseNorm, 6);
            psnr = formatMetric(metrics.psnr, 4);
            ssim = formatMetric(metrics.ssim, 6);
          }
        } catch (error) {
          status = t('statusReadFailed');
        }

        rows.push(
          '<tr>' +
            '<td>' + file.name + '</td>' +
            '<td>' + sizeText + '</td>' +
            '<td>' + mse + '</td>' +
            '<td>' + psnr + '</td>' +
            '<td>' + ssim + '</td>' +
            '<td>' + status + '</td>' +
          '</tr>'
        );
      }

      resultBody.innerHTML = rows.join('');
      showAlert(t('calcFinished').replace('{count}', String(targetFiles.length)), 'alert-success');
    } catch (error) {
      showAlert(error.message || t('calcFailed'), 'alert-danger');
      setEmptyResults();
    } finally {
      calculateBtn.disabled = false;
      calculateBtn.textContent = t('calculateBtn');
    }
  }

  targetsInput.addEventListener('change', function () {
    const count = targetsInput.files ? targetsInput.files.length : 0;
    targetsCount.textContent = String(count);
  });

  clearBtn.addEventListener('click', resetPage);
  calculateBtn.addEventListener('click', runCalculation);

  localizeStaticTexts();
  renderConceptInfo();
  resetPage();
})();
