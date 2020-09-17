"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _pickphoto = _interopRequireDefault(require("../images/icons/pickphoto.png"));

var _styles = require("../styles");

var UploadImage = function UploadImage(_ref) {
  var onUploadButtonPress = _ref.onUploadButtonPress,
      props = (0, _objectWithoutProperties2["default"])(_ref, ["onUploadButtonPress"]);
  var styles = (0, _styles.buildStylesheet)('uploadImage', props.styles || {});
  return /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
    onPress: onUploadButtonPress
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.Image, {
    source: _pickphoto["default"],
    style: styles.image
  })));
};

var _default = UploadImage;
exports["default"] = _default;