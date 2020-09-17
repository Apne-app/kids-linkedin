"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  StreamApp: true,
  FlatFeed: true,
  NotificationFeed: true,
  SinglePost: true,
  Avatar: true,
  FollowButton: true,
  UrlPreview: true,
  StatusUpdateForm: true,
  UploadImage: true,
  UserBar: true,
  UserCard: true,
  ReactionIcon: true,
  ReactionToggleIcon: true,
  ReactionIconBar: true,
  CommentsContainer: true,
  Card: true,
  ReactionList: true,
  SectionHeader: true,
  CommentBox: true,
  CommentItem: true,
  CommentList: true,
  LikeList: true,
  BackButton: true,
  Activity: true,
  LikeButton: true,
  NewActivitiesNotification: true,
  IconBadge: true,
  updateStyle: true,
  getStyle: true,
  buildStylesheet: true,
  humanizeTimestamp: true,
  registerNativeHandlers: true,
  setAndroidTranslucentStatusBar: true
};
Object.defineProperty(exports, "StreamApp", {
  enumerable: true,
  get: function get() {
    return _Context.StreamApp;
  }
});
Object.defineProperty(exports, "FlatFeed", {
  enumerable: true,
  get: function get() {
    return _FlatFeed["default"];
  }
});
Object.defineProperty(exports, "NotificationFeed", {
  enumerable: true,
  get: function get() {
    return _NotificationFeed["default"];
  }
});
Object.defineProperty(exports, "SinglePost", {
  enumerable: true,
  get: function get() {
    return _SinglePost["default"];
  }
});
Object.defineProperty(exports, "Avatar", {
  enumerable: true,
  get: function get() {
    return _Avatar["default"];
  }
});
Object.defineProperty(exports, "FollowButton", {
  enumerable: true,
  get: function get() {
    return _FollowButton["default"];
  }
});
Object.defineProperty(exports, "UrlPreview", {
  enumerable: true,
  get: function get() {
    return _UrlPreview["default"];
  }
});
Object.defineProperty(exports, "StatusUpdateForm", {
  enumerable: true,
  get: function get() {
    return _StatusUpdateForm["default"];
  }
});
Object.defineProperty(exports, "UploadImage", {
  enumerable: true,
  get: function get() {
    return _UploadImage["default"];
  }
});
Object.defineProperty(exports, "UserBar", {
  enumerable: true,
  get: function get() {
    return _UserBar["default"];
  }
});
Object.defineProperty(exports, "UserCard", {
  enumerable: true,
  get: function get() {
    return _UserCard["default"];
  }
});
Object.defineProperty(exports, "ReactionIcon", {
  enumerable: true,
  get: function get() {
    return _ReactionIcon["default"];
  }
});
Object.defineProperty(exports, "ReactionToggleIcon", {
  enumerable: true,
  get: function get() {
    return _ReactionToggleIcon["default"];
  }
});
Object.defineProperty(exports, "ReactionIconBar", {
  enumerable: true,
  get: function get() {
    return _ReactionIconBar["default"];
  }
});
Object.defineProperty(exports, "CommentsContainer", {
  enumerable: true,
  get: function get() {
    return _CommentsContainer["default"];
  }
});
Object.defineProperty(exports, "Card", {
  enumerable: true,
  get: function get() {
    return _Card["default"];
  }
});
Object.defineProperty(exports, "ReactionList", {
  enumerable: true,
  get: function get() {
    return _ReactionList["default"];
  }
});
Object.defineProperty(exports, "SectionHeader", {
  enumerable: true,
  get: function get() {
    return _SectionHeader["default"];
  }
});
Object.defineProperty(exports, "CommentBox", {
  enumerable: true,
  get: function get() {
    return _CommentBox["default"];
  }
});
Object.defineProperty(exports, "CommentItem", {
  enumerable: true,
  get: function get() {
    return _CommentItem["default"];
  }
});
Object.defineProperty(exports, "CommentList", {
  enumerable: true,
  get: function get() {
    return _CommentList["default"];
  }
});
Object.defineProperty(exports, "LikeList", {
  enumerable: true,
  get: function get() {
    return _LikeList["default"];
  }
});
Object.defineProperty(exports, "BackButton", {
  enumerable: true,
  get: function get() {
    return _BackButton["default"];
  }
});
Object.defineProperty(exports, "Activity", {
  enumerable: true,
  get: function get() {
    return _Activity["default"];
  }
});
Object.defineProperty(exports, "LikeButton", {
  enumerable: true,
  get: function get() {
    return _LikeButton["default"];
  }
});
Object.defineProperty(exports, "NewActivitiesNotification", {
  enumerable: true,
  get: function get() {
    return _NewActivitiesNotification["default"];
  }
});
Object.defineProperty(exports, "IconBadge", {
  enumerable: true,
  get: function get() {
    return _IconBadge["default"];
  }
});
Object.defineProperty(exports, "updateStyle", {
  enumerable: true,
  get: function get() {
    return _styles.updateStyle;
  }
});
Object.defineProperty(exports, "getStyle", {
  enumerable: true,
  get: function get() {
    return _styles.getStyle;
  }
});
Object.defineProperty(exports, "buildStylesheet", {
  enumerable: true,
  get: function get() {
    return _styles.buildStylesheet;
  }
});
Object.defineProperty(exports, "humanizeTimestamp", {
  enumerable: true,
  get: function get() {
    return _utils.humanizeTimestamp;
  }
});
Object.defineProperty(exports, "registerNativeHandlers", {
  enumerable: true,
  get: function get() {
    return _native.registerNativeHandlers;
  }
});
Object.defineProperty(exports, "setAndroidTranslucentStatusBar", {
  enumerable: true,
  get: function get() {
    return _native.setAndroidTranslucentStatusBar;
  }
});

