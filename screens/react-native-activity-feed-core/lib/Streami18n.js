"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Streami18n = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18next = _interopRequireDefault(require("i18next"));

var _dayjs = _interopRequireDefault(require("dayjs"));

var _calendar = _interopRequireDefault(require("dayjs/plugin/calendar"));

var _updateLocale = _interopRequireDefault(require("dayjs/plugin/updateLocale"));

var _localizedFormat = _interopRequireDefault(require("dayjs/plugin/localizedFormat"));

var _localeData = _interopRequireDefault(require("dayjs/plugin/localeData"));

var _relativeTime = _interopRequireDefault(require("dayjs/plugin/relativeTime"));

var _i18n = require("./i18n");

require("dayjs/locale/nl");

require("dayjs/locale/ru");

require("dayjs/locale/tr");

require("dayjs/locale/fr");

require("dayjs/locale/hi");

require("dayjs/locale/it");

require("dayjs/locale/en");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defaultNS = 'translation';
var defaultLng = 'en';

_dayjs["default"].extend(_updateLocale["default"]);

_dayjs["default"].updateLocale('nl', {
  calendar: {
    sameDay: '[vandaag om] LT',
    nextDay: '[morgen om] LT',
    nextWeek: 'dddd [om] LT',
    lastDay: '[gisteren om] LT',
    lastWeek: '[afgelopen] dddd [om] LT',
    sameElse: 'L'
  }
});

_dayjs["default"].updateLocale('it', {
  calendar: {
    sameDay: '[Oggi alle] LT',
    nextDay: '[Domani alle] LT',
    nextWeek: 'dddd [alle] LT',
    lastDay: '[Ieri alle] LT',
    lastWeek: '[lo scorso] dddd [alle] LT',
    sameElse: 'L'
  }
});

_dayjs["default"].updateLocale('hi', {
  calendar: {
    sameDay: '[आज] LT',
    nextDay: '[कल] LT',
    nextWeek: 'dddd, LT',
    lastDay: '[कल] LT',
    lastWeek: '[पिछले] dddd, LT',
    sameElse: 'L'
  },
  // Hindi notation for meridiems are quite fuzzy in practice. While there exists
  // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
  meridiemParse: /रात|सुबह|दोपहर|शाम/,
  meridiemHour: function meridiemHour(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }

    if (meridiem === 'रात') {
      return hour < 4 ? hour : hour + 12;
    } else if (meridiem === 'सुबह') {
      return hour;
    } else if (meridiem === 'दोपहर') {
      return hour >= 10 ? hour : hour + 12;
    } else if (meridiem === 'शाम') {
      return hour + 12;
    }
  },
  meridiem: function meridiem(hour) {
    if (hour < 4) {
      return 'रात';
    } else if (hour < 10) {
      return 'सुबह';
    } else if (hour < 17) {
      return 'दोपहर';
    } else if (hour < 20) {
      return 'शाम';
    } else {
      return 'रात';
    }
  }
});

_dayjs["default"].updateLocale('fr', {
  calendar: {
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L'
  }
});

_dayjs["default"].updateLocale('tr', {
  calendar: {
    sameDay: '[bugün saat] LT',
    nextDay: '[yarın saat] LT',
    nextWeek: '[gelecek] dddd [saat] LT',
    lastDay: '[dün] LT',
    lastWeek: '[geçen] dddd [saat] LT',
    sameElse: 'L'
  }
});

_dayjs["default"].updateLocale('ru', {
  calendar: {
    sameDay: '[Сегодня, в] LT',
    nextDay: '[Завтра, в] LT',
    lastDay: '[Вчера, в] LT'
  }
});

