"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyle = getStyle;
exports.updateStyle = updateStyle;
exports.buildStylesheet = buildStylesheet;
exports.styles = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _reactNative = require("react-native");

var _lodash = _interopRequireDefault(require("lodash"));

var styles = {
  avatar: _reactNative.StyleSheet.create({
    container: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
      position: 'absolute'
    },
    noShadow: {
      shadowOpacity: 0
    }
  }),
  backButton: _reactNative.StyleSheet.create({
    backButton: {
      width: 50,
      paddingRight: 6,
      paddingTop: 6,
      paddingBottom: 6
    },
    backArrow: {
      height: 22,
      width: 12
    }
  }),
  userBar: _reactNative.StyleSheet.create({
    container: {
      width: 100 + '%',
      flexDirection: 'row',
      alignItems: 'center'
    },
    content: {
      flex: 1
    },
    username: {
      fontSize: 17,
      fontWeight: '300',
      marginBottom: 4
    },
    subtitle: {
      fontSize: 15,
      opacity: 0.8,
      fontWeight: '300'
    },
    time: {
      fontSize: 13,
      opacity: 0.8,
      fontWeight: '300'
    }
  }),
  uploadImage: _reactNative.StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      borderRadius: 22,
      padding: 5,
      opacity: 0.8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowOpacity: 0.5,
      shadowRadius: 5
    },
    image: {
      width: 35,
      height: 35
    }
  }),
  statusUpdateForm: _reactNative.StyleSheet.create({
    container: {
      shadowOffset: {
        width: 0,
        height: -3
      },
      shadowColor: 'black',
      shadowOpacity: 0.1,
      backgroundColor: '#f6f6f6',
      height: 80
    },
    containerFocused: {
      height: 120
    },
    containerFocusedOg: {
      height: 171
    },
    newPostContainer: {
      backgroundColor: '#ffffff',
      padding: 15,
      flexDirection: 'row',
      flex: 1
    },
    textInput: {
      position: 'relative',
      // borderWidth: 1,
      // borderColor: 'red',
      padding: 10,
      marginRight: 10,
      flex: 1,
      backgroundColor: '#f8f8f8',
      borderRadius: 10
    },
    actionPanel: {
      justifyContent: 'space-between'
    },
    actionPanelBlur: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    accessory: {
      borderTopColor: '#DADFE3',
      backgroundColor: '#f6f6f6',
      borderTopWidth: 1,
      width: 100 + '%',
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center'
    },
    imageContainer: {
      width: 30,
      height: 30,
      overflow: 'hidden',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center'
    },
    imageContainerBlur: {
      marginRight: 8
    },
    imageOverlay: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: 30,
      height: 30,
      padding: 8,
      backgroundColor: 'rgba(0,0,0,0.4)'
    },
    image: {
      // position: 'absolute',
      width: 30,
      height: 30
    },
    image_loading: {
      position: 'absolute',
      width: 30,
      height: 30,
      opacity: 0.5
    },
    submitImage: {
      // marginTop: 10,
      width: 24,
      height: 24
    }
  }),
  urlPreview: _reactNative.StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    leftColumn: {
      position: 'relative'
    },
    rightColumn: {
      flex: 1,
      flexDirection: 'column',
      marginLeft: 8
    },
    textStyle: {
      fontWeight: '700'
    },
    image: {
      width: 35,
      height: 35,
      borderRadius: 4
    },
    closeButton: {
      width: 20,
      height: 20
    }
  }),
  card: _reactNative.StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      margin: 15,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: '#C5D9E6',
      overflow: 'hidden'
    },
    image: {
      width: 100,
      height: 100
    },
    content: {
      flex: 1,
      padding: 10
    },
    title: {
      color: '#007AFF',
      fontWeight: '500',
      fontSize: 14,
      lineHeight: 17,
      marginBottom: 7
    },
    description: {
      color: '#364047',
      fontSize: 13
    }
  }),
  commentBox: _reactNative.StyleSheet.create({
    container: {
      flex: 1,
      shadowOffset: {
        width: 0,
        height: -3
      },
      shadowColor: 'black',
      shadowOpacity: 0.1,
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15
    },
    textInput: {
      flex: 1,
      marginLeft: 25,
      fontSize: 16,
      color: '#364047'
    }
  }),
  followButton: _reactNative.StyleSheet.create({
    button: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 7,
      paddingBottom: 7,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.1,
      backgroundColor: '#007AFF',
      shadowRadius: 1
    },
    buttonText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold'
    }
  }),
  flatFeed: _reactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    }
  }),
  notificationFeed: _reactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    }
  }),
  activity: _reactNative.StyleSheet.create({
    container: {
      paddingTop: 15,
      paddingBottom: 15,
      borderBottomColor: 'rgba(0,0,0,0.1)',
      borderBottomWidth: 1
    },
    header: {
      padding: 15
    },
    content: {
      paddingBottom: 15,
      paddingLeft: 15,
      paddingRight: 15
    },
    mention: {
      color: '#0076FF',
      fontWeight: '700'
    },
    hashtag: {
      color: '#0076FF'
    },
    url: {
      color: '#666'
    },
    text: {
      color: '#000'
    }
  }),
  button: _reactNative.StyleSheet.create({
    container: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 5,
      paddingBottom: 5
    },
    text: {
      fontWeight: '700'
    },
    image: {
      marginRight: 5,
      width: 24,
      height: 24
    }
  }),
  likeButton: _reactNative.StyleSheet.create({
    container: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      marginLeft: 15
    },
    text: {
      fontWeight: '700'
    },
    image: {
      marginRight: 5,
      width: 24,
      height: 24
    }
  }),
  pagerBlock: _reactNative.StyleSheet.create({
    container: {
      backgroundColor: '#0068FF',
      padding: 15
    },
    text: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: '700'
    }
  }),
  reactionIconBar: _reactNative.StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: 100 + '%'
    }
  }),
  reactionIcon: _reactNative.StyleSheet.create({
    container: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      marginLeft: 15
    },
    image: {
      marginRight: 5,
      height: 24,
      width: 24
    },
    text: {
      fontWeight: '700',
      opacity: 1,
      fontSize: 14
    }
  }),
  userCard: _reactNative.StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 8
    },
    text: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '300',
      flex: 1
    }
  }),
  iconBadge: _reactNative.StyleSheet.create({
    container: {},
    icon: {
      position: 'absolute',
      top: -3,
      left: 12,
      alignSelf: 'center',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FF0000'
    },
    text: {
      fontSize: 10,
      color: '#fff'
    },
    iconInner: {
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
      minWidth: 15,
      height: 15,
      paddingLeft: 3,
      paddingRight: 3,
      borderRadius: 20
    }
  }),
  commentItem: _reactNative.StyleSheet.create({
    container: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'flex-start',
      paddingTop: 12,
      paddingBottom: 12,
      paddingRight: 15,
      paddingLeft: 15,
      borderBottomColor: '#DADFE3',
      borderBottomWidth: 1
    },
    commentText: {
      flex: 1,
      marginLeft: 5,
      paddingTop: 3,
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    commentAuthor: {
      fontWeight: '700',
      fontSize: 14
    },
    commentContent: {
      fontSize: 14
    },
    commentTime: {
      fontSize: 14,
      color: '#95A4AD'
    }
  }),
  sectionHeader: _reactNative.StyleSheet.create({
    container: {
      height: 30,
      backgroundColor: '#F5F5F5',
      borderBottomWidth: 1,
      borderBottomColor: '#DADFE3',
      paddingLeft: 15,
      paddingRight: 15,
      flexDirection: 'row',
      alignItems: 'center'
    },
    label: {
      fontSize: 13,
      color: '#69747A'
    }
  }),
  reactionList: _reactNative.StyleSheet.create({
    container: {}
  })
};
exports.styles = styles;

