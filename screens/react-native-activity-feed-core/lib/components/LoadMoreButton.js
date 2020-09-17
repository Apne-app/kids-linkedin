"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _styles = require("../styles");

var _Context = require("../Context");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var LoadMoreButton = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(LoadMoreButton, _React$Component);

  var _super = _createSuper(LoadMoreButton);

  function LoadMoreButton() {
    (0, _classCallCheck2["default"])(this, LoadMoreButton);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(LoadMoreButton, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          refreshing = _this$props.refreshing,
          onPress = _this$props.onPress,
          t = _this$props.t;
      var styles = (0, _styles.buildStylesheet)('loadMoreButton', this.props.styles);
      return /*#__PURE__*/React.createElement(_reactNative.TouchableOpacity, {
        style: styles.button,
        onPress: onPress,
        disabled: refreshing
      }, /*#__PURE__*/React.createElement(_reactNative.Text, {
        style: styles.buttonText
      }, children || t('Load more')));
    }
  }]);
  return LoadMoreButton;
}(React.Component);

(0, _defineProperty2["default"])(LoadMoreButton, "defaultProps", {
  children: 'Load more'
});

var _default = (0, _Context.withTranslationContext)(LoadMoreButton);

exports["default"] = _default;