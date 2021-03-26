/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, TouchableOpacity, Alert, Image, Share, Linking, TouchableHighlight, ImageStore, StatusBar, KeyboardAvoidingView, ScrollView, Keyboard, TextInput, Button } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet'
import ImageView from 'react-native-image-viewing';
import { useFocusEffect } from "@react-navigation/native";
import ImageViewer from 'react-native-image-zoom-viewer';
import { SliderBox } from "react-native-image-slider-box";
import YoutubePlayer from "react-native-youtube-iframe";
import BottomSheet from 'reanimated-bottom-sheet';
import CompHeader from '../Modules/CompHeader'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import AsyncStorage from '@react-native-community/async-storage'
import CompButton from '../Modules/CompButton'
import WebView from 'react-native-webview';
import { getUniqueId } from 'react-native-device-info';
import analytics from '@segment/analytics-react-native';
import FeedComponent from '../Modules/FeedComponent'
import FastImage from 'react-native-fast-image'
import axios from 'axios';
import KeyboardStickyView from 'rn-keyboard-sticky-view';
import Video from 'react-native-video';
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import PostLoader from '../Modules/PostLoader';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import ReadMore from 'react-native-read-more-text';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
function urlify(text) {
    var urlRegex = (/(https?:\/\/[^\s]+)/g);
    var res = text.match(urlRegex);
    return res
}

