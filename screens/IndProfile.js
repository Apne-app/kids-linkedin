/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, RefreshControl, Dimensions, Linking, BackHandler, Alert, View, ImageBackground, Image, FlatList, PixelRatio, SafeAreaView, Animated } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right, Left } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import SpinnerButton from 'react-native-spinner-button';
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
import axios from 'axios';
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
    const [loading, setloading] = React.useState(true);
    var children = route.params.children
    const status = route.params.status
    const [key, setkey] = React.useState('1');
    const [data, setdata] = useState({ mentions: [], classes: [], posts: [] })
    const [classes, setclasses] = useState([])
    const [index, setIndex] = useState(0);
    const [follow, setfollow] = useState({ 'followers': 0, 'following': 0 })
    const [refreshing, setrefreshing] = useState({ 'mentions': false, 'posts': false, 'classes': false })
    const [routes, setRoutes] = React.useState([
        { key: 'mentions', title: 'Mentions' },
        { key: 'posts', title: 'Posts' },
        { key: 'classes', title: 'Classes' },
    ]);
    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 80);
    const translateY = diffClamp.interpolate({
        inputRange: [0, 200],
        outputRange: [0, -200]
    })
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
    useEffect(() => {
        axios.post('https://d6a537d093a2.ngrok.io/profile', {
            'profile_id': route.params.id,
            'user_id': children ? children[0]['id'] : null
        }, {
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            setdata({ ...data, posts: response['data']['data'] })
            setkey(String(parseInt(key) + 1))
        }).catch((error) => {
            console.log(error)
        })
        if (route.params.data.type == 'Teacher') {
            axios.post('https://d6a537d093a2.ngrok.io/getmentions', {
                'mention_id': route.params.id,
                'user_id': children ? children[0]['id'] : null
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setdata({ ...data, mentions: response['data']['data'] })
                setkey(String(parseInt(key) + 1))
            }).catch((error) => {
                console.log(error)
            })
        }
        axios.post('http://mr_robot.api.genio.app/follow_count', {
            'user_id': route.params.id,
        }, {
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            setfollow(response['data']['data'])
            setkey(String(parseInt(key) + 1))
            setloading(false)
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
    const Empty = () => {
        return (<View style={{ backgroundColor: "#f9f9f9", height: height - 200, width: width }}>
            <View style={{ backgroundColor: '#327FEB', height: 250, width: 250, borderRadius: 10, alignSelf: 'center', marginTop: height / 10, flexDirection: 'column' }}>
                <Image source={require('../assets/noposts.gif')} style={{ height: 200, width: 200, alignSelf: 'center', marginTop: 45 }} />
            </View>
            <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'black', fontFamily: 'NunitoSans-Bold', paddingHorizontal: 50, marginTop: 40, fontSize: 17 }}>{route.params.data.name + " hasn't posted anything yet. Check back later!"}</Text>
        </View>)
    }
    const onRefresh = () => {

    }
    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'mentions':
                return <FeedView profile={true} scrollY={null} status={status} navigation={navigation} children={children} data={data.mentions} onRefresh={onRefresh} refreshing={refreshing[route.key]} feed_type={route.key} />
            case 'posts':
                return <FeedView profile={true} scrollY={null} status={status} navigation={navigation} children={children} data={data.posts} onRefresh={onRefresh} refreshing={refreshing[route.key]} feed_type={route.key} />
            case 'classes':
                return (
                    <View style={{ marginTop: 55 }}>
                        <FeedView profile={true} scrollY={null} status={status} navigation={navigation} children={children} data={data.classes} onRefresh={onRefresh} refreshing={refreshing[route.key]} feed_type={route.key} />
                    </View>)
            default:
                return null;
        }
    };
    const renderTabBar = (props) => {
        return (
            <Animated.View
                style={{
                    transform: [
                        { translateY: translateY }
                    ],
                    zIndex: 5,
                    position: 'absolute'
                }}
            >
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
            <ScreenHeader goback={() => navigation.pop()} left={true} screen={'Profile'} icon={'more-vertical'} fun={() => status == '3' ? showProfileSheet() : navigation.navigate('Login', { type: 'indprofile_settings' })} />
            <ActionSheet
                useNativeDriver={true}
                ref={refProfileSheet}
                styles={{ borderRadius: 0, margin: 10 }}
                options={[<Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                cancelButtonIndex={1}
                onPress={(index) => { index == 0 ? reportProfile() : null; }}
            />
            <View style={{ marginTop: 30, flexDirection: 'row' }}>
                <Image
                    source={{ uri: route['params']['data']['image'] ? route['params']['data']['image'] : route['params']['data']['profileImage'] }}
                    style={{ width: 80, height: 80, borderRadius: 306, marginLeft: 30, backgroundColor: 'lightgrey' }}
                />
                <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 10, flexWrap: 'wrap' }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20 }}>{route['params']['data']['name'][0].toUpperCase() + route['params']['data']['name'].substring(1)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'center', }}>{route.params.data ? route.params.data.type == 'Kid' ? String(year - parseInt(route.params.data.year)) + ' years old' : route.params.data.type : null}</Text>
                    </View>
                </View>
            </View>
            <View style={{ backgroundColor: 'white', width: width - 40, alignSelf: 'center', height: 100, borderRadius: 10, marginTop: 20, marginBottom: 20, }}>
                <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                    <View style={{ flexDirection: 'column', marginLeft: 30, marginLeft: 30, marginRight: 30 }}>
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
            {/* </Animated.View> */}
            {route.params.data.type === 'Teacher' ? <TabView
                key={key}
                style={{ flex: 4 }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                scrollEnabled={true}
                renderTabBar={renderTabBar}
            />
                : (loading ? <PostLoader /> : <FeedView scrollY={null} status={status} navigation={navigation} children={children} data={data['posts']} onRefresh={onRefresh} refreshing={refreshing['posts']} feed_type={'posts'} />)
            }
        </>
    );
};

export default IndProfile;