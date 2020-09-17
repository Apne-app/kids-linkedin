"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var CommentsContainer = function CommentsContainer(_ref) {
  var data = _ref.data,
      renderComment = _ref.renderComment,
      renderMoreLink = _ref.renderMoreLink,
      maxComments = _ref.maxComments;
  return /*#__PURE__*/_react["default"].createElement(_reactNative.View, null, data.slice(0, maxComments).map(renderComment), data.length > 0 && data.length > maxComments ? renderMoreLink() : null);
};

var _default = CommentsContainer;
exports["default"] = _default;