const SinglePostScreen = ({ navigation, route }) => {
    var videoRef = React.createRef();
    const [activity, setactivity] = useState()
    const [key, setkey] = useState('0')
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.pop()
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);

        }, []));
    const keyboardDidShowListener = React.useRef();
    const scrollref = React.useRef();
    const keyboardDidHideListener = React.useRef();
    const [comments, setcomments] = useState([])
    const [loader, setloader] = useState(true)
    const [comment, setcomment] = useState('')
    const [loading, setloading] = useState(1)
    const [place, setplace] = useState('1')
    const status = route.params.status
    const children = route.params.children
    var d = new Date();
    const videoPlayer = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paused, setPaused] = useState(true);
    const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
    console.log(route.params.id)
    useEffect(() => {
        var data = JSON.stringify({
            post_id: route.params.id,
            user_id: status === '3' ? children[0]['id'] : null
        })
        var config = {
            method: 'post',
            url: 'http://mr_robot.api.genio.app/getpost',
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config).then((response) => {
            setactivity(response.data.data[0]['data'])
            setloading(response.data.data[0]['data']['comments_count'])
            setloader(false)
        }).catch((response) => {
            console.log((response.toJSON()))
        })
    }, [])
    useEffect(() => {
        axios.post('http://mr_robot.api.genio.app/getcomments', {
            post_id: route.params.id
        }, {
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            setcomments(response['data']['data'])
            setloading(0)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
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
    };

    const onLoadStart = () => setIsLoading(true);

    const onEnd = () => {
        // Uncomment this line if you choose repeat=false in the video player
        // setPlayerState(PLAYER_STATES.ENDED);
    };

    const onSeeking = (currentTime) => setCurrentTime(currentTime);
    const noop = (video) => {
        setPaused(true);
        setPlayerState(PLAYER_STATES.PAUSED)
        navigation.navigate('VideoFull', { duration: duration, video: video, time: currentTime })
    };
    const onShare = async (message) => {
        try {
            const result = await Share.share({
                message:
                    message,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    var year = parseInt(d.getFullYear());
    const addorunlike = () => {
        var data = activity
        if (data['likes_user_id'] == children[0]['id']) {
            data['likes_user_id'] = null
            data['likes_count'] = data['likes_count'] - 1
            setactivity(data)
            setkey(String(parseInt(key) + 1))
            route.params.setparentkey ? route.params.setparentkey() : null
            axios.post('http://mr_robot.api.genio.app/like', {
                post_id: data['post_id'],
                user_id: children[0]['id'],
                user_name: children[0]['data']['name'],
                user_image: children[0]['data']['image'],
                response: 'unlike',
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {

            }).catch((error) => {

            })
        }
        else {
            data['likes_user_id'] = children[0]['id']
            data['likes_count'] = data['likes_count'] + 1
            setactivity(data)
            setkey(String(parseInt(key) + 1))
            route.params.setparentkey ? route.params.setparentkey() : null
            axios.post('http://mr_robot.api.genio.app/like', {
                post_id: data['post_id'],
                user_id: children[0]['id'],
                user_name: children[0]['data']['name'],
                user_image: children[0]['data']['image'],
                response: 'like',
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                analytics.track('Like', {
                    userID: children["0"]["id"],
                    deviceID: getUniqueId(),
                    by: children["0"]["id"],
                    byname: children["0"]['data']["name"],
                    byimage: children["0"]['data']["image"],
                    to: activity['user_id'],
                    actid: activity['post_id']
                })
            }).catch((error) => {

            })
        }
    }
    const CustomActivity = ({ props }) => {
        const refActionSheet = useRef(null);
        const showActionSheet = () => {
            refActionSheet.current.show()
        }
        const Footer = (id, data) => {
            return (<View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -12 }}>
                    <TouchableWithoutFeedback onPressIn={() => { addorunlike() }}>
                        <FastImage style={{ width: 32, height: 32, marginLeft: 10, marginRight: 0, marginTop: -1 }} source={activity['likes_user_id'] ? require('../Icons/star.png') : require('../Icons/star-outline.png')} />
                    </TouchableWithoutFeedback>
                    <Icon name="message-circle" type="Feather" style={{ fontSize: 28, marginLeft: 10, marginRight: 5 }} />
                    <Icon onPress={() => onShare('Hey! Check out this post by ' + activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1) + ' on the new Genio app: https://genio.app/post/' + activity['post_id'])} name="share-outline" type='MaterialCommunityIcons' style={{ fontSize: 28, marginLeft: 8, marginRight: -10, marginTop: -3 }} />
                    <TouchableOpacity style={{ width: 50, marginLeft: '58%', alignItems: 'center' }}
                        onPress={async () => {
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('WhatsappShare', {
                                userID: x ? JSON.parse(x)["0"]["id"] : null,
                                deviceID: getUniqueId()
                            });
                            Linking.openURL('whatsapp://send?text=Hey! Check out this post by ' + activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1) + ' on the new Genio app: https://genio.app/post/' + activity['post_id']).then((data) => {
                            }).catch((error) => {
                                alert('Please make sure Whatsapp is installed on your device');
                            });
                        }}
                    >
                        <Icon name="whatsapp" type="Fontisto" style={{ fontSize: 28, color: '#4FCE5D' }} />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1, width: width, backgroundColor: 'grey', opacity: 0.1, marginTop: 9, }} />
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <Text onPress={() => navigation.navigate('LikesList', { 'post_id': '' })} style={{ fontFamily: 'NunitoSans-SemiBold', marginLeft: 15, fontSize: 14, marginBottom: 2, marginRight: 8 }}>{activity['likes_count']} likes</Text>
                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', marginLeft: 7, fontSize: 14, marginBottom: 2 }}>{activity['comments_count']} comments</Text>
                </View>
                <View style={{ height: 1, width: width, backgroundColor: 'grey', opacity: 0.1, marginTop: 8, marginBottom: 5 }} />

                {loading ? <Image source={require('../assets/loading.gif')} style={{ width: 40, height: 40, marginLeft: 10 }} />
                    : comments.map((item) => {
                        return (
                            <View key={item['id']} style={{ flexDirection: 'row', padding: 10 }}>
                                <FastImage source={{ uri: item['data']['comments_user_image'] }} style={{ width: 25, height: 25, borderRadius: 10000 }} />
                                <Text style={{ fontSize: 13, color: 'black', paddingLeft: 10, fontFamily: 'NunitoSans-Regular' }}>
                                    {item['data']['comment']}
                                </Text>
                            </View>
                        )
                    })}
            </View>)
        }
        const [visible, setIsVisible] = React.useState(false);
        const Content = React.memo(() => (
            <View key={'content'} style={{ paddingVertical: 20 }}>
                {activity['caption'] === 'default123' ?
                    <View style={{ margin: 5 }}></View> :
                    <View style={{ marginRight: 8, marginLeft: 14, marginBottom: 10 }}>
                        <ReadMore renderRevealedFooter={(handlePress) => { return (<Text onPress={handlePress} style={{ fontFamily: 'NunitoSans-Bold', color: '#327FEB' }}>See Less</Text>) }} renderTruncatedFooter={(handlePress) => { return (<Text onPress={handlePress} style={{ fontFamily: 'NunitoSans-Bold', color: '#327FEB' }}>See More</Text>) }} numberOfLines={3}>
                            <Text style={{ fontFamily: 'NunitoSans-Regular' }}>
                                {activity['caption'] === 'default123' ? '' : activity['caption']}
                            </Text>
                        </ReadMore>
                    </View>}
                {activity['link'] ? <Text onPress={() => { navigation.navigate('Browser', { 'url': activity['link'] }) }} style={{ fontFamily: 'NunitoSans-SemiBold', paddingHorizontal: 10, marginLeft: 14, marginTop: 0, marginBottom: 10, color: '#327FEB' }}>{'Click here to follow the link'}</Text> : null}
                {activity['images'] ?
                    <ImageView
                        key={'2'}
                        presentationStyle={{ height: height / 3 }}
                        images={images}
                        imageIndex={0}
                        visible={visible}
                        doubleTapToZoomEnabled={true}
                        swipeToCloseEnabled={true}
                        animationType={'fade'}
                        animationType={'none'}
                        onRequestClose={() => setIsVisible(false)}
                    /> : <View></View>}
                <TouchableWithoutFeedback onPress={() => setIsVisible(true)} style={{ alignSelf: 'center' }}>
                    {activity['images'] ? activity['images'].split(", ").length - 1 == 1 ? <FastImage
                        source={{
                            uri: activity['images'].split(", ")[0],
                            priority: FastImage.priority.high
                        }}
                        style={{ width: width, height: 340, marginTop: 20 }}
                    /> : <View style={{ height: 340 }}><SliderBox
                        images={activity['images'].split(", ").filter(n => n)}
                        dotColor="#FFEE58"
                        inactiveDotColor="#90A4AE"
                        paginationBoxVerticalPadding={20}
                        sliderBoxHeight={340}
                        ImageComponentStyle={{ width: width, height: 340, }}
                        circleLoop={true}
                    /></View> : <View></View>}
                </TouchableWithoutFeedback>
                {activity['caption'].includes('http') ?
                    <LinkPreview touchableWithoutFeedbackProps={{ onPress: () => { navigation.navigate('Browser', { 'url': urlify(activity['caption'])[0] }) } }} renderTitle={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 12 }}>{text}</Text>} text={activity['caption']} containerStyle={{ backgroundColor: '#efefef', borderRadius: 0, marginTop: 40, width: width, alignSelf: 'center' }} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 100) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                    : null}
                <View style={{ marginTop: 13 }}>
                    {activity['videos'] ?
                        <View>
                            <Video
                                onEnd={onEnd}
                                onLoad={onLoad}
                                onLoadStart={onLoadStart}
                                onProgress={onProgress}
                                paused={paused}
                                ref={(ref) => (videoPlayer.current = ref)}
                                resizeMode="cover"
                                source={{
                                    uri: activity['videos'],
                                }}
                                style={styles.mediaPlayer}
                                playInBackground={false}
                                playWhenInactive={false}
                            />
                            <MediaControls
                                duration={duration}
                                isLoading={isLoading}
                                mainColor="#327FEB"
                                onFullScreen={() => noop(activity['videos'])}
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
                        </View> : null}
                    {activity['youtube'] ?
                        <YoutubePlayer
                            videoId={activity['youtube']} // The YouTube video ID
                            height={250}
                            width={width}
                            forceAndroidAutoplay={true}
                            play={true}
                        />
                        : null}
                </View>
                {activity['tags'] === 'Genio' || activity['tags'] === 'Other' || activity['tags'] === '' ? null : <View style={{/* backgroundColor: '#327FEB', borderRadius: 0, width: 90, padding: 9,*/ marginTop: 5, marginLeft: 17 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: '#327feb', fontSize: 15, alignSelf: 'flex-start' }}>#{activity['tags']}</Text></View>}
            </View>))
        var images = []
        activity['images'] ? activity['images'].split(', ').map((item) => item != '' ? images.push({ uri: item }) : null) : null
        return (
            <View style={{ marginTop: 20, marginBottom: 100 }} ref={scrollref}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FastImage
                            source={{
                                uri: activity['user_image'],
                                priority: FastImage.priority.high
                            }}
                            style={{ width: 60, height: 60, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                        />
                        <View style={{ flexDirection: 'column', marginLeft: 5, width: width - 150 }}>
                            <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1)}</Text>
                            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB' }}>{activity['acc_type'] == 'Kid' || 'Child' || 'child' || 'kid' ? String(year - parseInt(activity['user_year'])) + ' years old (Managed by parents)' : activity['acc_type']}</Text>
                        </View>
                        <ActionSheet
                            useNativeDriver={true}
                            ref={refActionSheet}
                            styles={{ borderRadius: 0, margin: 10 }}
                            options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                            cancelButtonIndex={2}
                            onPress={(index) => { index == 1 ? report(props.activity) : index == 0 ? onShare('Hey! Check out this post by ' + activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1) + ' on the new Genio app: https://genio.app/post/' + activity['post_id']) : null }}
                        />
                        <Right><TouchableOpacity style={{ width: 60, alignItems: 'center', padding: 12 }} onPress={() => { showActionSheet(); }} ><Icon name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 16, color: '#383838' }} /></TouchableOpacity></Right>
                    </View>
                </View>
                <Content />
                <Footer />
            </View>
        );
    };
    const addcomment = () => {
        if (comment) {
            var data = activity
            var comm = comment
            setcomment('')
            data['comments_count'] = data['comments_count'] + 1
            setactivity(data)
            setcomments([...comments, { 'data': { 'comments_user_image': children[0]['data']['image'], comment: comm }, 'id': key }])
            setkey(String(parseInt(key) + 1))
            route.params.setparentkey ? route.params.setparentkey() : null
            axios.post('http://mr_robot.api.genio.app/comment', {
                post_id: data['post_id'],
                user_id: children[0]['id'],
                user_name: children[0]['data']['name'],
                user_image: children[0]['data']['image'],
                comment: comm,
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                console.log(response)
                analytics.track('Comment', {
                    userID: children[0]['id'],
                    deviceID: getUniqueId(),
                    by: children[0]['id'],
                    byname: children[0]['data']['name'],
                    byimage: children[0]['data']['image'],
                    to: activity['user_id'],
                    actid: activity['post_id'],
                    comment: comm
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    }
    const there = () => {
        return (<View key={key} style={styles.container}>
            <CompHeader style={{ position: 'absolute' }} screen={activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1) + '\'s Post'} icon={'back'} goback={() => navigation.pop()} />
            <ScrollView>
                <CustomActivity />
            </ScrollView>
            {status === '3' ? 0 ? <CompButton message={'You have been temporarily banned from commenting'} back={'Home'} /> :
                <KeyboardStickyView style={styles.textInputView}>
                    <FastImage
                        source={{
                            uri: children[0]['data']['image'],
                            cache: FastImage.cacheControl.web
                        }}
                        style={{ width: 40, height: 40, borderRadius: 306, marginLeft: 2, }}
                    />
                    <TextInput
                        value={comment}
                        onChangeText={setcomment}
                        onSubmitEditing={() => addcomment()}
                        placeholder="Add a comment..."
                        style={styles.textInput}
                        enablesReturnKeyAutomatically={true}
                    />
                    {comment ? <Text onPress={() => addcomment()} style={{ fontFamily: 'NunitoSans-Bold', color: '#327FEB' }}>Post</Text> : null}
                </KeyboardStickyView> :
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Feed', type: 'feed_comment' })}><CompButton message={'Signup/Login to add comments for this post'} back={'Home'} /></TouchableWithoutFeedback>}
        </View>)
    }
    const notthere = () => {
        return (
            <View key={key} style={styles.container}>
                <CompHeader style={{ position: 'absolute' }} screen={'Loading...'} icon={'back'} goback={() => navigation.pop()} />
                <PostLoader />
            </View>
        )
    }
    return (
        loader ? notthere() : there()
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    textInputView: {
        padding: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: 'white',
        elevation: 20
    },
    textInput: {
        flexGrow: 1,
        padding: 10,
        width: width - 200,
        fontSize: 16,
        marginRight: 20,
        textAlignVertical: "top",
        fontFamily: 'NunitoSans-Regular'
    },
    textInputButton: {
        flexShrink: 1,
    },
    mediaPlayer: {
        height: 340,
        width: width,
        backgroundColor: "black",
    },
});
export default SinglePostScreen