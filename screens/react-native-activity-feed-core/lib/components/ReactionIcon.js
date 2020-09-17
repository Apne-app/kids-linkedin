"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _styles = require("../styles");

var _Context = require("../Context");

function defaultLabelFunction(count, props) {
  var labelSingle = props.labelSingle,
      labelPlural = props.labelPlural,
      labelFunction = props.labelFunction,
      kind = props.kind,
      t = props.t;

  if (labelFunction) {
    return labelFunction({
      count: count,
      labelSingle: labelSingle,
      labelPlural: labelPlural
    });
  }

  var label;

  if (labelSingle && labelPlural) {
    label = count === 1 ? "1 ".concat(labelSingle) : "".concat(count, " ").concat(labelPlural);
  }

  if (!labelSingle || !labelPlural) {
    switch (kind) {
      case 'like':
        label = count === 1 ? t('1 like') : t('{{ countLikes }} likes', {
          countLikes: count
        });
        break;

      case 'repost':
        label = count === 1 ? t('1 repost') : t('{{ countReposts }} reposts', {
          countReposts: count
        });
        break;

      case 'comment':
        label = count === 1 ? t('1 comment') : t('{{ countComments }} comments', {
          countComments: count
        });
        break;

      default:
        break;
    }
  }

  return label;
}

var ReactionIcon = (0, _Context.withTranslationContext)(function (props) {
  var count = null;

  if (props.counts && props.kind) {
    count = props.counts[props.kind] || 0;
  }

  var styles = (0, _styles.buildStylesheet)('reactionIcon', props.styles);
  var dimensions = {};

  if (props.height !== undefined) {
    dimensions.height = props.height;
  }

  if (props.width !== undefined) {
    dimensions.width = props.width;
  }

  return /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
    style: styles.container,
    onPress: props.onPress
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.Image, {
    source: props.icon,
    style: [styles.image, dimensions]
  }), count != null ? /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
    style: styles.text
  }, defaultLabelFunction(count, props)) : null);
});
var _default = ReactionIcon;
exports["default"] = _default;