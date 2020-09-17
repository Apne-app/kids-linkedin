"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _utils = require("../utils");

var _Avatar = _interopRequireDefault(require("./Avatar"));

var _FollowButton = _interopRequireDefault(require("./FollowButton"));

var _styles = require("../styles");

var _Context = require("../Context");

/**
 * A compact horizontal user information box (it is used as activities' header)
 * @example ./examples/UserBar.md
 */
var UserBar = (0, _Context.withTranslationContext)(function (_ref) {
  var username = _ref.username,
      subtitle = _ref.subtitle,
      avatar = _ref.avatar,
      follow = _ref.follow,
      onPressAvatar = _ref.onPressAvatar,
      icon = _ref.icon,
      tDateTimeParser = _ref.tDateTimeParser,
      props = (0, _objectWithoutProperties2["default"])(_ref, ["username", "subtitle", "avatar", "follow", "onPressAvatar", "icon", "tDateTimeParser"]);
  username = username || 'Unknown';
  var time = props.time;

  if (time === undefined && props.timestamp != null) {
    time = (0, _utils.humanizeTimestamp)(props.timestamp, tDateTimeParser);
  }

  var styles = (0, _styles.buildStylesheet)('userBar', props.styles);
  return /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
    style: styles.container
  }, avatar ? /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
    onPress: onPressAvatar,
    disabled: !onPressAvatar
  }, /*#__PURE__*/_react["default"].createElement(_Avatar["default"], {
    source: avatar,
    size: 48,
    noShadow: true,
    styles: styles && styles.avatar || {
      container: {
        marginRight: 10
      }
    }
  })) : null, /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
    style: styles.content
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
    style: styles.username
  }, username), /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
    style: {
      flexDirection: 'row'
    }
  }, icon !== undefined ? /*#__PURE__*/_react["default"].createElement(_reactNative.Image, {
    source: icon,
    style: {
      width: 24,
      height: 24,
      top: -2,
      marginRight: 5
    }
  }) : null, subtitle && /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
    style: styles.subtitle
  }, subtitle))), time && /*#__PURE__*/_react["default"].createElement(_reactNative.View, null, /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
    style: styles.time
  }, time)), follow && /*#__PURE__*/_react["default"].createElement(_reactNative.View, null, /*#__PURE__*/_react["default"].createElement(_FollowButton["default"], {
    followed: true
  })));
});
var _default = UserBar;
exports["default"] = _default;