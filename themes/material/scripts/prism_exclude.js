/**
 * Set PrismJS exclude_languages from theme config.
 */
hexo.on('generateBefore', function () {
  if (hexo.theme.config && hexo.theme.config.prismjs) {
    var themePrism = hexo.theme.config.prismjs;
    if (!hexo.config.prismjs) {
      hexo.config.prismjs = {};
    }
    if (themePrism.exclude_languages && Array.isArray(themePrism.exclude_languages)) {
      var existing = hexo.config.prismjs.exclude_languages || [];
      hexo.config.prismjs.exclude_languages = existing.concat(themePrism.exclude_languages);
    }
  }
});
