"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _UploadImage = _interopRequireDefault(require("./UploadImage"));

var _Context = require("../Context");

var _styles = require("../styles");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * A users' profile picture
 * @example ./examples/Avatar.md
 */
var Avatar = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Avatar, _React$Component);

  var _super = _createSuper(Avatar);

  function Avatar() {
    (0, _classCallCheck2["default"])(this, Avatar);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Avatar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          source = _this$props.source,
          props = (0, _objectWithoutProperties2["default"])(_this$props, ["source"]);

      if (typeof source === 'function') {
        var funcSource = source;
        return /*#__PURE__*/_react["default"].createElement(_Context.StreamApp.Consumer, null, function (appCtx) {
          var newSource;

          if (appCtx.user.full) {
            newSource = funcSource(appCtx.user.full);
          }

          return /*#__PURE__*/_react["default"].createElement(AvatarInner, (0, _extends2["default"])({}, props, {
            source: newSource
          }));
        });
      } else {
        return /*#__PURE__*/_react["default"].createElement(AvatarInner, (0, _extends2["default"])({}, props, {
          source: source
        }));
      }
    }
  }]);
  return Avatar;
}(_react["default"].Component);

exports["default"] = Avatar;

var AvatarInner = function AvatarInner(props) {
  var source = props.source,
      _props$size = props.size,
      size = _props$size === void 0 ? 200 : _props$size,
      noShadow = props.noShadow,
      notRound = props.notRound,
      editButton = props.editButton,
      onUploadButtonPress = props.onUploadButtonPress;
  var styles = (0, _styles.buildStylesheet)('avatar', props.styles || {});
  var borderRadius = notRound ? undefined : size / 2;
  return /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
    style: [styles.container, noShadow ? styles.noShadow : null, {
      width: size,
      height: size
    }]
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.Image, {
    style: [styles.image, {
      width: size,
      height: size,
      borderRadius: borderRadius
    }],
    source: source ? {
      uri: source
    } : require('../images/placeholder.png'),
    resizeMethod: "resize"
  }), editButton ? /*#__PURE__*/_react["default"].createElement(_UploadImage["default"], {
    onUploadButtonPress: onUploadButtonPress
  }) : null);
};