var en_locale = {
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_')
};
/**
 * Wrapper around [i18next](https://www.i18next.com/) class for Stream related translations.
 * Instance of this class should be provided to Chat component to handle translations.
 * Stream provides following list of in-built translations:
 * 1. English (en)
 * 2. Dutch (nl)
 * 3. Russian (ru)
 * 4. Turkish (tr)
 * 5. French (fr)
 * 6. Italian (it)
 * 7. Hindi (hi)
 *
 * Simplest way to start using chat components in one of the in-built languages would be following:
 *
 * ```
 * const i18n = new Streami18n({ language 'nl' });
 * <Chat client={chatClient} i18nInstance={i18n}>
 *  ...
 * </Chat>
 * ```
 *
 * If you would like to override certain keys in in-built translation.
 * UI will be automatically updated in this case.
 *
 * ```
 * const i18n = new Streami18n({
 *  language: 'nl',
 *  translationsForLanguage: {
 *    'Nothing yet...': 'Nog Niet ...',
 *    '{{ firstUser }} and {{ secondUser }} are typing...': '{{ firstUser }} en {{ secondUser }} zijn aan het typen...',
 *  }
 * });
 *
 * If you would like to register additional languages, use registerTranslation. You can add as many languages as you want:
 *
 * i18n.registerTranslation('zh', {
 *  'Nothing yet...': 'Nog Niet ...',
 *  '{{ firstUser }} and {{ secondUser }} are typing...': '{{ firstUser }} en {{ secondUser }} zijn aan het typen...',
 * });
 *
 * <Chat client={chatClient} i18nInstance={i18n}>
 *  ...
 * </Chat>
 * ```
 *
 * You can use the same function to add whole new language as well.
 *
 * ```
 * const i18n = new Streami18n();
 *
 * i18n.registerTranslation('mr', {
 *  'Nothing yet...': 'काहीही नाही  ...',
 *  '{{ firstUser }} and {{ secondUser }} are typing...': '{{ firstUser }} आणि {{ secondUser }} टीपी करत आहेत ',
 * });
 *
 * // Make sure to call setLanguage to reflect new language in UI.
 * i18n.setLanguage('it');
 * <Chat client={chatClient} i18nInstance={i18n}>
 *  ...
 * </Chat>
 * ```
 *
 * ## Datetime translations
 *
 * Stream react chat components uses [dayjs](https://day.js.org/en/) internally by default to format datetime stamp.
 * e.g., in ChannelPreview, MessageContent components.
 * Dayjs has locale support as well - https://day.js.org/docs/en/i18n/i18n
 * Dayjs is a lightweight alternative to Momentjs with the same modern API.
 *
 * Dayjs provides locale config for plenty of languages, you can check the whole list of locale configs at following url
 * https://github.com/iamkun/dayjs/tree/dev/src/locale
 *
 * You can either provide the dayjs locale config while registering
 * language with Streami18n (either via constructor or registerTranslation()) or you can provide your own Dayjs or Moment instance
 * to Streami18n constructor, which will be then used internally (using the language locale) in components.
 *
 * 1. Via language registration
 *
 * e.g.,
 * ```
 * const i18n = new Streami18n({
 *  language: 'nl',
 *  dayjsLocaleConfigForLanguage: {
 *    months: [...],
 *    monthsShort: [...],
 *    calendar: {
 *      sameDay: ...'
 *    }
 *  }
 * });
 * ```
 *
 * Similarly, you can add locale config for moment while registering translation via `registerTranslation` function.
 *
 * e.g.,
 * ```
 * const i18n = new Streami18n();
 *
 * i18n.registerTranslation(
 *  'mr',
 *  {
 *    'Nothing yet...': 'काहीही नाही  ...',
 *    '{{ firstUser }} and {{ secondUser }} are typing...': '{{ firstUser }} आणि {{ secondUser }} टीपी करत आहेत ',
 *  },
 *  {
 *    months: [...],
 *    monthsShort: [...],
 *    calendar: {
 *      sameDay: ...'
 *    }
 *  }
 * );
 *```
 * 2. Provide your own Moment object
 *
 * ```js
 * import 'moment/locale/nl';
 * import 'moment/locale/it';
 * // or if you want to include all locales
 * import 'moment/min/locales';
 *
 * import Moment from moment
 *
 * const i18n = new Streami18n({
 *  language: 'nl',
 *  DateTimeParser: Moment
 * })
 * ```
 *
 * 3. Provide your own Dayjs object
 *
 * ```js
 * import Dayjs from 'dayjs'
 *
 * import 'dayjs/locale/nl';
 * import 'dayjs/locale/it';
 * // or if you want to include all locales
 * import 'dayjs/min/locales';
 *
 * const i18n = new Streami18n({
 *  language: 'nl',
 *  DateTimeParser: Dayjs
 * })
 * ```
 * If you would like to stick with english language for datetimes in Stream compoments, you can set `disableDateTimeTranslations` to true.
 *
 */

