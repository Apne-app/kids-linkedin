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

var _styles = require("../styles");

var _Context = require("../Context");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Renders a toggle button to follow another user's feed
 * @example ./examples/FollowButton.md
 */
var FollowButton = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(FollowButton, _React$Component);

  var _super = _createSuper(FollowButton);

  function FollowButton(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, FollowButton);
    _this = _super.call(this, props);
    _this.state = {
      followed: _this.props.followed || false
    };
    return _this;
  }

  (0, _createClass2["default"])(FollowButton, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          clicked = _this$props.clicked,
          t = _this$props.t;
      var styles = (0, _styles.buildStylesheet)('followButton', this.props.styles);
      return /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
        onClick: clicked
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        colors: this.state.followed ? ['#ccc', '#ccc'] : ['#008DFF', '#0079FF'],
        style: styles.button
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
        style: styles.buttonText
      }, this.state.followed ? t('Following') : t('Follow'))));
    }
  }]);
  return FollowButton;
}(_react["default"].Component);

(0, _defineProperty2["default"])(FollowButton, "defaultProps", {
  followed: false
});

var _default = (0, _Context.withTranslationContext)(FollowButton);

exports["default"] = _default;