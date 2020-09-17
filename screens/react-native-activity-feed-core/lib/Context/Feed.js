"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Feed = exports.FeedManager = exports.FeedContext = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _immutable = _interopRequireDefault(require("immutable"));

var _urlParse = _interopRequireDefault(require("url-parse"));

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../utils");

var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));

var _StreamApp = require("./StreamApp");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var FeedContext = React.createContext({}); // type FR = FeedResponse<Object, Object>;

exports.FeedContext = FeedContext;

var FeedManager = /*#__PURE__*/function () {
  function FeedManager(props) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, FeedManager);
    (0, _defineProperty2["default"])(this, "props", void 0);
    (0, _defineProperty2["default"])(this, "state", {
      activityOrder: [],
      activities: _immutable["default"].Map(),
      activityIdToPath: {},
      activityIdToPaths: {},
      reactionIdToPaths: {},
      reactionActivities: {},
      lastResponse: null,
      lastReverseResponse: null,
      refreshing: false,
      realtimeAdds: [],
      realtimeDeletes: [],
      subscription: null,
      unread: 0,
      unseen: 0,
      numSubscribers: 0,
      reactionsBeingToggled: {},
      childReactionsBeingToggled: {}
    });
    (0, _defineProperty2["default"])(this, "registeredCallbacks", void 0);
    (0, _defineProperty2["default"])(this, "setState", function (changed) {
      if (typeof changed === 'function') {
        changed = changed(_this.state);
      }

      _this.state = _objectSpread({}, _this.state, {}, changed);

      _this.triggerUpdate();
    });
    (0, _defineProperty2["default"])(this, "trackAnalytics", function (label, activity, track) {
      var analyticsClient = _this.props.analyticsClient;

      if (!track) {
        return;
      }

      if (!analyticsClient) {
        console.warn('trackAnalytics was enabled, but analytics client was not initialized. ' + 'Please set the analyticsToken prop on StreamApp');
        return;
      }

      var feed = _this.props.client.feed(_this.props.feedGroup, _this.props.userId);

      analyticsClient.trackEngagement({
        label: label,
        feed_id: feed.id,
        content: {
          foreign_id: activity.foreign_id
        },
        location: _this.props.analyticsLocation
      });
    });
    (0, _defineProperty2["default"])(this, "getActivityPath", function (activity) {
      var activityId;

      if (typeof activity === 'string') {
        activityId = activity;
      } else {
        activityId = activity.id;
      }

      var activityPath = _this.state.activityIdToPath[activityId];

      for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      if (activityPath === undefined) {
        return [activityId].concat(rest);
      }

      return [].concat((0, _toConsumableArray2["default"])(activityPath), rest);
    });
    (0, _defineProperty2["default"])(this, "getActivityPaths", function (activity) {
      var activityId;

      if (typeof activity === 'string') {
        activityId = activity;
      } else {
        activityId = activity.id;
      }

      return _this.state.activityIdToPaths[activityId];
    });
    (0, _defineProperty2["default"])(this, "getReactionPaths", function (reaction) {
      var reactionId;

      if (typeof reaction === 'string') {
        reactionId = reaction;
      } else {
        reactionId = reaction.id;
      }

      return _this.state.reactionIdToPaths[reactionId];
    });
    (0, _defineProperty2["default"])(this, "onAddReaction", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(kind, activity, data) {
        var options,
            reaction,
            enrichedReaction,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
                _context.prev = 1;

                if (!_this.props.doReactionAddRequest) {
                  _context.next = 8;
                  break;
                }

                _context.next = 5;
                return _this.props.doReactionAddRequest(kind, activity, data, options);

              case 5:
                reaction = _context.sent;
                _context.next = 11;
                break;

              case 8:
                _context.next = 10;
                return _this.props.client.reactions.add(kind, activity, data, options);

              case 10:
                reaction = _context.sent;

              case 11:
                _context.next = 17;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](1);

                _this.props.errorHandler(_context.t0, 'add-reaction', {
                  kind: kind,
                  activity: activity,
                  feedGroup: _this.props.feedGroup,
                  userId: _this.props.userId
                });

                return _context.abrupt("return");

              case 17:
                _this.trackAnalytics(kind, activity, options.trackAnalytics);

                enrichedReaction = _immutable["default"].fromJS(_objectSpread({}, reaction, {
                  user: _this.props.user.full
                }));

                _this.setState(function (prevState) {
                  var activities = prevState.activities;
                  var reactionIdToPaths = prevState.reactionIdToPaths;

                  var _iterator = _createForOfIteratorHelper(_this.getActivityPaths(activity)),
                      _step;

                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      var path = _step.value;

                      _this.removeFoundReactionIdPaths(activities.getIn(path).toJS(), reactionIdToPaths, path);

                      activities = activities.updateIn([].concat((0, _toConsumableArray2["default"])(path), ['reaction_counts', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        return v + 1;
                      }).updateIn([].concat((0, _toConsumableArray2["default"])(path), ['own_reactions', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable["default"].List();
                        return v.unshift(enrichedReaction);
                      }).updateIn([].concat((0, _toConsumableArray2["default"])(path), ['latest_reactions', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable["default"].List();
                        return v.unshift(enrichedReaction);
                      });

                      _this.addFoundReactionIdPaths(activities.getIn(path).toJS(), reactionIdToPaths, path);
                    }
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }

                  return {
                    activities: activities,
                    reactionIdToPaths: reactionIdToPaths
                  };
                });

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 13]]);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "onRemoveReaction", /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(kind, activity, id) {
        var options,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};
                _context2.prev = 1;

                if (!_this.props.doReactionDeleteRequest) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 5;
                return _this.props.doReactionDeleteRequest(id);

              case 5:
                _context2.next = 9;
                break;

              case 7:
                _context2.next = 9;
                return _this.props.client.reactions["delete"](id);

              case 9:
                _context2.next = 15;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](1);

                _this.props.errorHandler(_context2.t0, 'delete-reaction', {
                  kind: kind,
                  activity: activity,
                  feedGroup: _this.props.feedGroup,
                  userId: _this.props.userId
                });

                return _context2.abrupt("return");

              case 15:
                _this.trackAnalytics('un' + kind, activity, options.trackAnalytics);

                if (_this.state.reactionActivities[id]) {
                  _this._removeActivityFromState(_this.state.reactionActivities[id]);
                }

                return _context2.abrupt("return", _this.setState(function (prevState) {
                  var activities = prevState.activities;
                  var reactionIdToPaths = prevState.reactionIdToPaths;

                  var _iterator2 = _createForOfIteratorHelper(_this.getActivityPaths(activity)),
                      _step2;

                  try {
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                      var path = _step2.value;

                      _this.removeFoundReactionIdPaths(activities.getIn(path).toJS(), reactionIdToPaths, path);

                      activities = activities.updateIn([].concat((0, _toConsumableArray2["default"])(path), ['reaction_counts', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        return v - 1;
                      }).updateIn([].concat((0, _toConsumableArray2["default"])(path), ['own_reactions', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable["default"].List();
                        return v.remove(v.findIndex(function (r) {
                          return r.get('id') === id;
                        }));
                      }).updateIn([].concat((0, _toConsumableArray2["default"])(path), ['latest_reactions', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable["default"].List();
                        return v.remove(v.findIndex(function (r) {
                          return r.get('id') === id;
                        }));
                      });

                      _this.addFoundReactionIdPaths(activities.getIn(path).toJS(), reactionIdToPaths, path);
                    }
                  } catch (err) {
                    _iterator2.e(err);
                  } finally {
                    _iterator2.f();
                  }

                  return {
                    activities: activities,
                    reactionIdToPaths: reactionIdToPaths
                  };
                }));

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 11]]);
      }));

      return function (_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "onToggleReaction", /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(kind, activity, data) {
        var options,
            togglingReactions,
            currentReactions,
            last,
            _args3 = arguments;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};
                togglingReactions = _this.state.reactionsBeingToggled[kind] || {};

                if (!togglingReactions[activity.id]) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt("return");

              case 4:
                togglingReactions[activity.id] = true;
                _this.state.reactionsBeingToggled[kind] = togglingReactions;
                currentReactions = _this.state.activities.getIn([].concat((0, _toConsumableArray2["default"])(_this.getActivityPaths(activity)[0]), ['own_reactions', kind]), _immutable["default"].List());
                last = currentReactions.last();

                if (!last) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 11;
                return _this.onRemoveReaction(kind, activity, last.get('id'), options);

              case 11:
                _context3.next = 15;
                break;

              case 13:
                _context3.next = 15;
                return _this.onAddReaction(kind, activity, data, options);

              case 15:
                delete togglingReactions[activity.id];

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "onAddChildReaction", /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(kind, reaction, data) {
        var options,
            childReaction,
            enrichedReaction,
            _args4 = arguments;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};
                _context4.prev = 1;

                if (!_this.props.doChildReactionAddRequest) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 5;
                return _this.props.doChildReactionAddRequest(kind, reaction, data, options);

              case 5:
                childReaction = _context4.sent;
                _context4.next = 11;
                break;

              case 8:
                _context4.next = 10;
                return _this.props.client.reactions.addChild(kind, reaction, data, options);

              case 10:
                childReaction = _context4.sent;

              case 11:
                _context4.next = 17;
                break;

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](1);

                _this.props.errorHandler(_context4.t0, 'add-child-reaction', {
                  kind: kind,
                  reaction: reaction,
                  feedGroup: _this.props.feedGroup,
                  userId: _this.props.userId
                });

                return _context4.abrupt("return");

              case 17:
                // this.trackAnalytics(kind, reaction, options.trackAnalytics);
                enrichedReaction = _immutable["default"].fromJS(_objectSpread({}, childReaction, {
                  user: _this.props.user.full
                }));

                _this.setState(function (prevState) {
                  var activities = prevState.activities;

                  var _iterator3 = _createForOfIteratorHelper(_this.getReactionPaths(reaction)),
                      _step3;

                  try {
                    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                      var path = _step3.value;
                      activities = activities.updateIn([].concat((0, _toConsumableArray2["default"])(path), ['children_counts', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        return v + 1;
                      }).updateIn([].concat((0, _toConsumableArray2["default"])(path), ['own_children', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable["default"].List();
                        return v.unshift(enrichedReaction);
                      }).updateIn([].concat((0, _toConsumableArray2["default"])(path), ['latest_children', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable["default"].List();
                        return v.unshift(enrichedReaction);
                      });
                    }
                  } catch (err) {
                    _iterator3.e(err);
                  } finally {
                    _iterator3.f();
                  }

                  return {
                    activities: activities
                  };
                });

              case 19:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[1, 13]]);
      }));

      return function (_x10, _x11, _x12) {
        return _ref4.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "onRemoveChildReaction", /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(kind, reaction, id) {
        var options,
            _args5 = arguments;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                options = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : {};
                _context5.prev = 1;

                if (!_this.props.doChildReactionDeleteRequest) {
                  _context5.next = 7;
                  break;
                }

                _context5.next = 5;
                return _this.props.doChildReactionDeleteRequest(id);

              case 5:
                _context5.next = 9;
                break;

              case 7:
                _context5.next = 9;
                return _this.props.client.reactions["delete"](id);

              case 9:
                _context5.next = 15;
                break;

              case 11:
                _context5.prev = 11;
                _context5.t0 = _context5["catch"](1);

                _this.props.errorHandler(_context5.t0, 'delete-reaction', {
                  kind: kind,
                  reaction: reaction,
                  feedGroup: _this.props.feedGroup,
                  userId: _this.props.userId
                });

                return _context5.abrupt("return");

              case 15:
                // this.trackAnalytics('un' + kind, reaction, options.trackAnalytics);
                if (_this.state.reactionActivities[id]) {
                  _this._removeActivityFromState(_this.state.reactionActivities[id]);
                }

                return _context5.abrupt("return", _this.setState(function (prevState) {
                  var activities = prevState.activities;

                  var _iterator4 = _createForOfIteratorHelper(_this.getReactionPaths(reaction)),
                      _step4;

                  try {
                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                      var path = _step4.value;
                      activities = activities.updateIn([].concat((0, _toConsumableArray2["default"])(path), ['children_counts', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        return v - 1;
                      }).updateIn([].concat((0, _toConsumableArray2["default"])(path), ['own_children', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable["default"].List();
                        return v.remove(v.findIndex(function (r) {
                          return r.get('id') === id;
                        }));
                      }).updateIn([].concat((0, _toConsumableArray2["default"])(path), ['latest_children', kind]), function () {
                        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable["default"].List();
                        return v.remove(v.findIndex(function (r) {
                          return r.get('id') === id;
                        }));
                      });
                    }
                  } catch (err) {
                    _iterator4.e(err);
                  } finally {
                    _iterator4.f();
                  }

                  return {
                    activities: activities
                  };
                }));

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[1, 11]]);
      }));

      return function (_x13, _x14, _x15) {
        return _ref5.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "onToggleChildReaction", /*#__PURE__*/function () {
      var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(kind, reaction, data) {
        var options,
            togglingReactions,
            currentReactions,
            last,
            _args6 = arguments;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                options = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : {};
                togglingReactions = _this.state.childReactionsBeingToggled[kind] || {};

                if (!togglingReactions[reaction.id]) {
                  _context6.next = 4;
                  break;
                }

                return _context6.abrupt("return");

              case 4:
                togglingReactions[reaction.id] = true;
                _this.state.childReactionsBeingToggled[kind] = togglingReactions;
                currentReactions = _this.state.activities.getIn([].concat((0, _toConsumableArray2["default"])(_this.getReactionPaths(reaction)[0]), ['own_children', kind]), _immutable["default"].List());
                last = currentReactions.last();

                if (!last) {
                  _context6.next = 13;
                  break;
                }

                _context6.next = 11;
                return _this.onRemoveChildReaction(kind, reaction, last.get('id'), options);

              case 11:
                _context6.next = 15;
                break;

              case 13:
                _context6.next = 15;
                return _this.onAddChildReaction(kind, reaction, data, options);

              case 15:
                delete togglingReactions[reaction.id];

              case 16:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      return function (_x16, _x17, _x18) {
        return _ref6.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "_removeActivityFromState", function (activityId) {
      return _this.setState(function (_ref7) {
        var activities = _ref7.activities,
            activityOrder = _ref7.activityOrder,
            activityIdToPath = _ref7.activityIdToPath,
            activityIdToPaths = _ref7.activityIdToPaths,
            reactionIdToPaths = _ref7.reactionIdToPaths;

        var path = _this.getActivityPath(activityId);

        var outerId = activityId;

        if (path.length > 1) {
          // It's an aggregated group we should update the paths of everything in
          // the list
          var groupArrayPath = path.slice(0, -1);
          activityIdToPath = _this.removeFoundActivityIdPath(activities.getIn(groupArrayPath).toJS(), activityIdToPath, groupArrayPath);
          activityIdToPaths = _this.removeFoundActivityIdPaths(activities.getIn(groupArrayPath).toJS(), activityIdToPaths, groupArrayPath);
          reactionIdToPaths = _this.removeFoundReactionIdPaths(activities.getIn(groupArrayPath).toJS(), reactionIdToPaths, groupArrayPath);
        }

        activities = activities.removeIn(path);

        if (path.length > 1) {
          var _groupArrayPath = path.slice(0, -1);

          if (activities.getIn(_groupArrayPath).size === 0) {
            outerId = path[0]; //
          } else {
            outerId = null;
          }

          activityIdToPath = _this.addFoundActivityIdPath(activities.getIn(_groupArrayPath).toJS(), activityIdToPath, _groupArrayPath);
          activityIdToPaths = _this.addFoundActivityIdPaths(activities.getIn(_groupArrayPath).toJS(), activityIdToPaths, _groupArrayPath);
          reactionIdToPaths = _this.addFoundReactionIdPaths(activities.getIn(_groupArrayPath).toJS(), reactionIdToPaths, _groupArrayPath);
        }

        if (outerId != null) {
          activityOrder = activityOrder.filter(function (id) {
            return id !== outerId;
          });
        }

        return {
          activities: activities,
          activityOrder: activityOrder,
          activityIdToPaths: activityIdToPaths,
          reactionIdToPaths: reactionIdToPaths,
          activityIdToPath: activityIdToPath
        };
      });
    });
    (0, _defineProperty2["default"])(this, "onRemoveActivity", /*#__PURE__*/function () {
      var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(activityId) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return _this.feed().removeActivity(activityId);

              case 3:
                _context7.next = 9;
                break;

              case 5:
                _context7.prev = 5;
                _context7.t0 = _context7["catch"](0);

                _this.props.errorHandler(_context7.t0, 'delete-activity', {
                  activityId: _this.props.feedGroup,
                  feedGroup: _this.props.feedGroup,
                  userId: _this.props.userId
                });

                return _context7.abrupt("return");

              case 9:
                return _context7.abrupt("return", _this._removeActivityFromState(activityId));

              case 10:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 5]]);
      }));

      return function (_x19) {
        return _ref8.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "onMarkAsRead", function (group) {
      return _this._onMarkAs('read', group);
    });
    (0, _defineProperty2["default"])(this, "onMarkAsSeen", function (group) {
      return _this._onMarkAs('seen', group);
    });
    (0, _defineProperty2["default"])(this, "_onMarkAs", /*#__PURE__*/function () {
      var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(type, group) {
        var groupArray, markArg;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                markArg = group;

                if (group === true) {
                  groupArray = _this.state.activityOrder;
                } else if (Array.isArray(group)) {
                  groupArray = group.map(function (g) {
                    return g.id;
                  });
                  markArg = groupArray;
                } else {
                  markArg = group.id;
                  groupArray = [group.id];
                }

                _context8.prev = 2;
                _context8.next = 5;
                return _this.doFeedRequest((0, _defineProperty2["default"])({
                  limit: 1,
                  id_lte: _this.state.activityOrder[0]
                }, 'mark_' + type, markArg));

              case 5:
                _context8.next = 10;
                break;

              case 7:
                _context8.prev = 7;
                _context8.t0 = _context8["catch"](2);

                _this.props.errorHandler(_context8.t0, 'get-notification-counts', {
                  feedGroup: _this.props.feedGroup,
                  userId: _this.props.userId
                });

              case 10:
                _this.setState(function (prevState) {
                  var counterKey = 'un' + type;
                  var activities = prevState.activities;
                  var counter = prevState[counterKey];

                  var _iterator5 = _createForOfIteratorHelper(groupArray),
                      _step5;

                  try {
                    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                      var groupId = _step5.value;
                      var markerPath = [groupId, 'is_' + type];

                      if (activities.getIn(markerPath) !== false) {
                        continue;
                      }

                      activities = activities.setIn(markerPath, true);
                      counter--;
                    }
                  } catch (err) {
                    _iterator5.e(err);
                  } finally {
                    _iterator5.f();
                  }

                  return (0, _defineProperty2["default"])({
                    activities: activities
                  }, counterKey, counter);
                });

              case 11:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[2, 7]]);
      }));

      return function (_x20, _x21) {
        return _ref9.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "getOptions", function () {
      var extraOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var propOpts = _objectSpread({}, _this.props.options);

      var id_gt = extraOptions.id_gt,
          id_gte = extraOptions.id_gte,
          id_lt = extraOptions.id_lt,
          id_lte = extraOptions.id_lte,
          offset = extraOptions.offset;

      if (id_gt || id_gte || id_lt || id_lte || offset != null) {
        delete propOpts.id_gt;
        delete propOpts.id_gte;
        delete propOpts.id_lt;
        delete propOpts.id_lte;
        delete propOpts.offset;
        delete propOpts.refresh;
      }

      return _objectSpread({
        withReactionCounts: true,
        withOwnReactions: true,
        limit: 10
      }, propOpts, {}, extraOptions);
    });
    (0, _defineProperty2["default"])(this, "doFeedRequest", /*#__PURE__*/function () {
      var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(options) {
        var requestWasSentAt, response, requestTime, MINIMUM_TIME_BETWEEN_REFRESHING_PROP_UPDATES, waitTime;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                requestWasSentAt = Date.now();

                if (!_this.props.doFeedRequest) {
                  _context9.next = 7;
                  break;
                }

                _context9.next = 4;
                return _this.props.doFeedRequest(_this.props.client, _this.props.feedGroup, _this.props.userId, options);

              case 4:
                response = _context9.sent;
                _context9.next = 10;
                break;

              case 7:
                _context9.next = 9;
                return _this.feed().get(options);

              case 9:
                response = _context9.sent;

              case 10:
                if (!(_reactNative.Platform.OS === 'ios')) {
                  _context9.next = 17;
                  break;
                }

                // Workaround for this issue: https://github.com/facebook/react-native/issues/5839
                requestTime = Date.now() - requestWasSentAt;
                MINIMUM_TIME_BETWEEN_REFRESHING_PROP_UPDATES = 350;
                waitTime = MINIMUM_TIME_BETWEEN_REFRESHING_PROP_UPDATES - requestTime;

                if (!(waitTime > 0)) {
                  _context9.next = 17;
                  break;
                }

                _context9.next = 17;
                return (0, _utils.sleep)(waitTime);

              case 17:
                return _context9.abrupt("return", response);

              case 18:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      return function (_x22) {
        return _ref11.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "feed", function () {
      return _this.props.client.feed(_this.props.feedGroup, _this.props.userId);
    });
    (0, _defineProperty2["default"])(this, "responseToActivityMap", function (response) {
      return _immutable["default"].fromJS(response.results.reduce(function (map, a) {
        map[a.id] = a;
        return map;
      }, {}));
    });
    (0, _defineProperty2["default"])(this, "responseToActivityIdToPath", function (response) {
      if (response.results.length === 0 || response.results[0].activities === undefined) {
        return {};
      }

      var aggregatedResponse = response;
      var map = {};

      var _iterator6 = _createForOfIteratorHelper(aggregatedResponse.results),
          _step6;

      try {
        var _loop = function _loop() {
          var group = _step6.value;
          group.activities.forEach(function (act, i) {
            map[act.id] = [group.id, 'activities', i];
          });
        };

        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      return map;
    });
    (0, _defineProperty2["default"])(this, "responseToActivityIdToPaths", function (response) {
      var previous = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var map = previous;
      var currentPath = [];

      function addFoundActivities(obj) {
        if (Array.isArray(obj)) {
          obj.forEach(function (v, i) {
            currentPath.push(i);
            addFoundActivities(v);
            currentPath.pop();
          });
        } else if ((0, _isPlainObject["default"])(obj)) {
          if (obj.id && obj.actor && obj.verb && obj.object) {
            if (!map[obj.id]) {
              map[obj.id] = [];
            }

            map[obj.id].push([].concat(currentPath));
          }

          for (var k in obj) {
            currentPath.push(k);
            addFoundActivities(obj[k]);
            currentPath.pop();
          }
        }
      }

      var _iterator7 = _createForOfIteratorHelper(response.results),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var a = _step7.value;
          currentPath.push(a.id);
          addFoundActivities(a);
          currentPath.pop();
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      return map;
    });
    (0, _defineProperty2["default"])(this, "feedResponseToReactionIdToPaths", function (response) {
      var previous = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var map = previous;
      var currentPath = [];

      function addFoundReactions(obj) {
        if (Array.isArray(obj)) {
          obj.forEach(function (v, i) {
            currentPath.push(i);
            addFoundReactions(v);
            currentPath.pop();
          });
        } else if ((0, _isPlainObject["default"])(obj)) {
          if (obj.id && obj.kind && obj.data) {
            if (!map[obj.id]) {
              map[obj.id] = [];
            }

            map[obj.id].push([].concat(currentPath));
          }

          for (var k in obj) {
            currentPath.push(k);
            addFoundReactions(obj[k]);
            currentPath.pop();
          }
        }
      }

      var _iterator8 = _createForOfIteratorHelper(response.results),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var a = _step8.value;
          currentPath.push(a.id);
          addFoundReactions(a);
          currentPath.pop();
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      return map;
    });
    (0, _defineProperty2["default"])(this, "reactionResponseToReactionIdToPaths", function (response, previous, basePath, oldLength) {
      var map = previous;
      var currentPath = (0, _toConsumableArray2["default"])(basePath);

      function addFoundReactions(obj) {
        if (Array.isArray(obj)) {
          obj.forEach(function (v, i) {
            currentPath.push(i);
            addFoundReactions(v);
            currentPath.pop();
          });
        } else if ((0, _isPlainObject["default"])(obj)) {
          if (obj.id && obj.kind && obj.data) {
            if (!map[obj.id]) {
              map[obj.id] = [];
            }

            map[obj.id].push((0, _toConsumableArray2["default"])(currentPath));
          }

          for (var k in obj) {
            currentPath.push(k);
            addFoundReactions(obj[k]);
            currentPath.pop();
          }
        }
      }

      var _iterator9 = _createForOfIteratorHelper(response.results),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var a = _step9.value;
          currentPath.push(oldLength);
          addFoundReactions(a);
          currentPath.pop();
          oldLength++;
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      return map;
    });
    (0, _defineProperty2["default"])(this, "removeFoundReactionIdPaths", function (data, previous, basePath) {
      var map = previous;
      var currentPath = (0, _toConsumableArray2["default"])(basePath);

      function removeFoundReactions(obj) {
        if (Array.isArray(obj)) {
          obj.forEach(function (v, i) {
            currentPath.push(i);
            removeFoundReactions(v);
            currentPath.pop();
          });
        } else if ((0, _isPlainObject["default"])(obj)) {
          if (obj.id && obj.kind && obj.data) {
            if (!map[obj.id]) {
              map[obj.id] = [];
            }

            _lodash["default"].remove(map[obj.id], function (path) {
              return _lodash["default"].isEqual(path, currentPath);
            });
          }

          for (var k in obj) {
            currentPath.push(k);
            removeFoundReactions(obj[k]);
            currentPath.pop();
          }
        }
      }

      removeFoundReactions(data);
      return map;
    });
    (0, _defineProperty2["default"])(this, "removeFoundActivityIdPaths", function (data, previous, basePath) {
      var map = previous;
      var currentPath = (0, _toConsumableArray2["default"])(basePath);

      function addFoundActivities(obj) {
        if (Array.isArray(obj)) {
          obj.forEach(function (v, i) {
            currentPath.push(i);
            addFoundActivities(v);
            currentPath.pop();
          });
        } else if ((0, _isPlainObject["default"])(obj)) {
          if (obj.id && obj.actor && obj.verb && obj.object) {
            if (!map[obj.id]) {
              map[obj.id] = [];
            }

            _lodash["default"].remove(map[obj.id], function (path) {
              return _lodash["default"].isEqual(path, currentPath);
            });
          }

          for (var k in obj) {
            currentPath.push(k);
            addFoundActivities(obj[k]);
            currentPath.pop();
          }
        }
      }

      addFoundActivities(data);
      return map;
    });
    (0, _defineProperty2["default"])(this, "removeFoundActivityIdPath", function (data, previous, basePath) {
      var map = previous;
      var currentPath = (0, _toConsumableArray2["default"])(basePath);
      data.forEach(function (obj, i) {
        currentPath.push(i);

        if (_lodash["default"].isEqual(map[obj.id], currentPath)) {
          delete map[obj.id];
        }

        currentPath.pop();
      });
      return map;
    });
    (0, _defineProperty2["default"])(this, "addFoundReactionIdPaths", function (data, previous, basePath) {
      var map = previous;
      var currentPath = (0, _toConsumableArray2["default"])(basePath);

      function addFoundReactions(obj) {
        if (Array.isArray(obj)) {
          obj.forEach(function (v, i) {
            currentPath.push(i);
            addFoundReactions(v);
            currentPath.pop();
          });
        } else if ((0, _isPlainObject["default"])(obj)) {
          if (obj.id && obj.kind && obj.data) {
            if (!map[obj.id]) {
              map[obj.id] = [];
            }

            map[obj.id].push((0, _toConsumableArray2["default"])(currentPath));
          }

          for (var k in obj) {
            currentPath.push(k);
            addFoundReactions(obj[k]);
            currentPath.pop();
          }
        }
      }

      addFoundReactions(data);
      return map;
    });
    (0, _defineProperty2["default"])(this, "addFoundActivityIdPaths", function (data, previous, basePath) {
      var map = previous;
      var currentPath = (0, _toConsumableArray2["default"])(basePath);

      function addFoundActivities(obj) {
        if (Array.isArray(obj)) {
          obj.forEach(function (v, i) {
            currentPath.push(i);
            addFoundActivities(v);
            currentPath.pop();
          });
        } else if ((0, _isPlainObject["default"])(obj)) {
          if (obj.id && obj.actor && obj.verb && obj.object) {
            if (!map[obj.id]) {
              map[obj.id] = [];
            }

            map[obj.id].push((0, _toConsumableArray2["default"])(currentPath));
          }

          for (var k in obj) {
            currentPath.push(k);
            addFoundActivities(obj[k]);
            currentPath.pop();
          }
        }
      }

      addFoundActivities(data);
      return map;
    });
    (0, _defineProperty2["default"])(this, "addFoundActivityIdPath", function (data, previous, basePath) {
      var map = previous;
      data.forEach(function (obj, i) {
        map[obj.id] = [].concat((0, _toConsumableArray2["default"])(basePath), [i]);
      });
      return map;
    });
    (0, _defineProperty2["default"])(this, "responseToReactionActivities", function (response) {
      if (response.results.length === 0) {
        return {};
      }

      var map = {};

      function setReactionActivities(activities) {
        var _iterator10 = _createForOfIteratorHelper(activities),
            _step10;

        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var a = _step10.value;

            if (a.reaction && a.reaction.id) {
              map[a.reaction.id] = a.id;
            }
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
      }

      if (response.results[0].activities === undefined) {
        setReactionActivities(response.results);
      } else {
        var aggregatedResponse = response;

        var _iterator11 = _createForOfIteratorHelper(aggregatedResponse.results),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var _group = _step11.value;
            setReactionActivities(_group.activities);
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }
      }

      return map;
    });
    (0, _defineProperty2["default"])(this, "refresh", /*#__PURE__*/function () {
      var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(extraOptions) {
        var options, response, newState;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                options = _this.getOptions(extraOptions);
                _context10.next = 3;
                return _this.setState({
                  refreshing: true
                });

              case 3:
                _context10.prev = 3;
                _context10.next = 6;
                return _this.doFeedRequest(options);

              case 6:
                response = _context10.sent;
                _context10.next = 14;
                break;

              case 9:
                _context10.prev = 9;
                _context10.t0 = _context10["catch"](3);

                _this.setState({
                  refreshing: false
                });

                _this.props.errorHandler(_context10.t0, 'get-feed', {
                  feedGroup: _this.props.feedGroup,
                  userId: _this.props.userId
                });

                return _context10.abrupt("return");

              case 14:
                newState = _objectSpread({
                  activityOrder: response.results.map(function (a) {
                    return a.id;
                  }),
                  activities: _this.responseToActivityMap(response),
                  activityIdToPath: _this.responseToActivityIdToPath(response),
                  activityIdToPaths: _this.responseToActivityIdToPaths(response),
                  reactionIdToPaths: _this.feedResponseToReactionIdToPaths(response),
                  reactionActivities: _this.responseToReactionActivities(response),
                  refreshing: false,
                  lastResponse: response,
                  realtimeAdds: [],
                  realtimeDeletes: []
                }, _this.unseenUnreadFromResponse(response));

                if (options.mark_seen === true) {
                  newState.unseen = 0;
                }

                if (options.mark_read === true) {
                  newState.unread = 0;
                }

                return _context10.abrupt("return", _this.setState(newState));

              case 18:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[3, 9]]);
      }));

      return function (_x23) {
        return _ref12.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "subscribe", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var feed;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              if (!_this.props.notify) {
                _context11.next = 4;
                break;
              }

              feed = _this.feed();
              _context11.next = 4;
              return _this.setState(function (prevState) {
                if (prevState.subscription) {
                  return {};
                }

                var subscription = feed.subscribe(function (data) {
                  _this.setState(function (prevState) {
                    var numActivityDiff = data["new"].length - data.deleted.length;
                    return {
                      realtimeAdds: prevState.realtimeAdds.concat(data["new"]),
                      realtimeDeletes: prevState.realtimeDeletes.concat(data.deleted),
                      unread: prevState.unread + numActivityDiff,
                      unseen: prevState.unseen + numActivityDiff
                    };
                  });
                });
                subscription.then(function () {
                  console.log("now listening to changes in realtime for ".concat(_this.feed().id));
                }, function (err) {
                  console.error(err);
                });
                return {
                  subscription: subscription
                };
              });

            case 4:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
    (0, _defineProperty2["default"])(this, "unsubscribe", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      var subscription;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              subscription = _this.state.subscription;

              if (subscription) {
                _context12.next = 3;
                break;
              }

              return _context12.abrupt("return");

            case 3:
              _context12.next = 5;
              return subscription;

            case 5:
              if (!(_this.registeredCallbacks.length === 0)) {
                _context12.next = 15;
                break;
              }

              _context12.prev = 6;
              _context12.next = 9;
              return subscription.cancel();

            case 9:
              console.log("stopped listening to changes in realtime for ".concat(_this.feed().id));
              _context12.next = 15;
              break;

            case 12:
              _context12.prev = 12;
              _context12.t0 = _context12["catch"](6);
              console.error(_context12.t0);

            case 15:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, null, [[6, 12]]);
    })));
    (0, _defineProperty2["default"])(this, "hasNextPage", function () {
      var lastResponse = _this.state.lastResponse;
      return Boolean(lastResponse && lastResponse.next);
    });
    (0, _defineProperty2["default"])(this, "hasReverseNextPage", function () {
      var lastReverseResponse = _this.state.lastReverseResponse;
      return Boolean(lastReverseResponse && lastReverseResponse.next);
    });
    (0, _defineProperty2["default"])(this, "loadNextPage", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      var lastResponse, cancel, nextURL, options, response;
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              lastResponse = _this.state.lastResponse;

              if (!(!lastResponse || !lastResponse.next)) {
                _context13.next = 3;
                break;
              }

              return _context13.abrupt("return");

            case 3:
              cancel = false;
              _context13.next = 6;
              return _this.setState(function (prevState) {
                if (prevState.refreshing) {
                  cancel = true;
                  return {};
                }

                return {
                  refreshing: true
                };
              });

            case 6:
              if (!cancel) {
                _context13.next = 8;
                break;
              }

              return _context13.abrupt("return");

            case 8:
              nextURL = new _urlParse["default"](lastResponse.next, true);
              options = _this.getOptions(nextURL.query);
              _context13.prev = 10;
              _context13.next = 13;
              return _this.doFeedRequest(options);

            case 13:
              response = _context13.sent;
              _context13.next = 21;
              break;

            case 16:
              _context13.prev = 16;
              _context13.t0 = _context13["catch"](10);

              _this.setState({
                refreshing: false
              });

              _this.props.errorHandler(_context13.t0, 'get-feed-next-page', {
                feedGroup: _this.props.feedGroup,
                userId: _this.props.userId
              });

              return _context13.abrupt("return");

            case 21:
              return _context13.abrupt("return", _this.setState(function (prevState) {
                var activities = prevState.activities.merge(_this.responseToActivityMap(response));

                var activityIdToPath = _objectSpread({}, prevState.activityIdToPath, {}, _this.responseToActivityIdToPath(response));

                return {
                  activityOrder: prevState.activityOrder.concat(response.results.map(function (a) {
                    return a.id;
                  })),
                  activities: activities,
                  activityIdToPath: activityIdToPath,
                  activityIdToPaths: _this.responseToActivityIdToPaths(response, prevState.activityIdToPaths),
                  reactionIdToPaths: _this.feedResponseToReactionIdToPaths(response, prevState.reactionIdToPaths),
                  reactionActivities: _objectSpread({}, prevState.reactionActivities, {}, _this.responseToReactionActivities(response)),
                  refreshing: false,
                  lastResponse: response
                };
              }));

            case 22:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, null, [[10, 16]]);
    })));
    (0, _defineProperty2["default"])(this, "loadReverseNextPage", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
      var lastReverseResponse, cancel, nextURL, options, response;
      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              lastReverseResponse = _this.state.lastReverseResponse;

              if (!(!lastReverseResponse || !lastReverseResponse.next)) {
                _context14.next = 3;
                break;
              }

              return _context14.abrupt("return");

            case 3:
              cancel = false;
              _context14.next = 6;
              return _this.setState(function (prevState) {
                if (prevState.refreshing) {
                  cancel = true;
                  return {};
                }

                return {
                  refreshing: true
                };
              });

            case 6:
              if (!cancel) {
                _context14.next = 8;
                break;
              }

              return _context14.abrupt("return");

            case 8:
              nextURL = new _urlParse["default"](lastReverseResponse.next, true);
              options = _this.getOptions(nextURL.query);
              _context14.prev = 10;
              _context14.next = 13;
              return _this.doFeedRequest(options);

            case 13:
              response = _context14.sent;
              _context14.next = 21;
              break;

            case 16:
              _context14.prev = 16;
              _context14.t0 = _context14["catch"](10);

              _this.setState({
                refreshing: false
              });

              _this.props.errorHandler(_context14.t0, 'get-feed-next-page', {
                feedGroup: _this.props.feedGroup,
                userId: _this.props.userId
              });

              return _context14.abrupt("return");

            case 21:
              return _context14.abrupt("return", _this.setState(function (prevState) {
                var activities = prevState.activities.merge(_this.responseToActivityMap(response));

                var activityIdToPath = _objectSpread({}, prevState.activityIdToPath, {}, _this.responseToActivityIdToPath(response));

                return {
                  activityOrder: response.results.map(function (a) {
                    return a.id;
                  }).concat(prevState.activityOrder),
                  activities: activities,
                  activityIdToPath: activityIdToPath,
                  activityIdToPaths: _this.responseToActivityIdToPaths(response, prevState.activityIdToPaths),
                  reactionIdToPaths: _this.feedResponseToReactionIdToPaths(response, prevState.reactionIdToPaths),
                  reactionActivities: _objectSpread({}, prevState.reactionActivities, {}, _this.responseToReactionActivities(response)),
                  refreshing: false,
                  lastReverseResponse: response
                };
              }));

            case 22:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, null, [[10, 16]]);
    })));
    (0, _defineProperty2["default"])(this, "loadNextReactions", /*#__PURE__*/function () {
      var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(activityId, kind, activityPath, oldestToNewest) {
        var options, orderPrefix, latestReactionsPath, nextUrlPath, refreshingPath, reactions_extra, nextUrl, refreshing, response;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                options = {
                  activity_id: activityId,
                  kind: kind
                };
                orderPrefix = 'latest';

                if (oldestToNewest) {
                  orderPrefix = 'oldest';
                }

                if (!activityPath) {
                  activityPath = _this.getActivityPath(activityId);
                }

                latestReactionsPath = [].concat((0, _toConsumableArray2["default"])(activityPath), [orderPrefix + '_reactions', kind]);
                nextUrlPath = [].concat((0, _toConsumableArray2["default"])(activityPath), [orderPrefix + '_reactions_extra', kind, 'next']);
                refreshingPath = [].concat((0, _toConsumableArray2["default"])(activityPath), [orderPrefix + '_reactions_extra', kind, 'refreshing']);
                reactions_extra = _this.state.activities.getIn([].concat((0, _toConsumableArray2["default"])(activityPath), [orderPrefix + '_reactions_extra']));
                nextUrl = 'https://api.stream-io-api.com/';

                if (reactions_extra) {
                  nextUrl = reactions_extra.getIn([kind, 'next'], '');
                } else if (oldestToNewest) {
                  // If it's the first request and oldest to newest make sure
                  // order is reversed by this trick with a non existant id.
                  options.id_gt = 'non-existant-' + (0, _utils.generateRandomId)();
                }

                refreshing = _this.state.activities.getIn(refreshingPath, false);

                if (!(!nextUrl || refreshing)) {
                  _context15.next = 13;
                  break;
                }

                return _context15.abrupt("return");

              case 13:
                _this.setState(function (prevState) {
                  return {
                    activities: prevState.activities.setIn(refreshingPath, true)
                  };
                });

                options = _objectSpread({}, (0, _urlParse["default"])(nextUrl, true).query, {}, options);
                _context15.prev = 15;

                if (!_this.props.doReactionsFilterRequest) {
                  _context15.next = 22;
                  break;
                }

                _context15.next = 19;
                return _this.props.doReactionsFilterRequest(options);

              case 19:
                response = _context15.sent;
                _context15.next = 25;
                break;

              case 22:
                _context15.next = 24;
                return _this.props.client.reactions.filter(options);

              case 24:
                response = _context15.sent;

              case 25:
                _context15.next = 32;
                break;

              case 27:
                _context15.prev = 27;
                _context15.t0 = _context15["catch"](15);

                _this.setState({
                  refreshing: false
                });

                _this.props.errorHandler(_context15.t0, 'get-reactions-next-page', {
                  options: options
                });

                return _context15.abrupt("return");

              case 32:
                _this.setState(function (prevState) {
                  return {
                    activities: prevState.activities.setIn(refreshingPath, false).setIn(nextUrlPath, response.next).updateIn(latestReactionsPath, function () {
                      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable["default"].List();
                      return v.concat(_immutable["default"].fromJS(response.results));
                    }),
                    reactionIdToPaths: _this.reactionResponseToReactionIdToPaths(response, prevState.reactionIdToPaths, latestReactionsPath, prevState.activities.getIn(latestReactionsPath, _immutable["default"].List()).toJS().length)
                  };
                });

              case 33:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, null, [[15, 27]]);
      }));

      return function (_x24, _x25, _x26, _x27) {
        return _ref17.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "refreshUnreadUnseen", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
      var response;
      return _regenerator["default"].wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.prev = 0;
              _context16.next = 3;
              return _this.doFeedRequest({
                limit: 0
              });

            case 3:
              response = _context16.sent;
              _context16.next = 10;
              break;

            case 6:
              _context16.prev = 6;
              _context16.t0 = _context16["catch"](0);

              _this.props.errorHandler(_context16.t0, 'get-notification-counts', {
                feedGroup: _this.props.feedGroup,
                userId: _this.props.userId
              });

              return _context16.abrupt("return");

            case 10:
              return _context16.abrupt("return", _this.setState(_this.unseenUnreadFromResponse(response)));

            case 11:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, null, [[0, 6]]);
    })));
    this.props = props;
    var initialOptions = this.getOptions();
    this.registeredCallbacks = [];
    var previousUrl = '';

    if (initialOptions.id_gte) {
      previousUrl = "?id_lt=".concat(initialOptions.id_gte);
    } else if (initialOptions.id_gt) {
      previousUrl = "?id_lte=".concat(initialOptions.id_gt);
    } else if (initialOptions.id_lte) {
      previousUrl = "?id_gt=".concat(initialOptions.id_lte);
    } else if (initialOptions.id_lt) {
      previousUrl = "?id_gte=".concat(initialOptions.id_lt);
    }

    this.state.lastReverseResponse = {
      next: previousUrl
    };
  }

  (0, _createClass2["default"])(FeedManager, [{
    key: "register",
    value: function register(callback) {
      this.registeredCallbacks.push(callback);
      this.subscribe();
    }
  }, {
    key: "unregister",
    value: function unregister(callback) {
      this.registeredCallbacks.splice(this.registeredCallbacks.indexOf(callback));
      this.unsubscribe();
    }
  }, {
    key: "triggerUpdate",
    value: function triggerUpdate() {
      var _iterator12 = _createForOfIteratorHelper(this.registeredCallbacks),
          _step12;

      try {
        for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
          var callback = _step12.value;
          callback();
        }
      } catch (err) {
        _iterator12.e(err);
      } finally {
        _iterator12.f();
      }
    }
  }, {
    key: "unseenUnreadFromResponse",
    value: function unseenUnreadFromResponse(response) {
      var unseen = 0;
      var unread = 0;

      if (typeof response.unseen === 'number') {
        unseen = response.unseen;
      }

      if (typeof response.unread === 'number') {
        unread = response.unread;
      }

      return {
        unseen: unseen,
        unread: unread
      };
    }
  }]);
  return FeedManager;
}();

