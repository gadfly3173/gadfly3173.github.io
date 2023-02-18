/* jslint browser: true */
/* global $, jQuery, alert */

// Custom_js
// Back_to_top_js
// Material_js
// Bootstrap_js
// Sidebar_js
// Burder_js

//* *********************************
//* *********************************
//* *********************************   Custom_js
//* *********************************
//* *********************************
$(document).ready(() => {
  Array.prototype.forEach.call(document.querySelectorAll('.mdl-card__media'), (el) => {
    const link = el.querySelector('a');
    if (!link) {
      return;
    }
    const target = link.getAttribute('href');
    if (!target) {
      return;
    }
    el.addEventListener('click', () => {
      location.href = target;
    });
  });

  // Auto fill visitor-url "http://"
  $('#visitor-url').focus(function () {
    this.placeholder = 'http://';
  });
  $('#visitor-url').blur(function () {
    this.placeholder = '';
  });

  // Auto delete input content & placeholder
  $('.search-input').blur(function () {
    this.value = '';
    this.placeholder = '';
  });

  // Auto hidden share/tags popup block
  $('#article-fuctions-share-button, #article-functions-viewtags-button').click(() => {
    $('.is-visible').removeClass('is-visible');
  });

  // Add 'fab' class to the PageNav <a>
  $('.fabs .prev, .fabs .next, .fabs .prev-content').addClass('fab');

  // Smooth scroll to Top
  $('a.toTop').click(function () {
    $('html, body').animate({
      scrollTop: `${$($(this).attr('href')).offset().top}px`,
    }, {
      duration: 500,
      easing: 'swing',
    });
    return false;
  });


  // Smooth scroll of TOC
  $('.post-toc a').click(function () {
    $('html, body').animate({
      scrollTop: `${$($(this).attr('href')).offset().top}px`,
    }, {
      duration: 500,
      easing: 'swing',
    });
    return false;
  });

  // Click anywhere to close the FAB menu
  $(document).click(() => {
    if ($('#prime').hasClass('is-visible')) {
      $('#prime').click();
    }
  });
  $('#prime').click((e) => {
    e.stopPropagation();
    return false;
  });

  // Click anywhere to remove local search result
  $(document).click(() => {
    $('#local-search-result ul').css('display', 'none');
  });

  // darkMode Detection
  const rememberThemeColorStorageKey = 'theme-color';
  const darkMode =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  const themeColorSwitchInput = document.getElementById('theme-color-switch-input');
  const rememberThemeColor = localStorage.getItem(rememberThemeColorStorageKey);
  // 判断是否匹配深色模式
  if ('dark' === rememberThemeColor || (darkMode && darkMode.matches)) {
    tinyBallSwitchTheme(true);
    document.body.setAttribute('data-theme', 'dark');
    document.getElementById('theme-color-switch-input').setAttribute('checked', 'checked');
  } else {
    document.body.setAttribute('data-theme', '');
  }
  // 监听主题切换事件
  themeColorSwitchInput.addEventListener('change', () => {
    tinyBallSwitchTheme(themeColorSwitchInput.checked);
    if (themeColorSwitchInput.checked) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem(rememberThemeColorStorageKey, 'dark');
    } else {
      document.body.setAttribute('data-theme', '');
      localStorage.setItem(rememberThemeColorStorageKey, 'light');
    }
  });
  darkMode &&
    darkMode.addEventListener("change", (e) => {
      tinyBallSwitchTheme(e.matches);
      if (e.matches) {
        document.body.setAttribute('data-theme', 'dark');
        themeColorSwitchInput.setAttribute('checked', 'checked');
        localStorage.setItem(rememberThemeColorStorageKey, 'dark');
      } else {
        document.body.setAttribute('data-theme', '');
        themeColorSwitchInput.removeAttribute('checked');
        localStorage.setItem(rememberThemeColorStorageKey, 'light');
      }
    });
  function tinyBallSwitchTheme(isDark) {
    const tinyBallCanvas = document.getElementById('tinyball-canvas');
    const tinyBallContext = tinyBallCanvas.getContext('2d');
    if (isDark) {
      tinyBallContext.strokeStyle = 'rgba(255,255,255,0.02)',
      tinyBallContext.fillStyle = 'rgba(255,255,255,0.05)';
    } else {
      tinyBallContext.strokeStyle = 'rgba(0,0,0,0.02)',
      tinyBallContext.fillStyle = 'rgba(0,0,0,0.05)';
    }
  }

});

//* *********************************
//* *********************************
//* *********************************   Back_to_top_js
//* *********************************
//* *********************************

$(window).scroll((event) => {
  const scroll = $(window).scrollTop();
  if (scroll > 300) {
    $('#back-to-top').addClass('btt-visible');
  } else {
    $('#back-to-top').removeClass('btt-visible');
  }

  const footerOffset = $('.mdl-mini-footer').offset().top;
  const windowHeight = $(window).height();
  if (scroll > footerOffset - windowHeight + 42) {
    $('#back-to-top').addClass('btt-docked');
  } else {
    $('#back-to-top').removeClass('btt-docked');
  }
});

//* *********************************
//* *********************************
//* *********************************   Material_js
//* *********************************
//* *********************************

function MaterialButton(e) {
  this.element_ = e, this.init();
}

function MaterialCheckbox(e) {
  this.element_ = e, this.init();
}

function MaterialIconToggle(e) {
  this.element_ = e, this.init();
}

function MaterialMenu(e) {
  this.element_ = e, this.init();
}

function MaterialProgress(e) {
  this.element_ = e, this.init();
}

function MaterialRadio(e) {
  this.element_ = e, this.init();
}

function MaterialSlider(e) {
  this.element_ = e, this.isIE_ = window.navigator.msPointerEnabled, this.init();
}

function MaterialSpinner(e) {
  this.element_ = e, this.init();
}

function MaterialSwitch(e) {
  this.element_ = e, this.init();
}

function MaterialTabs(e) {
  this.element_ = e, this.init();
}

