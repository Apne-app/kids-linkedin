/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, TouchableOpacity, BackHandler, Alert, Image, Share, Linking, ScrollView, TouchableHighlight, ImageStore, StatusBar, RefreshControl } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
import axios from 'axios';
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
var VideoPlayer = require('react-native-exoplayer');
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const FeedComponent = ({ props, status, children, navigation, route }) => {
    const refActionSheet = useRef(null);
    const showActionSheet = () => {
        refActionSheet.current.show()
    }
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
                    {status === '3' ? <LikeButton   {...props} /> : <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}><View pointerEvents={'none'}><LikeButton   {...props} /></View></TouchableWithoutFeedback>}
                </TouchableWithoutFeedback>
                <Icon onPress={() => navigation.navigate('SinglePost', { id: status === '3' ? children['0']['id'] : '', name: status === '3' ? children['0']['data']['name'] : '', image: status === '3' ? children['0']['data']['image'] : '', activity: props, token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' })} name="message-circle" type="Feather" style={{ fontSize: 22, marginLeft: 10, marginRight: -10 }} />
                <ReactionIcon
                    labelSingle=" "
                    labelPlural=" "
                    counts={props.activity.reaction_counts}
                    kind="comment"
                    width={-80}
                    onPress={async () => {
                        var x = await AsyncStorage.getItem('children');
                        analytics.track('Comment', {
                            userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                            deviceID: getUniqueId()
                        });
                        navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', activity: props, token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' })
                    }}
                />
                <Icon onPress={() => {
                    Linking.openURL('whatsapp://send?text=Hey! Check out this post by ' + data.activity.actor.data.name.charAt(0).toUpperCase() + data.activity.actor.data.name.slice(1) + ' on the new Genio app: https://link.genio.app/?link=https://link.genio.app/post?id=' + data.activity.id + '%26apn=com.genioclub.app').then((data) => {
                    }).catch(() => {
                        alert('Make sure Whatsapp installed on your device');
                    });
                }} name="whatsapp" type="Fontisto" style={{ fontSize: 20, marginLeft: '55%', color: '#4FCE5D' }} />
            </View>
        </View>)
    }
    var images = []
    props.activity.image ? props.activity.image.split(', ').map((item) => item != '' ? images.push({ uri: item  }) : null) : null
    return (
        <Activity
            Header={
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('IndProf', { 'id': props.activity.actor.id.replace('id', ''), 'data': props.activity.actor.data })}>
                            <Image
                                source={{ uri: props.activity.actor.data ? props.activity.actor.data.profileImage  : '' }}
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
                            options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                            cancelButtonIndex={2}
                            onPress={(index) => { index == 1 ? report(props.activity) : index == 0 ? onShare('Hey! Check out this post by ' + props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) + ' on the new Genio app: https://link.genio.app/?link=https://link.genio.app/post?id=' + props.activity.id + '%26apn=com.genioclub.app') : null }}
                        />
                        <Right><TouchableOpacity onPress={() => { showActionSheet(); }}><Icon name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 16, marginRight: 20, color: '#383838' }} /></TouchableOpacity></Right>
                    </View>
                    {/* <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>*/}
                </View>
            }
            Content={
                <View>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', activity: props })}>
                        {props.activity.object === 'default123' ? <View style={{ margin: 5 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10, marginLeft: 14, marginVertical: 15 }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text>}
                        <View style={{ alignSelf: 'center' }}>
                            {props.activity.image ? props.activity.image.split(", ").length - 1 == 1 ? <Image
                                source={{ uri: props.activity.image.split(", ")[0] }}
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
                        <VideoPlayer
                            seekColor={'#327FEB'}
                            toggleResizeModeOnFullscreen={false}
                            tapAnywhereToPause={true}
                            paused={true}
                            disableFullscreen={true}
                            disableBack={true}
                            disableVolume={true}
                            style={{ borderRadius: 0, width: width, height: 340, }}
                            source={{ uri: props.activity.video }}
                            navigator={navigation}
                        // onEnterFullscreen={()=>navigation.navigate('VideoFull',{'uri':props.activity.video})}
                        /> : null}
                    {props.activity.youtube ?
                        <Thumbnail onPress={() => { navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', activity: props }) }} imageHeight={200} imageWidth={width} showPlayIcon={true} url={"https://www.youtube.com/watch?v=" + props.activity.youtube} />
                        : null}
                    {props.activity.tag === 'Genio' || props.activity.tag === 'Other' || props.activity.tag === '' || !Object.keys(props.activity).includes('tag') ? null : <View style={{/* backgroundColor: '#327FEB', borderRadius: 0, width: 90, padding: 9,*/ marginTop: 5, marginLeft: 17 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: '#327feb', fontSize: 15, alignSelf: 'flex-start' }}>#{props.activity.tag}</Text></View>}
                </View>
            }
            Footer={footer(props.activity.id, props)}
        />
    );
};
export default FeedComponent