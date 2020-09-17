"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTranslationContext = withTranslationContext;
exports.TranslationContext = exports.StreamApp = exports.StreamContext = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _getstream = _interopRequireDefault(require("getstream"));

var _streamAnalytics = _interopRequireDefault(require("stream-analytics"));

var _dayjs = _interopRequireDefault(require("dayjs"));

var _Feed = require("./Feed");

var _errors = require("../errors");

var _Streami18n = require("../Streami18n");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var StreamContext = React.createContext({
  changedUserData: function changedUserData() {},
  sharedFeedManagers: {}
});
exports.StreamContext = StreamContext;

/**
 * Manages the connection with Stream. Any components that should talk to
 * Stream should be a child of this component.
 */
var StreamApp = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(StreamApp, _React$Component);

  var _super = _createSuper(StreamApp);

  function StreamApp(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, StreamApp);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getUserInfo", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _this.state.user.getOrCreate(_this.props.defaultUserData);

            case 3:
              _context.next = 9;
              break;

            case 5:
              _context.prev = 5;
              _context.t0 = _context["catch"](0);

              _this.props.errorHandler(_context.t0, 'get-user-info', {
                userId: _this.state.user.id
              });

              return _context.abrupt("return");

            case 9:
              _this.state.changedUserData();

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 5]]);
    })));

    var client = _getstream["default"].connect(_this.props.apiKey, _this.props.token, _this.props.appId, _this.props.options || {});

    var analyticsClient;
    _this.state = {
      client: client,
      user: client.currentUser,
      userData: client.currentUser.data,
      changedUserData: function changedUserData() {
        _this.setState({
          userData: _this.state.user.data
        });
      },
      analyticsClient: analyticsClient,
      sharedFeedManagers: {},
      errorHandler: _this.props.errorHandler
    };

    if (_this.props.analyticsToken) {
      analyticsClient = new _streamAnalytics["default"]({
        apiKey: _this.props.apiKey,
        token: _this.props.analyticsToken
      });
      analyticsClient.setUser(client.userId);
    }

    var _iterator = _createForOfIteratorHelper(_this.props.sharedFeeds),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var feedProps = _step.value;
        var manager = new _Feed.FeedManager(_objectSpread({}, feedProps, {
          client: _this.state.client,
          user: _this.state.user,
          userData: _this.state.userData,
          changedUserData: _this.state.changedUserData,
          analyticsClient: _this.state.analyticsClient,
          sharedFeedManagers: _this.state.sharedFeedManagers,
          errorHandler: _this.state.errorHandler
        }));
        _this.state.sharedFeedManagers[manager.feed().id] = manager;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return _this;
  }

  (0, _createClass2["default"])(StreamApp, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var appIdDifferent = this.props.appId !== prevProps.appId;

      if (appIdDifferent) {//TODO: Implement
      }
    }
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _this2 = this;

        var i18nInstance, streami18n, _yield$streami18n$get, t, tDateTimeParser;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.getUserInfo();
                i18nInstance = this.props.i18nInstance;

                if (i18nInstance && i18nInstance instanceof _Streami18n.Streami18n) {
                  streami18n = i18nInstance;
                } else {
                  streami18n = new _Streami18n.Streami18n({
                    language: 'en'
                  });
                }

                streami18n.registerSetLanguageCallback(function (t) {
                  _this2.setState({
                    t: t
                  });
                });
                _context2.next = 6;
                return streami18n.getTranslators();

              case 6:
                _yield$streami18n$get = _context2.sent;
                t = _yield$streami18n$get.t;
                tDateTimeParser = _yield$streami18n$get.tDateTimeParser;
                this.setState({
                  t: t,
                  tDateTimeParser: tDateTimeParser
                });

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      if (!this.state.t) return null;
      var _this$state = this.state,
          t = _this$state.t,
          tDateTimeParser = _this$state.tDateTimeParser,
          streamContextValue = (0, _objectWithoutProperties2["default"])(_this$state, ["t", "tDateTimeParser"]);
      return /*#__PURE__*/React.createElement(StreamContext.Provider, {
        value: _objectSpread({}, streamContextValue)
      }, /*#__PURE__*/React.createElement(TranslationContext.Provider, {
        value: {
          t: t,
          tDateTimeParser: tDateTimeParser
        }
      }, this.props.children));
    }
  }]);
  return StreamApp;
}(React.Component);

exports.StreamApp = StreamApp;
(0, _defineProperty2["default"])(StreamApp, "defaultProps", {
  sharedFeeds: [{
    feedGroup: 'notification',
    notify: true,
    options: {
      mark_seen: true
    }
  }],
  defaultUserData: {
    name: 'Unknown'
  },
  errorHandler: _errors.handleError
});
(0, _defineProperty2["default"])(StreamApp, "Consumer", function StreamAppConsumer(props) {
  return /*#__PURE__*/React.createElement(StreamContext.Consumer, null, function (appCtx) {
    if (!props.children || !props.children.length) {
      return null;
    }

    if (!appCtx.client || !appCtx.user) {
      throw new Error('This component should be a child of a StreamApp component');
    }

    var Child = props.children;
    return Child(appCtx);
  });
});
var TranslationContext = React.createContext({
  t: function t(msg) {
    return msg;
  },
  tDateTimeParser: function tDateTimeParser(input) {
    return (0, _dayjs["default"])(input);
  }
});
exports.TranslationContext = TranslationContext;

function withTranslationContext(OriginalComponent) {
  var ContextAwareComponent = function ContextComponent(props) {
    return /*#__PURE__*/React.createElement(TranslationContext.Consumer, null, function (translationContext) {
      return OriginalComponent && /*#__PURE__*/React.createElement(OriginalComponent, (0, _extends2["default"])({}, translationContext, props));
    });
  };

  ContextAwareComponent.displayName = OriginalComponent.displayName || OriginalComponent.name || 'Component';
  ContextAwareComponent.displayName = ContextAwareComponent.displayName.replace('Base', '');
  return ContextAwareComponent;
}