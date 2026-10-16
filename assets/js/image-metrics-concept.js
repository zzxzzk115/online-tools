(function () {
  const fallbackI18n = {
    detectLocale: function () {
      const raw = (navigator.language || '').toLowerCase();
      if (raw.startsWith('en')) {
        return 'en';
      }
      if (raw === 'zh-cn' || raw.startsWith('zh')) {
        return 'zh_CN';
      }
      return 'zh_CN';
    }
  };

  const i18n = window.AppI18n || fallbackI18n;
  const locale = i18n.detectLocale();

  const infoTitle = document.getElementById('infoTitle');
  const conceptInfo = document.getElementById('conceptInfo');
  if (!infoTitle || !conceptInfo) {
    return;
  }

  if (locale === 'en') {
    infoTitle.textContent = 'Metric Guide';
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
    infoTitle.textContent = '指标说明';
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

  function tryTypeset(retry) {
    const n = typeof retry === 'number' ? retry : 0;
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([conceptInfo]).catch(function () {});
      return;
    }
    if (n < 20) {
      window.setTimeout(function () {
        tryTypeset(n + 1);
      }, 120);
    }
  }

  tryTypeset(0);
})();
