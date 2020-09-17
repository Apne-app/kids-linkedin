"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _SectionHeader = _interopRequireDefault(require("./SectionHeader"));

var _CommentItem = _interopRequireDefault(require("./CommentItem"));

var _ReactionList = _interopRequireDefault(require("./ReactionList"));

var _LoadMoreButton = _interopRequireDefault(require("./LoadMoreButton"));

var _utils = require("../utils");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * CommentList uses ReactionList under the hood to render a list of comments.
 * To use this component in a `FlatFeed` you have to provide the following
 * props to `FlatFeed`:
 * ```
 * options={{withOwnReactions: true}}
 * ```
 *
 * @example ./examples/CommentList.md
 */
var CommentList = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2["default"])(CommentList, _React$PureComponent);

  var _super = _createSuper(CommentList);

  function CommentList() {
    var _this;

    (0, _classCallCheck2["default"])(this, CommentList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_Reaction", function (_ref) {
      var reaction = _ref.reaction;
      return (0, _utils.smartRender)(_this.props.CommentItem, {
        comment: reaction
      });
    });
    return _this;
  }

  (0, _createClass2["default"])(CommentList, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          activityId = _this$props.activityId,
          activityPath = _this$props.activityPath,
          infiniteScroll = _this$props.infiniteScroll,
          oldestToNewest = _this$props.oldestToNewest,
          reverseOrder = _this$props.reverseOrder,
          flatListProps = _this$props.flatListProps,
          LoadMoreButton = _this$props.LoadMoreButton;
      return /*#__PURE__*/_react["default"].createElement(_ReactionList["default"], {
        activityId: activityId,
        reactionKind: 'comment',
        Reaction: this._Reaction,
        activityPath: activityPath,
        infiniteScroll: infiniteScroll,
        oldestToNewest: oldestToNewest,
        flatListProps: flatListProps,
        reverseOrder: reverseOrder,
        LoadMoreButton: LoadMoreButton
      }, /*#__PURE__*/_react["default"].createElement(_SectionHeader["default"], null, "Comments"));
    }
  }]);
  return CommentList;
}(_react["default"].PureComponent);

exports["default"] = CommentList;
(0, _defineProperty2["default"])(CommentList, "defaultProps", {
  CommentItem: _CommentItem["default"],
  LoadMoreButton: _LoadMoreButton["default"],
  infiniteScroll: false,
  oldestToNewest: false,
  reverseOrder: false
});