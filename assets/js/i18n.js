(function () {
  const SUPPORTED_LOCALES = ['zh_CN', 'en'];

  function detectLocale() {
    const raw = (navigator.language || '').toLowerCase();
    if (raw.startsWith('en')) {
      return 'en';
    }
    if (raw === 'zh-cn' || raw.startsWith('zh')) {
      return 'zh_CN';
    }
    return 'zh_CN';
  }

  function createTranslator(dictionary, locale) {
    return function (key) {
      const primary = dictionary[locale] || {};
      const fallback = dictionary.zh_CN || {};
      return primary[key] || fallback[key] || key;
    };
  }

  window.AppI18n = {
    SUPPORTED_LOCALES: SUPPORTED_LOCALES,
    detectLocale: detectLocale,
    createTranslator: createTranslator
  };
})();