function MaterialTab(e, t) {
  if (e) {
    if (t.element_.classList.contains(t.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
      const s = document.createElement('span');
      s.classList.add(t.CssClasses_.MDL_RIPPLE_CONTAINER), s.classList.add(t.CssClasses_.MDL_JS_RIPPLE_EFFECT);
      const i = document.createElement('span');
      i.classList.add(t.CssClasses_.MDL_RIPPLE), s.appendChild(i), e.appendChild(s);
    }
    e.addEventListener('click', (s) => {
      s.preventDefault();
      const i = e.href.split('#')[1];
      const n = t.element_.querySelector(`#${i}`);
      t.resetTabState_(), t.resetPanelState_(), e.classList.add(t.CssClasses_.ACTIVE_CLASS), n.classList.add(t.CssClasses_.ACTIVE_CLASS);
    });
  }
}

function MaterialTextfield(e) {
  this.element_ = e, this.maxRows = this.Constant_.NO_MAX_ROWS, this.init();
}

function MaterialTooltip(e) {
  this.element_ = e, this.init();
}

function MaterialLayout(e) {
  this.element_ = e, this.init();
}

function MaterialLayoutTab(e, t, s, i) {
  if (e) {
    if (i.tabBar_.classList.contains(i.CssClasses_.JS_RIPPLE_EFFECT)) {
      const n = document.createElement('span');
      n.classList.add(i.CssClasses_.RIPPLE_CONTAINER), n.classList.add(i.CssClasses_.JS_RIPPLE_EFFECT);
      const a = document.createElement('span');
      a.classList.add(i.CssClasses_.RIPPLE), n.appendChild(a), e.appendChild(n);
    }
    e.addEventListener('click', (n) => {
      n.preventDefault();
      const a = e.href.split('#')[1];
      const l = i.content_.querySelector(`#${a}`);
      i.resetTabState_(t), i.resetPanelState_(s), e.classList.add(i.CssClasses_.IS_ACTIVE), l.classList.add(i.CssClasses_.IS_ACTIVE);
    });
  }
}

function MaterialDataTable(e) {
  this.element_ = e, this.init();
}

function MaterialRipple(e) {
  this.element_ = e, this.init();
}
const componentHandler = (function () {
  function e(e, t) {
    for (let s = 0; s < c.length; s++) { if (c[s].className === e) return void 0 !== t && (c[s] = t), c[s]; }
    return !1;
  }

  function t(e) {
    const t = e.getAttribute('data-upgraded');
    return t === null ? [''] : t.split(',');
  }

  function s(e, s) {
    const i = t(e);
    return i.indexOf(s) !== -1;
  }

  function i(t, s) {
    if (void 0 === t && void 0 === s) { for (let a = 0; a < c.length; a++) i(c[a].className, c[a].cssClass); } else {
      const l = t;
      if (void 0 === s) {
        const r = e(l);
        r && (s = r.cssClass);
      }
      for (let o = document.querySelectorAll(`.${s}`), d = 0; d < o.length; d++) n(o[d], l);
    }
  }

  function n(i, n) {
    if (!(typeof i === 'object' && i instanceof Element)) throw new Error('Invalid argument provided to upgrade MDL element.');
    const a = t(i);
    const l = [];
    if (n) s(i, n) || l.push(e(n));
    else {
      const r = i.classList;
      c.forEach((e) => {
        r.contains(e.cssClass) && l.indexOf(e) === -1 && !s(i, e.className) && l.push(e);
      });
    }
    for (var o, d = 0, _ = l.length; _ > d; d++) {
      if (o = l[d], !o) throw new Error('Unable to find a registered component for the given class.');
      a.push(o.className), i.setAttribute('data-upgraded', a.join(','));
      const h = new o.classConstructor(i);
      h[C] = o, u.push(h);
      for (let p = 0, E = o.callbacks.length; E > p; p++) o.callbacks[p](i);
      o.widget && (i[o.className] = h);
      const m = document.createEvent('Events');
      m.initEvent('mdl-componentupgraded', !0, !0), i.dispatchEvent(m);
    }
  }

  function a(e) {
    Array.isArray(e) || (e = typeof e.item === 'function' ? Array.prototype.slice.call(e) : [e]);
    for (var t, s = 0, i = e.length; i > s; s++) t = e[s], t instanceof HTMLElement && (t.children.length > 0 && a(t.children), n(t));
  }

  function l(t) {
    const s = {
      classConstructor: t.constructor,
      className: t.classAsString,
      cssClass: t.cssClass,
      widget: void 0 === t.widget ? !0 : t.widget,
      callbacks: [],
    };
    if (c.forEach((e) => {
      if (e.cssClass === s.cssClass) throw new Error('The provided cssClass has already been registered.');
      if (e.className === s.className) throw new Error('The provided className has already been registered');
    }), t.constructor.prototype.hasOwnProperty(C)) throw new Error(`MDL component classes must not have ${C} defined as a property.`);
    const i = e(t.classAsString, s);
    i || c.push(s);
  }

  function r(t, s) {
    const i = e(t);
    i && i.callbacks.push(s);
  }

  function o() {
    for (let e = 0; e < c.length; e++) i(c[e].className);
  }

  function d(e) {
    for (let t = 0; t < u.length; t++) {
      const s = u[t];
      if (s.element_ === e) return s;
    }
  }

  function _(e) {
    if (e && e[C].classConstructor.prototype.hasOwnProperty(p)) {
      e[p]();
      const t = u.indexOf(e);
      u.splice(t, 1);
      const s = e.element_.getAttribute('data-upgraded').split(',');
      const i = s.indexOf(e[C].classAsString);
      s.splice(i, 1), e.element_.setAttribute('data-upgraded', s.join(','));
      const n = document.createEvent('Events');
      n.initEvent('mdl-componentdowngraded', !0, !0), e.element_.dispatchEvent(n);
    }
  }

  function h(e) {
    const t = function (e) {
      _(d(e));
    };
    if (e instanceof Array || e instanceof NodeList) { for (let s = 0; s < e.length; s++) t(e[s]); } else {
      if (!(e instanceof Node)) throw new Error('Invalid argument provided to downgrade MDL nodes.');
      t(e);
    }
  }
  var c = [];
  var u = [];
  var p = 'mdlDowngrade_';
  var C = 'mdlComponentConfigInternal_';
  return {
    upgradeDom: i,
    upgradeElement: n,
    upgradeElements: a,
    upgradeAllRegistered: o,
    registerUpgradedCallback: r,
    register: l,
    downgradeElements: h,
  };
}());
window.addEventListener('load', () => {
  'classList' in document.createElement('div') && 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ? (document.documentElement.classList.add('mdl-js'), componentHandler.upgradeAllRegistered()) : componentHandler.upgradeElement = componentHandler.register = function () {};
}),
(function () {
  Date.now || (Date.now = function () {
    return (new Date()).getTime();
  });
  for (let e = ['webkit', 'moz'], t = 0; t < e.length && !window.requestAnimationFrame; ++t) {
    const s = e[t];
    window.requestAnimationFrame = window[`${s}RequestAnimationFrame`], window.cancelAnimationFrame = window[`${s}CancelAnimationFrame`] || window[`${s}CancelRequestAnimationFrame`];
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    let i = 0;
    window.requestAnimationFrame = function (e) {
      const t = Date.now();
      const s = Math.max(i + 16, t);
      return setTimeout(() => {
        e(i = s);
      }, s - t);
    }, window.cancelAnimationFrame = clearTimeout;
  }
}()), MaterialButton.prototype.Constant_ = {}, MaterialButton.prototype.CssClasses_ = {
  RIPPLE_EFFECT: 'mdl-js-ripple-effect',
  RIPPLE_CONTAINER: 'mdl-button__ripple-container',
  RIPPLE: 'mdl-ripple',
}, MaterialButton.prototype.blurHandler = function (e) {
  e && this.element_.blur();
}, MaterialButton.prototype.disable = function () {
  this.element_.disabled = !0;
}, MaterialButton.prototype.enable = function () {
  this.element_.disabled = !1;
}, MaterialButton.prototype.init = function () {
  if (this.element_) {
    if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
      const e = document.createElement('span');
      e.classList.add(this.CssClasses_.RIPPLE_CONTAINER), this.rippleElement_ = document.createElement('span'), this.rippleElement_.classList.add(this.CssClasses_.RIPPLE), e.appendChild(this.rippleElement_), this.boundRippleBlurHandler = this.blurHandler.bind(this), this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler), this.element_.appendChild(e);
    }
    this.boundButtonBlurHandler = this.blurHandler.bind(this), this.element_.addEventListener('mouseup', this.boundButtonBlurHandler), this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
  }
}, MaterialButton.prototype.mdlDowngrade_ = function () {
  this.rippleElement_ && this.rippleElement_.removeEventListener('mouseup', this.boundRippleBlurHandler), this.element_.removeEventListener('mouseup', this.boundButtonBlurHandler), this.element_.removeEventListener('mouseleave', this.boundButtonBlurHandler);
}, componentHandler.register({
  constructor: MaterialButton,
  classAsString: 'MaterialButton',
  cssClass: 'mdl-js-button',
  widget: !0,
}), MaterialCheckbox.prototype.Constant_ = {
  TINY_TIMEOUT: 0.001,
}, MaterialCheckbox.prototype.CssClasses_ = {
  INPUT: 'mdl-checkbox__input',
  BOX_OUTLINE: 'mdl-checkbox__box-outline',
  FOCUS_HELPER: 'mdl-checkbox__focus-helper',
  TICK_OUTLINE: 'mdl-checkbox__tick-outline',
  RIPPLE_EFFECT: 'mdl-js-ripple-effect',
  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
  RIPPLE_CONTAINER: 'mdl-checkbox__ripple-container',
  RIPPLE_CENTER: 'mdl-ripple--center',
  RIPPLE: 'mdl-ripple',
  IS_FOCUSED: 'is-focused',
  IS_DISABLED: 'is-disabled',
  IS_CHECKED: 'is-checked',
  IS_UPGRADED: 'is-upgraded',
}, MaterialCheckbox.prototype.onChange_ = function (e) {
  this.updateClasses_();
}, MaterialCheckbox.prototype.onFocus_ = function (e) {
  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
}, MaterialCheckbox.prototype.onBlur_ = function (e) {
  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
}, MaterialCheckbox.prototype.onMouseUp_ = function (e) {
  this.blur_();
}, MaterialCheckbox.prototype.updateClasses_ = function () {
  this.checkDisabled(), this.checkToggleState();
}, MaterialCheckbox.prototype.blur_ = function (e) {
  window.setTimeout(() => {
    this.inputElement_.blur();
  }, this.Constant_.TINY_TIMEOUT);
}, MaterialCheckbox.prototype.checkToggleState = function () {
  this.inputElement_.checked ? this.element_.classList.add(this.CssClasses_.IS_CHECKED) : this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
}, MaterialCheckbox.prototype.checkDisabled = function () {
  this.inputElement_.disabled ? this.element_.classList.add(this.CssClasses_.IS_DISABLED) : this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
}, MaterialCheckbox.prototype.disable = function () {
  this.inputElement_.disabled = !0, this.updateClasses_();
}, MaterialCheckbox.prototype.enable = function () {
  this.inputElement_.disabled = !1, this.updateClasses_();
}, MaterialCheckbox.prototype.check = function () {
  this.inputElement_.checked = !0, this.updateClasses_();
}, MaterialCheckbox.prototype.uncheck = function () {
  this.inputElement_.checked = !1, this.updateClasses_();
}, MaterialCheckbox.prototype.init = function () {
  if (this.element_) {
    this.inputElement_ = this.element_.querySelector(`.${this.CssClasses_.INPUT}`);
    const e = document.createElement('span');
    e.classList.add(this.CssClasses_.BOX_OUTLINE);
    const t = document.createElement('span');
    t.classList.add(this.CssClasses_.FOCUS_HELPER);
    const s = document.createElement('span');
    if (s.classList.add(this.CssClasses_.TICK_OUTLINE), e.appendChild(s), this.element_.appendChild(t), this.element_.appendChild(e), this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
      this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS), this.rippleContainerElement_ = document.createElement('span'), this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER), this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT), this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER), this.boundRippleMouseUp = this.onMouseUp_.bind(this), this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
      const i = document.createElement('span');
      i.classList.add(this.CssClasses_.RIPPLE), this.rippleContainerElement_.appendChild(i), this.element_.appendChild(this.rippleContainerElement_);
    }
    this.boundInputOnChange = this.onChange_.bind(this), this.boundInputOnFocus = this.onFocus_.bind(this), this.boundInputOnBlur = this.onBlur_.bind(this), this.boundElementMouseUp = this.onMouseUp_.bind(this), this.inputElement_.addEventListener('change', this.boundInputOnChange), this.inputElement_.addEventListener('focus', this.boundInputOnFocus), this.inputElement_.addEventListener('blur', this.boundInputOnBlur), this.element_.addEventListener('mouseup', this.boundElementMouseUp), this.updateClasses_(), this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
  }
}, MaterialCheckbox.prototype.mdlDowngrade_ = function () {
  this.rippleContainerElement_ && this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp), this.inputElement_.removeEventListener('change', this.boundInputOnChange), this.inputElement_.removeEventListener('focus', this.boundInputOnFocus), this.inputElement_.removeEventListener('blur', this.boundInputOnBlur), this.element_.removeEventListener('mouseup', this.boundElementMouseUp);
}, componentHandler.register({
  constructor: MaterialCheckbox,
  classAsString: 'MaterialCheckbox',
  cssClass: 'mdl-js-checkbox',
  widget: !0,
}), MaterialIconToggle.prototype.Constant_ = {
  TINY_TIMEOUT: 0.001,
}, MaterialIconToggle.prototype.CssClasses_ = {
  INPUT: 'mdl-icon-toggle__input',
  JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
  RIPPLE_CONTAINER: 'mdl-icon-toggle__ripple-container',
  RIPPLE_CENTER: 'mdl-ripple--center',
  RIPPLE: 'mdl-ripple',
  IS_FOCUSED: 'is-focused',
  IS_DISABLED: 'is-disabled',
  IS_CHECKED: 'is-checked',
}, MaterialIconToggle.prototype.onChange_ = function (e) {
  this.updateClasses_();
}, MaterialIconToggle.prototype.onFocus_ = function (e) {
  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
}, MaterialIconToggle.prototype.onBlur_ = function (e) {
  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
}, MaterialIconToggle.prototype.onMouseUp_ = function (e) {
  this.blur_();
}, MaterialIconToggle.prototype.updateClasses_ = function () {
  this.checkDisabled(), this.checkToggleState();
}, MaterialIconToggle.prototype.blur_ = function (e) {
  window.setTimeout(() => {
    this.inputElement_.blur();
  }, this.Constant_.TINY_TIMEOUT);
}, MaterialIconToggle.prototype.checkToggleState = function () {
  this.inputElement_.checked ? this.element_.classList.add(this.CssClasses_.IS_CHECKED) : this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
}, MaterialIconToggle.prototype.checkDisabled = function () {
  this.inputElement_.disabled ? this.element_.classList.add(this.CssClasses_.IS_DISABLED) : this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
}, MaterialIconToggle.prototype.disable = function () {
  this.inputElement_.disabled = !0, this.updateClasses_();
}, MaterialIconToggle.prototype.enable = function () {
  this.inputElement_.disabled = !1, this.updateClasses_();
}, MaterialIconToggle.prototype.check = function () {
  this.inputElement_.checked = !0, this.updateClasses_();
}, MaterialIconToggle.prototype.uncheck = function () {
  this.inputElement_.checked = !1, this.updateClasses_();
}, MaterialIconToggle.prototype.init = function () {
  if (this.element_) {
    if (this.inputElement_ = this.element_.querySelector(`.${this.CssClasses_.INPUT}`), this.element_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
      this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS), this.rippleContainerElement_ = document.createElement('span'), this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER), this.rippleContainerElement_.classList.add(this.CssClasses_.JS_RIPPLE_EFFECT), this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER), this.boundRippleMouseUp = this.onMouseUp_.bind(this), this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
      const e = document.createElement('span');
      e.classList.add(this.CssClasses_.RIPPLE), this.rippleContainerElement_.appendChild(e), this.element_.appendChild(this.rippleContainerElement_);
    }
    this.boundInputOnChange = this.onChange_.bind(this), this.boundInputOnFocus = this.onFocus_.bind(this), this.boundInputOnBlur = this.onBlur_.bind(this), this.boundElementOnMouseUp = this.onMouseUp_.bind(this), this.inputElement_.addEventListener('change', this.boundInputOnChange), this.inputElement_.addEventListener('focus', this.boundInputOnFocus), this.inputElement_.addEventListener('blur', this.boundInputOnBlur), this.element_.addEventListener('mouseup', this.boundElementOnMouseUp), this.updateClasses_(), this.element_.classList.add('is-upgraded');
  }
}, MaterialIconToggle.prototype.mdlDowngrade_ = function () {
  this.rippleContainerElement_ && this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp), this.inputElement_.removeEventListener('change', this.boundInputOnChange), this.inputElement_.removeEventListener('focus', this.boundInputOnFocus), this.inputElement_.removeEventListener('blur', this.boundInputOnBlur), this.element_.removeEventListener('mouseup', this.boundElementOnMouseUp);
}, componentHandler.register({
  constructor: MaterialIconToggle,
  classAsString: 'MaterialIconToggle',
  cssClass: 'mdl-js-icon-toggle',
  widget: !0,
}), MaterialMenu.prototype.Constant_ = {
  TRANSITION_DURATION_SECONDS: 0.3,
  TRANSITION_DURATION_FRACTION: 0.8,
  CLOSE_TIMEOUT: 150,
}, MaterialMenu.prototype.Keycodes_ = {
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
}, MaterialMenu.prototype.CssClasses_ = {
  CONTAINER: 'mdl-menu__container',
  OUTLINE: 'mdl-menu__outline',
  ITEM: 'mdl-menu__item',
  ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
  RIPPLE_EFFECT: 'mdl-js-ripple-effect',
  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
  RIPPLE: 'mdl-ripple',
  IS_UPGRADED: 'is-upgraded',
  IS_VISIBLE: 'is-visible',
  IS_ANIMATING: 'is-animating',
  BOTTOM_LEFT: 'mdl-menu--bottom-left',
  BOTTOM_RIGHT: 'mdl-menu--bottom-right',
  TOP_LEFT: 'mdl-menu--top-left',
  TOP_RIGHT: 'mdl-menu--top-right',
  UNALIGNED: 'mdl-menu--unaligned',
}, MaterialMenu.prototype.init = function () {
  if (this.element_) {
    const e = document.createElement('div');
    e.classList.add(this.CssClasses_.CONTAINER), this.element_.parentElement.insertBefore(e, this.element_), this.element_.parentElement.removeChild(this.element_), e.appendChild(this.element_), this.container_ = e;
    const t = document.createElement('div');
    t.classList.add(this.CssClasses_.OUTLINE), this.outline_ = t, e.insertBefore(t, this.element_);
    const s = this.element_.getAttribute('for');
    let i = null;
    s && (i = document.getElementById(s), i && (this.forElement_ = i, i.addEventListener('click', this.handleForClick_.bind(this)), i.addEventListener('keydown', this.handleForKeyboardEvent_.bind(this))));
    for (var n = this.element_.querySelectorAll(`.${this.CssClasses_.ITEM}`), a = 0; a < n.length; a++) n[a].addEventListener('click', this.handleItemClick_.bind(this)), n[a].tabIndex = '-1', n[a].addEventListener('keydown', this.handleItemKeyboardEvent_.bind(this));
    if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
      for (this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS), a = 0; a < n.length; a++) {
        const l = n[a];
        const r = document.createElement('span');
        r.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);
        const o = document.createElement('span');
        o.classList.add(this.CssClasses_.RIPPLE), r.appendChild(o), l.appendChild(r), l.classList.add(this.CssClasses_.RIPPLE_EFFECT);
      }
    }
    this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT) && this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT), this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT) && this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT), this.element_.classList.contains(this.CssClasses_.TOP_LEFT) && this.outline_.classList.add(this.CssClasses_.TOP_LEFT), this.element_.classList.contains(this.CssClasses_.TOP_RIGHT) && this.outline_.classList.add(this.CssClasses_.TOP_RIGHT), this.element_.classList.contains(this.CssClasses_.UNALIGNED) && this.outline_.classList.add(this.CssClasses_.UNALIGNED), e.classList.add(this.CssClasses_.IS_UPGRADED);
  }
}, MaterialMenu.prototype.handleForClick_ = function (e) {
  if (this.element_ && this.forElement_) {
    const t = this.forElement_.getBoundingClientRect();
    const s = this.forElement_.parentElement.getBoundingClientRect();
    this.element_.classList.contains(this.CssClasses_.UNALIGNED) || (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT) ? (this.container_.style.right = `${s.right - t.right}px`, this.container_.style.top = `${this.forElement_.offsetTop + this.forElement_.offsetHeight}px`) : this.element_.classList.contains(this.CssClasses_.TOP_LEFT) ? (this.container_.style.left = `${this.forElement_.offsetLeft}px`, this.container_.style.bottom = `${s.bottom - t.top}px`) : this.element_.classList.contains(this.CssClasses_.TOP_RIGHT) ? (this.container_.style.right = `${s.right - t.right}px`, this.container_.style.bottom = `${s.bottom - t.top}px`) : (this.container_.style.left = `${this.forElement_.offsetLeft}px`, this.container_.style.top = `${this.forElement_.offsetTop + this.forElement_.offsetHeight}px`));
  }
  this.toggle(e);
}, MaterialMenu.prototype.handleForKeyboardEvent_ = function (e) {
  if (this.element_ && this.container_ && this.forElement_) {
    const t = this.element_.querySelectorAll(`.${this.CssClasses_.ITEM}:not([disabled])`);
    t && t.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE) && (e.keyCode === this.Keycodes_.UP_ARROW ? (e.preventDefault(), t[t.length - 1].focus()) : e.keyCode === this.Keycodes_.DOWN_ARROW && (e.preventDefault(), t[0].focus()));
  }
}, MaterialMenu.prototype.handleItemKeyboardEvent_ = function (e) {
  if (this.element_ && this.container_) {
    const t = this.element_.querySelectorAll(`.${this.CssClasses_.ITEM}:not([disabled])`);
    if (t && t.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
      const s = Array.prototype.slice.call(t).indexOf(e.target);
      if (e.keyCode === this.Keycodes_.UP_ARROW) e.preventDefault(), s > 0 ? t[s - 1].focus() : t[t.length - 1].focus();
      else if (e.keyCode === this.Keycodes_.DOWN_ARROW) e.preventDefault(), t.length > s + 1 ? t[s + 1].focus() : t[0].focus();
      else if (e.keyCode === this.Keycodes_.SPACE || e.keyCode === this.Keycodes_.ENTER) {
        e.preventDefault();
        let i = new MouseEvent('mousedown');
        e.target.dispatchEvent(i), i = new MouseEvent('mouseup'), e.target.dispatchEvent(i), e.target.click();
      } else e.keyCode === this.Keycodes_.ESCAPE && (e.preventDefault(), this.hide());
    }
  }
}, MaterialMenu.prototype.handleItemClick_ = function (e) {
  e.target.getAttribute('disabled') !== null ? e.stopPropagation() : (this.closing_ = !0, window.setTimeout((e) => {
    this.hide(), this.closing_ = !1;
  }, this.Constant_.CLOSE_TIMEOUT));
}, MaterialMenu.prototype.applyClip_ = function (e, t) {
  this.element_.style.clip = this.element_.classList.contains(this.CssClasses_.UNALIGNED) ? null : this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT) ? `rect(0 ${t}px 0 ${t}px)` : this.element_.classList.contains(this.CssClasses_.TOP_LEFT) ? `rect(${e}px 0 ${e}px 0)` : this.element_.classList.contains(this.CssClasses_.TOP_RIGHT) ? `rect(${e}px ${t}px ${e}px ${t}px)` : null;
}, MaterialMenu.prototype.addAnimationEndListener_ = function () {
  var e = function () {
    this.element_.removeEventListener('transitionend', e), this.element_.removeEventListener('webkitTransitionEnd', e), this.element_.classList.remove(this.CssClasses_.IS_ANIMATING);
  }.bind(this);
  this.element_.addEventListener('transitionend', e), this.element_.addEventListener('webkitTransitionEnd', e);
}, MaterialMenu.prototype.show = function (e) {
  if (this.element_ && this.container_ && this.outline_) {
    const t = this.element_.getBoundingClientRect().height;
    const s = this.element_.getBoundingClientRect().width;
    this.container_.style.width = `${s}px`, this.container_.style.height = `${t}px`, this.outline_.style.width = `${s}px`, this.outline_.style.height = `${t}px`;
    for (let i = this.Constant_.TRANSITION_DURATION_SECONDS * this.Constant_.TRANSITION_DURATION_FRACTION, n = this.element_.querySelectorAll(`.${this.CssClasses_.ITEM}`), a = 0; a < n.length; a++) {
      let l = null;
      l = this.element_.classList.contains(this.CssClasses_.TOP_LEFT) || this.element_.classList.contains(this.CssClasses_.TOP_RIGHT) ? `${(t - n[a].offsetTop - n[a].offsetHeight) / t * i}s` : `${n[a].offsetTop / t * i}s`, n[a].style.transitionDelay = l;
    }
    this.applyClip_(t, s), window.requestAnimationFrame(() => {
      this.element_.classList.add(this.CssClasses_.IS_ANIMATING), this.element_.style.clip = `rect(0 ${s}px ${t}px 0)`, this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
    }), this.addAnimationEndListener_();
    var r = function (t) {
      t === e || this.closing_ || (document.removeEventListener('click', r), this.hide());
    }.bind(this);
    document.addEventListener('click', r);
  }
}, MaterialMenu.prototype.hide = function () {
  if (this.element_ && this.container_ && this.outline_) {
    for (let e = this.element_.querySelectorAll(`.${this.CssClasses_.ITEM}`), t = 0; t < e.length; t++) e[t].style.transitionDelay = null;
    const s = this.element_.getBoundingClientRect().height;
    const i = this.element_.getBoundingClientRect().width;
    this.element_.classList.add(this.CssClasses_.IS_ANIMATING), this.applyClip_(s, i), this.container_.classList.remove(this.CssClasses_.IS_VISIBLE), this.addAnimationEndListener_();
  }
}, MaterialMenu.prototype.toggle = function (e) {
  this.container_.classList.contains(this.CssClasses_.IS_VISIBLE) ? this.hide() : this.show(e);
}, componentHandler.register({
  constructor: MaterialMenu,
  classAsString: 'MaterialMenu',
  cssClass: 'mdl-js-menu',
  widget: !0,
}), MaterialProgress.prototype.Constant_ = {}, MaterialProgress.prototype.CssClasses_ = {
  INDETERMINATE_CLASS: 'mdl-progress__indeterminate',
}, MaterialProgress.prototype.setProgress = function (e) {
  this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS) || (this.progressbar_.style.width = `${e}%`);
}, MaterialProgress.prototype.setBuffer = function (e) {
  this.bufferbar_.style.width = `${e}%`, this.auxbar_.style.width = `${100 - e}%`;
}, MaterialProgress.prototype.init = function () {
  if (this.element_) {
    let e = document.createElement('div');
    e.className = 'progressbar bar bar1', this.element_.appendChild(e), this.progressbar_ = e, e = document.createElement('div'), e.className = 'bufferbar bar bar2', this.element_.appendChild(e), this.bufferbar_ = e, e = document.createElement('div'), e.className = 'auxbar bar bar3', this.element_.appendChild(e), this.auxbar_ = e, this.progressbar_.style.width = '0%', this.bufferbar_.style.width = '100%', this.auxbar_.style.width = '0%', this.element_.classList.add('is-upgraded');
  }
}, MaterialProgress.prototype.mdlDowngrade_ = function () {
  for (; this.element_.firstChild;) this.element_.removeChild(this.element_.firstChild);
}, componentHandler.register({
  constructor: MaterialProgress,
  classAsString: 'MaterialProgress',
  cssClass: 'mdl-js-progress',
  widget: !0,
}), MaterialRadio.prototype.Constant_ = {
  TINY_TIMEOUT: 0.001,
}, MaterialRadio.prototype.CssClasses_ = {
  IS_FOCUSED: 'is-focused',
  IS_DISABLED: 'is-disabled',
  IS_CHECKED: 'is-checked',
  IS_UPGRADED: 'is-upgraded',
  JS_RADIO: 'mdl-js-radio',
  RADIO_BTN: 'mdl-radio__button',
  RADIO_OUTER_CIRCLE: 'mdl-radio__outer-circle',
  RADIO_INNER_CIRCLE: 'mdl-radio__inner-circle',
  RIPPLE_EFFECT: 'mdl-js-ripple-effect',
  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
  RIPPLE_CONTAINER: 'mdl-radio__ripple-container',
  RIPPLE_CENTER: 'mdl-ripple--center',
  RIPPLE: 'mdl-ripple',
}, MaterialRadio.prototype.onChange_ = function (e) {
  for (let t = document.getElementsByClassName(this.CssClasses_.JS_RADIO), s = 0; s < t.length; s++) {
    const i = t[s].querySelector(`.${this.CssClasses_.RADIO_BTN}`);
    i.getAttribute('name') === this.btnElement_.getAttribute('name') && t[s].MaterialRadio.updateClasses_();
  }
}, MaterialRadio.prototype.onFocus_ = function (e) {
  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
}, MaterialRadio.prototype.onBlur_ = function (e) {
  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
}, MaterialRadio.prototype.onMouseup_ = function (e) {
  this.blur_();
}, MaterialRadio.prototype.updateClasses_ = function () {
  this.checkDisabled(), this.checkToggleState();
}, MaterialRadio.prototype.blur_ = function (e) {
  window.setTimeout(() => {
    this.btnElement_.blur();
  }, this.Constant_.TINY_TIMEOUT);
}, MaterialRadio.prototype.checkDisabled = function () {
  this.btnElement_.disabled ? this.element_.classList.add(this.CssClasses_.IS_DISABLED) : this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
}, MaterialRadio.prototype.checkToggleState = function () {
  this.btnElement_.checked ? this.element_.classList.add(this.CssClasses_.IS_CHECKED) : this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
}, MaterialRadio.prototype.disable = function () {
  this.btnElement_.disabled = !0, this.updateClasses_();
}, MaterialRadio.prototype.enable = function () {
  this.btnElement_.disabled = !1, this.updateClasses_();
}, MaterialRadio.prototype.check = function () {
  this.btnElement_.checked = !0, this.updateClasses_();
}, MaterialRadio.prototype.uncheck = function () {
  this.btnElement_.checked = !1, this.updateClasses_();
}, MaterialRadio.prototype.init = function () {
  if (this.element_) {
    this.btnElement_ = this.element_.querySelector(`.${this.CssClasses_.RADIO_BTN}`);
    const e = document.createElement('span');
    e.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);
    const t = document.createElement('span');
    t.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE), this.element_.appendChild(e), this.element_.appendChild(t);
    let s;
    if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
      this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS), s = document.createElement('span'), s.classList.add(this.CssClasses_.RIPPLE_CONTAINER), s.classList.add(this.CssClasses_.RIPPLE_EFFECT), s.classList.add(this.CssClasses_.RIPPLE_CENTER), s.addEventListener('mouseup', this.onMouseup_.bind(this));
      const i = document.createElement('span');
      i.classList.add(this.CssClasses_.RIPPLE), s.appendChild(i), this.element_.appendChild(s);
    }
    this.btnElement_.addEventListener('change', this.onChange_.bind(this)), this.btnElement_.addEventListener('focus', this.onFocus_.bind(this)), this.btnElement_.addEventListener('blur', this.onBlur_.bind(this)), this.element_.addEventListener('mouseup', this.onMouseup_.bind(this)), this.updateClasses_(), this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
  }
}, componentHandler.register({
  constructor: MaterialRadio,
  classAsString: 'MaterialRadio',
  cssClass: 'mdl-js-radio',
  widget: !0,
}), MaterialSlider.prototype.Constant_ = {}, MaterialSlider.prototype.CssClasses_ = {
  IE_CONTAINER: 'mdl-slider__ie-container',
  SLIDER_CONTAINER: 'mdl-slider__container',
  BACKGROUND_FLEX: 'mdl-slider__background-flex',
  BACKGROUND_LOWER: 'mdl-slider__background-lower',
  BACKGROUND_UPPER: 'mdl-slider__background-upper',
  IS_LOWEST_VALUE: 'is-lowest-value',
  IS_UPGRADED: 'is-upgraded',
}, MaterialSlider.prototype.onInput_ = function (e) {
  this.updateValueStyles_();
}, MaterialSlider.prototype.onChange_ = function (e) {
  this.updateValueStyles_();
}, MaterialSlider.prototype.onMouseUp_ = function (e) {
  e.target.blur();
}, MaterialSlider.prototype.onContainerMouseDown_ = function (e) {
  if (e.target === this.element_.parentElement) {
    e.preventDefault();
    const t = new MouseEvent('mousedown', {
      target: e.target,
      buttons: e.buttons,
      clientX: e.clientX,
      clientY: this.element_.getBoundingClientRect().y,
    });
    this.element_.dispatchEvent(t);
  }
}, MaterialSlider.prototype.updateValueStyles_ = function (e) {
  const t = (this.element_.value - this.element_.min) / (this.element_.max - this.element_.min);
  t === 0 ? this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE) : this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE), this.isIE_ || (this.backgroundLower_.style.flex = t, this.backgroundLower_.style.webkitFlex = t, this.backgroundUpper_.style.flex = 1 - t, this.backgroundUpper_.style.webkitFlex = 1 - t);
}, MaterialSlider.prototype.disable = function () {
  this.element_.disabled = !0;
}, MaterialSlider.prototype.enable = function () {
  this.element_.disabled = !1;
}, MaterialSlider.prototype.change = function (e) {
  e && (this.element_.value = e), this.updateValueStyles_();
}, MaterialSlider.prototype.init = function () {
  if (this.element_) {
    if (this.isIE_) {
      const e = document.createElement('div');
      e.classList.add(this.CssClasses_.IE_CONTAINER), this.element_.parentElement.insertBefore(e, this.element_), this.element_.parentElement.removeChild(this.element_), e.appendChild(this.element_);
    } else {
      const t = document.createElement('div');
      t.classList.add(this.CssClasses_.SLIDER_CONTAINER), this.element_.parentElement.insertBefore(t, this.element_), this.element_.parentElement.removeChild(this.element_), t.appendChild(this.element_);
      const s = document.createElement('div');
      s.classList.add(this.CssClasses_.BACKGROUND_FLEX), t.appendChild(s), this.backgroundLower_ = document.createElement('div'), this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER), s.appendChild(this.backgroundLower_), this.backgroundUpper_ = document.createElement('div'), this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER), s.appendChild(this.backgroundUpper_);
    }
    this.boundInputHandler = this.onInput_.bind(this), this.boundChangeHandler = this.onChange_.bind(this), this.boundMouseUpHandler = this.onMouseUp_.bind(this), this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this),
    this.element_.addEventListener('input', this.boundInputHandler), this.element_.addEventListener('change', this.boundChangeHandler), this.element_.addEventListener('mouseup', this.boundMouseUpHandler), this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler), this.updateValueStyles_(), this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
  }
}, MaterialSlider.prototype.mdlDowngrade_ = function () {
  this.element_.removeEventListener('input', this.boundInputHandler), this.element_.removeEventListener('change', this.boundChangeHandler), this.element_.removeEventListener('mouseup', this.boundMouseUpHandler), this.element_.parentElement.removeEventListener('mousedown', this.boundContainerMouseDownHandler);
}, componentHandler.register({
  constructor: MaterialSlider,
  classAsString: 'MaterialSlider',
  cssClass: 'mdl-js-slider',
  widget: !0,
}), MaterialSpinner.prototype.Constant_ = {
  MDL_SPINNER_LAYER_COUNT: 4,
}, MaterialSpinner.prototype.CssClasses_ = {
  MDL_SPINNER_LAYER: 'mdl-spinner__layer',
  MDL_SPINNER_CIRCLE_CLIPPER: 'mdl-spinner__circle-clipper',
  MDL_SPINNER_CIRCLE: 'mdl-spinner__circle',
  MDL_SPINNER_GAP_PATCH: 'mdl-spinner__gap-patch',
  MDL_SPINNER_LEFT: 'mdl-spinner__left',
  MDL_SPINNER_RIGHT: 'mdl-spinner__right',
}, MaterialSpinner.prototype.createLayer = function (e) {
  const t = document.createElement('div');
  t.classList.add(this.CssClasses_.MDL_SPINNER_LAYER), t.classList.add(`${this.CssClasses_.MDL_SPINNER_LAYER}-${e}`);
  const s = document.createElement('div');
  s.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER), s.classList.add(this.CssClasses_.MDL_SPINNER_LEFT);
  const i = document.createElement('div');
  i.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH);
  const n = document.createElement('div');
  n.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER), n.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT);
  for (let a = [s, i, n], l = 0; l < a.length; l++) {
    const r = document.createElement('div');
    r.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE), a[l].appendChild(r);
  }
  t.appendChild(s), t.appendChild(i), t.appendChild(n), this.element_.appendChild(t);
}, MaterialSpinner.prototype.stop = function () {
  this.element_.classList.remove('is-active');
}, MaterialSpinner.prototype.start = function () {
  this.element_.classList.add('is-active');
}, MaterialSpinner.prototype.init = function () {
  if (this.element_) {
    for (let e = 1; e <= this.Constant_.MDL_SPINNER_LAYER_COUNT; e++) this.createLayer(e);
    this.element_.classList.add('is-upgraded');
  }
}, componentHandler.register({
  constructor: MaterialSpinner,
  classAsString: 'MaterialSpinner',
  cssClass: 'mdl-js-spinner',
  widget: !0,
}), MaterialSwitch.prototype.Constant_ = {
  TINY_TIMEOUT: 0.001,
}, MaterialSwitch.prototype.CssClasses_ = {
  INPUT: 'mdl-switch__input',
  TRACK: 'mdl-switch__track',
  THUMB: 'mdl-switch__thumb',
  FOCUS_HELPER: 'mdl-switch__focus-helper',
  RIPPLE_EFFECT: 'mdl-js-ripple-effect',
  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
  RIPPLE_CONTAINER: 'mdl-switch__ripple-container',
  RIPPLE_CENTER: 'mdl-ripple--center',
  RIPPLE: 'mdl-ripple',
  IS_FOCUSED: 'is-focused',
  IS_DISABLED: 'is-disabled',
  IS_CHECKED: 'is-checked',
}, MaterialSwitch.prototype.onChange_ = function (e) {
  this.updateClasses_();
}, MaterialSwitch.prototype.onFocus_ = function (e) {
  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
}, MaterialSwitch.prototype.onBlur_ = function (e) {
  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
}, MaterialSwitch.prototype.onMouseUp_ = function (e) {
  this.blur_();
}, MaterialSwitch.prototype.updateClasses_ = function () {
  this.checkDisabled(), this.checkToggleState();
}, MaterialSwitch.prototype.blur_ = function (e) {
  window.setTimeout(() => {
    this.inputElement_.blur();
  }, this.Constant_.TINY_TIMEOUT);
}, MaterialSwitch.prototype.checkDisabled = function () {
  this.inputElement_.disabled ? this.element_.classList.add(this.CssClasses_.IS_DISABLED) : this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
}, MaterialSwitch.prototype.checkToggleState = function () {
  this.inputElement_.checked ? this.element_.classList.add(this.CssClasses_.IS_CHECKED) : this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
}, MaterialSwitch.prototype.disable = function () {
  this.inputElement_.disabled = !0, this.updateClasses_();
}, MaterialSwitch.prototype.enable = function () {
  this.inputElement_.disabled = !1, this.updateClasses_();
}, MaterialSwitch.prototype.on = function () {
  this.inputElement_.checked = !0, this.updateClasses_();
}, MaterialSwitch.prototype.off = function () {
  this.inputElement_.checked = !1, this.updateClasses_();
}, MaterialSwitch.prototype.init = function () {
  if (this.element_) {
    this.inputElement_ = this.element_.querySelector(`.${this.CssClasses_.INPUT}`);
    const e = document.createElement('div');
    e.classList.add(this.CssClasses_.TRACK);
    const t = document.createElement('div');
    t.classList.add(this.CssClasses_.THUMB);
    const s = document.createElement('span');
    if (s.classList.add(this.CssClasses_.FOCUS_HELPER), t.appendChild(s), this.element_.appendChild(e), this.element_.appendChild(t), this.boundMouseUpHandler = this.onMouseUp_.bind(this), this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
      this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS), this.rippleContainerElement_ = document.createElement('span'), this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER), this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT), this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER), this.rippleContainerElement_.addEventListener('mouseup', this.boundMouseUpHandler);
      const i = document.createElement('span');
      i.classList.add(this.CssClasses_.RIPPLE), this.rippleContainerElement_.appendChild(i), this.element_.appendChild(this.rippleContainerElement_);
    }
    this.boundChangeHandler = this.onChange_.bind(this), this.boundFocusHandler = this.onFocus_.bind(this), this.boundBlurHandler = this.onBlur_.bind(this), this.inputElement_.addEventListener('change', this.boundChangeHandler), this.inputElement_.addEventListener('focus', this.boundFocusHandler), this.inputElement_.addEventListener('blur', this.boundBlurHandler), this.element_.addEventListener('mouseup', this.boundMouseUpHandler), this.updateClasses_(), this.element_.classList.add('is-upgraded');
  }
}, MaterialSwitch.prototype.mdlDowngrade_ = function () {
  this.rippleContainerElement_ && this.rippleContainerElement_.removeEventListener('mouseup', this.boundMouseUpHandler), this.inputElement_.removeEventListener('change', this.boundChangeHandler), this.inputElement_.removeEventListener('focus', this.boundFocusHandler), this.inputElement_.removeEventListener('blur', this.boundBlurHandler), this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
}, componentHandler.register({
  constructor: MaterialSwitch,
  classAsString: 'MaterialSwitch',
  cssClass: 'mdl-js-switch',
  widget: !0,
}), MaterialTabs.prototype.Constant_ = {}, MaterialTabs.prototype.CssClasses_ = {
  TAB_CLASS: 'mdl-tabs__tab',
  PANEL_CLASS: 'mdl-tabs__panel',
  ACTIVE_CLASS: 'is-active',
  UPGRADED_CLASS: 'is-upgraded',
  MDL_JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
  MDL_RIPPLE_CONTAINER: 'mdl-tabs__ripple-container',
  MDL_RIPPLE: 'mdl-ripple',
  MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
}, MaterialTabs.prototype.initTabs_ = function (e) {
  this.element_.classList.contains(this.CssClasses_.MDL_JS_RIPPLE_EFFECT) && this.element_.classList.add(this.CssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS), this.tabs_ = this.element_.querySelectorAll(`.${this.CssClasses_.TAB_CLASS}`), this.panels_ = this.element_.querySelectorAll(`.${this.CssClasses_.PANEL_CLASS}`);
  for (let t = 0; t < this.tabs_.length; t++) new MaterialTab(this.tabs_[t], this);
  this.element_.classList.add(this.CssClasses_.UPGRADED_CLASS);
}, MaterialTabs.prototype.resetTabState_ = function () {
  for (let e = 0; e < this.tabs_.length; e++) this.tabs_[e].classList.remove(this.CssClasses_.ACTIVE_CLASS);
}, MaterialTabs.prototype.resetPanelState_ = function () {
  for (let e = 0; e < this.panels_.length; e++) this.panels_[e].classList.remove(this.CssClasses_.ACTIVE_CLASS);
}, MaterialTabs.prototype.init = function () {
  this.element_ && this.initTabs_();
}, componentHandler.register({
  constructor: MaterialTabs,
  classAsString: 'MaterialTabs',
  cssClass: 'mdl-js-tabs',
}), MaterialTextfield.prototype.Constant_ = {
  NO_MAX_ROWS: -1,
  MAX_ROWS_ATTRIBUTE: 'maxrows',
}, MaterialTextfield.prototype.CssClasses_ = {
  LABEL: 'mdl-textfield__label',
  INPUT: 'mdl-textfield__input',
  IS_DIRTY: 'is-dirty',
  IS_FOCUSED: 'is-focused',
  IS_DISABLED: 'is-disabled',
  IS_INVALID: 'is-invalid',
  IS_UPGRADED: 'is-upgraded',
}, MaterialTextfield.prototype.onKeyDown_ = function (e) {
  const t = e.target.value.split('\n').length;
  e.keyCode === 13 && t >= this.maxRows && e.preventDefault();
}, MaterialTextfield.prototype.onFocus_ = function (e) {
  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
}, MaterialTextfield.prototype.onBlur_ = function (e) {
  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
}, MaterialTextfield.prototype.updateClasses_ = function () {
  this.checkDisabled(), this.checkValidity(), this.checkDirty();
}, MaterialTextfield.prototype.checkDisabled = function () {
  this.input_.disabled ? this.element_.classList.add(this.CssClasses_.IS_DISABLED) : this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
}, MaterialTextfield.prototype.checkValidity = function () {
  this.input_.validity.valid ? this.element_.classList.remove(this.CssClasses_.IS_INVALID) : this.element_.classList.add(this.CssClasses_.IS_INVALID);
}, MaterialTextfield.prototype.checkDirty = function () {
  this.input_.value && this.input_.value.length > 0 ? this.element_.classList.add(this.CssClasses_.IS_DIRTY) : this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
}, MaterialTextfield.prototype.disable = function () {
  this.input_.disabled = !0, this.updateClasses_();
}, MaterialTextfield.prototype.enable = function () {
  this.input_.disabled = !1, this.updateClasses_();
}, MaterialTextfield.prototype.change = function (e) {
  e && (this.input_.value = e), this.updateClasses_();
}, MaterialTextfield.prototype.init = function () {
  this.element_ && (this.label_ = this.element_.querySelector(`.${this.CssClasses_.LABEL}`), this.input_ = this.element_.querySelector(`.${this.CssClasses_.INPUT}`), this.input_ && (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE) && (this.maxRows = parseInt(this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE), 10), isNaN(this.maxRows) && (this.maxRows = this.Constant_.NO_MAX_ROWS)), this.boundUpdateClassesHandler = this.updateClasses_.bind(this), this.boundFocusHandler = this.onFocus_.bind(this), this.boundBlurHandler = this.onBlur_.bind(this), this.input_.addEventListener('input', this.boundUpdateClassesHandler), this.input_.addEventListener('focus', this.boundFocusHandler), this.input_.addEventListener('blur', this.boundBlurHandler), this.maxRows !== this.Constant_.NO_MAX_ROWS && (this.boundKeyDownHandler = this.onKeyDown_.bind(this), this.input_.addEventListener('keydown', this.boundKeyDownHandler)), this.updateClasses_(), this.element_.classList.add(this.CssClasses_.IS_UPGRADED)));
}, MaterialTextfield.prototype.mdlDowngrade_ = function () {
  this.input_.removeEventListener('input', this.boundUpdateClassesHandler), this.input_.removeEventListener('focus', this.boundFocusHandler), this.input_.removeEventListener('blur', this.boundBlurHandler), this.boundKeyDownHandler && this.input_.removeEventListener('keydown', this.boundKeyDownHandler);
}, componentHandler.register({
  constructor: MaterialTextfield,
  classAsString: 'MaterialTextfield',
  cssClass: 'mdl-js-textfield',
  widget: !0,
}), MaterialTooltip.prototype.Constant_ = {}, MaterialTooltip.prototype.CssClasses_ = {
  IS_ACTIVE: 'is-active',
}, MaterialTooltip.prototype.handleMouseEnter_ = function (e) {
  e.stopPropagation();
  const t = e.target.getBoundingClientRect();
  const s = t.left + t.width / 2;
  const i = -1 * (this.element_.offsetWidth / 2);
  s + i < 0 ? (this.element_.style.left = 0, this.element_.style.marginLeft = 0) : (this.element_.style.left = `${s}px`, this.element_.style.marginLeft = `${i}px`), this.element_.style.top = `${t.top + t.height + 10}px`, this.element_.classList.add(this.CssClasses_.IS_ACTIVE), window.addEventListener('scroll', this.boundMouseLeaveHandler, !1), window.addEventListener('touchmove', this.boundMouseLeaveHandler, !1);
}, MaterialTooltip.prototype.handleMouseLeave_ = function (e) {
  e.stopPropagation(), this.element_.classList.remove(this.CssClasses_.IS_ACTIVE), window.removeEventListener('scroll', this.boundMouseLeaveHandler), window.removeEventListener('touchmove', this.boundMouseLeaveHandler, !1);
}, MaterialTooltip.prototype.init = function () {
  if (this.element_) {
    const e = this.element_.getAttribute('for');
    e && (this.forElement_ = document.getElementById(e)), this.forElement_ && (this.forElement_.getAttribute('tabindex') || this.forElement_.setAttribute('tabindex', '0'), this.boundMouseEnterHandler = this.handleMouseEnter_.bind(this), this.boundMouseLeaveHandler = this.handleMouseLeave_.bind(this), this.forElement_.addEventListener('mouseenter', this.boundMouseEnterHandler, !1), this.forElement_.addEventListener('click', this.boundMouseEnterHandler, !1), this.forElement_.addEventListener('blur', this.boundMouseLeaveHandler), this.forElement_.addEventListener('touchstart', this.boundMouseEnterHandler, !1), this.forElement_.addEventListener('mouseleave', this.boundMouseLeaveHandler));
  }
}, MaterialTooltip.prototype.mdlDowngrade_ = function () {
  this.forElement_ && (this.forElement_.removeEventListener('mouseenter', this.boundMouseEnterHandler, !1), this.forElement_.removeEventListener('click', this.boundMouseEnterHandler, !1), this.forElement_.removeEventListener('touchstart', this.boundMouseEnterHandler, !1), this.forElement_.removeEventListener('mouseleave', this.boundMouseLeaveHandler));
}, componentHandler.register({
  constructor: MaterialTooltip,
  classAsString: 'MaterialTooltip',
  cssClass: 'mdl-tooltip',
}), MaterialLayout.prototype.Constant_ = {
  MAX_WIDTH: '(max-width: 1024px)',
  TAB_SCROLL_PIXELS: 100,
  MENU_ICON: 'menu',
  CHEVRON_LEFT: 'chevron_left',
  CHEVRON_RIGHT: 'chevron_right',
}, MaterialLayout.prototype.Mode_ = {
  STANDARD: 0,
  SEAMED: 1,
  WATERFALL: 2,
  SCROLL: 3,
}, MaterialLayout.prototype.CssClasses_ = {
  CONTAINER: 'mdl-layout__container',
  HEADER: 'mdl-layout__header',
  DRAWER: 'mdl-layout__drawer',
  CONTENT: 'mdl-layout__content',
  DRAWER_BTN: 'mdl-layout__drawer-button',
  ICON: 'material-icons',
  JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
  RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
  RIPPLE: 'mdl-ripple',
  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
  HEADER_SEAMED: 'mdl-layout__header--seamed',
  HEADER_WATERFALL: 'mdl-layout__header--waterfall',
  HEADER_SCROLL: 'mdl-layout__header--scroll',
  FIXED_HEADER: 'mdl-layout--fixed-header',
  OBFUSCATOR: 'mdl-layout__obfuscator',
  TAB_BAR: 'mdl-layout__tab-bar',
  TAB_CONTAINER: 'mdl-layout__tab-bar-container',
  TAB: 'mdl-layout__tab',
  TAB_BAR_BUTTON: 'mdl-layout__tab-bar-button',
  TAB_BAR_LEFT_BUTTON: 'mdl-layout__tab-bar-left-button',
  TAB_BAR_RIGHT_BUTTON: 'mdl-layout__tab-bar-right-button',
  PANEL: 'mdl-layout__tab-panel',
  HAS_DRAWER: 'has-drawer',
  HAS_TABS: 'has-tabs',
  HAS_SCROLLING_HEADER: 'has-scrolling-header',
  CASTING_SHADOW: 'is-casting-shadow',
  IS_COMPACT: 'is-compact',
  IS_SMALL_SCREEN: 'is-small-screen',
  IS_DRAWER_OPEN: 'is-visible',
  IS_ACTIVE: 'is-active',
  IS_UPGRADED: 'is-upgraded',
  IS_ANIMATING: 'is-animating',
  ON_LARGE_SCREEN: 'mdl-layout--large-screen-only',
  ON_SMALL_SCREEN: 'mdl-layout--small-screen-only',
}, MaterialLayout.prototype.contentScrollHandler_ = function () {
  this.header_.classList.contains(this.CssClasses_.IS_ANIMATING) || (this.content_.scrollTop > 0 && !this.header_.classList.contains(this.CssClasses_.IS_COMPACT) ? (this.header_.classList.add(this.CssClasses_.CASTING_SHADOW), this.header_.classList.add(this.CssClasses_.IS_COMPACT), this.header_.classList.add(this.CssClasses_.IS_ANIMATING)) : this.content_.scrollTop <= 0 && this.header_.classList.contains(this.CssClasses_.IS_COMPACT) && (this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW), this.header_.classList.remove(this.CssClasses_.IS_COMPACT), this.header_.classList.add(this.CssClasses_.IS_ANIMATING)));
}, MaterialLayout.prototype.screenSizeHandler_ = function () {
  this.screenSizeMediaQuery_.matches ? this.element_.classList.add(this.CssClasses_.IS_SMALL_SCREEN) : (this.element_.classList.remove(this.CssClasses_.IS_SMALL_SCREEN), this.drawer_ && this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN));
}, MaterialLayout.prototype.drawerToggleHandler_ = function () {
  this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
}, MaterialLayout.prototype.headerTransitionEndHandler = function () {
  this.header_.classList.remove(this.CssClasses_.IS_ANIMATING);
}, MaterialLayout.prototype.headerClickHandler = function () {
  this.header_.classList.contains(this.CssClasses_.IS_COMPACT) && (this.header_.classList.remove(this.CssClasses_.IS_COMPACT), this.header_.classList.add(this.CssClasses_.IS_ANIMATING));
}, MaterialLayout.prototype.resetTabState_ = function (e) {
  for (let t = 0; t < e.length; t++) e[t].classList.remove(this.CssClasses_.IS_ACTIVE);
}, MaterialLayout.prototype.resetPanelState_ = function (e) {
  for (let t = 0; t < e.length; t++) e[t].classList.remove(this.CssClasses_.IS_ACTIVE);
}, MaterialLayout.prototype.init = function () {
  if (this.element_) {
    const e = document.createElement('div');
    e.classList.add(this.CssClasses_.CONTAINER), this.element_.parentElement.insertBefore(e, this.element_), this.element_.parentElement.removeChild(this.element_), e.appendChild(this.element_);
    for (let t = this.element_.childNodes, s = 0; s < t.length; s++) {
      const i = t[s];
      i.classList && i.classList.contains(this.CssClasses_.HEADER) && (this.header_ = i), i.classList && i.classList.contains(this.CssClasses_.DRAWER) && (this.drawer_ = i), i.classList && i.classList.contains(this.CssClasses_.CONTENT) && (this.content_ = i);
    }
    this.header_ && (this.tabBar_ = this.header_.querySelector(`.${this.CssClasses_.TAB_BAR}`));
    let n = this.Mode_.STANDARD;
    if (this.screenSizeMediaQuery_ = window.matchMedia(this.Constant_.MAX_WIDTH), this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this)), this.screenSizeHandler_(), this.header_ && (this.header_.classList.contains(this.CssClasses_.HEADER_SEAMED) ? n = this.Mode_.SEAMED : this.header_.classList.contains(this.CssClasses_.HEADER_WATERFALL) ? (n = this.Mode_.WATERFALL, this.header_.addEventListener('transitionend', this.headerTransitionEndHandler.bind(this)), this.header_.addEventListener('click', this.headerClickHandler.bind(this))) : this.header_.classList.contains(this.CssClasses_.HEADER_SCROLL) && (n = this.Mode_.SCROLL, e.classList.add(this.CssClasses_.HAS_SCROLLING_HEADER)), n === this.Mode_.STANDARD ? (this.header_.classList.add(this.CssClasses_.CASTING_SHADOW), this.tabBar_ && this.tabBar_.classList.add(this.CssClasses_.CASTING_SHADOW)) : n === this.Mode_.SEAMED || n === this.Mode_.SCROLL ? (this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW), this.tabBar_ && this.tabBar_.classList.remove(this.CssClasses_.CASTING_SHADOW)) : n === this.Mode_.WATERFALL && (this.content_.addEventListener('scroll', this.contentScrollHandler_.bind(this)), this.contentScrollHandler_())), this.drawer_) {
      const a = document.createElement('div');
      a.classList.add(this.CssClasses_.DRAWER_BTN), this.drawer_.classList.contains(this.CssClasses_.ON_LARGE_SCREEN) ? a.classList.add(this.CssClasses_.ON_LARGE_SCREEN) : this.drawer_.classList.contains(this.CssClasses_.ON_SMALL_SCREEN) && a.classList.add(this.CssClasses_.ON_SMALL_SCREEN);
      const l = document.createElement('i');
      l.classList.add(this.CssClasses_.ICON), l.textContent = this.Constant_.MENU_ICON, a.appendChild(l), a.addEventListener('click', this.drawerToggleHandler_.bind(this)), this.element_.classList.add(this.CssClasses_.HAS_DRAWER), this.element_.classList.contains(this.CssClasses_.FIXED_HEADER) ? this.header_.insertBefore(a, this.header_.firstChild) : this.element_.insertBefore(a, this.content_);
      const r = document.createElement('div');
      r.classList.add(this.CssClasses_.OBFUSCATOR), this.element_.appendChild(r), r.addEventListener('click', this.drawerToggleHandler_.bind(this));
    }
    if (this.header_ && this.tabBar_) {
      this.element_.classList.add(this.CssClasses_.HAS_TABS);
      const o = document.createElement('div');
      o.classList.add(this.CssClasses_.TAB_CONTAINER), this.header_.insertBefore(o, this.tabBar_), this.header_.removeChild(this.tabBar_);
      const d = document.createElement('div');
      d.classList.add(this.CssClasses_.TAB_BAR_BUTTON), d.classList.add(this.CssClasses_.TAB_BAR_LEFT_BUTTON);
      const _ = document.createElement('i');
      _.classList.add(this.CssClasses_.ICON), _.textContent = this.Constant_.CHEVRON_LEFT, d.appendChild(_), d.addEventListener('click', () => {
        this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
      });
      const h = document.createElement('div');
      h.classList.add(this.CssClasses_.TAB_BAR_BUTTON), h.classList.add(this.CssClasses_.TAB_BAR_RIGHT_BUTTON);
      const c = document.createElement('i');
      c.classList.add(this.CssClasses_.ICON), c.textContent = this.Constant_.CHEVRON_RIGHT, h.appendChild(c), h.addEventListener('click', () => {
        this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
      }), o.appendChild(d), o.appendChild(this.tabBar_), o.appendChild(h);
      const u = function () {
        this.tabBar_.scrollLeft > 0 ? d.classList.add(this.CssClasses_.IS_ACTIVE) : d.classList.remove(this.CssClasses_.IS_ACTIVE), this.tabBar_.scrollLeft < this.tabBar_.scrollWidth - this.tabBar_.offsetWidth ? h.classList.add(this.CssClasses_.IS_ACTIVE) : h.classList.remove(this.CssClasses_.IS_ACTIVE);
      }.bind(this);
      this.tabBar_.addEventListener('scroll', u), u(), this.tabBar_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT) && this.tabBar_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
      for (let p = this.tabBar_.querySelectorAll(`.${this.CssClasses_.TAB}`), C = this.content_.querySelectorAll(`.${this.CssClasses_.PANEL}`), E = 0; E < p.length; E++) new MaterialLayoutTab(p[E], p, C, this);
    }
    this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
  }
}, componentHandler.register({
  constructor: MaterialLayout,
  classAsString: 'MaterialLayout',
  cssClass: 'mdl-js-layout',
}), MaterialDataTable.prototype.Constant_ = {}, MaterialDataTable.prototype.CssClasses_ = {
  DATA_TABLE: 'mdl-data-table',
  SELECTABLE: 'mdl-data-table--selectable',
  IS_SELECTED: 'is-selected',
  IS_UPGRADED: 'is-upgraded',
}, MaterialDataTable.prototype.selectRow_ = function (e, t, s) {
  return t ? function () {
    e.checked ? t.classList.add(this.CssClasses_.IS_SELECTED) : t.classList.remove(this.CssClasses_.IS_SELECTED);
  }.bind(this) : s ? function () {
    let t; let
      i;
    if (e.checked) { for (t = 0; t < s.length; t++) i = s[t].querySelector('td').querySelector('.mdl-checkbox'), i.MaterialCheckbox.check(), s[t].classList.add(this.CssClasses_.IS_SELECTED); } else { for (t = 0; t < s.length; t++) i = s[t].querySelector('td').querySelector('.mdl-checkbox'), i.MaterialCheckbox.uncheck(), s[t].classList.remove(this.CssClasses_.IS_SELECTED); }
  }.bind(this) : void 0;
}, MaterialDataTable.prototype.createCheckbox_ = function (e, t) {
  const s = document.createElement('label');
  s.classList.add('mdl-checkbox'), s.classList.add('mdl-js-checkbox'), s.classList.add('mdl-js-ripple-effect'), s.classList.add('mdl-data-table__select');
  const i = document.createElement('input');
  return i.type = 'checkbox', i.classList.add('mdl-checkbox__input'), e ? i.addEventListener('change', this.selectRow_(i, e)) : t && i.addEventListener('change', this.selectRow_(i, null, t)), s.appendChild(i), componentHandler.upgradeElement(s, 'MaterialCheckbox'), s;
}, MaterialDataTable.prototype.init = function () {
  if (this.element_) {
    const e = this.element_.querySelector('th');
    const t = this.element_.querySelector('tbody').querySelectorAll('tr');
    if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
      const s = document.createElement('th');
      const i = this.createCheckbox_(null, t);
      s.appendChild(i), e.parentElement.insertBefore(s, e);
      for (let n = 0; n < t.length; n++) {
        const a = t[n].querySelector('td');
        if (a) {
          const l = document.createElement('td');
          const r = this.createCheckbox_(t[n]);
          l.appendChild(r), t[n].insertBefore(l, a);
        }
      }
    }
    this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
  }
}, componentHandler.register({
  constructor: MaterialDataTable,
  classAsString: 'MaterialDataTable',
  cssClass: 'mdl-js-data-table',
}), MaterialRipple.prototype.Constant_ = {
  INITIAL_SCALE: 'scale(0.0001, 0.0001)',
  INITIAL_SIZE: '1px',
  INITIAL_OPACITY: '0.4',
  FINAL_OPACITY: '0',
  FINAL_SCALE: '',
}, MaterialRipple.prototype.CssClasses_ = {
  RIPPLE_CENTER: 'mdl-ripple--center',
  RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
  RIPPLE: 'mdl-ripple',
  IS_ANIMATING: 'is-animating',
  IS_VISIBLE: 'is-visible',
}, MaterialRipple.prototype.downHandler_ = function (e) {
  if (!this.rippleElement_.style.width && !this.rippleElement_.style.height) {
    const t = this.element_.getBoundingClientRect();
    this.boundHeight = t.height, this.boundWidth = t.width, this.rippleSize_ = 2 * Math.sqrt(t.width * t.width + t.height * t.height) + 2, this.rippleElement_.style.width = `${this.rippleSize_}px`, this.rippleElement_.style.height = `${this.rippleSize_}px`;
  }
  if (this.rippleElement_.classList.add(this.CssClasses_.IS_VISIBLE), e.type === 'mousedown' && this.ignoringMouseDown_) this.ignoringMouseDown_ = !1;
  else {
    e.type === 'touchstart' && (this.ignoringMouseDown_ = !0);
    const s = this.getFrameCount();
    if (s > 0) return;
    this.setFrameCount(1);
    let i; let n; const
      a = e.currentTarget.getBoundingClientRect();
    if (e.clientX === 0 && e.clientY === 0) i = Math.round(a.width / 2), n = Math.round(a.height / 2);
    else {
      const l = e.clientX ? e.clientX : e.touches[0].clientX;
      const r = e.clientY ? e.clientY : e.touches[0].clientY;
      i = Math.round(l - a.left), n = Math.round(r - a.top);
    }
    this.setRippleXY(i, n), this.setRippleStyles(!0), window.requestAnimationFrame(this.animFrameHandler.bind(this));
  }
}, MaterialRipple.prototype.upHandler_ = function (e) {
  e && e.detail !== 2 && this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
}, MaterialRipple.prototype.init = function () {
  if (this.element_) {
    const e = this.element_.classList.contains(this.CssClasses_.RIPPLE_CENTER);
    this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT_IGNORE_EVENTS) || (this.rippleElement_ = this.element_.querySelector(`.${this.CssClasses_.RIPPLE}`), this.frameCount_ = 0, this.rippleSize_ = 0, this.x_ = 0, this.y_ = 0, this.ignoringMouseDown_ = !1, this.boundDownHandler = this.downHandler_.bind(this), this.element_.addEventListener('mousedown', this.boundDownHandler), this.element_.addEventListener('touchstart', this.boundDownHandler), this.boundUpHandler = this.upHandler_.bind(this), this.element_.addEventListener('mouseup', this.boundUpHandler), this.element_.addEventListener('mouseleave', this.boundUpHandler), this.element_.addEventListener('touchend', this.boundUpHandler), this.element_.addEventListener('blur', this.boundUpHandler), this.getFrameCount = function () {
      return this.frameCount_;
    }, this.setFrameCount = function (e) {
      this.frameCount_ = e;
    }, this.getRippleElement = function () {
      return this.rippleElement_;
    }, this.setRippleXY = function (e, t) {
      this.x_ = e, this.y_ = t;
    }, this.setRippleStyles = function (t) {
      if (this.rippleElement_ !== null) {
        let s; let i; let n; let
          a = `translate(${this.x_}px, ${this.y_}px)`;
        t ? (i = this.Constant_.INITIAL_SCALE, n = this.Constant_.INITIAL_SIZE) : (i = this.Constant_.FINAL_SCALE, n = `${this.rippleSize_}px`, e && (a = `translate(${this.boundWidth / 2}px, ${this.boundHeight / 2}px)`)), s = `translate(-50%, -50%) ${a}${i}`, this.rippleElement_.style.webkitTransform = s, this.rippleElement_.style.msTransform = s, this.rippleElement_.style.transform = s, t ? this.rippleElement_.classList.remove(this.CssClasses_.IS_ANIMATING) : this.rippleElement_.classList.add(this.CssClasses_.IS_ANIMATING);
      }
    }, this.animFrameHandler = function () {
      this.frameCount_-- > 0 ? window.requestAnimationFrame(this.animFrameHandler.bind(this)) : this.setRippleStyles(!1);
    });
  }
}, MaterialRipple.prototype.mdlDowngrade_ = function () {
  this.element_.removeEventListener('mousedown', this.boundDownHandler), this.element_.removeEventListener('touchstart', this.boundDownHandler), this.element_.removeEventListener('mouseup', this.boundUpHandler), this.element_.removeEventListener('mouseleave', this.boundUpHandler), this.element_.removeEventListener('touchend', this.boundUpHandler), this.element_.removeEventListener('blur', this.boundUpHandler);
}, componentHandler.register({
  constructor: MaterialRipple,
  classAsString: 'MaterialRipple',
  cssClass: 'mdl-js-ripple-effect',
  widget: !1,
});

