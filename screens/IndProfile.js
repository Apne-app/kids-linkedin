/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, RefreshControl, Dimensions, Linking, BackHandler, Alert, View, ImageBackground, Image, FlatList, PixelRatio, SafeAreaView, Animated, Share } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right, Left } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import SpinnerButton from 'react-native-spinner-button';
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import { useFocusEffect } from "@react-navigation/native";
import { RNS3 } from 'react-native-aws3';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import BottomSheet from 'reanimated-bottom-sheet';
import FeedComponent from '../Modules/FeedComponent'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import LikeButton from '../components/LikeButton'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Chip } from 'react-native-paper';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { SliderBox } from "react-native-image-slider-box";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import ImagePicker from 'react-native-image-crop-picker';
import PostLoader from '../Modules/PostLoader'
import FeedView from './FeedView'
const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const IndProfile = ({ navigation, route }) => {
    console.log(route.params.data)
    const [loading, setloading] = React.useState(true);
    var children = route.params.children
    const status = route.params.status
    const [key, setkey] = React.useState('1');
    const [profile, setprofile] = React.useState({ phone: '', website: '', fb: '', linkedin: '', email: '', category: '', name: 'loading...' });
    const [data, setdata] = useState({ mentions: [], classes: [], posts: [] })
    const [classes, setclasses] = useState([])
    const [index, setIndex] = useState(0);
    const [following, setFollowing] = useState(false);
    const [follow, setfollow] = useState({ 'followers': 0, 'following': 0 })
    const [refreshing, setrefreshing] = useState({ 'mentions': false, 'posts': false, 'classes': false })
    const [routes, setRoutes] = React.useState([
        { key: 'mentions', title: 'Mentions' },
        { key: 'posts', title: 'Posts' },
        { key: 'classes', title: 'Classes' },
    ]);
    const scrollY = useRef(new Animated.Value(0)).current;
    const diffClamp = Animated.diffClamp(scrollY, 0, 3650);
    const y = diffClamp.interpolate({
        inputRange: [0, 365],
        outputRange: [0, -365],
        extrapolateRight: 'clamp',
    });
    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }
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

    useEffect(() => {

        const getProfile = async () => {
            let pro = await AsyncStorage.getItem('children')
            pro = JSON.parse(pro)
            if (route.params.data.type != 'Teacher' && route.params.data.type != 'Kid') {
                setprofile(route.params.data)
                return
            }
            if (!pro) {
                var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });
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
                        const url = 'https://api.genio.app/matrix/teacherprofile/'
                        let data = JSON.stringify({ 'id': route.params.id })
                        axios({
                            method: 'post',
                            url: url + `?token=${response.data.token}`,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: data
                        }).then(async (response2) => {
                            setprofile(response2.data.data)
                        }).catch(async (error) => {
                            console.log(error)
                        })
                    })
            }
            else {
                var data = JSON.stringify({
                    "user_id": route.params.id,
                    "curr_id": pro["0"]["id"]
                });
                // console.log(data)

                var config = {
                    method: 'post',
                    url: 'https://api.genio.app/sherlock/getprofile',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {
                        //   let data = JSON.parse(response)
                        setprofile(response.data['data'])
                        setFollowing(response.data['follows'])
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }

        }
        getProfile()

    }, [])

    useEffect(() => {
        const analyse = async () => {
            var x = route.params.children;
            if (x) {
                if (Object.keys(x).length == 0) {
                    await AsyncStorage.removeItem('children');
                    x = null
                }
                analytics.screen('OtherProfileScreen', {
                    userID: x ? x["0"]["id"] : null,
                    deviceID: getUniqueId()
                })
            }
            else {
                analytics.screen('Profile Screen', {
                    userID: null,
                    deviceID: getUniqueId()
                })
            }

        }
        analyse();
    }, [])
    // useEffect(() => {
    //     if (profile.type === 'Teacher') {
    //         var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });
    //         var config = {
    //             method: 'post',
    //             url: 'https://api.genio.app/dark-knight/getToken',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             data: data
    //         };

    //         axios(config)
    //             .then(function (response) {
    //                 const url = 'https://api.genio.app/matrix/teacherprofile/'
    //                 let data = JSON.stringify({ 'id': route.params.id })
    //                 axios({
    //                     method: 'post',
    //                     url: url + `?token=${response.data.token}`,
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     },
    //                     data: data
    //                 }).then(async (response2) => {
    //                     setprofile(response2.data.data)
    //                 }).catch(async (error) => {
    //                     console.log(error)
    //                 })
    //             })
    //     }
    // }, [])
    useEffect(() => {
        axios.post('http://mr_robot.api.genio.app/profile', {
            'profile_id': route.params.id,
            'user_id': children ? children[0]['id'] : null
        }, {
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            var place = data
            place['posts'] = response['data']['data']
            await setdata(place)
            await setkey(String(parseInt(key) + 1))
            axios.post('http://mr_robot.api.genio.app/follow_count', {
                'user_id': route.params.id,
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then(async (response) => {
                await setfollow(response['data']['data'])
                await setkey(String(parseInt(key) + 1))
                await setloading(false)

            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            console.log(error)
        })
        axios.post('http://mr_robot.api.genio.app/getmentions', {
            'mention_id': route.params.id,
            'user_id': children ? children[0]['id'] : null
        }, {
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            var place = data
            place['mentions'] = response['data']['data']
            await setdata(place)
            await setkey(String(parseInt(key) + 1))
        }).catch((error) => {
            console.log(error)
        })
        axios.post('http://mr_robot.api.genio.app/getclasses', {
            'poster_id': route.params.id,
            'user_id': children ? children[0]['id'] : null
        }, {
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            var place = data
            place['classes'] = response['data']['data']
            await setdata(place)
            await setkey(String(parseInt(key) + 1))
        }).catch((error) => {
            console.log(error)
        })

    }, [])
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
            userID: y ? JSON.parse(y)["0"]["id"] : null,
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
    const followButtonHandle = async () => {
        let profile = await AsyncStorage.getItem('children')
        profile = JSON.parse(profile)
        if (!following) {
            var data = JSON.stringify({
                "user_id": route.params.id,
                "curr_id": profile["0"]["id"]
            });

            var config = {
                method: 'post',
                url: 'https://api.genio.app/barry/follow',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    // console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            var data = JSON.stringify({
                "user_id": route.params.id,
                "curr_id": profile["0"]["id"]
            });

            var config = {
                method: 'post',
                url: 'https://api.genio.app/barry/unfollow',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    // console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        setFollowing(!following)
    }

    const reportProfile = async () => {

        // console.log(children);


        var y = await AsyncStorage.getItem('children');
        var q = await AsyncStorage.getItem('profile');
        if (q) {
            q = JSON.parse(q)
        }
        analytics.track('Profile Reported', {
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
            "reported_id": route['params']['id'],
            "reported_name": profile['name'],
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
    const Empty = () => {
        return (<View style={{ backgroundColor: "#f9f9f9", height: height - 200, width: width }}>
            <View style={{ backgroundColor: '#327FEB', height: 250, width: 250, borderRadius: 10, alignSelf: 'center', marginTop: height / 10, flexDirection: 'column' }}>
                <Image source={require('../assets/noposts.gif')} style={{ height: 200, width: 200, alignSelf: 'center', marginTop: 350 }} />
            </View>
            <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'black', fontFamily: 'NunitoSans-Bold', paddingHorizontal: 50, marginTop: 40, fontSize: 17 }}>{profile.name + " hasn't posted anything yet. Check back later!"}</Text>
        </View>)
    }
    const onRefresh = () => {

    }
    const shareProfile = async () => {
        try {
            var cat = profile['type'] == 'Teacher' && profile.category && profile.category != 'others' ? titleCase(String(profile['category'][0])) : "";
            const result = await Share.share({
                message:
                    `Check out ${titleCase(profile['name'])}'s fantastic ${cat} profile on Genio!: https://genio.app/profile/` + route.params.id,
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
    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'mentions':
                return <FeedView more={''} profile={true} teacherprofile={true} scrollY={scrollY} status={status} navigation={navigation} children={children} data={data.mentions} onRefresh={onRefresh} refreshing={refreshing[route.key]} feed_type={route.key} />
            case 'posts':
                return <FeedView more={''} profile={true} teacherprofile={true} scrollY={scrollY} status={status} navigation={navigation} children={children} data={data.posts} onRefresh={onRefresh} refreshing={refreshing[route.key]} feed_type={route.key} />
            case 'classes':
                return <FeedView more={''} profile={true} teacherprofile={true} scrollY={scrollY} status={status} navigation={navigation} children={children} data={data.classes} onRefresh={onRefresh} refreshing={refreshing[route.key]} feed_type={route.key} />
            default:
                return null;
        }
    };
    const Tags = () => {
        if (profile.category) {
            return (
                <ScrollView horizontal={true} style={{ marginTop: -5, marginLeft: 15, marginBottom: 10 }} showsHorizontalScrollIndicator={false} >
                    {profile.category.map((item) => {
                        return (
                            <View style={{ backgroundColor: 'white', borderRadius: 5, paddingHorizontal: 8, marginHorizontal: 5, borderColor: '#327FEB', borderWidth: 0.5 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', color: '#327FEB', textAlignVertical: 'center', marginTop: 1, marginBottom: 2 }}>{titleCase(item)}</Text>
                            </View>
                        )
                    })}
                </ScrollView>
            )
        } else {
            return <View />
        }
    }
    const renderTabBar = (props) => {
        const tabY = scrollY.interpolate({
            inputRange: [0, 350],
            outputRange: [350, 0],
        });
        return (
            <Animated.View
                style={{
                    transform: [{ translateY: y }],
                    position: 'absolute',
                    marginTop: 360,
                    zIndex: 5
                }}>
                <TabBar
                    {...props}
                    activeColor={'#327FEB'}
                    inactiveColor={'black'}
                    pressColor={'lightblue'}
                    indicatorStyle={{ backgroundColor: 'white' }}
                    style={{ backgroundColor: 'white' }}
                    tabStyle={{ width: width / 3 }}
                    scrollEnabled={true}
                    bounces={true}
                    renderLabel={({ route, focused, color }) => (
                        <Text style={{ color, margin: 8, fontFamily: 'NunitoSans-SemiBold' }}>
                            {route.title + ' (' + String(data[route.key].length) + ')'}
                        </Text>
                    )}
                    indicatorStyle={{ backgroundColor: '#327FEB', height: 5, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
                />
            </Animated.View>
        )
    }
    return (
        <>
            <ActionSheet
                useNativeDriver={true}
                ref={refProfileSheet}
                styles={{ borderRadius: 0, margin: 10 }}
                options={[<Text style={{ fontFamily: 'NunitoSans-Bold', color: '#327FEB' }}>Share Profile</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                cancelButtonIndex={2}
                onPress={(index) => { index == 0 ? shareProfile() : reportProfile(); }}
            />
            <Animated.View style={[styles.header,
            { transform: [{ translateY: y }] }]}>
                <ScreenHeader goback={() => navigation.pop()} left={true} screen={'Profile'} icon={'more-vertical'} fun={() => status == '3' ? showProfileSheet() : navigation.navigate('Login', { type: 'indprofile_settings' })} />
                <View style={{ zIndex: 1000, backgroundColor: '#f2f2f2', position: 'absolute', marginTop: 80, width: width }}>
                    <View style={{ marginTop: 30, flexDirection: 'row', height: 80, zIndex: 1000 }}>
                        <View style={{ flexDirection: 'column' }}>
                            <FastImage
                                source={{ uri: profile['image'] ? profile['image'] : profile['profileImage'] }}
                                style={{ width: 70, height: 70, borderRadius: 306, marginLeft: 30, backgroundColor: 'lightgrey' }}
                            />
                            {profile['type'] ? <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: '#327FEB', textAlign: 'center', color: 'white', paddingHorizontal: 10, alignSelf: 'center', marginLeft: 30, borderRadius: 5, marginTop: -8, height: 27, paddingTop: 2, maxWidth: 100 }}>{profile['type']}</Text> : null}
                        </View>
                        <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 0, }}>
                            <View style={{}}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20, width: width - 100 }}>{titleCase(profile['name'])}</Text>
                            </View>
                            {/* <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'center', }}>{profile ? profile.type : null} {profile['type'] == 'Teacher' && profile.category && profile.category != 'others' ? "( " + titleCase(String(profile['category'].join().replace(",", ", ").length > 26 ? profile['category'].join().replace(",", ", ").substring(0, 26) + "..." : profile['category'].join().replace(",", ", "))) + " )" : ""}</Text> */}
                            {children ? <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        followButtonHandle();
                                    }}
                                >
                                    <Chip style={{ backgroundColor: following ? '#327feb' : "#fff", borderWidth: following ? 0 : 1, borderColor: '#327feb', height: 31, borderRadius: 5, marginTop: 8 }} textStyle={{ color: following ? '#fff' : '#327feb', fontFamily: 'NunitoSans-SemiBold', alignSelf: 'center', marginTop: 0 }}>
                                        {following ? 'Following' : 'Follow'}
                                    </Chip>
                                </TouchableOpacity>
                            </View> : null}
                            {/* {children ? <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        followButtonHandle();
                                    }}
                                >
                                    <Chip style={{ backgroundColor: following ? '#327feb' : "#fff", marginLeft: 10, padding: 1, borderWidth: following ? 0 : 1, borderColor: '#327feb' }} textStyle={{ color: following ? '#fff' : '#327feb', fontFamily: 'NunitoSans-SemiBold' }}>
                                        {following ? 'Following' : 'Follow'}
                                    </Chip>
                                </TouchableOpacity>
                            </View> : null} */}
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', width: width - 40, alignSelf: 'center', height: 60, borderRadius: 10, marginTop: 20, marginBottom: 20, zIndex: 1000 }}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 6 }}>
                            <View key={String(parseInt(key) + 1)} style={{ flexDirection: 'column', marginLeft: 30, marginLeft: 30, marginRight: 30 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{data.posts.length}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Posts</Text>
                            </View>
                            <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{follow.followers}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Followers</Text>
                            </View>
                            <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{follow.following}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Following</Text>
                            </View>
                        </View>
                    </View>
                    {
                        profile['type'] === 'Teacher' ?
                            <View style={{ width: width - 40, alignSelf: 'center', height: 40, borderRadius: 10, marginTop: 0, marginBottom: 4, zIndex: 1000, flexDirection: 'row' }}>
                                {
                                    profile['phone'] != '' ?
                                        <TouchableOpacity onPress={() => Linking.openURL("tel://" + "+" + profile['phone'])}>
                                            <Icon type="Feather" style={{ marginHorizontal: 10 }} name='phone' />
                                        </TouchableOpacity>
                                        : null
                                }
                                {
                                    profile['fb'] != '' && !profile['fb'].includes('default') ?
                                        <TouchableOpacity onPress={() => Linking.openURL(profile['fb'])}>
                                            <Icon type="Feather" style={{ marginHorizontal: 10 }} name='facebook' />
                                        </TouchableOpacity>
                                        : null
                                }
                                {
                                    profile['linkedin'] && profile['linkedin'] != '' && !profile['linkedin'].includes('default') ?
                                        <TouchableOpacity onPress={() => Linking.openURL(profile['linkedin'])}>
                                            <Icon type="Feather" style={{ marginHorizontal: 10 }} name='linkedin' />
                                        </TouchableOpacity>
                                        : null
                                }
                                {
                                    profile['website'] && profile['website'] != '' && !profile['website'].includes('default') ?
                                        <TouchableOpacity onPress={() => Linking.openURL(profile['website'])}>
                                            <Icon type="Feather" style={{ marginHorizontal: 10 }} name='link' />
                                        </TouchableOpacity>
                                        : null
                                }
                                {
                                    profile['email'] && profile['email'] != '' ?
                                        <TouchableOpacity onPress={() => Linking.openURL("mailto:" + profile['email'])}>
                                            <Icon type="Feather" style={{ marginHorizontal: 10 }} name='mail' />
                                        </TouchableOpacity>
                                        : null
                                }
                                {
                                    <TouchableOpacity onPress={() => shareProfile()}>
                                        <Icon type="MaterialIcons" style={{ marginHorizontal: 10 }} name='share' />
                                    </TouchableOpacity>
                                }
                            </View>
                            :
                            null
                    }
                    {profile['type'] == 'Teacher' ? <Tags /> : null}
                </View>
            </Animated.View>
            {profile.type === 'Teacher' ? <TabView
                key={key}
                style={{ flex: 4 }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                scrollEnabled={true}
                renderTabBar={renderTabBar}
            />
                : (loading ? <PostLoader /> : <FeedView more={''} profile={true} scrollY={scrollY} status={status} navigation={navigation} children={children} data={data.posts} onRefresh={onRefresh} refreshing={refreshing['posts']} feed_type={'posts'} />)
            }
        </>
    );
};


const styles = StyleSheet.create({
    Next: {
        alignSelf: 'center',
        flexDirection: 'row',
        padding: 12,
        // margin: 5,
        backgroundColor: '#327FEB',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#fff",
        width: 165,
        flex: 1,
        marginHorizontal: 20
    },
    header: {
        zIndex: 10000
    }
})

export default IndProfile;