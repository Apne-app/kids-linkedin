/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, TouchableOpacity, Alert, Image, Share, Linking, TouchableHighlight, ImageStore, StatusBar, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { StreamApp, FlatFeed, Activity, CommentItem, updateStyle, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList, SinglePost } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton'
import ReactionIcon from '../components/ReactionIcon'
import CommentBox from '../components/CommentBox'
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
import { connect } from 'getstream';
import { Video } from 'expo-av';
import VideoPlayer from 'expo-video-player'

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
function urlify(text) {
    var urlRegex = (/(https?:\/\/[^\s]+)/g);
    var res = text.match(urlRegex);
    return res
}

const SinglePostScreen = ({ navigation, route }) => {
    var videoRef = React.createRef();
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
    const [place, setplace] = useState('1')
    const status = route.params.status
    const children = route.params.children
    console.log( route.params.activity.activity.id, route.params.activity.activity.actor.id)
    var d = new Date();
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
    useEffect(() => {
        const data = async () => {
            const client = connect(
                '9ecz2uw6ezt9',
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM',
                '96078'
            );
            const reactions = await client.reactions.filter({
                'activity_id': route.params.activity.activity.id
            });
            var dat = []
            reactions.results.map((item) => {
                if (item['kind'] == 'comment') {
                    dat.push(item)
                }
            })
            setcomments(dat)
            const analyse = async () => {
                var x = await AsyncStorage.getItem('children');
                if (x) {
                    x = JSON.parse(x)
                    if (Object.keys(x).length == 0) {
                        await AsyncStorage.removeItem('children');
                        x = null
                    }
                    analytics.screen('SinglePostScreen', {
                        userID: x ? x["0"]["id"] : null,
                        deviceID: getUniqueId()
                    })
                }
                else {
                    analytics.screen('SinglePostScreen', {
                        userID: null,
                        deviceID: getUniqueId()
                    })
                }
            }
            analyse();
        }
        data()
    }, [])
    console.log(route.params.activity.activity.image)
    const CustomActivity = ({ props }) => {
        const refActionSheet = useRef(null);
        const showActionSheet = () => {
            refActionSheet.current.show()
        }
        const footer = (id, data) => {
            return (<View>
                <View style={{ height: 1, width: width, backgroundColor: 'grey', opacity: 0.1, marginTop: -10, marginBottom: 8 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ReactionIcon
                        labelSingle="like"
                        labelPlural="likes"
                        counts={props.activity.reaction_counts}
                        kind="like"
                        width={-80}
                        onPress={async () => {
                            setplace(String(parseInt(place) + 1))
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('LikeNumberPressed', {
                                userID: x ? JSON.parse(x)["0"]["id"] : null,
                                deviceID: getUniqueId()
                            });
                        }}
                    />
                    <ReactionIcon
                        labelSingle="comment"
                        labelPlural="comments"
                        counts={props.activity.reaction_counts}
                        kind="comment"
                        width={-80}
                        onPress={async () => {
                            setplace(String(parseInt(place) + 1))
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('CommentNumberPressed', {
                                userID: x ? JSON.parse(x)["0"]["id"] : null,
                                deviceID: getUniqueId()
                            });
                        }}
                    />
                    <TouchableOpacity style={{ width: 50, marginLeft: '40%', alignItems: 'center' }}
                        onPress={async () => {
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('WhatsappShare', {
                                userID: x ? JSON.parse(x)["0"]["id"] : null,
                                deviceID: getUniqueId()
                            });
                            Linking.openURL('whatsapp://send?text=Hey! Check out this post by ' + data.activity.actor.data.name.charAt(0).toUpperCase() + data.activity.actor.data.name.slice(1) + ' on the new Genio app: https://genio.app/post/' + data.activity.id).then((data) => {
                            }).catch(() => {
                                alert('Please make sure Whatsapp is installed on your device');
                            });
                        }}
                    >
                        <Icon name="whatsapp" type="Fontisto" style={{ fontSize: 28, color: '#4FCE5D' }} />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1, width: width, backgroundColor: 'grey', opacity: 0.1, marginTop: 8, marginBottom: 5 }} />
                <FlatList data={comments} renderItem={({ item }) => {
                    return (
                        item.user ?
                            <View style={{ flexDirection: 'row', padding: 10 }}>
                                <Image source={{ uri: item.user.data.profileImage }} style={{ width: 25, height: 25, borderRadius: 10000 }} />
                                <Text style={{ fontSize: 13, color: 'black', paddingLeft: 10, fontFamily: 'NunitoSans-Regular' }}>
                                    {item.data.text}
                                </Text>
                            </View> : <View style={{ flexDirection: 'row', padding: 10 }}>
                                <Image source={require('../images/profile.jpg')} style={{ width: 25, height: 25, borderRadius: 10000 }} />
                                <Text style={{ fontSize: 13, color: 'black', paddingLeft: 10, fontFamily: 'NunitoSans-Regular' }}>
                                    {item.data.text}
                                </Text>
                            </View>
                    )
                }} />
            </View>)
        }
        const [visible, setIsVisible] = React.useState(false);
        const Content = React.memo(() => (
            <View key={'content'} style={{ paddingVertical: 20 }}>
                {props.activity.object === 'default123' ? <View style={{ margin: 5 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10, marginLeft: 14, }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text>}
                {props.activity.image ?
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
                    {props.activity.image ? props.activity.image.split(", ").length - 1 == 1 ? <FastImage
                        source={{
                            uri: props.activity.image.split(", ")[0],
                            priority: FastImage.priority.high
                        }}
                        style={{ width: width, height: 340, marginTop: 20 }}
                    /> : <View style={{ height: 340 }}><SliderBox
                        images={props.activity.image.split(", ").filter(n => n)}
                        dotColor="#FFEE58"
                        inactiveDotColor="#90A4AE"
                        paginationBoxVerticalPadding={20}
                        sliderBoxHeight={340}
                        ImageComponentStyle={{ width: width, height: 340, }}
                        circleLoop={true}
                    /></View> : <View></View>}
                </TouchableWithoutFeedback>
                {props.activity.object.includes('http') ?
                    <LinkPreview touchableWithoutFeedbackProps={{ onPress: () => { navigation.navigate('Browser', { 'url': urlify(props.activity.object)[0] }) } }} renderTitle={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 12 }}>{text}</Text>} text={props.activity.object} containerStyle={{ backgroundColor: '#efefef', borderRadius: 0, marginTop: 40, width: width, alignSelf: 'center' }} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 100) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                    : null}

                {props.activity.video ?
                    <VideoPlayer
                        videoProps={{
                            source: { uri: props.activity.video },
                            rate: 1.0,
                            volume: 1.0,
                            isMuted: false,
                            videoRef: v => videoRef = v,
                            resizeMode: Video.RESIZE_MODE_CONTAIN,
                            // shouldPlay
                            // usePoster={props.activity.poster?true:false}
                            // posterSource={{uri:'https://pyxis.nymag.com/v1/imgs/e8b/db7/07d07cab5bc2da528611ffb59652bada42-05-interstellar-3.2x.rhorizontal.w700.jpg'}}
                            playInBackground: false,
                            playWhenInactive: false,
                            width: width,
                            height: 340,

                        }}
                        width={width}
                        height={340}
                        switchToLandscape={() => videoRef.presentFullscreenPlayer()}
                        sliderColor={'#327FEB'}
                        inFullscreen={false}
                    /> : null}
                {props.activity.youtube ?
                    <YoutubePlayer
                        videoId={props.activity.youtube} // The YouTube video ID
                        height={250}
                        width={width}
                        forceAndroidAutoplay={true}
                        play={true}
                    />
                    : null}
                {props.activity.tag === 'Genio' || props.activity.tag === 'Other' || props.activity.tag === '' || !Object.keys(props.activity).includes('tag') ? null : <View style={{/* backgroundColor: '#327FEB', borderRadius: 0, width: 90, padding: 9,*/ marginTop: 5, marginLeft: 17 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: '#327feb', fontSize: 15, alignSelf: 'flex-start' }}>#{props.activity.tag}</Text></View>}
            </View>))
        var images = []
        props.activity.image ? props.activity.image.split(', ').map((item) => item != '' ? images.push({ uri: item }) : null) : null
        props.activity.own_reactions['like'] ? console.log(props.activity.own_reactions['like'][0]) : null
        return (
            <ScrollView ref={scrollref}>
                <Activity
                    Header={
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FastImage
                                    source={{
                                        uri: props.activity.actor.data ? props.activity.actor.data.profileImage : '',
                                        priority: FastImage.priority.high
                                    }}
                                    style={{ width: 60, height: 60, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                                />
                                <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                    <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{props.activity.actor.data ? props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) : null}</Text>
                                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB' }}>{props.activity.actor.data ? props.activity.actor.data.type == 'Kid' || 'Child' || 'child' || 'kid' ? String(year - parseInt(props.activity.actor.data.year)) + ' years old (Managed by parents)' : props.activity.actor.data.type : null}</Text>
                                </View>
                                <ActionSheet
                                    useNativeDriver={true}
                                    ref={refActionSheet}
                                    styles={{ borderRadius: 0, margin: 10 }}
                                    options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                                    cancelButtonIndex={2}
                                    onPress={(index) => { index == 1 ? report(props.activity) : index == 0 ? onShare('Hey! Check out this post by ' + props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) + ' on the new Genio app: https://genio.app/post/' + props.activity.id) : null }}
                                />
                                <Right><TouchableOpacity style={{ width: 70, alignItems: 'center', padding: 12 }} onPress={() => { showActionSheet(); }} ><Icon name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 16, marginRight: 20, color: '#383838' }} /></TouchableOpacity></Right>
                            </View>
                        </View>
                    }
                    Content={<Content />}
                    Footer={footer(props.activity.id, route.params.activity)}
                />
            </ScrollView>
        );
    };
    return (
        <View key={place} style={styles.container}>
            <CompHeader style={{ position: 'absolute' }} screen={route.params.activity.activity.actor.data.name[0].toUpperCase() + route.params.activity.activity.actor.data.name.slice(1) + '\'s Post'} icon={'back'} goback={() => navigation.navigate('Home')} />
            <StreamApp
                apiKey={'9ecz2uw6ezt9'}
                appId={'96078'}
                token={route.params.token}
            >
                <CustomActivity props={route.params.activity} status={status} children={children} navigation={navigation} route={route} />
                {status === '3' ? 0 ? <CompButton message={'You have been temporarily banned from commenting'} back={'Home'} /> : <CommentBox
                    key={'1'}
                    type={route.params.type}
                    textInputProps={{ fontFamily: 'NunitoSans-Regular', placeholder: 'Add a comment' }}
                    activity={route.params.activity.activity}
                    onSubmit={(text) => {
                        route.params.activity.onAddReaction('comment', route.params.activity.activity, {
                            'text': text,
                        });
                        setcomments([{ 'data': { 'text': text }, 'user': { 'data': { 'profileImage': route.params.image } } }, ...comments])
                        analytics.track('Comment', {
                            userID: route.params.token,
                            deviceID: getUniqueId(),
                            by: route.params.id,
                            byname: route.params.name,
                            byimage: route.params.image,
                            to: (route.params.activity.activity.actor.id.replace('id', '')),
                            actid: route.params.activity.activity.id,
                            comment: text
                        })
                    }}
                    avatarProps={{
                        source: route.params.image,
                    }}
                /> :
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Feed', type: 'feed_comment' })}><CompButton message={'Signup/Login to add comments for this post'} back={'Home'} /></TouchableWithoutFeedback>}
            </StreamApp>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});
export default SinglePostScreen