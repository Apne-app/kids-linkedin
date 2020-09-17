"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _Context = require("../Context");

var _UrlPreview = _interopRequireDefault(require("./UrlPreview"));

var _native = require("../native");

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _styles = require("../styles");

var _lodash = _interopRequireDefault(require("lodash"));

var _es6Symbol = _interopRequireDefault(require("es6-symbol"));

var _reactNativeStickyKeyboardAccessory = _interopRequireDefault(require("react-native-sticky-keyboard-accessory"));

var _reactNativeKeyboardSpacer = _interopRequireDefault(require("react-native-keyboard-spacer"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ImageState = Object.freeze({
  NO_IMAGE: (0, _es6Symbol["default"])('no_image'),
  UPLOADING: (0, _es6Symbol["default"])('uploading'),
  UPLOADED: (0, _es6Symbol["default"])('uploaded'),
  UPLOAD_FAILED: (0, _es6Symbol["default"])('upload_failed')
});
var urlRegex = /(https?:\/\/[^\s]+)/gi;

var StatusUpdateForm = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(StatusUpdateForm, _React$Component);

  var _super = _createSuper(StatusUpdateForm);

  function StatusUpdateForm() {
    (0, _classCallCheck2["default"])(this, StatusUpdateForm);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(StatusUpdateForm, [{
    key: "render",
    value: function render() {
      var _this = this;

      return /*#__PURE__*/_react["default"].createElement(_Context.StreamApp.Consumer, null, function (appCtx) {
        if (_this.props.fullscreen) {
          return /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
            style: {
              flex: 1
            }
          }, /*#__PURE__*/_react["default"].createElement(StatusUpdateFormInner, (0, _extends2["default"])({}, _this.props, appCtx)));
        } else {
          if ((_reactNative.Platform.OS === 'ios' || _native.androidTranslucentStatusBar) && !_this.props.noKeyboardAccessory) {
            return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
              style: {
                height: _this.props.height
              }
            }), /*#__PURE__*/_react["default"].createElement(_reactNativeStickyKeyboardAccessory["default"], {
              verticalOffset: _this.props.verticalOffset
            }, /*#__PURE__*/_react["default"].createElement(StatusUpdateFormInner, (0, _extends2["default"])({}, _this.props, appCtx))));
          } else {
            return /*#__PURE__*/_react["default"].createElement(StatusUpdateFormInner, (0, _extends2["default"])({}, _this.props, appCtx));
          }
        }
      });
    }
  }]);
  return StatusUpdateForm;
}(_react["default"].Component);

(0, _defineProperty2["default"])(StatusUpdateForm, "defaultProps", {
  feedGroup: 'user',
  activityVerb: 'post',
  fullscreen: false,
  modifyActivityData: function modifyActivityData(d) {
    return d;
  },
  height: 80,
  verticalOffset: 0,
  noKeyboardAccessory: false,
  styles: {
    urlPreview: {
      wrapper: {
        padding: 15,
        paddingTop: 8,
        paddingBottom: 8,
        borderTopColor: '#eee',
        borderTopWidth: 1
      },
      textStyle: {
        fontSize: 14
      }
    }
  }
});

