/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, TouchableOpacity, BackHandler, Alert, Image, Share, Linking, ScrollView, TouchableHighlight, ImageStore, StatusBar, RefreshControl } from 'react-native'
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const VideoPlayer = React.memo(({ navigation, video }) => {
    const videoPlayer = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paused, setPaused] = useState(true);
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
        setDuration(data.duration);
        setIsLoading(false);
    };
    const onLoadStart = () => setIsLoading(true);

    const onEnd = () => {
        // Uncomment this line if you choose repeat=false in the video player
        setPlayerState(PLAYER_STATES.ENDED);
    };
    const onSeeking = (currentTime) => setCurrentTime(currentTime);
    const noop = (video) => {
        setPaused(true);
        setPlayerState(PLAYER_STATES.PAUSED)
        navigation.navigate('VideoFull', { duration: duration, video: video, time: currentTime })
    };
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <InViewPort onChange={(value) => value ? null : (setPaused(true), setPlayerState(PLAYER_STATES.PAUSED))}>
                <View>
                    <Video
                        onEnd={onEnd}
                        onLoad={onLoad}
                        onLoadStart={onLoadStart}
                        onProgress={onProgress}
                        paused={paused}
                        ref={(ref) => (videoPlayer.current = ref)}
                        resizeMode="contain"
                        repeat={false}
                        source={{
                            uri: video,
                        }}
                        style={styles.mediaPlayer}
                        playInBackground={false}
                        playWhenInactive={false}
                    />
                    <MediaControls
                        duration={duration}
                        isLoading={isLoading}
                        mainColor="#327FEB"
                        onFullScreen={() => noop(video)}
                        onPaused={onPaused}
                        onReplay={onReplay}
                        onSeek={onSeek}
                        onSeeking={onSeeking}
                        playerState={playerState}
                        progress={currentTime}
                        showOnStart={true}
                    >
                        <MediaControls.Toolbar>
                        </MediaControls.Toolbar>
                    </MediaControls>
                </View>
            </InViewPort>
        </View>
    )
})
const styles = StyleSheet.create({
    mediaPlayer: {
        height: 340,
        width: width,
        backgroundColor: "black",
    },
});
export default VideoPlayer