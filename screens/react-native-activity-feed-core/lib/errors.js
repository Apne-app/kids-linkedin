"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fallbackErrorMessage = exports.getErrorMessage = exports.handleError = void 0;

var _getstream = _interopRequireDefault(require("getstream"));

var handleError = function handleError(error, type, detail) {
  console.warn(error);
  alert(getErrorMessage(error, type, detail));
};

exports.handleError = handleError;

var getErrorMessage = function getErrorMessage(error, type, detail) {
  console.warn(error);

  if (!(error instanceof _getstream["default"].errors.StreamApiError)) {
    return fallbackErrorMessage(error, type, detail);
  }

  var response = error.response;

  if (!response.statusCode || !response.body || !response.body.detail) {
    return fallbackErrorMessage(error, type, detail);
  }

  var statusCode = response.statusCode;
  var text = response.body.detail;

  if (statusCode >= 400 && statusCode < 500) {
    return text;
  } else if (statusCode >= 500 && statusCode < 600) {
    return text;
  }

  return fallbackErrorMessage(error, type, detail);
};

exports.getErrorMessage = getErrorMessage;

var fallbackErrorMessage = function fallbackErrorMessage(error, type, detail) {
  var text = 'Something went wrong';
  var suffix = '';

  switch (type) {
    case 'get-user-info':
      text += ' when loading user info';
      break;

    case 'get-feed':
      text += ' when loading the feed';
      break;

    case 'get-feed-next-page':
      text += ' when loading the next page of the feed';
      break;

    case 'get-notification-counts':
      text += ' when loading your unread notification counts';
      break;

    case 'upload-image':
      text += ' when uploading your image';
      suffix = ' If it is, the image is probably too big';
      break;

    case 'add-activity':
      text += ' when submitting your post';
      break;

    case 'add-reaction':
      text += ' when submitting your ' + detail.kind;
      break;

    case 'delete-reaction':
      text += ' when removing your ' + detail.kind;
      break;

    default:
      break;
  }

  text += '. Is your internet working?' + suffix;
  return text;
};

exports.fallbackErrorMessage = fallbackErrorMessage;