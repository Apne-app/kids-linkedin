/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, TouchableOpacity, BackHandler, Alert, Image, Share, Linking, ScrollView, TouchableHighlight, ImageStore, StatusBar, RefreshControl } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton';
import { Viewport } from '@skele/components'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
import axios from 'axios';
import { connect } from 'getstream';
import * as rssParser from 'react-native-rss-parser';
import { useFocusEffect } from "@react-navigation/native";
import BottomSheet from 'reanimated-bottom-sheet';
import { SliderBox } from "react-native-image-slider-box";
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
import FastImage from 'react-native-fast-image';
import { Video } from 'expo-av';
import VideoPlayer from 'expo-video-player'
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const FeedComponent = ({ props, status, children, navigation, route, place, setplace }) => {
    const refActionSheet = useRef(null);
    var videoRef = React.createRef();
    const showActionSheet = () => {
        refActionSheet.current.show()
    }
    const deletepost = (id1) => {
        Alert.alert("Alert", "Are you sure you want to delete the post? The action cannot be reversed", [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "YES", onPress: () => {
                    const client = connect('9ecz2uw6ezt9', children['0']['data']['gsToken'], '96078');
                    var user = client.feed('user', children['0']['id'] + 'id');
                    user.removeActivity(id1).then(() => {
                        alert('Successfully deleted your post!')
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        })
                    }).catch(() => {
                        alert(
                            "There was an error deleting your post, please try again later."
                        )
                    })
                }
            }
        ]);
    }
    const report = async (x) => {
        if (children) {
            if (props.activity.actor.id == children['0']['id'] + 'id') {
                deletepost(props.activity.id)
            }
            else {
                var y = await AsyncStorage.getItem('children');
                var q = await AsyncStorage.getItem('profile');
                if (q) {
                    q = JSON.parse(q)
                }
                analytics.track('Post Reported', {
                    userID: y ? JSON.parse(y)["0"]["id"] : null,
                    deviceID: getUniqueId()
                })
                var now = new Date();
                var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
                datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
                var body = {
                    "created_by": q ? q['id'] : 'nonloggedin',
                    "created_by_name": q ? q['email'] : 'nonloggedin',
                    "created_by_child": children ? children["0"]["id"] : 'nonloggedin',
                    "post_data": JSON.stringify(x),
                    "reported_time": datetime,
                }
                var config = {
                    method: 'post',
                    url: 'https://api.genio.app/the-office/report',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: body
                };
                axios(config)
                    .then(function (response) {
                        // console.log(JSON.stringify(response.data));
                        // setLoading(false);
                        if (response.data == "success") {
                            alert('Succesfully reported post');
                        }
                        console.log(response.data)
                    })
                    .catch(function (error) {
                        alert(error);
                        // setLoading(false)
                    });
            }
        }
        else {
            var y = await AsyncStorage.getItem('children');
            var q = await AsyncStorage.getItem('profile');
            if (q) {
                q = JSON.parse(q)
            }
            analytics.track('Post Reported', {
                userID: y ? JSON.parse(y)["0"]["id"] : null,
                deviceID: getUniqueId()
            })
            var now = new Date();
            var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
            datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
            var body = {
                "created_by": q ? q['id'] : 'nonloggedin',
                "created_by_name": q ? q['email'] : 'nonloggedin',
                "created_by_child": children ? children["0"]["id"] : 'nonloggedin',
                "post_data": JSON.stringify(x),
                "reported_time": datetime,
            }
            var config = {
                method: 'post',
                url: 'https://api.genio.app/the-office/report',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: body
            };
            axios(config)
                .then(function (response) {
                    // console.log(JSON.stringify(response.data));
                    // setLoading(false);
                    if (response.data == "success") {
                        alert('Succesfully reported post');
                    }
                    console.log(response.data)
                })
                .catch(function (error) {
                    alert(error);
                    // setLoading(false)
                });
        }

    }
    const onShare = async (message) => {
        var x = await AsyncStorage.getItem('children');
        analytics.track('SharePost', {
            userID: x ? JSON.parse(x)["0"]["id"] : null,
            deviceID: getUniqueId()
        })
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
    var d = new Date();
    var year = parseInt(d.getFullYear());
    const footer = (id, data) => {
        return (<View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={async () => {
                    if (status === '3') {
                        var x = await AsyncStorage.getItem('children');
                        var done = 0
                        data.activity.own_reactions.like ? data.activity.own_reactions.like.map((item) => {
                            var by = String(JSON.parse(x)["0"]["id"]) + 'id'
                            if ((item.user_id) == by) {
                                done = 1
                            }
                        }) : null
                        if (done == 0) {
                            console.log('doing')
                            x = JSON.parse(x)
                            analytics.track('Like', {
                                userID: x["0"]["data"]["gsToken"],
                                deviceID: getUniqueId(),
                                by: x["0"]["id"],
                                byname: x["0"]['data']["name"],
                                byimage: x["0"]['data']["image"],
                                to: (props.activity.actor.id.replace('id', '')),
                                actid: id
                            })
                        }
                    }

                }}>
                    {status === '3' ? <LikeButton {...props} /> : <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { 'type': 'feed_like' })}><View pointerEvents={'none'}><LikeButton   {...props} /></View></TouchableWithoutFeedback>}
                </TouchableWithoutFeedback>
                <Icon onPress={() => { data.activity.video ? videoRef.pauseAsync() : null; navigation.navigate('SinglePost', { id: status === '3' ? children['0']['id'] : '', name: status === '3' ? children['0']['data']['name'] : '', image: status === '3' ? children['0']['data']['image'] : '', activity: props, token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', type: 'comment' }) }} name="message-circle" type="Feather" style={{ fontSize: 28, marginLeft: 10, marginRight: -10 }} />
                <View style={{ marginTop: 0 }}>
                    <ReactionIcon
                        labelSingle=" "
                        labelPlural=" "
                        counts={props.activity.reaction_counts}
                        kind="comment"
                        width={-80}
                        onPress={async () => {
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('CommentIconPressed', {
                                userID: x ? JSON.parse(x)["0"]["id"] : null,
                                deviceID: getUniqueId()
                            });
                            navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', activity: props, token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' })
                        }}
                    />
                </View>
                <TouchableOpacity style={{ width: 50, marginLeft: '53%', padding: 10, right: 12, alignItems: 'center' }}
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
            {props.activity.tag === 'Genio' || props.activity.tag === 'Other' || props.activity.tag === '' || !Object.keys(props.activity).includes('tag') ? null : <View style={{/* backgroundColor: '#327FEB', borderRadius: 0, width: 90, padding: 9,*/ marginTop: 5, marginLeft: 17 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: '#327feb', fontSize: 15, alignSelf: 'flex-start' }}>#{props.activity.tag}</Text></View>}
        </View>)
    }
    var images = []
    var options = [<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>]
    if (children) {
        if (props.activity.actor.id == children['0']['id'] + 'id') {
            options.push(<Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Delete Post</Text>)
        }
        else {
            options.push(<Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>)
        }
    }
    else {
        options.push(<Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>)
    }
    options.push(<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>)
    props.activity.image ? props.activity.image.split(', ').map((item) => item != '' ? images.push({ uri: item }) : null) : null
    // if (props.activity.status && props.activity.status === 'inreview') {
    //     return null
    // }
    // else {
    return (
        <Activity
            Header={
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('IndProf', { 'id': props.activity.actor.id.replace('id', ''), 'data': props.activity.actor.data })}>
                            <FastImage
                                source={{
                                    uri: props.activity.actor.data ? props.activity.actor.data.profileImage : '',
                                    priority: FastImage.priority.high,
                                }}
                                style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                            />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('IndProf', { 'id': props.activity.actor.id.replace('id', ''), 'data': props.activity.actor.data })}>
                            <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{props.activity.actor.data ? props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) : null}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'left' }}>{props.activity.actor.data ? props.activity.actor.data.type == 'Kid' || 'Child' || 'child' || 'kid' ? String(year - parseInt(props.activity.actor.data.year)) + ' years old (Managed by parents)' : props.activity.actor.data.type : null}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <ActionSheet
                            useNativeDriver={true}
                            ref={refActionSheet}
                            styles={{ borderRadius: 0, margin: 10 }}
                            options={options}
                            cancelButtonIndex={2}
                            onPress={(index) => { index == 1 ? report(props.activity) : index == 0 ? onShare('Hey! Check out this post by ' + props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) + ' on the new Genio app: https://genio.app/post/' + props.activity.id) : null }}
                        />
                        <Right><TouchableOpacity style={{ width: 70, alignItems: 'center', padding: 12 }} onPress={() => { showActionSheet(); }}><Icon name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 20, marginRight: -10, color: '#383838' }} /></TouchableOpacity></Right>
                    </View>
                    {/* <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>*/}
                </View>
            }
            Content={
                <View>
                    <TouchableWithoutFeedback onPress={() => { props.activity.video ? videoRef.pauseAsync() : null; navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', activity: props }) }}>
                        {props.activity.object === 'default123' ? <View style={{ margin: 5 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10, marginLeft: 14, marginVertical: 15 }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text>}
                        <View style={{ alignSelf: 'center' }}>
                            {props.activity.image ? props.activity.image.split(", ").length - 1 == 1 ? <FastImage
                                source={{
                                    uri: props.activity.image.split(", ")[0],
                                    priority: FastImage.priority.high
                                }}
                                style={{ width: width, height: 340, borderRadius: 0 }}
                            /> : <View style={{ height: 340 }}><SliderBox
                                images={props.activity.image.split(", ").filter(n => n)}
                                dotColor="#FFEE58"
                                inactiveDotColor="#90A4AE"
                                paginationBoxVerticalPadding={20}
                                sliderBoxHeight={340}
                                disableOnPress={true}
                                ImageComponentStyle={{ borderRadius: 0, width: width, height: 340, backgroundColor: 'transparent' }}
                                circleLoop={true}
                            /></View> : <View></View>}
                        </View>
                    </TouchableWithoutFeedback>
                    {props.activity.object.includes('http') ?
                        <LinkPreview touchableWithoutFeedbackProps={{ onPress: () => { navigation.navigate('Browser', { 'url': urlify(props.activity.object)[0] }) } }} text={props.activity.object} containerStyle={{ backgroundColor: '#efefef', borderRadius: 0, marginTop: 10, width: width, alignSelf: 'center' }} renderTitle={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 12 }}>{text}</Text>} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 100) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                        : null}
                    {props.activity.video ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {/* <Video
                                source={{ uri: props.activity.video }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="cover"
                                // shouldPlay
                                // usePoster={props.activity.poster?true:false}
                                // posterSource={{uri:'https://pyxis.nymag.com/v1/imgs/e8b/db7/07d07cab5bc2da528611ffb59652bada42-05-interstellar-3.2x.rhorizontal.w700.jpg'}}
                                ref={videoRef}
                                useNativeControls={true}
                                playInBackground={false}
                                playWhenInactive={false}
                                onViewportEnter={() => console.log('Entered!')}
                                onViewportLeave={() => console.log('Left!')}
                                style={{ width: width, height: 340 }}
                            /> */}
                            <InViewPort onChange={(value) => value ? null : videoRef.pauseAsync()}>

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
                                    hideControlsTimerDuration={1000}
                                    showControlsOnLoad={true}
                                    switchToLandscape={() => videoRef.presentFullscreenPlayer()}
                                    sliderColor={'#327FEB'}
                                    inFullscreen={false}
                                />
                            </InViewPort>
                        </View> : null}
                    {props.activity.youtube ?
                        <Thumbnail onPress={() => { navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', activity: props }) }} imageHeight={200} imageWidth={width} showPlayIcon={true} url={"https://www.youtube.com/watch?v=" + props.activity.youtube} />
                        : null}
                </View>
            }
            Footer={footer(props.activity.id, props)}
        />
    );
    // }
};
export default FeedComponent;