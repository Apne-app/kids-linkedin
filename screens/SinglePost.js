/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, Alert, Image, Share, Linking, TouchableHighlight, ImageStore, StatusBar } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList, SinglePost } from 'react-native-activity-feed';
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
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { Chip } from 'react-native-paper';
import { clockRunning, set } from 'react-native-reanimated';
import YouTube from 'react-native-youtube';
import CompHeader from '../Modules/CompHeader'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
var height = Dimensions.get('screen').height;
var halfHeight = height / 2;
var width = Dimensions.get('screen').width;
const SinglePostScreen = ({ navigation, route }) => {
    console.log(route.params.activity)
    const CustomActivity = (props) => {
        let img = props.activity.image ? props.activity.image.split(", ").length - 1 > 1 ? props.activity.image.split(", ").pop : props.activity.image : '';

        const [commentVisible, setCmv] = React.useState('none');
        const refActionSheet = useRef(null);
        const onShare = async () => {

        };
        const nulre = () => {
            return null
        }
        const showActionSheet = () => {
            refActionSheet.current.show()
        }
        const footer = (id, data) => {
            return (<View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LikeButton  {...props} />
                    <Icon onPress={() => props.navigation.navigate('SinglePost', { activity: props })} name="message-circle" type="Feather" style={{ fontSize: 22, marginLeft: 10, marginRight: -10 }} />
                    <ReactionIcon
                        labelSingle=" "
                        labelPlural=" "
                        counts={props.activity.reaction_counts}
                        kind="comment"
                        width={-80}
                        onPress={async () => {
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('Comment', {
                                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"]: null,   
                                deviceID: getUniqueId()
                            });
                        }}
                    />
                    <Icon onPress={() => {
                        Linking.openURL('whatsapp://send?text=check').then((data) => {
                            console.log('WhatsApp Opened');
                        }).catch(() => {
                            alert('Make sure Whatsapp installed on your device');
                        });
                    }} name="whatsapp" type="Fontisto" style={{ fontSize: 20, marginLeft: '55%', color: '#4FCE5D' }} />
                </View>
            </View>)
        }
        const [visible, setIsVisible] = React.useState(false);
        var images = []
        props.activity.image ? props.activity.image.split(', ').map((item) => item != '' ? images.push({ uri: item }) : null) : null
        props.activity.own_reactions['like'] ? console.log(props.activity.own_reactions['like'][0]) : null
        return (
            <Activity
                Header={
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: props.activity.actor.data ? props.activity.actor.data.profileImage : '' }}
                                style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{props.activity.actor.data ? props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) : null}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB', textAlign: 'center', borderRadius: 28.5, borderColor: '#327FEB', borderWidth: 1, paddingHorizontal: 10 }}>{props.activity.actor.data ? props.activity.actor.data.type : null}</Text>
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
                        <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>
                    </View>
                }
                Content={
                    <TouchableOpacity onPress={() => setIsVisible(true)} style={{ padding: 20 }}>
                        {props.activity.object === 'default123' ? <View style={{ marginTop: -20 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10 }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text>}
                        {props.activity.image ?
                            <ImageView
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
                        <View style={{ alignSelf: 'center' }}>
                            {props.activity.image ? props.activity.image.split(", ").length - 1 == 1 ? <Image
                                source={{ uri: props.activity.image.split(", ")[0] }}
                                style={{ width: width - 80, height: 340, marginTop: 20, borderRadius: 10 }}
                            /> : <View style={{ height: 340 }}><SliderBox
                                images={props.activity.image.split(", ").filter(n => n)}
                                dotColor="#FFEE58"
                                inactiveDotColor="#90A4AE"
                                paginationBoxVerticalPadding={20}
                                sliderBoxHeight={340}
                                ImageComponentStyle={{ borderRadius: 10, width: width - 80, height: 340, }}
                                circleLoop={true}
                            // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                            // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
                            /></View> : <View></View>}
                        </View>
                        {props.activity.object.includes('http') ?
                            <LinkPreview text={props.activity.object} containerStyle={{ backgroundColor: '#efefef', borderRadius: 10, marginTop: 10, width: width - 80, alignSelf: 'center' }} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 50) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                            : null}

                        {props.activity.video ?
                            <View style={{ width: width - 40, height: 340 }}>
                                <VideoPlayer
                                    source={{ uri: props.activity.video }}
                                    navigator={navigator}
                                /></View> : null}
                        {props.activity.youtube ?
                            <YouTube
                                videoId={props.activity.youtube} // The YouTube video ID
                                apiKey={'AIzaSyD6OI-AVRxALkG2WVshNSqrc2FuEfH2Z04'}
                                style={{ borderRadius: 10, width: width - 80, height: 340, }}
                            /> : null}
                        {props.activity.tag === 'Genio' || props.activity.tag === 'Other' ? null : <View style={{ backgroundColor: '#327FEB', borderRadius: 10, width: 90, padding: 9, marginTop: 5, marginLeft: -10 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: 'white', fontSize: 10, alignSelf: 'center' }}>{props.activity.tag}</Text></View>}
                    </TouchableOpacity>
                }
                Footer={footer(props.activity.id, props)}
            />
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <StreamApp
                apiKey={'9ecz2uw6ezt9'}
                appId={'96078'}
                token={route.params.token}
            >
                <CompHeader screen={'Post'} icon={'back'} goback={() => props.navigation.navigate('Home')} />
                <SinglePost
                    activity={route.params.activity}
                    feedGroup={'timeline'}
                    navigation={navigation}
                    Activity={CustomActivity} options={{ withOwnReactions: true }}
                />
            </StreamApp>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});
export default SinglePostScreen