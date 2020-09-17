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

var _Context = require("../Context");

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Renders a notification message when new activities are received by a feed
 * @example ./examples/NewActivitiesNotification.md
 */
var NewActivitiesNotification = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(NewActivitiesNotification, _React$Component);

  var _super = _createSuper(NewActivitiesNotification);

  function NewActivitiesNotification() {
    var _this;

    (0, _classCallCheck2["default"])(this, NewActivitiesNotification);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_labelFunction", function () {
      var _this$props = _this.props,
          adds = _this$props.adds,
          deletes = _this$props.deletes,
          labelSingular = _this$props.labelSingular,
          labelPlural = _this$props.labelPlural,
          labelFunction = _this$props.labelFunction,
          t = _this$props.t;
      var addCount = (adds || []).length;
      var deleteCount = (deletes || []).length;
      var count = addCount + deleteCount;

      if (labelFunction) {
        return labelFunction({
          count: count,
          addCount: addCount,
          deleteCount: deleteCount,
          labelSingular: labelSingular,
          labelPlural: labelPlural
        });
      }

      if (addCount === 0) {
        return null;
      }

      var singleNotificationText = '';
      var pluralNotificationText = '';

      if (labelSingular) {
        singleNotificationText = "You have 1 new ".concat(labelSingular);
      } else {
        singleNotificationText = t('You have 1 new notification');
      }

      if (labelPlural) {
        pluralNotificationText = "You have ".concat(addCount, " new ").concat(labelPlural);
      } else {
        pluralNotificationText = t('You have {{ notificationCount }} new notifications', {
          notificationCount: addCount
        });
      }

      return addCount > 1 ? pluralNotificationText : singleNotificationText; // return `You have ${addCount} new ${
      //   addCount > 1 ? labelPlural : labelSingular
      // }`;
    });
    return _this;
  }

  (0, _createClass2["default"])(NewActivitiesNotification, [{
    key: "render",
    value: function render() {
      var styles = (0, _styles.buildStylesheet)('pagerBlock', this.props.styles);

      var label = this._labelFunction();

      return label != null ? /*#__PURE__*/React.createElement(_reactNative.TouchableOpacity, {
        style: [styles.container],
        onPress: this.props.onPress
      }, /*#__PURE__*/React.createElement(_reactNative.Text, {
        style: [styles.text]
      }, label)) : null;
    }
  }]);
  return NewActivitiesNotification;
}(React.Component);

(0, _defineProperty2["default"])(NewActivitiesNotification, "defaultProps", {
  labelSingular: 'activity',
  labelPlural: 'activities'
});

var _default = (0, _Context.withTranslationContext)(NewActivitiesNotification);

exports["default"] = _default;