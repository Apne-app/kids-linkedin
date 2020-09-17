"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _FlatFeed = _interopRequireDefault(require("./FlatFeed"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Shows the detail of a single activity
 * @example ./examples/SinglePost.md
 */
var SinglePost = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(SinglePost, _React$Component);

  var _super = _createSuper(SinglePost);

  function SinglePost() {
    (0, _classCallCheck2["default"])(this, SinglePost);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(SinglePost, [{
    key: "render",
    value: function render() {
      var _this = this;

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_FlatFeed["default"], {
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
        options: _objectSpread({
          withRecentReactions: true
        }, this.props.options),
        Activity: this.props.Activity,
        styles: this.props.styles,
        navigation: this.props.navigation,
        doFeedRequest: function doFeedRequest(client, feedGroup, userId, options) {
          return client.feed(feedGroup, userId).getActivityDetail(_this.props.activity.id, options);
        },
        doReactionAddRequest: this.props.doReactionAddRequest,
        doReactionDeleteRequest: this.props.doReactionDeleteRequest,
        doChildReactionAddRequest: this.props.doChildReactionAddRequest,
        doChildReactionDeleteRequest: this.props.doChildReactionDeleteRequest,
        doReactionsFilterRequest: this.props.doReactionsFilterRequest,
        Footer: this.props.Footer,
        setListRef: this.props.setListRef,
        noPagination: true
      }));
    }
  }]);
  return SinglePost;
}(_react["default"].Component);

exports["default"] = SinglePost;