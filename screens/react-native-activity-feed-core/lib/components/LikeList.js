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

var _ReactionList = _interopRequireDefault(require("./ReactionList"));

var _SectionHeader = _interopRequireDefault(require("./SectionHeader"));

var _Context = require("../Context");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * LikeList uses ReactionList under the hood to render a list of likes.
 *
 * @example ./examples/LikeList.md
 */
var LikeList = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2["default"])(LikeList, _React$PureComponent);

  var _super = _createSuper(LikeList);

  function LikeList() {
    (0, _classCallCheck2["default"])(this, LikeList);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(LikeList, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          activityId = _this$props.activityId,
          activityPath = _this$props.activityPath,
          t = _this$props.t;
      return /*#__PURE__*/_react["default"].createElement(_ReactionList["default"], {
        activityId: activityId,
        reactionKind: this.props.reactionKind,
        activityPath: activityPath,
        styles: {
          container: {
            padding: 12,
            paddingLeft: 15,
            paddingRight: 15
          }
        },
        flatListProps: {
          horizontal: true
        },
        Reaction: function Reaction(_ref) {
          var reaction = _ref.reaction;
          return /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
            style: {
              marginRight: 10
            }
          }, /*#__PURE__*/_react["default"].createElement(_Avatar["default"], {
            source: reaction.user.data.profileImage,
            size: 25,
            noShadow: true
          }));
        },
        noPagination: true
      }, /*#__PURE__*/_react["default"].createElement(_SectionHeader["default"], null, t('Likes')));
    }
  }]);
  return LikeList;
}(_react["default"].PureComponent);

(0, _defineProperty2["default"])(LikeList, "defaultProps", {
  reactionKind: 'like'
});

var _default = (0, _Context.withTranslationContext)(LikeList);

exports["default"] = _default;