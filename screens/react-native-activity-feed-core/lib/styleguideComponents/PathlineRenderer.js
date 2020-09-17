"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PathlineRenderer = PathlineRenderer;
exports["default"] = exports.styles = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Link = _interopRequireDefault(require("react-styleguidist/lib/rsg-components/Link"));

var _Styled = _interopRequireDefault(require("react-styleguidist/lib/rsg-components/Styled"));

var styles = function styles(_ref) {
  var space = _ref.space,
      fontFamily = _ref.fontFamily,
      fontSize = _ref.fontSize,
      color = _ref.color;
  return {
    pathline: {
      fontFamily: fontFamily.monospace,
      fontSize: fontSize.small,
      color: color.light,
      wordBreak: 'break-all'
    },
    copyButton: {
      marginLeft: space[0]
    }
  };
};

exports.styles = styles;

function PathlineRenderer(_ref2) {
  var classes = _ref2.classes,
      children = _ref2.children;
  var source = children;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: classes.pathline
  }, /*#__PURE__*/_react["default"].createElement(_Link["default"], {
    href: 'https://github.com/GetStream/react-native-activity-feed/blob/master/' + source,
    target: "blank",
    rel: "noopener"
  }, source));
}

PathlineRenderer.propTypes = {
  classes: _propTypes["default"].object.isRequired,
  children: _propTypes["default"].string
};

var _default = (0, _Styled["default"])(styles)(PathlineRenderer);

exports["default"] = _default;