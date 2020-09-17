"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _styles = require("../styles");

var _lodash = _interopRequireDefault(require("lodash"));

var _UserBar = _interopRequireDefault(require("./UserBar"));

var _Card = _interopRequireDefault(require("./Card"));

var _utils = require("../utils");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Renders feed activities
 * @example ./examples/Activity.md
 */
var Activity = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Activity, _React$Component);

  var _super = _createSuper(Activity);

  function Activity() {
    var _this;

    (0, _classCallCheck2["default"])(this, Activity);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_getOnPress", function () {
      if (_this.props.onPress) {
        return _this.props.onPress;
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_getOnPressAvatar", function () {
      if (_this.props.activity.actor !== 'NotFound' && _this.props.onPressAvatar) {
        return _this.props.onPressAvatar;
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "renderHeader", function () {
      var _this$props$activity = _this.props.activity,
          time = _this$props$activity.time,
          activityActor = _this$props$activity.actor;
      var notFound = {
        id: '!not-found',
        created_at: '',
        updated_at: '',
        data: {
          name: 'Unknown',
          profileImage: ''
        }
      };
      var actor;

      if (typeof activityActor === 'string' || typeof activityActor.error === 'string') {
        actor = notFound;
      } else {
        //$FlowBug
        actor = activityActor;
      }

      var styles = (0, _styles.buildStylesheet)('activity', _this.props.styles);
      return /*#__PURE__*/React.createElement(_reactNative.View, {
        style: styles.header
      }, /*#__PURE__*/React.createElement(_UserBar["default"], {
        username: actor.data.name,
        avatar: actor.data.profileImage,
        subtitle: _this.props.sub,
        timestamp: time,
        icon: _this.props.icon,
        onPressAvatar: _this._getOnPressAvatar()
      }));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onPressMention", function (text, activity) {
      if (_this.props.onPressMention !== undefined) {
        _this.props.onPressMention(text, activity);

        return;
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onPressHashtag", function (text, activity) {
      if (_this.props.onPressHashtag !== undefined) {
        _this.props.onPressHashtag(text, activity);

        return;
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getAndTrimUrl", function (text, activity) {
      if (activity.attachments && activity.attachments.og && Object.keys(activity.attachments.og).length > 0) {
        var textWithoutUrl = _lodash["default"].replace(text, activity.attachments.og.url, ' ');

        return textWithoutUrl.split(' ');
      } else {
        return text.split(' ');
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "renderText", function (text, activity) {
      var tokens = text.split(' ');
      var rendered = [];
      var styles = (0, _styles.buildStylesheet)('activity', _this.props.styles);

      var _loop = function _loop(i) {
        if (tokens[i][0] === '@') {
          rendered.push( /*#__PURE__*/React.createElement(_reactNative.Text, {
            style: styles.mention,
            onPress: function onPress() {
              _this.onPressMention(tokens[i], activity);
            },
            key: i
          }, tokens[i], ' '));
        } else if (tokens[i][0] === '#') {
          rendered.push( /*#__PURE__*/React.createElement(_reactNative.Text, {
            style: styles.hashtag,
            onPress: function onPress() {
              _this.onPressHashtag(tokens[i], activity);
            },
            key: i
          }, tokens[i], ' '));
        } else if (activity.attachments && activity.attachments.og && Object.keys(activity.attachments.og).length > 0 && tokens[i] === activity.attachments.og.url) {
          var url = activity.attachments.og.url;
          rendered.push( /*#__PURE__*/React.createElement(_reactNative.Text, {
            key: i,
            onPress: function onPress() {
              return _reactNative.Linking.openURL(url);
            },
            style: styles.url
          }, tokens[i].slice(0, 20), tokens[i].length > 20 ? '...' : '', ' '));
        } else {
          rendered.push( /*#__PURE__*/React.createElement(_reactNative.Text, {
            style: styles.text
          }, tokens[i] + ' '));
        }
      };

      for (var i = 0; i < tokens.length; i++) {
        _loop(i);
      }

      return rendered;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "renderContent", function () {
      // return null;
      var width = _this.props.imageWidth != null ? _this.props.imageWidth : _reactNative.Dimensions.get('window').width;
      var _this$props$activity2 = _this.props.activity,
          object = _this$props$activity2.object,
          image = _this$props$activity2.image,
          attachments = _this$props$activity2.attachments;
      var text = _this.props.activity.text;
      var styles = (0, _styles.buildStylesheet)('activity', _this.props.styles);
      var Card = _this.props.Card;

      if (text === undefined) {
        if (typeof object === 'string') {
          text = object;
        } else {
          text = '';
        }
      }

      text = text.trim();
      return /*#__PURE__*/React.createElement(_reactNative.View, null, Boolean(text) && /*#__PURE__*/React.createElement(_reactNative.View, {
        style: styles.content
      }, /*#__PURE__*/React.createElement(_reactNative.Text, {
        style: styles.text
      }, _this.renderText(text, _this.props.activity))), Boolean(image) && /*#__PURE__*/React.createElement(_reactNative.Image, {
        style: {
          width: width,
          height: width
        },
        source: {
          uri: image
        },
        resizeMethod: "resize"
      }), attachments && attachments.images && attachments.images.length > 0 && /*#__PURE__*/React.createElement(_reactNative.Image, {
        style: {
          width: width,
          height: width
        },
        source: {
          uri: attachments.images[0]
        },
        resizeMethod: "resize"
      }), attachments && attachments.og && Object.keys(attachments.og).length > 0 && (0, _utils.smartRender)(Card, {
        title: attachments.og.title,
        description: attachments.og.description,
        image: attachments.og.images && attachments.og.images.length > 0 ? attachments.og.images[0].image : null,
        url: attachments.og.url,
        og: attachments.og
      }));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "renderFooter", function () {
      return null;
    });
    return _this;
  }

  (0, _createClass2["default"])(Activity, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      if (this.props.componentDidCatch) {
        this.props.componentDidCatch(error, info, this.props);
      } else {
        console.error(error);
        console.error('The following activity caused the previous error');
        console.error(this.props.activity);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          Header = _this$props.Header,
          Content = _this$props.Content,
          Footer = _this$props.Footer;
      var styles = (0, _styles.buildStylesheet)('activity', this.props.styles);
      return /*#__PURE__*/React.createElement(_reactNative.TouchableOpacity, {
        style: [styles.container],
        onPress: this._getOnPress(),
        disabled: !this._getOnPress()
      }, (0, _utils.smartRender)(Header, {}, this.renderHeader), (0, _utils.smartRender)(Content, {}, this.renderContent), (0, _utils.smartRender)(Footer, {}, this.renderFooter));
    }
  }]);
  return Activity;
}(React.Component);

exports["default"] = Activity;
(0, _defineProperty2["default"])(Activity, "defaultProps", {
  Card: _Card["default"]
});