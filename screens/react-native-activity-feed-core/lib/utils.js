"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.humanizeTimestamp = humanizeTimestamp;
exports.sleep = sleep;
exports.generateRandomId = generateRandomId;
exports.smartRender = void 0;

var React = _interopRequireWildcard(require("react"));

var _dayjs = _interopRequireDefault(require("dayjs"));

function humanizeTimestamp(timestamp) {
  var tDateTimeParser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _dayjs["default"];
  // Following calculation is based on assumption that tDateTimeParser()
  // either returns momentjs or dayjs object.
  var time = tDateTimeParser(timestamp).add((0, _dayjs["default"])(timestamp).utcOffset(), 'minute'); // parse time as UTC

  var now = tDateTimeParser();
  return time.from(now);
}

var smartRender = function smartRender(ElementOrComponentOrLiteral, props, fallback) {
  if (ElementOrComponentOrLiteral === undefined) {
    ElementOrComponentOrLiteral = fallback;
  }

  if (React.isValidElement(ElementOrComponentOrLiteral)) {
    // Flow cast through any, to make flow believe it's a React.Element
    var element = ElementOrComponentOrLiteral;
    return element;
  } // Flow cast through any to remove React.Element after previous check


  var ComponentOrLiteral = ElementOrComponentOrLiteral;

  if (typeof ComponentOrLiteral === 'string' || typeof ComponentOrLiteral === 'number' || typeof ComponentOrLiteral === 'boolean' || ComponentOrLiteral == null) {
    return ComponentOrLiteral;
  }

  return /*#__PURE__*/React.createElement(ComponentOrLiteral, props);
};

exports.smartRender = smartRender;

function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
} // https://stackoverflow.com/a/6860916/2570866


function generateRandomId() {
  // prettier-ignore
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function S4() {
  return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}