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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _Avatar = _interopRequireDefault(require("./Avatar"));

var _FollowButton = _interopRequireDefault(require("./FollowButton"));

var _styles = require("../styles");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var UserCard = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(UserCard, _React$Component);

  var _super = _createSuper(UserCard);

  function UserCard() {
    (0, _classCallCheck2["default"])(this, UserCard);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(UserCard, [{
    key: "render",
    value: function render() {
      var styles = (0, _styles.buildStylesheet)('userCard', this.props.styles);
      var user = this.props.user;
      return /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: styles.container
      }, /*#__PURE__*/_react["default"].createElement(_Avatar["default"], {
        source: user.profileImage,
        size: 42,
        noShadow: true
      }), /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
        style: styles.text
      }, user.name), /*#__PURE__*/_react["default"].createElement(_FollowButton["default"], null));
    }
  }]);
  return UserCard;
}(_react["default"].Component);

exports["default"] = UserCard;
(0, _defineProperty2["default"])(UserCard, "defaultProps", {});