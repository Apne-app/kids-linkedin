"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

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

var _styles = require("../styles");

var _Context = require("../Context");

var _utils = require("../utils");

var _immutable = _interopRequireDefault(require("immutable"));

var _LoadMoreButton = _interopRequireDefault(require("./LoadMoreButton"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * To use this component in a `FlatFeed` you have to provide the following
 * props to `FlatFeed`:
 * ```
 * options={{withOwnReactions: true}}
 * ```
 */
var ReactionList = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2["default"])(ReactionList, _React$PureComponent);

  var _super = _createSuper(ReactionList);

  function ReactionList() {
    (0, _classCallCheck2["default"])(this, ReactionList);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(ReactionList, [{
    key: "render",
    value: function render() {
      var _this = this;

      return /*#__PURE__*/React.createElement(_Context.FeedContext.Consumer, null, function (appCtx) {
        return /*#__PURE__*/React.createElement(ReactionListInner, (0, _extends2["default"])({}, _this.props, appCtx));
      });
    }
  }]);
  return ReactionList;
}(React.PureComponent);

exports["default"] = ReactionList;
(0, _defineProperty2["default"])(ReactionList, "defaultProps", {
  LoadMoreButton: _LoadMoreButton["default"],
  infiniteScroll: false,
  noPagination: false,
  oldestToNewest: false,
  reverseOrder: false
});

var ReactionListInner = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(ReactionListInner, _React$Component);

  var _super2 = _createSuper(ReactionListInner);

  function ReactionListInner() {
    var _this2;

    (0, _classCallCheck2["default"])(this, ReactionListInner);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_renderReaction", function (reaction) {
      var Reaction = _this2.props.Reaction;
      return (0, _utils.smartRender)(Reaction, {
        reaction: reaction
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_renderWrappedReaction", function (_ref) {
      var item = _ref.item;
      return /*#__PURE__*/React.createElement(ImmutableItemWrapper, {
        renderItem: _this2._renderReaction,
        item: item
      });
    });
    return _this2;
  }

  (0, _createClass2["default"])(ReactionListInner, [{
    key: "initReactions",
    value: function initReactions() {
      var _this$props = this.props,
          activityId = _this$props.activityId,
          activities = _this$props.activities,
          reactionKind = _this$props.reactionKind,
          getActivityPath = _this$props.getActivityPath,
          oldestToNewest = _this$props.oldestToNewest;

      if (!oldestToNewest) {
        return;
      }

      var activityPath = this.props.activityPath || getActivityPath(activityId);
      var orderPrefix = 'oldest';
      var reactions_extra = activities.getIn([].concat((0, _toConsumableArray2["default"])(activityPath), [orderPrefix + '_reactions_extra']));

      if (reactions_extra) {
        return;
      }

      return this.props.loadNextReactions(activityId, reactionKind, activityPath, oldestToNewest);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initReactions();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.initReactions();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          activityId = _this$props2.activityId,
          activities = _this$props2.activities,
          reactionKind = _this$props2.reactionKind,
          getActivityPath = _this$props2.getActivityPath,
          oldestToNewest = _this$props2.oldestToNewest,
          reverseOrder = _this$props2.reverseOrder;
      var activityPath = this.props.activityPath || getActivityPath(activityId);
      var orderPrefix = 'latest';

      if (oldestToNewest) {
        orderPrefix = 'oldest';
      }

      var reactionsOfKind = activities.getIn([].concat((0, _toConsumableArray2["default"])(activityPath), [orderPrefix + '_reactions', reactionKind]), _immutable["default"].List());
      var reactions_extra = activities.getIn([].concat((0, _toConsumableArray2["default"])(activityPath), [orderPrefix + '_reactions_extra']));
      var nextUrl = 'https://api.stream-io-api.com/';

      if (reactions_extra) {
        nextUrl = reactions_extra.getIn([reactionKind, 'next'], '');
      }

      var refreshing = activities.getIn([].concat((0, _toConsumableArray2["default"])(activityPath), [orderPrefix + '_reactions_extra', reactionKind, 'refreshing']), false);
      var LoadMoreButton = this.props.LoadMoreButton;
      var styles = (0, _styles.buildStylesheet)('reactionList', this.props.styles);

      if (!reactionsOfKind.size) {
        return null;
      }

      var loadMoreButton = this.props.noPagination || !nextUrl || this.props.infiniteScroll ? null : (0, _utils.smartRender)(LoadMoreButton, {
        refreshing: refreshing,
        styles: styles,
        onPress: function onPress() {
          return _this3.props.loadNextReactions(activityId, reactionKind, activityPath, oldestToNewest);
        }
      }); // <LoadMoreButton
      //   refreshing={refreshing}
      //   styles={styles}
      //   onPress={() =>
      //     this.props.loadNextReactions(
      //       activityId,
      //       reactionKind,
      //       activityPath,
      //       oldestToNewest,
      //     )
      //   }
      // />

      return /*#__PURE__*/React.createElement(React.Fragment, null, this.props.children, reverseOrder && loadMoreButton, /*#__PURE__*/React.createElement(_reactNative.FlatList, (0, _extends2["default"])({
        listKey: reactionKind + '-' + activityId,
        style: styles.container,
        refreshing: refreshing,
        data: reactionsOfKind.toArray(),
        keyExtractor: function keyExtractor(item) {
          return item.get('id') + activityPath;
        },
        renderItem: this._renderWrappedReaction,
        inverted: reverseOrder,
        onEndReached: this.props.noPagination || !this.props.infiniteScroll ? undefined : function () {
          return _this3.props.loadNextReactions(activityId, reactionKind, activityPath, oldestToNewest);
        }
      }, this.props.flatListProps)), !reverseOrder && loadMoreButton);
    }
  }]);
  return ReactionListInner;
}(React.Component);

var ImmutableItemWrapper = /*#__PURE__*/function (_React$PureComponent2) {
  (0, _inherits2["default"])(ImmutableItemWrapper, _React$PureComponent2);

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