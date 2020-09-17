"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _styles = require("../styles");

var _lodash = _interopRequireDefault(require("lodash"));

/**
 * Card element
 * @example ./examples/Card.md
 */
var Card = function Card(props) {
  var title = props.title,
      description = props.description,
      image = props.image,
      url = props.url;
  var styles = (0, _styles.buildStylesheet)('card', props.styles);
  return /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
    onPress: function onPress() {
      _reactNative.Linking.openURL(url);
    },
    style: styles.container
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.Image, {
    style: styles.image,
    source: image ? {
      uri: image
    } : require('../images/placeholder.png'),
    resizeMethod: "resize"
  }), /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
    style: styles.content
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
    style: styles.title
  }, _lodash["default"].truncate(title, {
    length: 60
  })), /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
    style: styles.description
  }, _lodash["default"].truncate(description, {
    length: 60
  }))));
};

var _default = Card;
exports["default"] = _default;