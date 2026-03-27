(function () {
  const dictionary = {
    zh_CN: {
      pageTitle: 'Abs Error Map / Heatmap 生成器',
      metaDescription: 'Abs error map 与 heatmap 生成工具',
      backLink: '← 返回工具集',
      pageHeading: 'Abs Error Map / Heatmap 生成器',
      pageSubheading: '上传 Ground Truth 与目标图像，生成绝对误差图和热力图。',
      infoTitle: '概念说明',
      gtLabel: 'Ground Truth 图像',
      gtHelp: '仅支持一张，作为对比基准。',
      targetsLabel: '待比较图像',
      targetsHelp: '支持多张，按顺序生成结果。',
      generateBtn: '生成',
      generating: '生成中...',
      clearBtn: '清空',
      gtPreviewTitle: 'Ground Truth 预览',
      gtPreviewEmpty: '尚未上传',
      targetsCountTitle: '待比较图像数量',
      resultsTitle: '生成结果',
      emptyHint: '暂无结果',
      fileLabel: '文件：',
      sizeLabel: '尺寸：',
      absMapTitle: 'Abs Error Map',
      heatmapTitle: 'Heatmap',
      statusDone: '完成',
      statusSizeMismatch: '尺寸不一致，已跳过',
      statusReadFailed: '读取失败',
      needGroundTruth: '请先上传 Ground Truth 图像。',
      needTargets: '请至少上传一张待比较图像。',
      plotlyMissing: 'Plotly 未加载成功，无法生成 heatmap。',
      generatedCount: '生成完成，共处理 {count} 张图像。',
      genericFailed: '生成失败，请检查图像后重试。',
      resultStatus: '状态：',
      unreadableImage: '无法读取图像：',
      gtPreviewAlt: 'Ground Truth 预览',
      hoverX: 'x',
      hoverY: 'y',
      hoverAbs: 'abs',
      showOriginal: '查看原图 1:1',
      showThumbnail: '查看缩略图'
    },
    en: {
      pageTitle: 'Abs Error Map / Heatmap Generator',
      metaDescription: 'Generate abs error maps and heatmaps',
      backLink: '← Back to Tools',
      pageHeading: 'Abs Error Map / Heatmap Generator',
      pageSubheading: 'Upload a ground truth image and one or more targets to generate abs error maps and heatmaps.',
      infoTitle: 'Concept Guide',
      gtLabel: 'Ground Truth Image',
      gtHelp: 'Upload one image as the reference.',
      targetsLabel: 'Target Images',
      targetsHelp: 'Multiple files are supported and processed one by one.',
      generateBtn: 'Generate',
      generating: 'Generating...',
      clearBtn: 'Clear',
      gtPreviewTitle: 'Ground Truth Preview',
      gtPreviewEmpty: 'No image uploaded yet',
      targetsCountTitle: 'Target Image Count',
      resultsTitle: 'Results',
      emptyHint: 'No results yet',
      fileLabel: 'File: ',
      sizeLabel: 'Size: ',
      absMapTitle: 'Abs Error Map',
      heatmapTitle: 'Heatmap',
      statusDone: 'Done',
      statusSizeMismatch: 'Size mismatch, skipped',
      statusReadFailed: 'Read failed',
      needGroundTruth: 'Please upload a ground truth image first.',
      needTargets: 'Please upload at least one target image.',
      plotlyMissing: 'Plotly failed to load. Heatmap generation is unavailable.',
      generatedCount: 'Generation completed. Processed {count} images.',
      genericFailed: 'Generation failed. Please check the images and try again.',
      resultStatus: 'Status: ',
      unreadableImage: 'Unable to read image: ',
      gtPreviewAlt: 'Ground Truth Preview',
      hoverX: 'x',
      hoverY: 'y',
      hoverAbs: 'abs',
      showOriginal: 'View original 1:1',
      showThumbnail: 'View thumbnail'
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

  const groundTruthInput = document.getElementById('groundTruthInput');
  const targetsInput = document.getElementById('targetsInput');
  const generateBtn = document.getElementById('generateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const alertBox = document.getElementById('alertBox');
  const gtPreview = document.getElementById('gtPreview');
  const targetsCount = document.getElementById('targetsCount');
  const resultList = document.getElementById('resultList');
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
      'generateBtn',
      'clearBtn',
      'gtPreviewTitle',
      'targetsCountTitle',
      'resultsTitle'
    ];

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = t(id);
      }
    }
  }

  function renderConceptInfo() {
    if (!conceptInfo) {
      return;
    }

    if (locale === 'en') {
      conceptInfo.innerHTML =
        '<p class="mb-2"><strong>Absolute Error Map</strong> visualizes per-pixel absolute difference.</p>' +
        '<p class="mb-2">\\( E_{abs}(i,j)=|I_{gt}(i,j)-I_{pred}(i,j)| \\)</p>' +
        '<p class="mb-2">Darker means smaller error, brighter means larger error.</p>' +
        '<p class="mb-2"><strong>Heatmap</strong> maps absolute error values to colors (here: Viridis).</p>' +
        '<p class="mb-2">The same error matrix is reused, only color encoding differs.</p>' +
        '<p class="mb-2">\\( H(i,j)=\\mathrm{Colormap}(E_{abs}(i,j)) \\)</p>' +
        '<p class="mb-0">Interpretation: widespread bright regions indicate global mismatch; sparse bright spots indicate local artifacts.</p>';
    } else {
      conceptInfo.innerHTML =
        '<p class="mb-2"><strong>绝对误差图（Abs Error Map）</strong>展示逐像素绝对误差。</p>' +
        '<p class="mb-2">\\( E_{abs}(i,j)=|I_{gt}(i,j)-I_{pred}(i,j)| \\)</p>' +
        '<p class="mb-2">颜色越暗表示误差越小，越亮表示误差越大。</p>' +
        '<p class="mb-2"><strong>热力图（Heatmap）</strong>将绝对误差矩阵映射到颜色空间（本工具使用 Viridis）。</p>' +
        '<p class="mb-2">它与误差图使用同一组误差值，仅可视化编码方式不同。</p>' +
        '<p class="mb-2">\\( H(i,j)=\\mathrm{Colormap}(E_{abs}(i,j)) \\)</p>' +
        '<p class="mb-0">解读建议：大面积高亮通常表示整体偏差，局部高亮则常对应局部伪影或细节错误。</p>';
    }

    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([conceptInfo]).catch(function () {});
    }
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

  function setEmptyResult() {
    resultList.innerHTML = '<p id="emptyHint" class="text-secondary mb-0">' + t('emptyHint') + '</p>';
  }

  function resetPage() {
    groundTruthInput.value = '';
    targetsInput.value = '';
    gtPreview.innerHTML = '<span class="text-secondary small">' + t('gtPreviewEmpty') + '</span>';
    targetsCount.textContent = '0';
    generateBtn.textContent = t('generateBtn');
    hideAlert();
    setEmptyResult();
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

  function luminance(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  function computeAbsDiff(baseImageData, targetImageData) {
    const width = baseImageData.width;
    const height = baseImageData.height;
    const base = baseImageData.data;
    const target = targetImageData.data;

    const absImage = new ImageData(width, height);
    const absData = absImage.data;
    const matrix = new Array(height);

    let idx = 0;
    for (let y = 0; y < height; y += 1) {
      const row = new Array(width);
      for (let x = 0; x < width; x += 1) {
        const a = luminance(base[idx], base[idx + 1], base[idx + 2]);
        const b = luminance(target[idx], target[idx + 1], target[idx + 2]);
        const d = Math.abs(a - b);
        row[x] = d;

        const c = Math.round(d);
        absData[idx] = c;
        absData[idx + 1] = c;
        absData[idx + 2] = c;
        absData[idx + 3] = 255;

        idx += 4;
      }
      matrix[y] = row;
    }

    return { absImage: absImage, matrix: matrix };
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

  function enforcePixelatedRendering(plotDiv) {
    const imageNodes = plotDiv.querySelectorAll('.hm image, .imagelayer image');
    for (const node of imageNodes) {
      node.style.imageRendering = 'pixelated';
      node.style.imageRendering = 'crisp-edges';
    }
  }

  function getThumbnailSize(width, height) {
    const maxThumbWidth = 360;
    if (width <= maxThumbWidth) {
      return { width: width, height: height };
    }
    const scale = maxThumbWidth / width;
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale))
    };
  }

  function getDisplayDpi() {
    const dpr = window.devicePixelRatio || 1;
    return {
      dpr: dpr,
      dpi: 96 * dpr
    };
  }

  async function appendResultCard(file, gtImage, gtData) {
    const wrapper = document.createElement('article');
    wrapper.className = 'card border mb-3';

    const body = document.createElement('div');
    body.className = 'card-body';
    wrapper.appendChild(body);

    const heading = document.createElement('h3');
    heading.className = 'h6 fw-semibold mb-2';
    heading.textContent = file.name;
    body.appendChild(heading);

    const statusLine = document.createElement('p');
    statusLine.className = 'small text-secondary mb-3';
    body.appendChild(statusLine);

    try {
      const image = await getImageElement(file);
      statusLine.textContent = t('resultStatus') + t('statusDone') + ' | ' + t('sizeLabel') + image.naturalWidth + ' x ' + image.naturalHeight;

      if (image.naturalWidth !== gtImage.naturalWidth || image.naturalHeight !== gtImage.naturalHeight) {
        statusLine.textContent = t('resultStatus') + t('statusSizeMismatch');
        resultList.appendChild(wrapper);
        return;
      }

      const targetData = getImageDataFromImage(image);
      const diff = computeAbsDiff(gtData, targetData);

      const row = document.createElement('div');
      row.className = 'row g-3';
      body.appendChild(row);

      const absCol = document.createElement('div');
      absCol.className = 'col-12 col-xl-6';
      row.appendChild(absCol);

      const absTitle = document.createElement('p');
      absTitle.className = 'fw-semibold mb-2';
      absTitle.textContent = t('absMapTitle');
      absCol.appendChild(absTitle);

      const absToggleBtn = document.createElement('button');
      absToggleBtn.type = 'button';
      absToggleBtn.className = 'btn btn-sm btn-outline-secondary mb-2';
      absCol.appendChild(absToggleBtn);

      const absWrap = document.createElement('div');
      absWrap.className = 'pixel-preview-wrap';
      absCol.appendChild(absWrap);

      const absCanvas = document.createElement('canvas');
      absCanvas.width = diff.absImage.width;
      absCanvas.height = diff.absImage.height;
      absCanvas.className = 'result-canvas';
      absWrap.appendChild(absCanvas);

      const absCtx = absCanvas.getContext('2d', { willReadFrequently: true });
      absCtx.putImageData(diff.absImage, 0, 0);

      const absThumb = getThumbnailSize(diff.absImage.width, diff.absImage.height);
      let absIsOriginal = false;
      function applyAbsView() {
        const targetW = absIsOriginal ? diff.absImage.width : absThumb.width;
        const targetH = absIsOriginal ? diff.absImage.height : absThumb.height;
        absCanvas.style.width = String(targetW) + 'px';
        absCanvas.style.height = String(targetH) + 'px';
        absToggleBtn.textContent = absIsOriginal ? t('showThumbnail') : t('showOriginal');
      }
      absToggleBtn.addEventListener('click', function () {
        absIsOriginal = !absIsOriginal;
        applyAbsView();
      });
      absCanvas.addEventListener('click', function () {
        absIsOriginal = !absIsOriginal;
        applyAbsView();
      });
      applyAbsView();

      const heatCol = document.createElement('div');
      heatCol.className = 'col-12 col-xl-6';
      row.appendChild(heatCol);

      const heatTitle = document.createElement('p');
      heatTitle.className = 'fw-semibold mb-2';
      heatTitle.textContent = t('heatmapTitle');
      heatCol.appendChild(heatTitle);

      const heatToggleBtn = document.createElement('button');
      heatToggleBtn.type = 'button';
      heatToggleBtn.className = 'btn btn-sm btn-outline-secondary mb-2';
      heatCol.appendChild(heatToggleBtn);

      const heatWrap = document.createElement('div');
      heatWrap.className = 'pixel-preview-wrap';
      heatCol.appendChild(heatWrap);

      const plotDiv = document.createElement('div');
      plotDiv.className = 'heatmap-box';
      heatWrap.appendChild(plotDiv);

      const zData = diff.matrix;
      const heatW = zData.length > 0 ? zData[0].length : 1;
      const heatH = zData.length > 0 ? zData.length : 1;
      const heatThumb = getThumbnailSize(heatW, heatH);
      let heatIsOriginal = false;

      function getHeatLayout() {
        const viewW = heatIsOriginal ? heatW : heatThumb.width;
        const viewH = heatIsOriginal ? heatH : heatThumb.height;
        const display = getDisplayDpi();
        const dpiScale = Math.min(2, Math.max(1, display.dpr));
        const targetTick = Math.round((heatIsOriginal ? 22 : 13) * dpiScale);
        const targetBar = Math.round((heatIsOriginal ? 32 : 16) * dpiScale);

        // Keep aggressive sizing, but cap by viewport width so colorbar and ticks stay inside canvas.
        const maxBar = Math.max(12, Math.floor(viewW * 0.22));
        const maxTick = Math.max(10, Math.floor(viewW * 0.16));
        const barThickness = Math.min(targetBar, maxBar);
        const tickSize = Math.min(targetTick, maxTick);
        const rightMargin = Math.max(
          22,
          Math.round(barThickness + tickSize * 3.2 + 14)
        );
        return {
          autosize: false,
          width: viewW + rightMargin,
          height: viewH,
          margin: { l: 0, r: rightMargin, t: 0, b: 0 },
          paper_bgcolor: '#ffffff',
          plot_bgcolor: '#ffffff',
          _tickSize: tickSize,
          _barThickness: barThickness,
          xaxis: {
            visible: false,
            range: [-0.5, heatW - 0.5],
            domain: [0, 1],
            constrain: 'domain',
            fixedrange: true
          },
          yaxis: {
            visible: false,
            range: [heatH - 0.5, -0.5],
            domain: [0, 1],
            scaleanchor: 'x',
            scaleratio: 1,
            constrain: 'domain',
            fixedrange: true
          }
        };
      }

      function renderHeatmap() {
        const layout = getHeatLayout();
        const heatTrace = {
          z: zData,
          type: 'heatmap',
          colorscale: 'Viridis',
          x0: 0,
          dx: 1,
          y0: 0,
          dy: 1,
          xgap: 0,
          ygap: 0,
          zsmooth: false,
          zmin: 0,
          zmax: 255,
          showscale: true,
          colorbar: {
            thickness: layout._barThickness,
            len: 1,
            lenmode: 'fraction',
            y: 0.5,
            yanchor: 'middle',
            x: 1.03,
            xanchor: 'left',
            xpad: 0,
            tickfont: {
              size: layout._tickSize
            }
          },
          hovertemplate:
            t('hoverX') + '=%{x:.0f}, ' +
            t('hoverY') + '=%{y:.0f}, ' +
            t('hoverAbs') + '=%{z:.2f}<extra></extra>'
        };
        delete layout._tickSize;
        delete layout._barThickness;
        plotDiv.style.width = String(layout.width) + 'px';
        plotDiv.style.height = String(layout.height) + 'px';
        heatToggleBtn.textContent = heatIsOriginal ? t('showThumbnail') : t('showOriginal');
        return Plotly.react(
          plotDiv,
          [heatTrace],
          layout,
          {
            responsive: true,
            displaylogo: false,
            displayModeBar: true
          }
        ).then(function () {
          enforcePixelatedRendering(plotDiv);
        });
      }

      heatToggleBtn.addEventListener('click', function () {
        heatIsOriginal = !heatIsOriginal;
        renderHeatmap();
      });
      plotDiv.addEventListener('click', function () {
        heatIsOriginal = !heatIsOriginal;
        renderHeatmap();
      });
      window.addEventListener('resize', function () {
        renderHeatmap();
      });

      await renderHeatmap();
    } catch (error) {
      statusLine.textContent = t('resultStatus') + t('statusReadFailed');
    }

    resultList.appendChild(wrapper);
  }

  async function runGeneration() {
    hideAlert();

    if (typeof window.Plotly === 'undefined') {
      showAlert(t('plotlyMissing'), 'alert-danger');
      return;
    }

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

    generateBtn.disabled = true;
    generateBtn.textContent = t('generating');
    resultList.innerHTML = '';

    try {
      const gtImage = await getImageElement(gtFile);
      const gtData = getImageDataFromImage(gtImage);
      renderGroundTruthPreview(gtFile, gtImage);

      for (const file of targetFiles) {
        await appendResultCard(file, gtImage, gtData);
      }

      showAlert(t('generatedCount').replace('{count}', String(targetFiles.length)), 'alert-success');
    } catch (error) {
      showAlert(error.message || t('genericFailed'), 'alert-danger');
      setEmptyResult();
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = t('generateBtn');
    }
  }

  targetsInput.addEventListener('change', function () {
    const count = targetsInput.files ? targetsInput.files.length : 0;
    targetsCount.textContent = String(count);
  });

  clearBtn.addEventListener('click', function () {
    if (typeof window.Plotly !== 'undefined') {
      const plots = resultList.querySelectorAll('.heatmap-box');
      for (const plot of plots) {
        Plotly.purge(plot);
      }
    }
    resetPage();
  });

  generateBtn.addEventListener('click', runGeneration);

  localizeStaticTexts();
  renderConceptInfo();
  resetPage();
})();
