"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNativeStickyKeyboardAccessory = _interopRequireDefault(require("react-native-sticky-keyboard-accessory"));

var _Avatar = _interopRequireDefault(require("./Avatar"));

var _styles = require("../styles");

var _Context = require("../Context");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Comment box with keyboard control, avatar and text input
 * All props are fulfilled automatically if used as a child element
 * of an activity.
 */
var CommentBox = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(CommentBox, _React$Component);

  var _super = _createSuper(CommentBox);

  function CommentBox() {
    var _this;

    (0, _classCallCheck2["default"])(this, CommentBox);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      text: ''
    });
    return _this;
  }

  (0, _createClass2["default"])(CommentBox, [{
    key: "postComment",
    value: function postComment(event) {
      if (this.props.onSubmit !== undefined) {
        this.props.onSubmit(event.nativeEvent.text);
      } else {
        this.props.onAddReaction('comment', this.props.activity, {
          text: event.nativeEvent.text
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          noKeyboardAccessory = _this$props.noKeyboardAccessory,
          textInputProps = _this$props.textInputProps,
          t = _this$props.t;
      var styles = (0, _styles.buildStylesheet)('commentBox', this.props.styles);

      var input = /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: styles.container
      }, this.props.noAvatar || /*#__PURE__*/_react["default"].createElement(_Avatar["default"], (0, _extends2["default"])({
        size: 48,
        styles: styles.avatar
      }, this.props.avatarProps)), /*#__PURE__*/_react["default"].createElement(_reactNative.TextInput, (0, _extends2["default"])({
        value: this.state.text,
        style: styles.textInput,
        underlineColorAndroid: "transparent",
        onChangeText: function onChangeText(text) {
          return _this2.setState({
            text: text
          });
        },
        onSubmitEditing: function onSubmitEditing(event) {
          _this2.setState({
            text: ''
          });

          _this2.postComment(event);
        },
        placeholder: t('Start Typing...'),
        returnKeyType: "send"
      }, textInputProps)));

      if (noKeyboardAccessory) {
        return input;
      }

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: {
          height: this.props.height
        }
      }), /*#__PURE__*/_react["default"].createElement(_reactNativeStickyKeyboardAccessory["default"], {
        verticalOffset: this.props.verticalOffset
      }, input));
    }
  }]);
  return CommentBox;
}(_react["default"].Component);

(0, _defineProperty2["default"])(CommentBox, "defaultProps", {
  styles: {},
  height: 80,
  verticalOffset: 0,
  noKeyboardAccessory: false
});

var _default = (0, _Context.withTranslationContext)(CommentBox);

exports["default"] = _default;