/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, Alert, Image, Share, Linking, TouchableHighlight, ImageStore, StatusBar } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReplyIcon from '../images/icons/heart.png';
import ActionSheet from 'react-native-actionsheet'
import ImageView from 'react-native-image-viewing';
import VideoPlayer from 'react-native-video-controls';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { useFocusEffect } from "@react-navigation/native";
import BottomSheet from 'reanimated-bottom-sheet';
import { SliderBox } from "react-native-image-slider-box";
import { Snackbar } from 'react-native-paper';
import analytics from '@segment/analytics-react-native';
import { Chip } from 'react-native-paper';
import { clockRunning, set } from 'react-native-reanimated';
import YouTube from 'react-native-youtube';
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
var height = Dimensions.get('screen').height;
var halfHeight = height / 2;
var width = Dimensions.get('screen').width;
const CustomActivity = (props) => {
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
            <LinkPreview text={props.activity.object} containerStyle={{ backgroundColor: '#efefef', borderRadius: 10, marginTop: 10, width: width - 80, alignSelf: 'center' }} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 50) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
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
    </View>
);
};
export default CustomActivity