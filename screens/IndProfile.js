/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, RefreshControl, Dimensions, Linking, BackHandler, Alert, View, ImageBackground, Image, FlatList, PixelRatio } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right, Left } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import SpinnerButton from 'react-native-spinner-button';
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
import axios from 'axios';
import { SECRET_KEY, ACCESS_KEY } from '@env';
import { useFocusEffect } from "@react-navigation/native";
import { RNS3 } from 'react-native-aws3';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import BottomSheet from 'reanimated-bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'getstream';
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
var VideoPlayer = require('react-native-exoplayer');
import { SliderBox } from "react-native-image-slider-box";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import ImagePicker from 'react-native-image-crop-picker';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const IndProfile = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [result, setresult] = React.useState([]);
    const [follows, setfollows] = React.useState([]);
    const [followPerson, setFollowPerson] = React.useState('Follow')
    const [currentid, setcurrentid] = React.useState('');
    const [certi, setCerti] = useState([]);
    const [courses, setCourses] = useState([])
    const children = route.params.children
    if (children) {
        //do nothing
    }
    else {
        children = ({ 'data': { 'gsToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' } })
    }
    const [profile, setProfile] = useState({});
    const [data, setdata] = useState({ 'followers': [], 'following': [] })
    const status = route.params.status
    const optionsRef = React.useRef(null);
    useEffect(() => {
        const addfollows = async () => {
            const client = connect('9ecz2uw6ezt9', children['0']['data']['gsToken'], '96078');
            var user = client.feed('user', route['params']['id'] + 'id');
            setProfile(user.client);
            var follows = await user.followers()
            var user = client.feed('timeline', route['params']['id'] + 'id');
            var following = await user.following()
            setdata({ 'followers': follows['results'], 'following': following['results'] })
        }
        addfollows()
    }, [])
    // useEffect(() => {
    //     // console.log(route.params)
    //     const addfollows = async () => {
    //         var children = await AsyncStorage.getItem('children')
    //         if (children) {
    //             children = JSON.parse(children)['0']
    //         }
    //         else {
    //             children = ({ 'data': { 'gsToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' } })
    //         }
    //         const client = connect('9ecz2uw6ezt9', children['data']['gsToken'], '96078');
    //         var user = client.feed('timeline', route['params']['data']['id'] + 'id');
    //         var follows = await user.following()
    //         // var profile = client.feed('user', route['params']['id']+'id');
    //         // var profFollow = await profile.followers();
    //         // var profFollowing = await profile.followers();
    //         // console.log("asdaaaa",profile)
    //         // setdata({ 'followers': profFollow['results'], 'following': profFollowing['results'] });
    //         var data = []
    //         follows['results'].map(item => {
    //             data.push(item['target_id'].replace('user:', '').replace('id', ''))
    //         })
    //         setfollows(data)
    //         data.includes(String(route.params.id)) ? setFollowPerson('Following') : null;
    //     }
    //     addfollows()
    // }, [])

    useEffect(() => {
        const addCerti = async () => {
            var children = await AsyncStorage.getItem('children')
            children = JSON.parse(children)['0']
            var config = {
                method: 'get',
                url: `https://barry-2z27nzutoq-as.a.run.app/getcerti/${route['params']['data']['gsToken']}`,
                headers: {}
            };
            axios(config)
                .then(function (response) {
                    // console.log((response.data));
                    var arr = [];
                    Object.keys(response.data).forEach(e => arr.push(response.data[e]["data"]["path"]));
                    setCerti([...arr])
                    // console.log(arr);
                })
                .catch(function (error) {
                    console.log(error);
                });

            config = {
                method: 'get',
                url: `https://barry-2z27nzutoq-as.a.run.app/getcourse/${route['params']['data']['gsToken']}`,
                headers: {}
            };

            axios(config)
                .then(function (response) {
                    var arr = [];
                    Object.keys(response.data).forEach(e => arr.push({ "name": response.data[e]["data"]["name"], "url": response.data[e]["data"]["url"], "org": response.data[e]["data"]["org"] }));
                    setCourses([...arr])
                    console.log(arr)
                })
                .catch(function (error) {
                    // console.log(error);
                });

        }
        // addCerti();
    }, [])

    useEffect(() => {
        const addfollows = async () => {
            var children = await AsyncStorage.getItem('children')
            if (children) {
                children = JSON.parse(children)['0']
            }
            else {
                children = ({ 'data': { 'gsToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' } })
            }
            setcurrentid(children['id'])
        }
        addfollows()
    }, [])
    const followid = (id) => {
        // console.log("asd");
        if (followPerson == 'Follow') {
            // console.log('https://api.genio.app/matrix/follow/' + currentid + '/' + id)
            var data = JSON.stringify({ "username": "Shashwat", "password": "GenioKaPassword" });

            var config = {
                method: 'post',
                url: 'https://api.genio.app/dark-knight/getToken',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            axios(config)
                .then(function (response) {
                    // console.log(JSON.stringify(response.data.token));
                    axios({
                        method: 'post',
                        url: 'https://api.genio.app/matrix/follow/' + `?token=${response.data.token}`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            "id1": currentid,
                            "id2": id
                        })
                    })
                        .then(async (res) => {
                            if (res.data == 'success') {
                                var place = follows;
                                place.push(String(id));
                                setfollows(place)
                                setFollowPerson('Following');
                            }
                        })
                })
                .catch(function (error) {
                });


        }
        else {
            var data = JSON.stringify({ "username": "Shashwat", "password": "GenioKaPassword" });

            var config = {
                method: 'post',
                url: 'https://api.genio.app/dark-knight/getToken',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            axios(config)
                .then(function (response) {
                    // console.log(JSON.stringify(response.data.token));
                    axios({
                        method: 'post',
                        url: 'https://api.genio.app/matrix/unfollow/' + currentid + '/' + id + `?token=${response.data.token}`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            "id1": currentid,
                            "id2": id
                        })
                    })
                        .then(async (res) => {
                            if (res.data == 'success') {
                                var place = follows;
                                const index = place.indexOf(id);
                                if (index > -1) {
                                    place.splice(index, 1);
                                }
                                setfollows(place)
                                setFollowPerson('Follow');
                            }
                        })
                })
                .catch(function (error) {
                });

        }

    }
    const CustomActivity = (props) => {
        const refActionSheet = useRef(null);
        const showActionSheet = () => {
            refActionSheet.current.show()
        }
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
                                analytics.track('Like', {
                                    userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                                    deviceID: getUniqueId(),
                                    by: JSON.parse(x)["0"]["id"],
                                    to: parseInt(props.activity.actor.id.replace('id', '')),
                                    actid: id
                                })
                            }
                        }
                    }}>
                        {status === '3' ? <LikeButton   {...props} /> : <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}><View pointerEvents={'none'}><LikeButton   {...props} /></View></TouchableWithoutFeedback>}
                    </TouchableWithoutFeedback>
                    <Icon onPress={() => navigation.navigate('SinglePost', { image: children['0']['data']['image'], activity: props, token: children['0']['data']['gsToken'] })} name="message-circle" type="Feather" style={{ fontSize: 22, marginLeft: 10, marginRight: -10 }} />
                    <ReactionIcon
                        labelSingle=" "
                        labelPlural=" "
                        counts={props.activity.reaction_counts}
                        kind="comment"
                        width={-80}
                        onPress={async () => {
                            var x = await AsyncStorage.getItem('children');
                            if (x) {
                                x = JSON.parse(x)
                                if (Object.keys(x).length == 0) {
                                    await AsyncStorage.removeItem('children');
                                    x = null
                                }
                            }
                            analytics.track('Comment', {
                                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                                deviceID: getUniqueId()
                            });
                            navigation.navigate('SinglePost', { image: children['0']['data']['image'], activity: props, token: children['0']['data']['gsToken'] })
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
        props.activity.image ? props.activity.image.split(', ').map((item) => item != '' ? images.push({ uri: item }) : null) : null
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
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'left' }}>{props.activity.actor.data ? props.activity.actor.data.type : null}</Text>
                            </View>
                            <ActionSheet
                                useNativeDriver={true}
                                ref={refActionSheet}
                                styles={{ borderRadius: 0, margin: 10 }}
                                options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                                cancelButtonIndex={2}
                                onPress={(index) => { index == 1 ? report(props.activity) : null; }}
                            />
                            <Right><Icon onPress={() => { showActionSheet(); }} name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 16, marginRight: 20, color: '#383838' }} /></Right>
                        </View>
                        {/* <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>*/}
                    </View>
                }
                Content={
                    <View>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('SinglePost', { image: children['0']['data']['image'], token: children['0']['data']['gsToken'], activity: props })}>
                            {props.activity.object === 'default123' ? <View style={{ margin: 5 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10, marginLeft: 14, marginVertical: 10 }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text>}
                            <View style={{ alignSelf: 'center' }}>
                                {props.activity.image ? props.activity.image.split(", ").length - 1 == 1 ? <Image
                                    source={{ uri: props.activity.image.split(", ")[0] }}
                                    style={{ width: width, height: 340, marginTop: 20, borderRadius: 0 }}
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
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('SinglePost', { image: children['0']['data']['image'], token: children['0']['data']['gsToken'], activity: props })}>
                            {props.activity.object.includes('http') ?
                                <LinkPreview text={props.activity.object} containerStyle={{ backgroundColor: '#efefef', borderRadius: 0, marginTop: 10, width: width, alignSelf: 'center' }} renderTitle={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 12 }}>{text}</Text>} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 100) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                                : null}
                        </TouchableWithoutFeedback>
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
                            <Thumbnail onPress={() => { navigation.navigate('SinglePost', { image: children['0']['data']['image'], token: children['0']['data']['gsToken'], activity: props }) }} imageHeight={200} imageWidth={width} showPlayIcon={true} url={"https://www.youtube.com/watch?v=" + props.activity.youtube} />
                            : null}
                        {props.activity.tag === 'Genio' || props.activity.tag === 'Other' || props.activity.tag === '' || !Object.keys(props.activity).includes('tag') ? null : <View style={{/* backgroundColor: '#327FEB', borderRadius: 0, width: 90, padding: 9,*/ marginTop: 5, marginLeft: 17 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: '#327feb', fontSize: 15, alignSelf: 'flex-start' }}>#{props.activity.tag}</Text></View>}
                    </View>
                }
                Footer={footer(props.activity.id, props)}
            />
        );
    };

    const refProfileSheet = useRef(null);
    const showProfileSheet = () => {
        refProfileSheet.current.show()
    }

    const report = async (x) => {

        // console.log(children);
        var y = await AsyncStorage.getItem('children');
        var q = await AsyncStorage.getItem('profile');
        q = JSON.parse(q)
        console.log(q)
        analytics.track('Post Reported', {
            userID: y ? JSON.parse(y)["0"]["data"]["gsToken"] : null,
            deviceID: getUniqueId()
        })
        var now = new Date();
        var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

        var body = {
            "created_by": q['id'],
            "created_by_name": q['email'],
            "created_by_child": children["0"]["id"],
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
                    setShowToast(true);
                }
                console.log(response.data)
            })
            .catch(function (error) {
                alert(error);
                // setLoading(false)
            });

    }

    const reportProfile = async () => {

        // console.log(children);


        var y = await AsyncStorage.getItem('children');
        var q = await AsyncStorage.getItem('profile');
        q = JSON.parse(q)
        console.log(q)
        analytics.track('Post Reported', {
            userID: y ? JSON.parse(y)["0"]["data"]["gsToken"] : null,
            deviceID: getUniqueId()
        })
        var now = new Date();
        var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

        var body = {
            "created_by": q['id'],
            "created_by_name": q['email'],
            "created_by_child": children["0"]["id"],
            "reported_id": route['params']['id'],
            "reported_name": route['params']['data']['name'],
            "reported_time": datetime,
        }

        var config = {
            method: 'post',
            url: 'https://api.genio.app/the-office/report_profile',
            headers: {
                'Content-Type': 'application/json'
            },
            data: body
        };
        // console.log(body)
        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                // setLoading(false);
                if (response.data == "success") {
                    // setShowToast(true);
                    console.log('success')
                }
                else {
                    console.log(response.data)
                }
            })
            .catch(function (error) {
                alert(error);
                // setLoading(false)
            });

        // console.log(body);

    }

    return (
        Object.keys(children).length ?
            <View>
                <ActionSheet
                    useNativeDriver={true}
                    ref={refProfileSheet}
                    styles={{ borderRadius: 0, margin: 10 }}
                    options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share Profile</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                    cancelButtonIndex={2}
                    onPress={(index) => { index == 1 ? reportProfile() : null; }}
                />
                <ScreenHeader goback={() => navigation.pop()} left={true} screen={'Profile'} icon={'more-vertical'} fun={() => status == '3' ? showProfileSheet() : navigation.navigate('Login')} />
                <ScrollView style={{ backgroundColor: "#f9f9f9" }} >
                    <StreamApp
                        apiKey={'9ecz2uw6ezt9'}
                        appId={'96078'}
                        token={children['0']['data']['gsToken']}
                    >
                        <View style={{ marginTop: 30, flexDirection: 'row' }}>
                            <TouchableOpacity style={{ flexDirection: 'row' }}>
                                <Image
                                    source={{ uri: route['params']['data']['image'] ? route['params']['data']['image'] : route['params']['data']['profileImage'] }}
                                    style={{ width: 80, height: 80, borderRadius: 306, marginLeft: 30 }}
                                />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 10, flexWrap: 'wrap' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20 }}>{route['params']['data']['name'][0].toUpperCase() + route['params']['data']['name'].substring(1)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'center', }}>{route['params']['data']['type']}</Text>
                                </View>
                                {/* <TouchableOpacity onPressIn={() => followid(route.params.id)} block dark style={{ backgroundColor: '#91d7ff', height: 25, width: 80, alignSelf: 'center', marginBottom: 20, marginTop: 2, borderRadius: 10, marginLeft: -20 }}>
                                <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 12, textAlign: 'center', marginTop: 2 }}>{followPerson}</Text>
                            </TouchableOpacity> */}
                            </View>
                        </View>
                        {/* <View style={{ backgroundColor: 'white', width: width - 40, alignSelf: 'center', height: 100, borderRadius: 10, marginTop: 20, marginBottom: 20, }}> */}
                        {/* <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                                <View style={{ flexDirection: 'column', marginLeft: 30, marginLeft: 30, marginRight: 30 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>3</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Posts</Text>
                            </View>
                                <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{data.followers.length}</Text>
                                    <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Followers</Text>
                                </View>
                                <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{data.following.length}</Text>
                                    <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Following</Text>
                                </View>
                            </View> */}
                        {/*<View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                            <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{certi.length}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Certifications</Text>
                            </View>
                            <TouchableOpacity onPress={() => { optionsRef.current.snapTo(0); setBottomType('courses') }} style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 40, marginRight: 10 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{courses.length}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Courses</Text>
                            </TouchableOpacity>

                        </View>*/}
                        {/* </View> */}
                        <FlatFeed userId={route['params']['id'] + 'id'} feedGroup="user" Activity={CustomActivity} options={{ withOwnReactions: true }} />
                    </StreamApp>
                </ScrollView>
            </View> : <View style={{ backgroundColor: 'white', height: height, width: width }}>
                <ScreenHeader goback={() => navigation.pop()} left={true} screen={'Profile'} icon={'more-vertical'} fun={() => status == '3' ? navigation.navigate('Settings') : navigation.navigate('Login')} />
                <Image source={require('../assets/loading.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: width / 2 }} />
            </View>
    );
};

export default IndProfile;