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

var _utils = require("../utils");

var _Avatar = _interopRequireDefault(require("./Avatar"));

var _styles = require("../styles");

var _Context = require("../Context");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Renders a comment
 * @example ./examples/CommentItem.md
 */
var CommentItem = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(CommentItem, _React$Component);

  var _super = _createSuper(CommentItem);

  function CommentItem() {
    (0, _classCallCheck2["default"])(this, CommentItem);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(CommentItem, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      if (this.props.componentDidCatch) {
        this.props.componentDidCatch(error, info, this.props);
      } else {
        console.error(error);
        console.error('The following comment caused the previous error');
        console.error(this.props.comment);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          comment = _this$props.comment,
          tDateTimeParser = _this$props.tDateTimeParser;
      var styles = (0, _styles.buildStylesheet)('commentItem', this.props.styles || {});
      return /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: styles.container
      }, /*#__PURE__*/_react["default"].createElement(_Avatar["default"], {
        source: comment.user.data.profileImage,
        size: 25,
        noShadow: true
      }), /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: styles.commentText
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.Text, null, /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
        style: styles.commentAuthor
      }, comment.user.data.name, " "), /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
        style: styles.commentContent
      }, comment.data.text, " "), /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
        style: styles.commentTime
      }, (0, _utils.humanizeTimestamp)(comment.created_at, tDateTimeParser)))), (0, _utils.smartRender)(this.props.Footer));
    }
  }]);
  return CommentItem;
}(_react["default"].Component);

var _default = (0, _Context.withTranslationContext)(CommentItem);

exports["default"] = _default;