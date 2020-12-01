/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, Alert, Image, Share, Linking, TouchableHighlight, ImageStore, StatusBar, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { StreamApp, FlatFeed, Activity, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList, SinglePost } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton'
import CommentBox from '../components/CommentBox'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet'
import ImageView from 'react-native-image-viewing';
import { useFocusEffect } from "@react-navigation/native";
import VideoPlayer from 'react-native-video-controls';
import { SliderBox } from "react-native-image-slider-box";
import YoutubePlayer from "react-native-youtube-iframe";
import BottomSheet from 'reanimated-bottom-sheet';
import CompHeader from '../Modules/CompHeader'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import AsyncStorage from '@react-native-community/async-storage'
import CompButton from '../Modules/CompButton'
import WebView from 'react-native-webview';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
function urlify(text) {
    var urlRegex = (/(https?:\/\/[^\s]+)/g);
    var res = text.match(urlRegex);
    return res
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

updateStyle('activity', {
    container:
    {
        marginVertical: height * 0.01,
        backgroundColor: "#fff",
        marginHorizontal: 0,
        fontFamily: 'NunitoSans-Regular',
        borderRadius: 0
    },
    text: {
        fontFamily: 'NunitoSans-Regular'
    },
    header: {
        fontFamily: 'NunitoSans-Regular'
    }
});
updateStyle('flatFeed', {
    container:
    {
        backgroundColor: "#f9f9f9",
        paddingRight: 0,
        paddingLeft: 0,
        borderRadius: 0
    }
});
updateStyle('LikeButton', {
    text: {
        fontFamily: 'NunitoSans-Bold'
    },
});

const SinglePostScreen = ({ navigation, route }) => {

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
    const [status, setstatus] = useState('3')
    const [website, setwebsite] = useState('https://genio.app')
    const websiteref = React.useRef();
    const onKeyboardShow = (event) => {
        scrollref.current.scrollToEnd({ animated: true })
    };
    const onKeyboardHide = () => {

    };
    React.useEffect(() => {
        const check = async () => {
            var st = await AsyncStorage.getItem('status')
            setstatus(st)
        }
        check()
    }, [])
    React.useEffect(() => {
        keyboardDidShowListener.current = Keyboard.addListener('keyboardWillShow', onKeyboardShow);
        keyboardDidHideListener.current = Keyboard.addListener('keyboardWillHide', onKeyboardHide);

        return () => {
            keyboardDidShowListener.current.remove();
            keyboardDidHideListener.current.remove();
        };
    }, []);
    useEffect(() => {
        if (route.params.activity.activity.own_reactions.comment) {
            setcomments(route.params.activity.activity.own_reactions.comment)
        }

    }, [])
    const [currentCommment, setcurrentCommment] = useState([])
    const [place, setplace] = useState('')
    const CustomActivity = ({ props }) => {
        const refActionSheet = useRef(null);
        const showActionSheet = () => {
            refActionSheet.current.show()
        }
        const addcomment = (event) => {
            console.log(event)
        }
        const settext = (text) => {
            setcurrentCommment(text)
        }
        const footer = (id, data) => {
            return (
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {status === '3' ? <LikeButton   {...props} /> : <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}><View pointerEvents={'none'}><LikeButton   {...props} /></View></TouchableWithoutFeedback>}
                        <Icon name="message-circle" type="Feather" style={{ fontSize: 22, marginLeft: 10, }} />
                        <Text style={{ fontFamily: 'NunitoSans-Bold', marginLeft: 4 }}>{comments ? comments.length : 0}</Text>
                    </View>
                    <FlatList data={comments} renderItem={({ item }) => {
                        return (
                            <View style={{ flexDirection: 'row', padding: 10 }}>
                                <Image source={{ uri: item.user.data.profileImage }} style={{ width: 25, height: 25, borderRadius: 10000 }} />
                                <Text style={{ fontSize: 13, color: 'black', paddingLeft: 10, fontFamily: 'NunitoSans-Regular' }}>
                                    {item.data.text}
                                </Text>
                            </View>
                        )
                    }} />
                </View>)
        }
        const [visible, setIsVisible] = React.useState(false);
        // const Memo = React.memo(() => (
        //     <ActivityFeedTitle />
        //   ))
        const Content = React.memo(() => (<View key={'content'} style={{ paddingVertical: 20 }}>
            {props.activity.object === 'default123' ? <View style={{ marginTop: -20 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10, marginBottom: 10 }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text>}
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
                {props.activity.image ? props.activity.image.split(", ").length - 1 == 1 ? <Image
                    source={{ uri: props.activity.image.split(", ")[0] }}
                    style={{ width: width, height: 340, marginTop: 20 }}
                /> : <View style={{ height: 340 }}><SliderBox
                    images={props.activity.image.split(", ").filter(n => n)}
                    dotColor="#FFEE58"
                    inactiveDotColor="#90A4AE"
                    paginationBoxVerticalPadding={20}
                    sliderBoxHeight={340}
                    ImageComponentStyle={{ width: width, height: 340, }}
                    circleLoop={true}
                // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
                /></View> : <View></View>}
            </TouchableWithoutFeedback>
            {props.activity.object.includes('http') ?
                <LinkPreview touchableWithoutFeedbackProps={{ onPress: () => { websiteref.current.snapTo(0); } }} renderTitle={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 12 }}>{text}</Text>} text={props.activity.object} containerStyle={{ backgroundColor: '#efefef', borderRadius: 0, marginTop: 40, width: width, alignSelf: 'center' }} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 100) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                : null}

            {props.activity.video ?
                <VideoPlayer
                    seekColor={'#327FEB'}
                    toggleResizeModeOnFullscreen={false}
                    tapAnywhereToPause={true}
                    paused={true}
                    disableFullscreen={true}
                    disableBack={true}
                    disableVolume={true}
                    style={{ width: width, height: 340 }}
                    source={{ uri: props.activity.video }}
                    navigator={navigation}
                // onEnterFullscreen={()=>navigation.navigate('VideoFull',{'uri':props.activity.video})}
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
                                <Image
                                    source={{ uri: props.activity.actor.data ? props.activity.actor.data.profileImage : '' }}
                                    style={{ width: 60, height: 60, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                                />
                                <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                    <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{props.activity.actor.data ? props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) : null}</Text>
                                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB' }}>{props.activity.actor.data ? props.activity.actor.data.type : null}</Text>
                                </View>
                                <ActionSheet
                                    ref={refActionSheet}
                                    options={['Share', 'Report', 'Close']}
                                    cancelButtonIndex={2}
                                    destructiveButtonIndex={1}
                                    onPress={(index) => { index == 1 ? report(props.activity) : null; }}
                                />
                                <Right><Icon onPress={() => { showActionSheet(); }} name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 16, marginRight: 20, color: '#383838' }} /></Right>
                            </View>
                        </View>
                    }
                    Content={<Content />}
                    Footer={footer(props.activity.id, route.params.activity)}
                />
            </ScrollView>
        );
    };
    const renderWebsite = () => {
        return (
            <View style={{ height: height - 80, flex: 1, }}>
                <WebView source={{ uri: website }} />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <StreamApp
                apiKey={'9ecz2uw6ezt9'}
                appId={'96078'}
                token={route.params.token}
            >
                <CompHeader style={{ position: 'absolute' }} screen={route.params.activity.activity.actor.data.name[0].toUpperCase() + route.params.activity.activity.actor.data.name.slice(1) + '\'s Post'} icon={'back'} goback={() => navigation.navigate('Home')} />
                <CustomActivity props={route.params.activity} />
                {status === '3' ? <CommentBox
                    key={'1'}
                    // noKeyboardAccessory={true}
                    textInputProps={{ fontFamily: 'NunitoSans-Regular', placeholder: 'Add a comment' }}
                    activity={route.params.activity.activity}
                    onSubmit={(text) => {
                        route.params.activity.onAddReaction('comment', route.params.activity.activity, {
                            'text': text,
                        });
                        setcomments([{ 'data': { 'text': text }, 'user': { 'data': { 'profileImage': route.params.image } } }, ...comments])
                    }}
                    avatarProps={{
                        source: route.params.image,
                    }}
                /> :
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Feed' })}><CompButton message={'Signup/Login to add comments for this post'} back={'Home'} /></TouchableWithoutFeedback>}
            </StreamApp>
            <BottomSheet
                ref={websiteref}
                enabledContentTapInteraction={false}
                snapPoints={[height - 80, 0]}
                // enabledContentGestureInteraction={false}
                initialSnap={1}
                borderRadius={2}
                renderContent={renderWebsite}
            />
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