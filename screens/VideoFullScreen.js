/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, Alert, Image, Share, Linking, ScrollView, TouchableHighlight, ImageStore, StatusBar, RefreshControl } from 'react-native'
var VideoPlayer = require('react-native-exoplayer');
const VideoFullScreen = ({ route, navigation }) => {
    return (
        <VideoPlayer
            seekColor={'#327FEB'}
            toggleResizeModeOnFullscreen={false}
            tapAnywhereToPause={true}
            playInBackground={false}
            fullscreen={true}
            disableFullscreen={false}
            disableBack={true}
            disableVolume={true}
            source={{ uri: route.params.uri }}
            navigator={navigation} />
    )
}
export default VideoFullScreen