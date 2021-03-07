/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { SafeAreaView, FlatList, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import VideoPlayer from 'expo-video-player';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton';
import { Viewport } from '@skele/components'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
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
import { Video } from 'expo-av';
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

const FeedScreen = ({ navigation, route }) => {
    const [data, setdata] = useState([])
    const [feedstate, setFeedState] = useState(0);
    var status = route.params.status
    var children = route.params.children
    const [newnoti, setnewnoti] = useState(false);
    const refActionSheet = useRef(null);
    var videoRef = React.createRef();
    const showActionSheet = () => {
        refActionSheet.current.show()
    }
    const Features = () => {
        return (
            <View style={{ backgroundColor: "#f9f9f9", margin: 'auto', justifyContent: 'center', zIndex: 1000, height: 60 }}>
                <FlatList
                    data={[["Feed", "dynamic-feed", "MaterialIcons"], ["Quiz", "clipboard-pencil", "Foundation"], ["Inspire", "newspaper-outline", "Ionicons"]]}
                    scrollEnabled={true}
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignSelf: 'center'
                    }}
                    // showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 10 }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={item}
                            onPress={async () => {
                                var x = await AsyncStorage.getItem('children');
                                item[0] == 'Feed' ?
                                    analytics.track('FeedSwitchedtoPosts', {
                                        userID: x ? JSON.parse(x)["0"]["id"] : null,
                                        deviceID: getUniqueId()
                                    })
                                    :
                                    item[0] == 'Quiz' ?
                                        analytics.track('FeedSwitchedtoQuiz', {
                                            userID: x ? JSON.parse(x)["0"]["id"] : null,
                                            deviceID: getUniqueId()
                                        })
                                        :
                                        analytics.track('FeedSwitchedtoNews', {
                                            userID: x ? JSON.parse(x)["0"]["id"] : null,
                                            deviceID: getUniqueId()
                                        });
                                // setTimeout(() => {
                                item[0] == 'Feed' ? setFeedState(0) : item[0] == 'Quiz' ? setFeedState(1) : setFeedState(2);
                                // }, 280);
                            }}>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', color: "#fff", justifyContent: 'center', height: 40, width: 100, borderRadius: 20, backgroundColor: feedstate == index ? "#327feb" : '#fff', marginHorizontal: 6, marginBottom: 3, elevation: 3 }} >
                                <Icon name={item[1]} type={item[2]} style={{ fontSize: 20, color: feedstate == index ? '#fff' : '#327feb' }} />
                                <Text style={{ alignSelf: 'center', alignItems: 'center', color: feedstate == index ? "#fff" : "#327feb", justifyContent: 'center' }}> {item[0]}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    //Setting the number of column
                    numColumns={3}
                    // horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
    useEffect(() => {
        axios.get('http://b92cbc1efd42.ngrok.io/feed')
            .then((response) => {
                setdata(response.data.data)
            })
    }, [])
    var d = new Date();
    var year = parseInt(d.getFullYear());
    const renderItem = (item) => {
        var activity = item['item']['data']
        var options = [<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>]
        if (children) {
            if (activity[2] == children['0']['id'] + 'id') {
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
        return (
            <View style={{ marginVertical: 9 }}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('IndProf', { 'id': activity[2].replace('id', '') })}>
                            <FastImage
                                source={{
                                    uri: activity[5],
                                    priority: FastImage.priority.high,
                                }}
                                style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                            />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('IndProf', { 'id': activity[2].replace('id', '') })}>
                            <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{activity[17].charAt(0).toUpperCase() + activity[17].slice(1)}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'left' }}>{activity[4] == 'Kid' || 'Child' || 'child' || 'kid' ? String(year - parseInt(activity[18])) + ' years old (Managed by parents)' : activity[4]}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <ActionSheet
                            useNativeDriver={true}
                            ref={refActionSheet}
                            styles={{ borderRadius: 0, margin: 10 }}
                            options={options}
                            cancelButtonIndex={2}
                            onPress={(index) => { index == 1 ? report(activit) : index == 0 ? onShare('Hey! Check out this post by ' + activity[17].charAt(0).toUpperCase() + activity[17].slice(1) + ' on the new Genio app: https://genio.app/post/' + activity[1]) : null }}
                        />
                        <Right><TouchableOpacity style={{ width: 70, alignItems: 'center', padding: 12 }} onPress={() => { showActionSheet(); }}><Icon name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 20, marginRight: -10, color: '#383838' }} /></TouchableOpacity></Right>
                    </View>
                    {/* <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>*/}
                </View>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', activity: activity })}>
                    {activity[9] === 'default123' ? <View style={{ margin: 5 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10, marginLeft: 14, marginVertical: 15 }}>{activity[9] === 'default123' ? '' : activity[9]}</Text>}
                    <View style={{ alignSelf: 'center' }}>
                        {activity[6] ? activity[6].split(", ").length - 1 == 1 ? <FastImage
                            source={{
                                uri: activity[6].split(", ")[0],
                                priority: FastImage.priority.high
                            }}
                            style={{ width: width, height: 340, borderRadius: 0 }}
                        /> : <View style={{ height: 340 }}><SliderBox
                            images={activity[6].split(", ").filter(n => n)}
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
                {activity[9].includes('http') ?
                    <LinkPreview touchableWithoutFeedbackProps={{ onPress: () => { navigation.navigate('Browser', { 'url': urlify(activity[9])[0] }) } }} text={activity[9]} containerStyle={{ backgroundColor: '#efefef', borderRadius: 0, marginTop: 10, width: width, alignSelf: 'center' }} renderTitle={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 12 }}>{text}</Text>} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 100) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                    : null}
                {activity.video ?
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <InViewPort onChange={(value) => value ? null : videoRef.pauseAsync()}>
                            <VideoPlayer
                                videoProps={{
                                    source: { uri: activity.video },
                                    rate: 1.0,
                                    volume: 1.0,
                                    isMuted: false,
                                    videoRef: v => videoRef = v,
                                    resizeMode: Video.RESIZE_MODE_CONTAIN,
                                    // shouldPlay
                                    // usePoster={activity.poster?true:false}
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
                {activity.youtube ?
                    <Thumbnail onPress={() => { navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', activity: activity }) }} imageHeight={200} imageWidth={width} showPlayIcon={true} url={"https://www.youtube.com/watch?v=" + data.youtube} />
                    : null}
                <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon onPress={() => navigation.navigate('SinglePost', { id: status === '3' ? children['0']['id'] : '', name: status === '3' ? children['0']['data']['name'] : '', image: status === '3' ? children['0']['data']['image'] : '', activity: activity, token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', type: 'comment' })} name="star" type="Feather" style={{ fontSize: 28, marginLeft: 10, marginRight: -10 }} />
                        <Text style={{ fontFamily: 'NunitoSans-Bold', marginLeft: 15, fontSize: 16, marginBottom: 2, marginRight: 8 }}>{activity[12]}</Text>
                        <Icon onPress={() => navigation.navigate('SinglePost', { id: status === '3' ? children['0']['id'] : '', name: status === '3' ? children['0']['data']['name'] : '', image: status === '3' ? children['0']['data']['image'] : '', activity: activity, token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', type: 'comment' })} name="message-circle" type="Feather" style={{ fontSize: 28, marginLeft: 10, marginRight: -10 }} />
                        <Text style={{ fontFamily: 'NunitoSans-Bold', marginLeft: 15, fontSize: 16, marginBottom: 2 }}>{activity[13]}</Text>
                        <TouchableOpacity style={{ width: 50, marginLeft: '60%', padding: 10, right: 12, alignItems: 'center' }}
                            onPress={async () => {
                                var x = await AsyncStorage.getItem('children');
                                analytics.track('WhatsappShare', {
                                    userID: x ? JSON.parse(x)["0"]["id"] : null,
                                    deviceID: getUniqueId()
                                });
                                Linking.openURL('whatsapp://send?text=Hey! Check out this post by ' + activity[17].charAt(0).toUpperCase() + activity[17].slice(1) + ' on the new Genio app: https://genio.app/post/' + activity[1]).then((data) => {
                                }).catch(() => {
                                    alert('Please make sure Whatsapp is installed on your device');
                                });
                            }}
                        >
                            <Icon name="whatsapp" type="Fontisto" style={{ fontSize: 28, color: '#4FCE5D' }} />
                        </TouchableOpacity>
                    </View>
                    {activity[10] === 'Genio' || activity[10] === 'Other' || activity[10] === '' ? null : <View style={{/* backgroundColor: '#327FEB', borderRadius: 0, width: 90, padding: 9,*/ marginTop: 5, marginLeft: 17 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: '#327feb', fontSize: 15, alignSelf: 'flex-start' }}>#{activity[10]}</Text></View>}
                </View>
            </View>
        )
    }
    return (
        <SafeAreaView>
            <ScreenHeader new={newnoti} screen={'Genio'} icon={'bell'} navigation={navigation} fun={() => { navigation.navigate('Notifications'); setnewnoti(false) }} />
            <Features style={{ backgroundColor: '#f9f9f9' }} />
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item['data'][1]}
            />
        </SafeAreaView>
    )
}
export default FeedScreen