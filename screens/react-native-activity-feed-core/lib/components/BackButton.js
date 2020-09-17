"use strict";

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

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _styles = require("../styles");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Back button
 * @example ./examples/BackButton.md
 */
var BackButton = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(BackButton, _React$Component);

  var _super = _createSuper(BackButton);

  function BackButton() {
    (0, _classCallCheck2["default"])(this, BackButton);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(BackButton, [{
    key: "render",
    value: function render() {
      var styles = (0, _styles.buildStylesheet)('backButton', this.props.styles);
      var _this$props = this.props,
          blue = _this$props.blue,
          pressed = _this$props.pressed;
      return /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
        style: styles.backButton,
        onPress: pressed
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.Image, {
        source: blue ? require('../images/icons/backarrow-blue.png') : require('../images/icons/backarrow.png'),
        style: styles.backArrow
      }));
    }
  }]);
  return BackButton;
}(_react["default"].Component);

exports["default"] = BackButton;