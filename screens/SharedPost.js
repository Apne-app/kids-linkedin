/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, TouchableOpacity, Alert, Image, Share, Linking, TouchableHighlight, ImageStore, StatusBar, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
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
//import {Video} from "expo-av";
//import VideoPlayer from '../Modules/expo-video-player'
import axios from 'axios';
import PostLoader from '../Modules/PostLoader';

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
function urlify(text) {
    var urlRegex = (/(https?:\/\/[^\s]+)/g);
    var res = text.match(urlRegex);
    return res
}

const SinglePostScreen = ({ navigation, route }) => {
    var videoRef = React.createRef();
    var [activity, setactivity] = useState([]);
    useEffect(() => {
        axios.post('https://4561d0a210d4.ngrok.io/getpost', {
            post_id: route.params.id
        }).then((response) => {
            setactivity(response.data.data[0]['data'])
            axios.post('https://4561d0a210d4.ngrok.io/getcomments', {
                post_id: response.data.data[0]['data'][1]
            }).then((response) => {
                setcomments(response['data']['data'])
            }).catch((error) => {
                console.log(error)
            })
        }).catch((response) => {
            console.log(response)
        })
    }, [])
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('Home')
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
    const CustomActivity = ({ props }) => {
        const refActionSheet = useRef(null);
        const showActionSheet = () => {
            refActionSheet.current.show()
        }
        const Footer = (id, data) => {
            return (<View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -12 }}>
                    <Icon name="star" type="Feather" style={{ fontSize: 28, marginLeft: 10, marginRight: 5 }} />
                    <Icon name="message-circle" type="Feather" style={{ fontSize: 28, marginLeft: 10, marginRight: 5 }} />
                    <Icon name="share-outline" type='MaterialCommunityIcons' style={{ fontSize: 28, marginLeft: 8, marginRight: -10, marginTop: -3 }} />
                    <TouchableOpacity style={{ width: 50, marginLeft: '58%', alignItems: 'center' }}
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
                <View style={{ height: 1, width: width, backgroundColor: 'grey', opacity: 0.1, marginTop: 9, }} />
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', marginLeft: 15, fontSize: 14, marginBottom: 2, marginRight: 8 }}>{activity['likes_count']} likes</Text>
                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', marginLeft: 7, fontSize: 14, marginBottom: 2 }}>{activity['comments_count']} comments</Text>
                </View>
                <View style={{ height: 1, width: width, backgroundColor: 'grey', opacity: 0.1, marginTop: 8, marginBottom: 5 }} />
                <FlatList data={comments} renderItem={({ item }) => {
                    return (
                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <FastImage source={{ uri: item['data'][5] }} style={{ width: 25, height: 25, borderRadius: 10000 }} />
                            <Text style={{ fontSize: 13, color: 'black', paddingLeft: 10, fontFamily: 'NunitoSans-Regular' }}>
                                {item['data'][6]}
                            </Text>
                        </View>
                    )
                }} />
            </View>)
        }
        const [visible, setIsVisible] = React.useState(false);
        const Content = React.memo(() => (
            <View key={'content'} style={{ paddingVertical: 20 }}>
                {activity['caption'] === 'default123' ? <View style={{ margin: 5 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10, marginLeft: 14, }}>{activity['caption'] === 'default123' ? '' : activity['caption']}</Text>}
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
                        <VideoPlayer
                            videoProps={{
                                source: { uri: activity['videos'] },
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
            <ScrollView style={{ marginTop: 20 }} ref={scrollref}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FastImage
                            source={{
                                uri: activity['user_image'],
                                priority: FastImage.priority.high
                            }}
                            style={{ width: 60, height: 60, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                        />
                        <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                            <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1)}</Text>
                            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB' }}>{activity['acc_type'] == 'Kid' || 'Child' || 'child' || 'kid' ? String(year - parseInt(activity['user_year'])) + ' years old (Managed by parents)' : activity['acc_type']}</Text>
                        </View>
                        <ActionSheet
                            useNativeDriver={true}
                            ref={refActionSheet}
                            styles={{ borderRadius: 0, margin: 10 }}
                            options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                            cancelButtonIndex={2}
                            onPress={(index) => { index == 1 ? report(props.activity) : index == 0 ? onShare('Hey! Check out this post by ' + props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) + ' on the new Genio app: https://genio.app/post/' + props.activity.id) : null }}
                        />
                        <Right><TouchableOpacity style={{ width: 60, alignItems: 'center', padding: 12 }} onPress={() => { showActionSheet(); }} ><Icon name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 16, color: '#383838' }} /></TouchableOpacity></Right>
                    </View>
                </View>
                <Content />
                <Footer />
            </ScrollView>
        );
    };
    return (
        <View key={place} style={styles.container}>
            {activity.length ? <><CompHeader style={{ position: 'absolute' }} screen={activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1) + '\'s Post'} icon={'back'} goback={() => navigation.navigate('Home')} />
                <CustomActivity />
                {status === '3' ? 0 ? <CompButton message={'You have been temporarily banned from commenting'} back={'Home'} /> :
                    //  <CommentBox
                    //     key={'1'}
                    //     type={route.params.type}
                    //     textInputProps={{ fontFamily: 'NunitoSans-Regular', placeholder: 'Add a comment' }}
                    //     activity={route.params.activity.activity}
                    //     onSubmit={(text) => {
                    //         route.params.activity.onAddReaction('comment', route.params.activity.activity, {
                    //             'text': text,
                    //         });
                    //         setcomments([{ 'data': { 'text': text }, 'user': { 'data': { 'profileImage': route.params.image } } }, ...comments])
                    //         analytics.track('Comment', {
                    //             userID: route.params.token,
                    //             deviceID: getUniqueId(),
                    //             by: route.params.id,
                    //             byname: route.params.name,
                    //             byimage: route.params.image,
                    //             to: (route.params.activity.activity.actor.id.replace('id', '')),
                    //             actid: route.params.activity.activity.id,
                    //             comment: text
                    //         })
                    //     }}
                    //     avatarProps={{
                    //         source: route.params.image,
                    //     }}
                    // />
                    <View /> :
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Feed', type: 'feed_comment' })}><CompButton message={'Signup/Login to add comments for this post'} back={'Home'} /></TouchableWithoutFeedback>}
            </> :
                <>
                    <CompHeader style={{ position: 'absolute' }} screen={'Loading'} icon={'back'} goback={() => navigation.navigate('Home')} />
                    <PostLoader />
                </>}
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