var depthOf = function depthOf(object) {
  var level = 1;
  var key;

  for (key in object) {
    if (!object.hasOwnProperty(key)) continue;

    if ((0, _typeof2["default"])(object[key]) == 'object') {
      var depth = depthOf(object[key]) + 1;
      level = Math.max(depth, level);
    }
  }

  return level;
};

function getStyle(styleName) {
  return styles[styleName] || {};
}

function updateStyle(styleName, styleOverwrites) {
  styles[styleName] = buildStylesheet(styleName, styleOverwrites);
}

function buildStylesheet(styleName, styleOverwrites) {
  var baseStyle = getStyle(styleName);

  if (!styleOverwrites || Object.keys(styleOverwrites).length === 0) {
    return baseStyle;
  }

  var falseObj = {};
  var base = Object.keys(baseStyle).map(function (k) {
    return (0, _defineProperty2["default"])({}, k, _reactNative.StyleSheet.flatten(baseStyle[k]));
  }).reduce(function (accumulated, v) {
    return Object.assign(accumulated, v);
  }, {});
  var topLevelOverwrites = Object.keys(styleOverwrites).map(function (k) {
    if (depthOf(styleOverwrites[k]) === 1) {
      return (0, _defineProperty2["default"])({}, k, _reactNative.StyleSheet.flatten(styleOverwrites[k]));
    }

    return falseObj;
  }).filter(function (v) {
    return v !== falseObj;
  }).reduce(function (accumulated, v) {
    return Object.assign(accumulated, v);
  }, {}); // console.log(_.defaultsDeep(topLevelOverwrites, base));

  return _reactNative.StyleSheet.create(_lodash["default"].defaultsDeep(topLevelOverwrites, base));
}