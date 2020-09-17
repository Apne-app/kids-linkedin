"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ReactionToggleIcon;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _ReactionIcon = _interopRequireDefault(require("./ReactionIcon"));

/**
 * A generic component that can be used to toggle a reaction and display it's
 * current state. Mostly used for reactions such as like and repost.
 * The [source for
 * LikeButton](https://github.com/GetStream/react-native-activity-feed/blob/master/src/components/LikeButton.js)
 * is a good example of the usage of this component.
 */
function ReactionToggleIcon(_ref) {
  var activeIcon = _ref.activeIcon,
      inactiveIcon = _ref.inactiveIcon,
      own_reactions = _ref.own_reactions,
      _ref$kind = _ref.kind,
      kind = _ref$kind === void 0 ? 'like' : _ref$kind,
      props = (0, _objectWithoutProperties2["default"])(_ref, ["activeIcon", "inactiveIcon", "own_reactions", "kind"]);
  var icon = inactiveIcon;

  if (own_reactions && own_reactions[kind] && own_reactions[kind].length) {
    icon = activeIcon;
  }

  return /*#__PURE__*/_react["default"].createElement(_ReactionIcon["default"], (0, _extends2["default"])({
    icon: icon,
    kind: kind
  }, props));
}