var StatusUpdateFormInner = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2["default"])(StatusUpdateFormInner, _React$Component2);

  var _super2 = _createSuper(StatusUpdateFormInner);

  function StatusUpdateFormInner(props) {
    var _this2;

    (0, _classCallCheck2["default"])(this, StatusUpdateFormInner);
    _this2 = _super2.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_handleOgDebounced", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "textInputRef", _react["default"].createRef());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "state", {
      image: null,
      imageUrl: null,
      imageState: ImageState.NO_IMAGE,
      og: null,
      ogScraping: false,
      ogLink: null,
      textFromInput: '',
      clearInput: false,
      focused: false,
      urls: [],
      dismissedUrls: []
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_pickImage", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var result, response, contentType, filename;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _native.pickImage)();

            case 2:
              result = _context.sent;

              if (!result.cancelled) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return");

            case 5:
              _this2.setState({
                image: result.uri,
                imageState: ImageState.UPLOADING
              });

              if (_reactNative.Platform.OS === 'android') {
                filename = result.uri.replace(/^(file:\/\/|content:\/\/)/, '');
                contentType = _mimeTypes["default"].lookup(filename) || 'application/octet-stream';
              }

              _context.prev = 7;
              _context.next = 10;
              return _this2.props.client.images.upload(result.uri, null, contentType);

            case 10:
              response = _context.sent;
              _context.next = 19;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](7);
              console.warn(_context.t0);

              _this2.setState({
                imageState: ImageState.UPLOAD_FAILED,
                image: null
              });

              _this2.props.errorHandler(_context.t0, 'upload-image', {
                feedGroup: _this2.props.feedGroup,
                userId: _this2.props.userId
              });

              return _context.abrupt("return");

            case 19:
              _this2.setState({
                imageState: ImageState.UPLOADED,
                imageUrl: response.file
              });

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[7, 13]]);
    })));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_removeImage", function () {
      _this2.setState({
        imageState: ImageState.NO_IMAGE,
        imageUrl: null,
        image: null
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_text", function () {
      return _this2.state.textFromInput.trim();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_object", function () {
      if (_this2.state.imageUrl) {
        return _this2.state.imageUrl;
      }

      return _this2._text();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_canSubmit", function () {
      return Boolean(_this2._object());
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_onPressDismiss", function (url) {
      var oldDismissedUrls = _this2.state.dismissedUrls;

      _this2.setState({
        dismissedUrls: [].concat((0, _toConsumableArray2["default"])(oldDismissedUrls), [url]),
        ogScraping: false,
        ogLink: null,
        og: null
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "onSubmitForm", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _this2.addActivity();

            case 3:
              _context2.next = 9;
              break;

            case 5:
              _context2.prev = 5;
              _context2.t0 = _context2["catch"](0);

              _this2.props.errorHandler(_context2.t0, 'add-activity', {
                feedGroup: _this2.props.feedGroup,
                userId: _this2.props.userId
              });

              return _context2.abrupt("return");

            case 9:
              _reactNative.Keyboard.dismiss();

              _this2.setState({
                image: null,
                imageUrl: null,
                imageState: ImageState.NO_IMAGE,
                og: null,
                ogScraping: false,
                ogLink: null,
                textFromInput: '',
                focused: false,
                urls: [],
                dismissedUrls: []
              });

              if (_this2.props.onSuccess) {
                _this2.props.onSuccess();
              }

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 5]]);
    })));
    _this2._handleOgDebounced = _lodash["default"].debounce(_this2.handleOG, 250);
    return _this2;
  }

  (0, _createClass2["default"])(StatusUpdateFormInner, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      if (this.props.registerSubmit) {
        this.props.registerSubmit(function () {
          return _this3.onSubmitForm();
        });
      }
    }
  }, {
    key: "addActivity",
    value: function () {
      var _addActivity = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var activity, attachments, modifiedActivity;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                activity = {
                  actor: this.props.client.currentUser,
                  verb: this.props.activityVerb,
                  object: this._object()
                };
                attachments = {};

                if (this.state.og && Object.keys(this.state.og).length > 0) {
                  attachments.og = this.state.og;
                }

                if (this.state.imageUrl) {
                  attachments.images = [this.state.imageUrl];
                  activity.text = this._text();
                }

                if (Object.keys(attachments).length > 0) {
                  activity.attachments = attachments;
                }

                modifiedActivity = this.props.modifyActivityData(activity);

                if (!this.props.doRequest) {
                  _context3.next = 11;
                  break;
                }

                _context3.next = 9;
                return this.props.doRequest(modifiedActivity);

              case 9:
                _context3.next = 13;
                break;

              case 11:
                _context3.next = 13;
                return this.props.client.feed(this.props.feedGroup, this.props.userId).addActivity(modifiedActivity);

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function addActivity() {
        return _addActivity.apply(this, arguments);
      }

      return addActivity;
    }()
  }, {
    key: "handleOG",
    value: function handleOG(text) {
      var _this4 = this;

      if (this.state.ogScraping) {
        return;
      }

      var urls = text.match(urlRegex);

      if (!urls) {
        this.setState({
          og: null,
          ogLink: null
        });
        return;
      }

      urls.forEach(function (url) {
        if (url !== _this4.state.ogLink && !(_this4.state.dismissedUrls.indexOf(url) > -1) && !_this4.state.og && urls.indexOf(url) > -1) {
          _this4.setState({
            ogScraping: true,
            ogLink: url,
            og: url === _this4.state.ogLink ? _this4.state.og : null
          });

          _this4.props.client.og(url).then(function (resp) {
            var oldStateUrls = _this4.state.urls;

            _this4.setState({
              og: Object.keys(resp).length > 0 ? _objectSpread({}, resp, {
                url: url
              }) : null,
              // Added url manually from the entered URL
              ogScraping: false,
              urls: [].concat((0, _toConsumableArray2["default"])(oldStateUrls), [url])
            }, function () {
              return text.replace(url, '');
            });
          })["catch"](function (err) {
            console.log(err);

            _this4.setState({
              ogScraping: false,
              og: null
            });
          });
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var t = this.props.t;
      var styles = (0, _styles.buildStylesheet)('statusUpdateForm', this.props.styles);
      return /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: [this.props.fullscreen ? {
          flex: 1
        } : {}]
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: [styles.container, this.props.height ? {
          height: this.props.height
        } : {
          height: 80
        }, this.state.focused ? styles.containerFocused : {}, this.state.og ? styles.containerFocusedOg : {}, this.props.fullscreen ? {
          flex: 1
        } : {}]
      }, this.state.og && /*#__PURE__*/_react["default"].createElement(_UrlPreview["default"], {
        onPressDismiss: this._onPressDismiss,
        og: this.state.og,
        styles: // $FlowFixMe
        this.props.styles.urlPreview
      }), /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: styles.newPostContainer
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: [styles.textInput]
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.TextInput, (0, _extends2["default"])({
        ref: this.textInputRef,
        style: this.props.fullscreen ? {
          flex: 1
        } : {},
        multiline: true,
        onChangeText: function onChangeText(text) {
          _this5.setState({
            textFromInput: text
          });

          _this5._handleOgDebounced(text);
        },
        value: this.state.textFromInput,
        autocorrect: false,
        placeholder: t('Type your post...'),
        underlineColorAndroid: "transparent",
        onBlur: function onBlur() {
          return _this5.setState({
            focused: false
          });
        },
        onFocus: function onFocus() {
          return _this5.setState({
            focused: true
          });
        }
      }, this.props.textInputProps))), /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: [styles.actionPanel, this.state.focused ? {} : styles.actionPanelBlur]
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: [styles.imageContainer, this.state.focused ? {} : styles.imageContainerBlur]
      }, this.state.image ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactNative.Image, {
        source: {
          uri: this.state.image
        },
        style: this.state.imageState === ImageState.UPLOADING ? styles.image_loading : styles.image,
        resizeMethod: "resize"
      }), /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
        style: styles.imageOverlay
      }, this.state.imageState === ImageState.UPLOADING ? /*#__PURE__*/_react["default"].createElement(_reactNative.ActivityIndicator, {
        color: "#ffffff"
      }) : /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
        onPress: this._removeImage
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.Image, {
        source: require('../images/icons/close-white.png'),
        style: [{
          width: 24,
          height: 24
        }]
      })))) : /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
        title: t('Pick an image from camera roll'),
        onPress: this._pickImage
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.Image, {
        source: require('../images/icons/gallery.png'),
        style: {
          width: 24,
          height: 24
        }
      }))), /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
        title: t('Pick an image from camera roll'),
        onPress: this.onSubmitForm,
        disabled: !this._canSubmit()
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.Image, {
        source: this._canSubmit() ? require('../images/icons/send.png') : require('../images/icons/send-disabled.png'),
        style: styles.submitImage
      }))))), this.props.fullscreen ? /*#__PURE__*/_react["default"].createElement(_reactNativeKeyboardSpacer["default"], null) : null);
    }
  }]);
  return StatusUpdateFormInner;
}(_react["default"].Component);

var _default = (0, _Context.withTranslationContext)(StatusUpdateForm);

exports["default"] = _default;