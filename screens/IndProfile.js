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
import FeedComponent from '../Modules/FeedComponent'
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
    var children = route.params.children
    if (children) {
        //do nothing
    }
    else {
        children = ([{ 'data': { 'gsToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' } }])
    }
    const [profile, setProfile] = useState({});
    const [data, setdata] = useState({ 'followers': [], 'following': [] })
    const status = route.params.status
    const optionsRef = React.useRef(null);
    // useEffect(() => {
    //     const addfollows = async () => {
    //         const client = connect('9ecz2uw6ezt9', children['0']['data']['gsToken'], '96078');
    //         var user = client.feed('user', route['params']['id'] + 'id');
    //         setProfile(user.client);
    //         var follows = await user.followers()
    //         var user = client.feed('timeline', route['params']['id'] + 'id');
    //         var following = await user.following()
    //         setdata({ 'followers': follows['results'], 'following': following['results'] })
    //     }
    //     addfollows()
    // }, [])
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

    // useEffect(() => {
    //     const addfollows = async () => {
    //         var children = await AsyncStorage.getItem('children')
    //         if (children) {
    //             children = JSON.parse(children)['0']
    //         }
    //         else {
    //             children = ({ 'data': { 'gsToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' } })
    //         }
    //         setcurrentid(children['id'])
    //     }
    //     addfollows()
    // }, [])
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
        if (q) {
            q = JSON.parse(q)
        }
        analytics.track('Profile Reported', {
            userID: y ? JSON.parse(y)["0"]["data"]["gsToken"] : null,
            deviceID: getUniqueId()
        })
        var now = new Date();
        var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        var body = {
            "created_by": q ? q['id'] : 'nonloggedin',
            "created_by_name": q ? q['email'] : 'nonloggedin',
            "created_by_child": children ? children["0"]["id"] : 'nonloggedin',
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
                    alert('Succesfully reported profile')
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
    var d = new Date();
    var year = parseInt(d.getFullYear());
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
                <ScreenHeader goback={() => navigation.pop()} left={true} screen={'Profile'} icon={'more-vertical'} fun={() => status == '3' ? showProfileSheet() : navigation.navigate('Login', { type: 'indprofile_settings' })} />
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
                                    style={{ width: 80, height: 80, borderRadius: 306, marginLeft: 30, backgroundColor: 'lightgrey' }}
                                />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 10, flexWrap: 'wrap' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20 }}>{route['params']['data']['name'][0].toUpperCase() + route['params']['data']['name'].substring(1)}</Text>
                                </View>
                                {console.log(route.params.data.year)}
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'center', }}>{route.params.data ? route.params.data.type == 'Kid' || 'Child' || 'child' || 'kid' ? String(year - parseInt(route.params.data.year)) + ' years old' : route.params.data.type : null}</Text>
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
                        <FlatFeed userId={route['params']['id'] + 'id'} feedGroup="user" Activity={(data) => { return <FeedComponent props={data} status={status} children={children} navigation={navigation} route={route} /> }} options={{ withOwnReactions: true }} />
                    </StreamApp>
                </ScrollView>
            </View> : <View style={{ backgroundColor: 'white', height: height, width: width }}>
                <ScreenHeader goback={() => navigation.pop()} left={true} screen={'Profile'} icon={'more-vertical'} fun={() => status == '3' ? navigation.navigate('Settings') : navigation.navigate('Login', { type: 'indprofile_settings' })} />
                <Image source={require('../assets/loading.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: width / 2 }} />
            </View>
    );
};

export default IndProfile;