var _Context = require("./Context");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});

var _FlatFeed = _interopRequireDefault(require("./components/FlatFeed"));

var _NotificationFeed = _interopRequireDefault(require("./components/NotificationFeed"));

var _SinglePost = _interopRequireDefault(require("./components/SinglePost"));

var _Avatar = _interopRequireDefault(require("./components/Avatar"));

var _FollowButton = _interopRequireDefault(require("./components/FollowButton"));

var _UrlPreview = _interopRequireDefault(require("./components/UrlPreview"));

var _StatusUpdateForm = _interopRequireDefault(require("./components/StatusUpdateForm"));

var _UploadImage = _interopRequireDefault(require("./components/UploadImage"));

var _UserBar = _interopRequireDefault(require("./components/UserBar"));

var _UserCard = _interopRequireDefault(require("./components/UserCard"));

var _ReactionIcon = _interopRequireDefault(require("./components/ReactionIcon"));

var _ReactionToggleIcon = _interopRequireDefault(require("./components/ReactionToggleIcon"));

var _ReactionIconBar = _interopRequireDefault(require("./components/ReactionIconBar"));

var _CommentsContainer = _interopRequireDefault(require("./components/CommentsContainer"));

var _Card = _interopRequireDefault(require("./components/Card"));

var _ReactionList = _interopRequireDefault(require("./components/ReactionList"));

var _SectionHeader = _interopRequireDefault(require("./components/SectionHeader"));

var _CommentBox = _interopRequireDefault(require("./components/CommentBox"));

var _CommentItem = _interopRequireDefault(require("./components/CommentItem"));

var _CommentList = _interopRequireDefault(require("./components/CommentList"));

var _LikeList = _interopRequireDefault(require("./components/LikeList"));

var _BackButton = _interopRequireDefault(require("./components/BackButton"));

var _Activity = _interopRequireDefault(require("./components/Activity"));

var _LikeButton = _interopRequireDefault(require("./components/LikeButton"));

var _NewActivitiesNotification = _interopRequireDefault(require("./components/NewActivitiesNotification"));

var _IconBadge = _interopRequireDefault(require("./components/IconBadge"));

var _styles = require("./styles");

var _utils = require("./utils");

var _native = require("./native");

if (global.Expo) {
  (0, _native.setAndroidTranslucentStatusBar)(true);
} else {
  (0, _native.setAndroidTranslucentStatusBar)(false);
}