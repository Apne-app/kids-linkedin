"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAndroidTranslucentStatusBar = exports.androidTranslucentStatusBar = exports.registerNativeHandlers = exports.pickImage = void 0;

var _reactNative = require("react-native");

var _reactNativeSafeAreaView = _interopRequireDefault(require("react-native-safe-area-view"));

var pickImage = function pickImage() {
  throw Error('Native handler was not registered, you should import expo-activity-feed or react-native-activity-feed');
};

exports.pickImage = pickImage;

var registerNativeHandlers = function registerNativeHandlers(handlers) {
  if (handlers.pickImage) {
    exports.pickImage = pickImage = handlers.pickImage;
  }
};

exports.registerNativeHandlers = registerNativeHandlers;
var androidTranslucentStatusBar = false;
exports.androidTranslucentStatusBar = androidTranslucentStatusBar;

var setAndroidTranslucentStatusBar = function setAndroidTranslucentStatusBar() {
  var translucent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  if (_reactNative.Platform.OS === 'android') {
    exports.androidTranslucentStatusBar = androidTranslucentStatusBar = translucent;

    if (translucent) {
      // _reactNativeSafeAreaView["default"].setStatusBarHeight(24);
    } else {
      // _reactNativeSafeAreaView["default"].setStatusBarHeight(0);
    }
  }
};

exports.setAndroidTranslucentStatusBar = setAndroidTranslucentStatusBar;