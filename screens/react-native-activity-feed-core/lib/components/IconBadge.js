"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _Context = require("../Context");

var _styles = require("../styles");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * A badge icon that notifies the user if a feed has new activities
 * @example ./examples/IconBadge.md
 */
var IconBadge = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(IconBadge, _React$Component);

  var _super = _createSuper(IconBadge);

  function IconBadge() {
    (0, _classCallCheck2["default"])(this, IconBadge);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(IconBadge, [{
    key: "render",
    value: function render() {
      var _this = this;

      return /*#__PURE__*/React.createElement(_Context.Feed, {
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
        notify: true
      }, /*#__PURE__*/React.createElement(_Context.FeedContext.Consumer, null, function (feedCtx) {
        return /*#__PURE__*/React.createElement(IconBadgeInner, (0, _extends2["default"])({}, _this.props, feedCtx));
      }));
    }
  }]);
  return IconBadge;
}(React.Component);

exports["default"] = IconBadge;
(0, _defineProperty2["default"])(IconBadge, "defaultProps", {
  feedGroup: 'notification',
  showNumber: false
});

var IconBadgeInner = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2["default"])(IconBadgeInner, _React$Component2);

  var _super2 = _createSuper(IconBadgeInner);

  function IconBadgeInner() {
    (0, _classCallCheck2["default"])(this, IconBadgeInner);
    return _super2.apply(this, arguments);
  }

  (0, _createClass2["default"])(IconBadgeInner, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.props.refreshUnreadUnseen();

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          showNumber = _this$props.showNumber,
          hidden = _this$props.hidden;
      var styles = (0, _styles.buildStylesheet)('iconBadge', this.props.styles);
      return /*#__PURE__*/React.createElement(_reactNative.View, {
        style: styles.container
      }, children, !hidden && this.props.unseen > 0 && /*#__PURE__*/React.createElement(_reactNative.View, {
        style: styles.icon
      }, /*#__PURE__*/React.createElement(_reactNative.View, {
        style: styles.iconInner
      }, showNumber && /*#__PURE__*/React.createElement(_reactNative.Text, {
        style: styles.text
      }, this.props.unseen))));
    }
  }]);
  return IconBadgeInner;
}(React.Component);