"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ReactionIconBar;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _styles = require("../styles");

function ReactionIconBar(props) {
  var styles = (0, _styles.buildStylesheet)('reactionIconBar', props.styles);
  return /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.container
  }, props.children);
}