exports.FeedManager = FeedManager;

var Feed = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Feed, _React$Component);

  var _super = _createSuper(Feed);

  function Feed() {
    var _this2;

    (0, _classCallCheck2["default"])(this, Feed);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_appCtxWrapperFunc", function (appCtx) {
      return /*#__PURE__*/React.createElement(FeedInner, (0, _extends2["default"])({}, _this2.props, appCtx));
    });
    return _this2;
  }

  (0, _createClass2["default"])(Feed, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(_StreamApp.StreamApp.Consumer, null, this._appCtxWrapperFunc);
    }
  }]);
  return Feed;
}(React.Component);

exports.Feed = Feed;

var FeedInner = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2["default"])(FeedInner, _React$Component2);

  var _super2 = _createSuper(FeedInner);

  function FeedInner(props) {
    var _this3;

    (0, _classCallCheck2["default"])(this, FeedInner);
    _this3 = _super2.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this3), "boundForceUpdate", function () {
      return _this3.forceUpdate();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this3), "getCtx", function () {
      var manager = _this3.state.manager;
      var state = manager.state;
      return {
        getActivityPath: manager.getActivityPath,
        onToggleReaction: manager.onToggleReaction,
        onAddReaction: manager.onAddReaction,
        onRemoveReaction: manager.onRemoveReaction,
        onToggleChildReaction: manager.onToggleChildReaction,
        onAddChildReaction: manager.onAddChildReaction,
        onRemoveChildReaction: manager.onRemoveChildReaction,
        onRemoveActivity: manager.onRemoveActivity,
        onMarkAsRead: manager.onMarkAsRead,
        onMarkAsSeen: manager.onMarkAsSeen,
        hasDoneRequest: state.lastResponse != null,
        refresh: manager.refresh,
        refreshUnreadUnseen: manager.refreshUnreadUnseen,
        loadNextReactions: manager.loadNextReactions,
        loadNextPage: manager.loadNextPage,
        hasNextPage: manager.hasNextPage(),
        loadReverseNextPage: manager.loadReverseNextPage,
        hasReverseNextPage: manager.hasReverseNextPage(),
        feedGroup: _this3.props.feedGroup,
        userId: _this3.props.userId,
        activityOrder: state.activityOrder,
        activities: state.activities,
        realtimeAdds: state.realtimeAdds,
        realtimeDeletes: state.realtimeDeletes,
        refreshing: state.refreshing,
        unread: state.unread,
        unseen: state.unseen
      };
    });
    var feedId = props.client.feed(props.feedGroup, props.userId).id;
    var _manager = props.sharedFeedManagers[feedId];

    if (!_manager) {
      _manager = new FeedManager(props);
    }

    _this3.state = {
      manager: _manager
    };
    return _this3;
  }

  (0, _createClass2["default"])(FeedInner, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      return this.state.manager.register(this.boundForceUpdate);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var clientDifferent = this.props.client !== prevProps.client;
      var notifyDifferent = this.props.notify !== prevProps.notify;
      var feedDifferent = this.props.userId !== prevProps.userId || this.props.feedGroup !== prevProps.feedGroup;
      var optionsDifferent = !_lodash["default"].isEqual(this.props.options, prevProps.options);
      var doFeedRequestDifferent = this.props.doFeedRequest !== prevProps.doFeedRequest;

      if (clientDifferent || feedDifferent || optionsDifferent || doFeedRequestDifferent) {// TODO: Implement
      }

      if (clientDifferent || feedDifferent || notifyDifferent) {// TODO: Implement
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      return this.state.manager.unregister(this.boundForceUpdate);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(FeedContext.Provider, {
        value: this.getCtx()
      }, this.props.children);
    }
  }]);
  return FeedInner;
}(React.Component);