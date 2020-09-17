"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _Context = require("../Context");

var _styles = require("../styles");

var _NewActivitiesNotification = _interopRequireDefault(require("./NewActivitiesNotification"));

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var NotificationFeed = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(NotificationFeed, _React$Component);

  var _super = _createSuper(NotificationFeed);

  function NotificationFeed() {
    (0, _classCallCheck2["default"])(this, NotificationFeed);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(NotificationFeed, [{
    key: "render",
    value: function render() {
      var _this = this;

      return /*#__PURE__*/React.createElement(_Context.Feed, {
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
        options: makeDefaultOptions(this.props.options),
        notify: this.props.notify,
        doFeedRequest: this.props.doFeedRequest,
        doReactionAddRequest: this.props.doReactionAddRequest,
        doReactionDeleteRequest: this.props.doReactionDeleteRequest,
        doChildReactionAddRequest: this.props.doChildReactionAddRequest,
        doChildReactionDeleteRequest: this.props.doChildReactionDeleteRequest
      }, /*#__PURE__*/React.createElement(_Context.FeedContext.Consumer, null, function (feedCtx) {
        return /*#__PURE__*/React.createElement(NotificationFeedInner, (0, _extends2["default"])({}, _this.props, feedCtx));
      }));
    }
  }]);
  return NotificationFeed;
}(React.Component);

exports["default"] = NotificationFeed;
(0, _defineProperty2["default"])(NotificationFeed, "defaultProps", {
  feedGroup: 'notification',
  styles: {},
  Notifier: _NewActivitiesNotification["default"]
});

var makeDefaultOptions = function makeDefaultOptions(options) {
  var copy = _objectSpread({}, options);

  if (copy.mark_seen === undefined) {
    copy.mark_seen = true;
  }

  return copy;
};

var NotificationFeedInner = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2["default"])(NotificationFeedInner, _React$Component2);

  var _super2 = _createSuper(NotificationFeedInner);

  function NotificationFeedInner() {
    var _this2;

    (0, _classCallCheck2["default"])(this, NotificationFeedInner);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(_args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_refresh", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var ref;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this2.props.refresh(makeDefaultOptions(_this2.props.options));

            case 2:
              // $FlowFixMe
              ref = _this2.listRef;

              if (ref) {
                ref.scrollToOffset({
                  offset: 0
                });
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_renderWrappedGroup", function (_ref2) {
      var item = _ref2.item;
      return /*#__PURE__*/React.createElement(ImmutableItemWrapper, {
        renderItem: _this2._renderGroup,
        item: item,
        navigation: _this2.props.navigation,
        feedGroup: _this2.props.feedGroup,
        userId: _this2.props.userId
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_childProps", function () {
      return {
        onRemoveActivity: _this2.props.onRemoveActivity,
        onToggleReaction: _this2.props.onToggleReaction,
        onAddReaction: _this2.props.onAddReaction,
        onRemoveReaction: _this2.props.onRemoveReaction,
        onToggleChildReaction: _this2.props.onToggleChildReaction,
        onAddChildReaction: _this2.props.onAddChildReaction,
        onRemoveChildReaction: _this2.props.onRemoveChildReaction,
        onMarkAsRead: _this2.props.onMarkAsRead,
        onMarkAsSeen: _this2.props.onMarkAsSeen,
        navigation: _this2.props.navigation,
        feedGroup: _this2.props.feedGroup,
        userId: _this2.props.userId
      };
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_renderGroup", function (item) {
      var args = _objectSpread({
        activityGroup: item,
        styles: _this2.props.styles.activity
      }, _this2._childProps());

      return (0, _utils.smartRender)(_this2.props.Group, args);
    });
    return _this2;
  }

  (0, _createClass2["default"])(NotificationFeedInner, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._refresh();

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var styles = (0, _styles.buildStylesheet)('notificationFeed', this.props.styles);
      var notifierProps = {
        adds: this.props.realtimeAdds,
        deletes: this.props.realtimeDeletes,
        onPress: this._refresh
      };
      return /*#__PURE__*/React.createElement(React.Fragment, null, (0, _utils.smartRender)(this.props.Notifier, notifierProps), /*#__PURE__*/React.createElement(_reactNative.FlatList, (0, _extends2["default"])({
        ListHeaderComponent: this.props.children,
        style: styles.container,
        refreshControl: /*#__PURE__*/React.createElement(_reactNative.RefreshControl, {
          refreshing: this.props.refreshing,
          onRefresh: this._refresh
        }),
        data: this.props.activityOrder.map(function (id) {
          return _this3.props.activities.get(id);
        }),
        keyExtractor: function keyExtractor(item) {
          return item.get('id');
        },
        renderItem: this._renderWrappedGroup,
        onEndReached: this.props.noPagination ? undefined : this.props.loadNextPage,
        ref: function (_ref3) {
          function ref(_x) {
            return _ref3.apply(this, arguments);
          }

          ref.toString = function () {
            return _ref3.toString();
          };

          return ref;
        }(function (ref) {
          _this3.props.setListRef === undefined ? null : _this3.props.setListRef(ref); // $FlowFixMe

          _this3.listRef = ref;
        })
      }, this.props.flatListProps)));
    }
  }]);
  return NotificationFeedInner;
}(React.Component);

var ImmutableItemWrapper = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2["default"])(ImmutableItemWrapper, _React$PureComponent);

  var _super3 = _createSuper(ImmutableItemWrapper);

  function ImmutableItemWrapper() {
    (0, _classCallCheck2["default"])(this, ImmutableItemWrapper);
    return _super3.apply(this, arguments);
  }

  (0, _createClass2["default"])(ImmutableItemWrapper, [{
    key: "render",
    value: function render() {
      return this.props.renderItem(this.props.item.toJS());
    }
  }]);
  return ImmutableItemWrapper;
}(React.PureComponent);