/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { SafeAreaView, FlatList, View, Text, Dimensions, TouchableOpacity, useWindowDimensions, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea, Tab, Tabs } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import LikeButton from '../components/LikeButton';
import { Viewport } from '@skele/components'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
import { connect } from 'getstream';
import * as rssParser from 'react-native-rss-parser';
import { useFocusEffect } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BottomSheet from 'reanimated-bottom-sheet';
import { SliderBox } from "react-native-image-slider-box";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Snackbar } from 'react-native-paper';
import analytics from '@segment/analytics-react-native';
import { getUniqueId } from 'react-native-device-info';
import { Chip } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker'
import YoutubePlayer from "react-native-youtube-iframe";
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import * as Animatable from 'react-native-animatable';
import FeedComponent from '../Modules/FeedComponent';
import Video from 'react-native-video';
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import VideoPlayer from 'react-native-video-player'
import PostLoader from '../Modules/PostLoader';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import { height, width } from '../Modules/CommonImports';
const VideoFullScreen = ({ route, navigation }) => {
    const videoPlayer = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(route.params.duration);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paused, setPaused] = useState(false);
    const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);

    const onSeek = (seek) => {
        videoPlayer?.current.seek(seek);
    };

    const onPaused = (playerState) => {
        setPaused(!paused);
        setPlayerState(playerState);
    };

    const onReplay = () => {
        setPlayerState(PLAYER_STATES.PLAYING);
        videoPlayer?.current.seek(0);
    };

    const onProgress = (data) => {
        // Video Player will continue progress even if the video already ended
        if (!isLoading) {
            setCurrentTime(data.currentTime);
        }
    };

    const onLoad = (data) => {
        setIsLoading(false);
        videoPlayer?.current.seek(route.params.time)
    };

    const onLoadStart = () => setIsLoading(true);

    const onEnd = () => {
        // Uncomment this line if you choose repeat=false in the video player
        // setPlayerState(PLAYER_STATES.ENDED);
    };

    const onSeeking = (currentTime) => setCurrentTime(currentTime);
    const noop = () => {
        navigation.pop()
    };
    return (
        <View>
            <Video
                onEnd={onEnd}
                onLoad={onLoad}
                onLoadStart={onLoadStart}
                onProgress={onProgress}
                paused={paused}
                ref={(ref) => (videoPlayer.current = ref)}
                resizeMode="contain"
                source={{
                    uri: route.params.video,
                }}
                style={{ width: width, height: height }}
                fullscreen={true}
                fullscreenOrientation={'potrait'}
            />
            <MediaControls
                duration={duration}
                isLoading={isLoading}
                mainColor="#327FEB"
                onFullScreen={noop}
                onPaused={onPaused}
                onReplay={onReplay}
                onSeek={onSeek}
                onSeeking={onSeeking}
                playerState={playerState}
                progress={currentTime}
            >
                <MediaControls.Toolbar>
                </MediaControls.Toolbar>
            </MediaControls>
        </View>
    )
}
export default VideoFullScreen