//* *********************************
//* *********************************
//* *********************************   Bootstrap_js
//* *********************************
//* *********************************
if (typeof jQuery === 'undefined') throw new Error("Bootstrap's JavaScript requires jQuery"); +(function (a) {
  function b() {
    const a = document.createElement('bootstrap');
    const b = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend',
    };
    for (const c in b) {
      if (void 0 !== a.style[c]) {
        return {
          end: b[c],
        };
      }
    }
    return !1;
  }
  a.fn.emulateTransitionEnd = function (b) {
    let c = !1;
    const d = this;
    a(this).one('bsTransitionEnd', () => {
      c = !0;
    });
    const e = function () {
      c || a(d).trigger(a.support.transition.end);
    };
    return setTimeout(e, b), this;
  }, a(() => {
    a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {
      bindType: a.support.transition.end,
      delegateType: a.support.transition.end,
      handle(b) {
        return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0;
      },
    });
  });
}(jQuery)), +(function (a) {
  function b(b) {
    return this.each(function () {
      const c = a(this);
      let e = c.data('bs.alert');
      e || c.data('bs.alert', e = new d(this)), typeof b === 'string' && e[b].call(c);
    });
  }
  const c = '[data-dismiss="alert"]';
  var d = function (b) {
    a(b).on('click', c, this.close);
  };
  d.VERSION = '3.2.0', d.prototype.close = function (b) {
    function c() {
      f.detach().trigger('closed.bs.alert').remove();
    }
    const d = a(this);
    let e = d.attr('data-target');
    e || (e = d.attr('href'), e = e && e.replace(/.*(?=#[^\s]*$)/, ''));
    var f = a(e);
    b && b.preventDefault(), f.length || (f = d.hasClass('alert') ? d : d.parent()), f.trigger(b = a.Event('close.bs.alert')), b.isDefaultPrevented() || (f.removeClass('in'), a.support.transition && f.hasClass('fade') ? f.one('bsTransitionEnd', c).emulateTransitionEnd(150) : c());
  };
  const e = a.fn.alert;
  a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function () {
    return a.fn.alert = e, this;
  }, a(document).on('click.bs.alert.data-api', c, d.prototype.close);
}(jQuery)), +(function (a) {
  function b(b) {
    return this.each(function () {
      const d = a(this);
      let e = d.data('bs.button');
      const f = typeof b === 'object' && b;
      e || d.data('bs.button', e = new c(this, f)), b == 'toggle' ? e.toggle() : b && e.setState(b);
    });
  }
  var c = function (b, d) {
    this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1;
  };
  c.VERSION = '3.2.0', c.DEFAULTS = {
    loadingText: 'loading...',
  }, c.prototype.setState = function (b) {
    const c = 'disabled';
    const d = this.$element;
    const e = d.is('input') ? 'val' : 'html';
    const f = d.data();
    b += 'Text', f.resetText == null && d.data('resetText', d[e]()), d[e](f[b] == null ? this.options[b] : f[b]), setTimeout(a.proxy(function () {
      b == 'loadingText' ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c));
    }, this), 0);
  }, c.prototype.toggle = function () {
    let a = !0;
    const b = this.$element.closest('[data-toggle="buttons"]');
    if (b.length) {
      const c = this.$element.find('input');
      c.prop('type') == 'radio' && (c.prop('checked') && this.$element.hasClass('active') ? a = !1 : b.find('.active').removeClass('active')), a && c.prop('checked', !this.$element.hasClass('active')).trigger('change');
    }
    a && this.$element.toggleClass('active');
  };
  const d = a.fn.button;
  a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function () {
    return a.fn.button = d, this;
  }, a(document).on('click.bs.button.data-api', '[data-toggle^="button"]', (c) => {
    let d = a(c.target);
    d.hasClass('btn') || (d = d.closest('.btn')), b.call(d, 'toggle'), c.preventDefault();
  });
}(jQuery)), +(function (a) {
  function b(b) {
    return this.each(function () {
      const d = a(this);
      let e = d.data('bs.carousel');
      const f = a.extend({}, c.DEFAULTS, d.data(), typeof b === 'object' && b);
      const g = typeof b === 'string' ? b : f.slide;
      e || d.data('bs.carousel', e = new c(this, f)), typeof b === 'number' ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle();
    });
  }
  var c = function (b, c) {
    this.$element = a(b).on('keydown.bs.carousel', a.proxy(this.keydown, this)), this.$indicators = this.$element.find('.carousel-indicators'), this.options = c, this.paused = this.sliding = this.interval = this.$active = this.$items = null, this.options.pause == 'hover' && this.$element.on('mouseenter.bs.carousel', a.proxy(this.pause, this)).on('mouseleave.bs.carousel', a.proxy(this.cycle, this));
  };
  c.VERSION = '3.2.0', c.DEFAULTS = {
    interval: 5e3,
    pause: 'hover',
    wrap: !0,
  }, c.prototype.keydown = function (a) {
    switch (a.which) {
      case 37:
        this.prev();
        break;
      case 39:
        this.next();
        break;
      default:
        return;
    }
    a.preventDefault();
  }, c.prototype.cycle = function (b) {
    return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this;
  }, c.prototype.getItemIndex = function (a) {
    return this.$items = a.parent().children('.item'), this.$items.index(a || this.$active);
  }, c.prototype.to = function (b) {
    const c = this;
    const d = this.getItemIndex(this.$active = this.$element.find('.item.active'));
    return b > this.$items.length - 1 || b < 0 ? void 0 : this.sliding ? this.$element.one('slid.bs.carousel', () => {
      c.to(b);
    }) : d == b ? this.pause().cycle() : this.slide(b > d ? 'next' : 'prev', a(this.$items[b]));
  }, c.prototype.pause = function (b) {
    return b || (this.paused = !0), this.$element.find('.next, .prev').length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this;
  }, c.prototype.next = function () {
    return this.sliding ? void 0 : this.slide('next');
  }, c.prototype.prev = function () {
    return this.sliding ? void 0 : this.slide('prev');
  }, c.prototype.slide = function (b, c) {
    const d = this.$element.find('.item.active');
    let e = c || d[b]();
    const f = this.interval;
    const g = b == 'next' ? 'left' : 'right';
    const h = b == 'next' ? 'first' : 'last';
    const i = this;
    if (!e.length) {
      if (!this.options.wrap) return;
      e = this.$element.find('.item')[h]();
    }
    if (e.hasClass('active')) return this.sliding = !1;
    const j = e[0];
    const k = a.Event('slide.bs.carousel', {
      relatedTarget: j,
      direction: g,
    });
    if (this.$element.trigger(k), !k.isDefaultPrevented()) {
      if (this.sliding = !0, f && this.pause(), this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active');
        const l = a(this.$indicators.children()[this.getItemIndex(e)]);
        l && l.addClass('active');
      }
      const m = a.Event('slid.bs.carousel', {
        relatedTarget: j,
        direction: g,
      });
      return a.support.transition && this.$element.hasClass('slide') ? (e.addClass(b), e[0].offsetWidth, d.addClass(g), e.addClass(g), d.one('bsTransitionEnd', () => {
        e.removeClass([b, g].join(' ')).addClass('active'), d.removeClass(['active', g].join(' ')), i.sliding = !1, setTimeout(() => {
          i.$element.trigger(m);
        }, 0);
      }).emulateTransitionEnd(1e3 * d.css('transition-duration').slice(0, -1))) : (d.removeClass('active'), e.addClass('active'), this.sliding = !1, this.$element.trigger(m)), f && this.cycle(), this;
    }
  };
  const d = a.fn.carousel;
  a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function () {
    return a.fn.carousel = d, this;
  }, a(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (c) {
    let d; const e = a(this);
    const f = a(e.attr('data-target') || (d = e.attr('href')) && d.replace(/.*(?=#[^\s]+$)/, ''));
    if (f.hasClass('carousel')) {
      const g = a.extend({}, f.data(), e.data());
      const h = e.attr('data-slide-to');
      h && (g.interval = !1), b.call(f, g), h && f.data('bs.carousel').to(h), c.preventDefault();
    }
  }), a(window).on('load', () => {
    a('[data-ride="carousel"]').each(function () {
      const c = a(this);
      b.call(c, c.data());
    });
  });
}(jQuery)), +(function (a) {
  function b(b) {
    return this.each(function () {
      const d = a(this);
      let e = d.data('bs.collapse');
      const f = a.extend({}, c.DEFAULTS, d.data(), typeof b === 'object' && b);
      !e && f.toggle && b == 'show' && (b = !b), e || d.data('bs.collapse', e = new c(this, f)), typeof b === 'string' && e[b]();
    });
  }
  var c = function (b, d) {
    this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.transitioning = null, this.options.parent && (this.$parent = a(this.options.parent)), this.options.toggle && this.toggle();
  };
  c.VERSION = '3.2.0', c.DEFAULTS = {
    toggle: !0,
  }, c.prototype.dimension = function () {
    const a = this.$element.hasClass('width');
    return a ? 'width' : 'height';
  }, c.prototype.show = function () {
    if (!this.transitioning && !this.$element.hasClass('in')) {
      const c = a.Event('show.bs.collapse');
      if (this.$element.trigger(c), !c.isDefaultPrevented()) {
        const d = this.$parent && this.$parent.find('> .panel > .in');
        if (d && d.length) {
          const e = d.data('bs.collapse');
          if (e && e.transitioning) return;
          b.call(d, 'hide'), e || d.data('bs.collapse', null);
        }
        const f = this.dimension();
        this.$element.removeClass('collapse').addClass('collapsing')[f](0), this.transitioning = 1;
        const g = function () {
          this.$element.removeClass('collapsing').addClass('collapse in')[f](''), this.transitioning = 0, this.$element.trigger('shown.bs.collapse');
        };
        if (!a.support.transition) return g.call(this);
        const h = a.camelCase(['scroll', f].join('-'));
        this.$element.one('bsTransitionEnd', a.proxy(g, this)).emulateTransitionEnd(350)[f](this.$element[0][h]);
      }
    }
  }, c.prototype.hide = function () {
    if (!this.transitioning && this.$element.hasClass('in')) {
      const b = a.Event('hide.bs.collapse');
      if (this.$element.trigger(b), !b.isDefaultPrevented()) {
        const c = this.dimension();
        this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass('collapsing').removeClass('collapse').removeClass('in'), this.transitioning = 1;
        const d = function () {
          this.transitioning = 0, this.$element.trigger('hidden.bs.collapse').removeClass('collapsing').addClass('collapse');
        };
        return a.support.transition ? void this.$element[c](0).one('bsTransitionEnd', a.proxy(d, this)).emulateTransitionEnd(350) : d.call(this);
      }
    }
  }, c.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  };
  const d = a.fn.collapse;
  a.fn.collapse = b, a.fn.collapse.Constructor = c, a.fn.collapse.noConflict = function () {
    return a.fn.collapse = d, this;
  }, a(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (c) {
    let d; const e = a(this);
    const f = e.attr('data-target') || c.preventDefault() || (d = e.attr('href')) && d.replace(/.*(?=#[^\s]+$)/, '');
    const g = a(f);
    const h = g.data('bs.collapse');
    const i = h ? 'toggle' : e.data();
    const j = e.attr('data-parent');
    const k = j && a(j);
    h && h.transitioning || (k && k.find(`[data-toggle="collapse"][data-parent="${j}"]`).not(e).addClass('collapsed'), e[g.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')), b.call(g, i);
  });
}(jQuery)), +(function (a) {
  function b(b) {
    b && b.which === 3 || (a(e).remove(), a(f).each(function () {
      const d = c(a(this));
      const e = {
        relatedTarget: this,
      };
      d.hasClass('open') && (d.trigger(b = a.Event('hide.bs.dropdown', e)), b.isDefaultPrevented() || d.removeClass('open').trigger('hidden.bs.dropdown', e));
    }));
  }

  function c(b) {
    let c = b.attr('data-target');
    c || (c = b.attr('href'), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ''));
    const d = c && a(c);
    return d && d.length ? d : b.parent();
  }

  function d(b) {
    return this.each(function () {
      const c = a(this);
      let d = c.data('bs.dropdown');
      d || c.data('bs.dropdown', d = new g(this)), typeof b === 'string' && d[b].call(c);
    });
  }
  var e = '.dropdown-backdrop';
  var f = '[data-toggle="dropdown"]';
  var g = function (b) {
    a(b).on('click.bs.dropdown', this.toggle);
  };
  g.VERSION = '3.2.0', g.prototype.toggle = function (d) {
    const e = a(this);
    if (!e.is('.disabled, :disabled')) {
      const f = c(e);
      const g = f.hasClass('open');
      if (b(), !g) {
        'ontouchstart' in document.documentElement && !f.closest('.navbar-nav').length && a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on('click', b);
        const h = {
          relatedTarget: this,
        };
        if (f.trigger(d = a.Event('show.bs.dropdown', h)), d.isDefaultPrevented()) return;
        e.trigger('focus'), f.toggleClass('open').trigger('shown.bs.dropdown', h);
      }
      return !1;
    }
  }, g.prototype.keydown = function (b) {
    if (/(38|40|27)/.test(b.keyCode)) {
      const d = a(this);
      if (b.preventDefault(), b.stopPropagation(), !d.is('.disabled, :disabled')) {
        const e = c(d);
        const g = e.hasClass('open');
        if (!g || g && b.keyCode == 27) return b.which == 27 && e.find(f).trigger('focus'), d.trigger('click');
        const h = ' li:not(.divider):visible a';
        const i = e.find(`[role="menu"]${h}, [role="listbox"]${h}`);
        if (i.length) {
          let j = i.index(i.filter(':focus'));
          b.keyCode == 38 && j > 0 && j--, b.keyCode == 40 && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger('focus');
        }
      }
    }
  };
  const h = a.fn.dropdown;
  a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function () {
    return a.fn.dropdown = h, this;
  }, a(document).on('click.bs.dropdown.data-api', b).on('click.bs.dropdown.data-api', '.dropdown form', (a) => {
    a.stopPropagation();
  }).on('click.bs.dropdown.data-api', f, g.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', `${f}, [role="menu"], [role="listbox"]`, g.prototype.keydown);
}(jQuery)), +(function (a) {
  function b(b, d) {
    return this.each(function () {
      const e = a(this);
      let f = e.data('bs.modal');
      const g = a.extend({}, c.DEFAULTS, e.data(), typeof b === 'object' && b);
      f || e.data('bs.modal', f = new c(this, g)), typeof b === 'string' ? f[b](d) : g.show && f.show(d);
    });
  }
  var c = function (b, c) {
    this.options = c, this.$body = a(document.body), this.$element = a(b), this.$backdrop = this.isShown = null, this.scrollbarWidth = 0, this.options.remote && this.$element.find('.modal-content').load(this.options.remote, a.proxy(function () {
      this.$element.trigger('loaded.bs.modal');
    }, this));
  };
  c.VERSION = '3.2.0', c.DEFAULTS = {
    backdrop: !0,
    keyboard: !0,
    show: !0,
  }, c.prototype.toggle = function (a) {
    return this.isShown ? this.hide() : this.show(a);
  }, c.prototype.show = function (b) {
    const c = this;
    const d = a.Event('show.bs.modal', {
      relatedTarget: b,
    });
    this.$element.trigger(d), this.isShown || d.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.$body.addClass('modal-open'), this.setScrollbar(), this.escape(), this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.backdrop(() => {
      const d = a.support.transition && c.$element.hasClass('fade');
      c.$element.parent().length || c.$element.appendTo(c.$body), c.$element.show().scrollTop(0), d && c.$element[0].offsetWidth, c.$element.addClass('in').attr('aria-hidden', !1), c.enforceFocus();
      const e = a.Event('shown.bs.modal', {
        relatedTarget: b,
      });
      d ? c.$element.find('.modal-dialog').one('bsTransitionEnd', () => {
        c.$element.trigger('focus').trigger(e);
      }).emulateTransitionEnd(300) : c.$element.trigger('focus').trigger(e);
    }));
  }, c.prototype.hide = function (b) {
    b && b.preventDefault(), b = a.Event('hide.bs.modal'), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.$body.removeClass('modal-open'), this.resetScrollbar(), this.escape(), a(document).off('focusin.bs.modal'), this.$element.removeClass('in').attr('aria-hidden', !0).off('click.dismiss.bs.modal'), a.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', a.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal());
  }, c.prototype.enforceFocus = function () {
    a(document).off('focusin.bs.modal').on('focusin.bs.modal', a.proxy(function (a) {
      this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger('focus');
    }, this));
  }, c.prototype.escape = function () {
    this.isShown && this.options.keyboard ? this.$element.on('keyup.dismiss.bs.modal', a.proxy(function (a) {
      a.which == 27 && this.hide();
    }, this)) : this.isShown || this.$element.off('keyup.dismiss.bs.modal');
  }, c.prototype.hideModal = function () {
    const a = this;
    this.$element.hide(), this.backdrop(() => {
      a.$element.trigger('hidden.bs.modal');
    });
  }, c.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove(), this.$backdrop = null;
  }, c.prototype.backdrop = function (b) {
    const c = this;
    const d = this.$element.hasClass('fade') ? 'fade' : '';
    if (this.isShown && this.options.backdrop) {
      const e = a.support.transition && d;
      if (this.$backdrop = a(`<div class="modal-backdrop ${d}" />`).appendTo(this.$body), this.$element.on('click.dismiss.bs.modal', a.proxy(function (a) {
        a.target === a.currentTarget && (this.options.backdrop == 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this));
      }, this)), e && this.$backdrop[0].offsetWidth, this.$backdrop.addClass('in'), !b) return;
      e ? this.$backdrop.one('bsTransitionEnd', b).emulateTransitionEnd(150) : b();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');
      const f = function () {
        c.removeBackdrop(), b && b();
      };
      a.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', f).emulateTransitionEnd(150) : f();
    } else b && b();
  }, c.prototype.checkScrollbar = function () {
    document.body.clientWidth >= window.innerWidth || (this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar());
  }, c.prototype.setScrollbar = function () {
    const a = parseInt(this.$body.css('padding-right') || 0, 10);
    this.scrollbarWidth && this.$body.css('padding-right', a + this.scrollbarWidth);
  }, c.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '');
  }, c.prototype.measureScrollbar = function () {
    const a = document.createElement('div');
    a.className = 'modal-scrollbar-measure', this.$body.append(a);
    const b = a.offsetWidth - a.clientWidth;
    return this.$body[0].removeChild(a), b;
  };
  const d = a.fn.modal;
  a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function () {
    return a.fn.modal = d, this;
  }, a(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (c) {
    const d = a(this);
    const e = d.attr('href');
    const f = a(d.attr('data-target') || e && e.replace(/.*(?=#[^\s]+$)/, ''));
    const g = f.data('bs.modal') ? 'toggle' : a.extend({
      remote: !/#/.test(e) && e,
    }, f.data(), d.data());
    d.is('a') && c.preventDefault(), f.one('show.bs.modal', (a) => {
      a.isDefaultPrevented() || f.one('hidden.bs.modal', () => {
        d.is(':visible') && d.trigger('focus');
      });
    }), b.call(f, g, this);
  });
}(jQuery)), +(function (a) {
  function b(b) {
    return this.each(function () {
      const d = a(this);
      let e = d.data('bs.tooltip');
      const f = typeof b === 'object' && b;
      (e || b != 'destroy') && (e || d.data('bs.tooltip', e = new c(this, f)), typeof b === 'string' && e[b]());
    });
  }
  var c = function (a, b) {
    this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init('tooltip', a, b);
  };
  c.VERSION = '3.2.0', c.DEFAULTS = {
    animation: !0,
    placement: 'top',
    selector: !1,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: !1,
    container: !1,
    viewport: {
      selector: 'body',
      padding: 0,
    },
  }, c.prototype.init = function (b, c, d) {
    this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(this.options.viewport.selector || this.options.viewport);
    for (let e = this.options.trigger.split(' '), f = e.length; f--;) {
      const g = e[f];
      if (g == 'click') this.$element.on(`click.${this.type}`, this.options.selector, a.proxy(this.toggle, this));
      else if (g != 'manual') {
        const h = g == 'hover' ? 'mouseenter' : 'focusin';
        const i = g == 'hover' ? 'mouseleave' : 'focusout';
        this.$element.on(`${h}.${this.type}`, this.options.selector, a.proxy(this.enter, this)), this.$element.on(`${i}.${this.type}`, this.options.selector, a.proxy(this.leave, this));
      }
    }
    this.options.selector ? this._options = a.extend({}, this.options, {
      trigger: 'manual',
      selector: '',
    }) : this.fixTitle();
  }, c.prototype.getDefaults = function () {
    return c.DEFAULTS;
  }, c.prototype.getOptions = function (b) {
    return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && typeof b.delay === 'number' && (b.delay = {
      show: b.delay,
      hide: b.delay,
    }), b;
  }, c.prototype.getDelegateOptions = function () {
    const b = {};
    const c = this.getDefaults();
    return this._options && a.each(this._options, (a, d) => {
      c[a] != d && (b[a] = d);
    }), b;
  }, c.prototype.enter = function (b) {
    let c = b instanceof this.constructor ? b : a(b.currentTarget).data(`bs.${this.type}`);
    return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data(`bs.${this.type}`, c)), clearTimeout(c.timeout), c.hoverState = 'in', c.options.delay && c.options.delay.show ? void (c.timeout = setTimeout(() => {
      c.hoverState == 'in' && c.show();
    }, c.options.delay.show)) : c.show();
  }, c.prototype.leave = function (b) {
    let c = b instanceof this.constructor ? b : a(b.currentTarget).data(`bs.${this.type}`);
    return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data(`bs.${this.type}`, c)), clearTimeout(c.timeout), c.hoverState = 'out', c.options.delay && c.options.delay.hide ? void (c.timeout = setTimeout(() => {
      c.hoverState == 'out' && c.hide();
    }, c.options.delay.hide)) : c.hide();
  }, c.prototype.show = function () {
    const b = a.Event(`show.bs.${this.type}`);
    if (this.hasContent() && this.enabled) {
      this.$element.trigger(b);
      const c = a.contains(document.documentElement, this.$element[0]);
      if (b.isDefaultPrevented() || !c) return;
      const d = this;
      const e = this.tip();
      const f = this.getUID(this.type);
      this.setContent(), e.attr('id', f), this.$element.attr('aria-describedby', f), this.options.animation && e.addClass('fade');
      let g = typeof this.options.placement === 'function' ? this.options.placement.call(this, e[0], this.$element[0]) : this.options.placement;
      const h = /\s?auto?\s?/i;
      const i = h.test(g);
      i && (g = g.replace(h, '') || 'top'), e.detach().css({
        top: 0,
        left: 0,
        display: 'block',
      }).addClass(g).data(`bs.${this.type}`, this), this.options.container ? e.appendTo(this.options.container) : e.insertAfter(this.$element);
      const j = this.getPosition();
      const k = e[0].offsetWidth;
      const l = e[0].offsetHeight;
      if (i) {
        const m = g;
        const n = this.$element.parent();
        const o = this.getPosition(n);
        g = g == 'bottom' && j.top + j.height + l - o.scroll > o.height ? 'top' : g == 'top' && j.top - o.scroll - l < 0 ? 'bottom' : g == 'right' && j.right + k > o.width ? 'left' : g == 'left' && j.left - k < o.left ? 'right' : g, e.removeClass(m).addClass(g);
      }
      const p = this.getCalculatedOffset(g, j, k, l);
      this.applyPlacement(p, g);
      const q = function () {
        d.$element.trigger(`shown.bs.${d.type}`), d.hoverState = null;
      };
      a.support.transition && this.$tip.hasClass('fade') ? e.one('bsTransitionEnd', q).emulateTransitionEnd(150) : q();
    }
  }, c.prototype.applyPlacement = function (b, c) {
    const d = this.tip();
    const e = d[0].offsetWidth;
    const f = d[0].offsetHeight;
    let g = parseInt(d.css('margin-top'), 10);
    let h = parseInt(d.css('margin-left'), 10);
    isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top += g, b.left += h, a.offset.setOffset(d[0], a.extend({
      using(a) {
        d.css({
          top: Math.round(a.top),
          left: Math.round(a.left),
        });
      },
    }, b), 0), d.addClass('in');
    const i = d[0].offsetWidth;
    const j = d[0].offsetHeight;
    c == 'top' && j != f && (b.top = b.top + f - j);
    const k = this.getViewportAdjustedDelta(c, b, i, j);
    k.left ? b.left += k.left : b.top += k.top;
    const l = k.left ? 2 * k.left - e + i : 2 * k.top - f + j;
    const m = k.left ? 'left' : 'top';
    const n = k.left ? 'offsetWidth' : 'offsetHeight';
    d.offset(b), this.replaceArrow(l, d[0][n], m);
  }, c.prototype.replaceArrow = function (a, b, c) {
    this.arrow().css(c, a ? `${50 * (1 - a / b)}%` : '');
  }, c.prototype.setContent = function () {
    const a = this.tip();
    const b = this.getTitle();
    a.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](b), a.removeClass('fade in top bottom left right');
  }, c.prototype.hide = function () {
    function b() {
      c.hoverState != 'in' && d.detach(), c.$element.trigger(`hidden.bs.${c.type}`);
    }
    var c = this;
    var d = this.tip();
    const e = a.Event(`hide.bs.${this.type}`);
    return this.$element.removeAttr('aria-describedby'), this.$element.trigger(e), e.isDefaultPrevented() ? void 0 : (d.removeClass('in'), a.support.transition && this.$tip.hasClass('fade') ? d.one('bsTransitionEnd', b).emulateTransitionEnd(150) : b(), this.hoverState = null, this);
  }, c.prototype.fixTitle = function () {
    const a = this.$element;
    (a.attr('title') || typeof a.attr('data-original-title') !== 'string') && a.attr('data-original-title', a.attr('title') || '').attr('title', '');
  }, c.prototype.hasContent = function () {
    return this.getTitle();
  }, c.prototype.getPosition = function (b) {
    b = b || this.$element;
    const c = b[0];
    const d = c.tagName == 'BODY';
    return a.extend({}, typeof c.getBoundingClientRect === 'function' ? c.getBoundingClientRect() : null, {
      scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop(),
      width: d ? a(window).width() : b.outerWidth(),
      height: d ? a(window).height() : b.outerHeight(),
    }, d ? {
      top: 0,
      left: 0,
    } : b.offset());
  }, c.prototype.getCalculatedOffset = function (a, b, c, d) {
    return a == 'bottom' ? {
      top: b.top + b.height,
      left: b.left + b.width / 2 - c / 2,
    } : a == 'top' ? {
      top: b.top - d,
      left: b.left + b.width / 2 - c / 2,
    } : a == 'left' ? {
      top: b.top + b.height / 2 - d / 2,
      left: b.left - c,
    } : {
      top: b.top + b.height / 2 - d / 2,
      left: b.left + b.width,
    };
  }, c.prototype.getViewportAdjustedDelta = function (a, b, c, d) {
    const e = {
      top: 0,
      left: 0,
    };
    if (!this.$viewport) return e;
    const f = this.options.viewport && this.options.viewport.padding || 0;
    const g = this.getPosition(this.$viewport);
    if (/right|left/.test(a)) {
      const h = b.top - f - g.scroll;
      const i = b.top + f - g.scroll + d;
      h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i);
    } else {
      const j = b.left - f;
      const k = b.left + f + c;
      j < g.left ? e.left = g.left - j : k > g.width && (e.left = g.left + g.width - k);
    }
    return e;
  }, c.prototype.getTitle = function () {
    let a; const b = this.$element;
    const c = this.options;
    return a = b.attr('data-original-title') || (typeof c.title === 'function' ? c.title.call(b[0]) : c.title);
  }, c.prototype.getUID = function (a) {
    do a += ~~(1e6 * Math.random()); while (document.getElementById(a));
    return a;
  }, c.prototype.tip = function () {
    return this.$tip = this.$tip || a(this.options.template);
  }, c.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
  }, c.prototype.validate = function () {
    this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null);
  }, c.prototype.enable = function () {
    this.enabled = !0;
  }, c.prototype.disable = function () {
    this.enabled = !1;
  }, c.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  }, c.prototype.toggle = function (b) {
    let c = this;
    b && (c = a(b.currentTarget).data(`bs.${this.type}`), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data(`bs.${this.type}`, c))), c.tip().hasClass('in') ? c.leave(c) : c.enter(c);
  }, c.prototype.destroy = function () {
    clearTimeout(this.timeout), this.hide().$element.off(`.${this.type}`).removeData(`bs.${this.type}`);
  };
  const d = a.fn.tooltip;
  a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function () {
    return a.fn.tooltip = d, this;
  };
}(jQuery)), +(function (a) {
  function b(b) {
    return this.each(function () {
      const d = a(this);
      let e = d.data('bs.popover');
      const f = typeof b === 'object' && b;
      (e || b != 'destroy') && (e || d.data('bs.popover', e = new c(this, f)), typeof b === 'string' && e[b]());
    });
  }
  var c = function (a, b) {
    this.init('popover', a, b);
  };
  if (!a.fn.tooltip) throw new Error('Popover requires tooltip.js');
  c.VERSION = '3.2.0', c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
  }), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function () {
    return c.DEFAULTS;
  }, c.prototype.setContent = function () {
    const a = this.tip();
    const b = this.getTitle();
    const c = this.getContent();
    a.find('.popover-title')[this.options.html ? 'html' : 'text'](b), a.find('.popover-content').empty()[this.options.html ? typeof c === 'string' ? 'html' : 'append' : 'text'](c), a.removeClass('fade top bottom left right in'), a.find('.popover-title').html() || a.find('.popover-title').hide();
  }, c.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  }, c.prototype.getContent = function () {
    const a = this.$element;
    const b = this.options;
    return a.attr('data-content') || (typeof b.content === 'function' ? b.content.call(a[0]) : b.content);
  }, c.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow');
  }, c.prototype.tip = function () {
    return this.$tip || (this.$tip = a(this.options.template)), this.$tip;
  };
  const d = a.fn.popover;
  a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function () {
    return a.fn.popover = d, this;
  };
}(jQuery)), +(function (a) {
  function b(c, d) {
    const e = a.proxy(this.process, this);
    this.$body = a('body'), this.$scrollElement = a(a(c).is('body') ? window : c), this.options = a.extend({}, b.DEFAULTS, d), this.selector = `${this.options.target || ''} .nav li > a`, this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on('scroll.bs.scrollspy', e), this.refresh(), this.process();
  }

  function c(c) {
    return this.each(function () {
      const d = a(this);
      let e = d.data('bs.scrollspy');
      const f = typeof c === 'object' && c;
      e || d.data('bs.scrollspy', e = new b(this, f)), typeof c === 'string' && e[c]();
    });
  }
  b.VERSION = '3.2.0', b.DEFAULTS = {
    offset: 10,
  }, b.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
  }, b.prototype.refresh = function () {
    let b = 'offset';
    let c = 0;
    a.isWindow(this.$scrollElement[0]) || (b = 'position', c = this.$scrollElement.scrollTop()), this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight();
    const d = this;
    this.$body.find(this.selector).map(function () {
      const d = a(this);
      const e = d.data('target') || d.attr('href');
      const f = /^#./.test(e) && a(e);
      return f && f.length && f.is(':visible') && [
        [f[b]().top + c, e],
      ] || null;
    }).sort((a, b) => a[0] - b[0]).each(function () {
      d.offsets.push(this[0]), d.targets.push(this[1]);
    });
  }, b.prototype.process = function () {
    let a; const b = this.$scrollElement.scrollTop() + this.options.offset;
    const c = this.getScrollHeight();
    const d = this.options.offset + c - this.$scrollElement.height();
    const e = this.offsets;
    const f = this.targets;
    const g = this.activeTarget;
    if (this.scrollHeight != c && this.refresh(), b >= d) return g != (a = f[f.length - 1]) && this.activate(a);
    if (g && b <= e[0]) return g != (a = f[0]) && this.activate(a);
    for (a = e.length; a--;) g != f[a] && b >= e[a] && (!e[a + 1] || b <= e[a + 1]) && this.activate(f[a]);
  }, b.prototype.activate = function (b) {
    this.activeTarget = b, a(this.selector).parentsUntil(this.options.target, '.active').removeClass('active');
    const c = `${this.selector}[data-target="${b}"],${this.selector}[href="${b}"]`;
    let d = a(c).parents('li').addClass('active');
    d.parent('.dropdown-menu').length && (d = d.closest('li.dropdown').addClass('active')), d.trigger('activate.bs.scrollspy');
  };
  const d = a.fn.scrollspy;
  a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function () {
    return a.fn.scrollspy = d, this;
  }, a(window).on('load.bs.scrollspy.data-api', () => {
    a('[data-spy="scroll"]').each(function () {
      const b = a(this);
      c.call(b, b.data());
    });
  });
}(jQuery)), +(function (a) {
  function b(b) {
    return this.each(function () {
      const d = a(this);
      let e = d.data('bs.tab');
      e || d.data('bs.tab', e = new c(this)), typeof b === 'string' && e[b]();
    });
  }
  var c = function (b) {
    this.element = a(b);
  };
  c.VERSION = '3.2.0', c.prototype.show = function () {
    const b = this.element;
    const c = b.closest('ul:not(.dropdown-menu)');
    let d = b.data('target');
    if (d || (d = b.attr('href'), d = d && d.replace(/.*(?=#[^\s]*$)/, '')), !b.parent('li').hasClass('active')) {
      const e = c.find('.active:last a')[0];
      const f = a.Event('show.bs.tab', {
        relatedTarget: e,
      });
      if (b.trigger(f), !f.isDefaultPrevented()) {
        const g = a(d);
        this.activate(b.closest('li'), c), this.activate(g, g.parent(), () => {
          b.trigger({
            type: 'shown.bs.tab',
            relatedTarget: e,
          });
        });
      }
    }
  }, c.prototype.activate = function (b, c, d) {
    function e() {
      f.removeClass('active').find('> .dropdown-menu > .active').removeClass('active'), b.addClass('active'), g ? (b[0].offsetWidth, b.addClass('in')) : b.removeClass('fade'), b.parent('.dropdown-menu') && b.closest('li.dropdown').addClass('active'), d && d();
    }
    var f = c.find('> .active');
    var g = d && a.support.transition && f.hasClass('fade');
    g ? f.one('bsTransitionEnd', e).emulateTransitionEnd(150) : e(), f.removeClass('in');
  };
  const d = a.fn.tab;
  a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function () {
    return a.fn.tab = d, this;
  }, a(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (c) {
    c.preventDefault(), b.call(a(this), 'show');
  });
}(jQuery)), +(function (a) {
  function b(b) {
    return this.each(function () {
      const d = a(this);
      let e = d.data('bs.affix');
      const f = typeof b === 'object' && b;
      e || d.data('bs.affix', e = new c(this, f)), typeof b === 'string' && e[b]();
    });
  }
  var c = function (b, d) {
    this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on('scroll.bs.affix.data-api', a.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = this.unpin = this.pinnedOffset = null, this.checkPosition();
  };
  c.VERSION = '3.2.0', c.RESET = 'affix affix-top affix-bottom', c.DEFAULTS = {
    offset: 0,
    target: window,
  }, c.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(c.RESET).addClass('affix');
    const a = this.$target.scrollTop();
    const b = this.$element.offset();
    return this.pinnedOffset = b.top - a;
  }, c.prototype.checkPositionWithEventLoop = function () {
    setTimeout(a.proxy(this.checkPosition, this), 1);
  }, c.prototype.checkPosition = function () {
    if (this.$element.is(':visible')) {
      const b = a(document).height();
      const d = this.$target.scrollTop();
      const e = this.$element.offset();
      const f = this.options.offset;
      let g = f.top;
      let h = f.bottom;
      typeof f !== 'object' && (h = g = f), typeof g === 'function' && (g = f.top(this.$element)), typeof h === 'function' && (h = f.bottom(this.$element));
      const i = this.unpin != null && d + this.unpin <= e.top ? !1 : h != null && e.top + this.$element.height() >= b - h ? 'bottom' : g != null && g >= d ? 'top' : !1;
      if (this.affixed !== i) {
        this.unpin != null && this.$element.css('top', '');
        const j = `affix${i ? `-${i}` : ''}`;
        const k = a.Event(`${j}.bs.affix`);
        this.$element.trigger(k), k.isDefaultPrevented() || (this.affixed = i, this.unpin = i == 'bottom' ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(j).trigger(a.Event(j.replace('affix', 'affixed'))), i == 'bottom' && this.$element.offset({
          top: b - this.$element.height() - h,
        }));
      }
    }
  };
  const d = a.fn.affix;
  a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function () {
    return a.fn.affix = d, this;
  }, a(window).on('load', () => {
    a('[data-spy="affix"]').each(function () {
      const c = a(this);
      const d = c.data();
      d.offset = d.offset || {}, d.offsetBottom && (d.offset.bottom = d.offsetBottom), d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d);
    });
  });
}(jQuery));


//* *********************************
//* *********************************
//* *********************************   Sidebar_js
//* *********************************
//* *********************************

$(document).ready(() => {
  const overlay = $('.sidebar-overlay');

  $('.sidebar-toggle').on('click', () => {
    const sidebar = $('#sidebar');
    sidebar.toggleClass('open');
    if (sidebar.hasClass('sidebar-fixed-left') && sidebar.hasClass('open')) {
      overlay.addClass('active');
      $('.MD-burger-layer').remove('MD-burger-line');
      $('.MD-burger-layer').add('MD-burger-arrow');
      document.documentElement.style.overflow = 'hidden';
    } else {
      overlay.removeClass('active');
      $('.MD-burger-layer').removeClass('MD-burger-arrow');
      $('.MD-burger-layer').addClass('MD-burger-line');
      document.documentElement.style.overflow = 'auto';
    }
  });

  overlay.on('click', function () {
    $(this).removeClass('active');
    $('#sidebar').removeClass('open');
    $('.MD-burger-layer').removeClass('MD-burger-arrow');
    $('.MD-burger-layer').addClass('MD-burger-line');
    document.documentElement.style.overflow = 'auto';
  });
});

// Sidebar constructor
$(document).ready(() => {
  const sidebar = $('#sidebar');
  const sidebarHeader = $('#sidebar .sidebar-header');
  const sidebarImg = sidebarHeader.css('background-image');
  const toggleButtons = $('.sidebar-toggle');

  // Hide toggle buttons on default position
  toggleButtons.css('display', 'initial');

  // Sidebar position
  $('#sidebar-position').change(function () {
    const value = $(this).val();
    sidebar.removeClass('sidebar-fixed-left').addClass(value).addClass('open');
    if (value == 'sidebar-fixed-left') {
      $('.sidebar-overlay').addClass('active');
    }
  });
});

// Add JQuery animation to bootstrap dropdown elements.
(function ($) {
  const dropdown = $('.dropdown');

  // Add slidedown animation to dropdown
  dropdown.on('show.bs.dropdown', function (e) {
    $(this).find('.dropdown-menu').first().stop(true, true)
      .slideDown();
  });

  // Add slideup animation to dropdown
  dropdown.on('hide.bs.dropdown', function (e) {
    $(this).find('.dropdown-menu').first().stop(true, true)
      .slideUp();
  });
}(jQuery));


(function (removeClass) {
  jQuery.fn.removeClass = function (value) {
    if (value && typeof value.test === 'function') {
      for (let i = 0, l = this.length; i < l; i++) {
        const elem = this[i];
        if (elem.nodeType === 1 && elem.className) {
          const classNames = elem.className.split(/\s+/);

          for (let n = classNames.length; n--;) {
            if (value.test(classNames[n])) {
              classNames.splice(n, 1);
            }
          }
          elem.className = jQuery.trim(classNames.join(' '));
        }
      }
    } else {
      removeClass.call(this, value);
    }
    return this;
  };
}(jQuery.fn.removeClass));


//* *********************************
//* *********************************
//* *********************************   Burder_js
//* *********************************
//* *********************************

(function () {
  const burger = document.querySelector('.MD-burger-icon');

  if (burger !== null) {
    burger.addEventListener(
      'click',
      () => {
        let child;

        child = document.getElementById('MD-burger-id').classList;

        if (child.contains('MD-burger-arrow')) {
          child.remove('MD-burger-arrow');
          child.add('MD-burger-line');
        } else {
          child.remove('MD-burger-line');
          child.add('MD-burger-arrow');
        }
      });
  }
}());
