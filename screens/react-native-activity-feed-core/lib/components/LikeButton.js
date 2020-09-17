"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

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

var React = _interopRequireWildcard(require("react"));

var _styles = require("../styles");

var _ReactionToggleIcon = _interopRequireDefault(require("./ReactionToggleIcon"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Like button ready to be embedded as Activity footer
 * @example ./examples/LikeButton.md
 */
var LikeButton = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(LikeButton, _React$Component);

  var _super = _createSuper(LikeButton);

  function LikeButton() {
    var _this;

    (0, _classCallCheck2["default"])(this, LikeButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onPress", function () {
      var _this$props = _this.props,
          activity = _this$props.activity,
          reaction = _this$props.reaction,
          reactionKind = _this$props.reactionKind,
          onToggleReaction = _this$props.onToggleReaction,
          onToggleChildReaction = _this$props.onToggleChildReaction;

      if (reaction && onToggleChildReaction) {
        return onToggleChildReaction(reactionKind, reaction, {}, {});
      }

      return onToggleReaction(reactionKind, activity, {}, {});
    });
    return _this;
  }

  (0, _createClass2["default"])(LikeButton, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          activity = _this$props2.activity,
          reaction = _this$props2.reaction,
          reactionKind = _this$props2.reactionKind;
      var styles = (0, _styles.buildStylesheet)('likeButton', this.props.styles);
      var counts, own_reactions;

      if (reaction && this.props.onToggleChildReaction) {
        counts = reaction.children_counts;
        own_reactions = reaction.own_children;
      } else {
        counts = activity.reaction_counts;
        own_reactions = activity.own_reactions;
      }
      function nulre(){
        return null
      }
      return /*#__PURE__*/React.createElement(_ReactionToggleIcon["default"], {
        styles: styles,
        counts: counts,
        own_reactions: own_reactions,
        kind: reactionKind,
        onPress: this._onPress,
        labelFunction: nulre,
        activeIcon: require('../images/icons/heart.png'),
        inactiveIcon: require('../images/icons/heart-outline.png')
      });
    }
  }]);
  return LikeButton;
}(React.Component);

exports["default"] = LikeButton;
(0, _defineProperty2["default"])(LikeButton, "defaultProps", {
  reactionKind: 'like'
});