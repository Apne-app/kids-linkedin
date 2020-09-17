"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SectionHeader;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _styles = require("../styles");

/**
 * Header components for list of reactions (eg. LikesList)
 * @example ./examples/SectionHeader.md
 */
function SectionHeader(props) {
  var styles = (0, _styles.buildStylesheet)('sectionHeader', props.styles);
  return /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(_reactNative.Text, {
    style: styles.label
  }, props.children));
}