var defaultStreami18nOptions = {
  language: 'en',
  disableDateTimeTranslations: false,
  debug: false,
  logger: function logger(msg) {
    return console.warn(msg);
  },
  dayjsLocaleConfigForLanguage: null,
  DateTimeParser: _dayjs["default"]
};

var Streami18n = /*#__PURE__*/function () {
  /**
   * dayjs.defineLanguage('nl') also changes the global locale. We don't want to do that
   * when user calls registerTranslation() function. So intead we will store the locale configs
   * given to registerTranslation() function in `dayjsLocales` object, and register the required locale
   * with moment, when setLanguage is called.
   * */

  /**
   * Contructor accepts following options:
   *  - language (String) default: 'en'
   *    Language code e.g., en, tr
   *
   *  - translationsForLanguage (object)
   *    Translations object. Please check src/i18n/en.json for example.
   *
   *  - disableDateTimeTranslations (boolean) default: false
   *    Disable translations for datetimes
   *
   *  - debug (boolean) default: false
   *    Enable debug mode in internal i18n class
   *
   *  - logger (function) default: () => {}
   *    Logger function to log warnings/errors from this class
   *
   *  - dayjsLocaleConfigForLanguage (object) default: 'enConfig'
   *    [Config object](https://momentjs.com/docs/#/i18n/changing-locale/) for internal moment object,
   *    corresponding to language (param)
   *
   *  - DateTimeParser (function) Moment or Dayjs instance/function.
   *    Make sure to load all the required locales in this Moment or Dayjs instance that you will be provide to Streami18n
   *
   * @param {*} options
   */
  function Streami18n() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Streami18n);
    (0, _defineProperty2["default"])(this, "i18nInstance", _i18next["default"].createInstance());
    (0, _defineProperty2["default"])(this, "Dayjs", null);
    (0, _defineProperty2["default"])(this, "setLanguageCallback", function () {
      return null;
    });
    (0, _defineProperty2["default"])(this, "initialized", false);
    (0, _defineProperty2["default"])(this, "t", null);
    (0, _defineProperty2["default"])(this, "tDateTimeParser", null);
    (0, _defineProperty2["default"])(this, "translations", {
      en: (0, _defineProperty2["default"])({}, defaultNS, _i18n.enTranslations),
      nl: (0, _defineProperty2["default"])({}, defaultNS, _i18n.nlTranslations),
      ru: (0, _defineProperty2["default"])({}, defaultNS, _i18n.ruTranslations),
      tr: (0, _defineProperty2["default"])({}, defaultNS, _i18n.trTranslations),
      fr: (0, _defineProperty2["default"])({}, defaultNS, _i18n.frTranslations),
      hi: (0, _defineProperty2["default"])({}, defaultNS, _i18n.hiTranslations),
      it: (0, _defineProperty2["default"])({}, defaultNS, _i18n.itTranslations)
    });
    (0, _defineProperty2["default"])(this, "dayjsLocales", {});
    (0, _defineProperty2["default"])(this, "localeExists", function (language) {
      if (_this.isCustomDateTimeParser) return true;
      return Object.keys(_dayjs["default"].Ls).indexOf(language) > -1;
    });
    (0, _defineProperty2["default"])(this, "validateCurrentLanguage", function () {
      var availableLanguages = Object.keys(_this.translations);

      if (availableLanguages.indexOf(_this.currentLanguage) === -1) {
        _this.logger("Streami18n: '".concat(_this.currentLanguage, "' language is not registered.") + " Please make sure to call streami18n.registerTranslation('".concat(_this.currentLanguage, "', {...}) or ") + "use one the built-in supported languages - ".concat(_this.getAvailableLanguages()));

        _this.currentLanguage = defaultLng;
      }
    });
    (0, _defineProperty2["default"])(this, "geti18Instance", function () {
      return _this.i18nInstance;
    });
    (0, _defineProperty2["default"])(this, "getAvailableLanguages", function () {
      return Object.keys(_this.translations);
    });
    (0, _defineProperty2["default"])(this, "getTranslations", function () {
      return _this.translations;
    });

    var finalOptions = _objectSpread({}, defaultStreami18nOptions, {}, options); // Prepare the i18next configuration.


    this.logger = finalOptions.logger;
    this.currentLanguage = finalOptions.language;
    this.DateTimeParser = finalOptions.DateTimeParser;

    try {
      // This is a shallow check to see if given parser is instance of Dayjs.
      // For some reason Dayjs.isDayjs(this.DateTimeParser()) doesn't work.
      if (this.DateTimeParser && this.DateTimeParser.extend) {
        this.DateTimeParser.extend(_localizedFormat["default"]);
        this.DateTimeParser.extend(_calendar["default"]);
        this.DateTimeParser.extend(_localeData["default"]);
        this.DateTimeParser.extend(_relativeTime["default"]);
      }
    } catch (error) {
      throw Error("Streami18n: Looks like you wanted to provide Dayjs instance, but something went wrong while adding plugins", error);
    }

    this.isCustomDateTimeParser = !!options.DateTimeParser;
    var translationsForLanguage = finalOptions.translationsForLanguage;

    if (translationsForLanguage) {
      this.translations[this.currentLanguage] = (0, _defineProperty2["default"])({}, defaultNS, translationsForLanguage);
    } // If translations don't exist for given language, then set it as empty object.


    if (!this.translations[this.currentLanguage]) {
      this.translations[this.currentLanguage] = (0, _defineProperty2["default"])({}, defaultNS, {});
    }

    this.i18nextConfig = {
      nsSeparator: false,
      keySeparator: false,
      fallbackLng: false,
      debug: finalOptions.debug,
      lng: this.currentLanguage,
      interpolation: {
        escapeValue: false
      },
      parseMissingKeyHandler: function parseMissingKeyHandler(key) {
        _this.logger("Streami18n: Missing translation for key: ".concat(key));

        return key;
      }
    };
    this.validateCurrentLanguage(this.currentLanguage);
    var dayjsLocaleConfigForLanguage = finalOptions.dayjsLocaleConfigForLanguage;

    if (dayjsLocaleConfigForLanguage) {
      this.addOrUpdateLocale(this.currentLanguage, _objectSpread({}, dayjsLocaleConfigForLanguage));
    } else if (!this.localeExists(this.currentLanguage)) {
      this.logger("Streami18n: Streami18n(...) - Locale config for ".concat(this.currentLanguage, " does not exist in momentjs.") + "Please import the locale file using \"import 'moment/locale/".concat(this.currentLanguage, "';\" in your app or ") + "register the locale config with Streami18n using registerTranslation(language, translation, customDayjsLocale)");
    }

    this.tDateTimeParser = function (timestamp) {
      if (finalOptions.disableDateTimeTranslations || !_this.localeExists(_this.currentLanguage)) {
        return _this.DateTimeParser(timestamp).locale(defaultLng);
      }

      return _this.DateTimeParser(timestamp).locale(_this.currentLanguage);
    };
  }
  /**
   * Initializes the i18next instance with configuration (which enables natural language as default keys)
   */


  (0, _createClass2["default"])(Streami18n, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.validateCurrentLanguage();
                _context.prev = 1;
                _context.next = 4;
                return this.i18nInstance.init(_objectSpread({}, this.i18nextConfig, {
                  resources: this.translations,
                  lng: this.currentLanguage
                }));

              case 4:
                this.t = _context.sent;
                this.initialized = true;
                return _context.abrupt("return", {
                  t: this.t,
                  tDateTimeParser: this.tDateTimeParser
                });

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](1);
                this.logger("Something went wrong with init:", _context.t0);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 9]]);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "getTranslators",

    /**
     * Returns current version translator function.
     */
    value: function () {
      var _getTranslators = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.initialized) {
                  _context2.next = 7;
                  break;
                }

                if (this.dayjsLocales[this.currentLanguage]) {
                  this.addOrUpdateLocale(this.currentLanguage, this.dayjsLocales[this.currentLanguage]);
                }

                _context2.next = 4;
                return this.init();

              case 4:
                return _context2.abrupt("return", _context2.sent);

              case 7:
                return _context2.abrupt("return", {
                  t: this.t,
                  tDateTimeParser: this.tDateTimeParser
                });

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getTranslators() {
        return _getTranslators.apply(this, arguments);
      }

      return getTranslators;
    }()
    /**
     * Register translation
     *
     * @param {*} language
     * @param {*} translation
     * @param {*} customDayjsLocale
     */

  }, {
    key: "registerTranslation",
    value: function registerTranslation(language, translation, customDayjsLocale) {
      if (!translation) {
        this.logger("Streami18n: registerTranslation(language, translation, customDayjsLocale) called without translation");
        return;
      }

      if (!this.translations[language]) {
        this.translations[language] = (0, _defineProperty2["default"])({}, defaultNS, translation);
      } else {
        this.translations[language][defaultNS] = translation;
      }

      if (customDayjsLocale) {
        this.dayjsLocales[language] = _objectSpread({}, customDayjsLocale);
      } else if (!this.localeExists(language)) {
        this.logger("Streami18n: registerTranslation(language, translation, customDayjsLocale) - " + "Locale config for ".concat(language, " does not exist in Dayjs.") + "Please import the locale file using \"import 'dayjs/locale/".concat(language, "';\" in your app or ") + "register the locale config with Streami18n using registerTranslation(language, translation, customDayjsLocale)");
      }

      if (this.initialized) {
        this.i18nInstance.addResources(language, defaultNS, translation);
      }
    }
  }, {
    key: "addOrUpdateLocale",
    value: function addOrUpdateLocale(key, config) {
      if (this.localeExists(key)) {
        _dayjs["default"].updateLocale(key, _objectSpread({}, config));
      } else {
        // Merging the custom locale config with en config, so missing keys can default to english.
        _dayjs["default"].locale(_objectSpread({
          name: key
        }, _objectSpread({}, en_locale, {}, config)), null, true);
      }
    }
    /**
     * Changes the language.
     * @param {*} language
     */

  }, {
    key: "setLanguage",
    value: function () {
      var _setLanguage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(language) {
        var t;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.currentLanguage = language;

                if (this.initialized) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                _context3.prev = 3;
                _context3.next = 6;
                return this.i18nInstance.changeLanguage(language);

              case 6:
                t = _context3.sent;

                if (this.dayjsLocales[language]) {
                  this.addOrUpdateLocale(this.currentLanguage, this.dayjsLocales[this.currentLanguage]);
                }

                this.setLanguageCallback(t);
                return _context3.abrupt("return", t);

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](3);
                this.logger("Failed to set language:", _context3.t0);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 12]]);
      }));

      function setLanguage(_x) {
        return _setLanguage.apply(this, arguments);
      }

      return setLanguage;
    }()
    /**
     *
     * @param {*} callback
     */

  }, {
    key: "registerSetLanguageCallback",
    value: function registerSetLanguageCallback(callback) {
      this.setLanguageCallback = callback;
    }
  }]);
  return Streami18n;
}();

exports.Streami18n = Streami18n;