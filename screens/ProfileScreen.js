/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, RefreshControl, Dimensions, Animated, Linking, BackHandler, Alert, View, ImageBackground, Image, FlatList, PixelRatio } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right, Left } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import SpinnerButton from 'react-native-spinner-button';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import FastImage from 'react-native-fast-image'
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import { useFocusEffect } from "@react-navigation/native";
import { RNS3 } from 'react-native-aws3';
import AuthContext from '../Context/Data';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import BottomSheet from 'reanimated-bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import LikeButton from '../components/LikeButton'
import FeedComponent from '../Modules/FeedComponent'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { SliderBox } from "react-native-image-slider-box";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import ImagePicker from 'react-native-image-crop-picker';
import { Thumbnail } from 'react-native-thumbnail-video';
import PostLoader from '../Modules/PostLoader'
import FeedView from './FeedView'
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const ProfileScreen = ({ navigation, route }) => {
    const children = route.params.children
    const profile = route.params.profile
    const status = route.params.status
    const [place, setplace] = useState(0)
    const [source, setsource] = useState('')
    const [data, setdata] = useState({ posts: [], classes: [], mentions: [], loaded: false })
    const [follow, setfollow] = useState({ 'followers': '', 'following': '' })
    const [token, setToken] = useState('');
    const [loading, setloading] = useState(true);
    const [key, setkey] = useState('1')
    const [posts, setposts] = useState([])
    const { Update } = React.useContext(AuthContext);
    const refActionSheet = useRef(null);
    const [index, setIndex] = useState(0);
    const [refreshing, setrefreshing] = useState({ 'mentions': false, 'posts': false, 'classes': false })
    const [routes, setRoutes] = React.useState([
        { key: 'mentions', title: 'Mentions' },
        { key: 'posts', title: 'Posts' },
        { key: 'classes', title: 'Classes' },
    ]);
    const scrollY = useRef(new Animated.Value(0)).current;
    const diffClamp = Animated.diffClamp(scrollY, 0, 335);
    const y = diffClamp.interpolate({      
        inputRange: [0, 335],
        outputRange: [0, -335],      
        extrapolateRight: 'clamp',    
      });
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123356789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
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
    const pickImage = (type) => {
        if (type === 'gallery') {
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                cropperCircleOverlay: true
            }).then(image => {

                var name = children['0']['id'] + '/' + makeid(6) + '.jpg'
                const file = {
                    uri: image.path,
                    name: name,
                    type: "image/png",
                }
                const options = {
                    keyPrefix: '',
                    bucket: "kids-linkedin-avatars",
                    region: "ap-south-1",
                    accessKey: ACCESS_KEY,
                    secretKey: SECRET_KEY,
                    successActionStatus: 201
                }
                RNS3.put(file, options).then(response => {
                    if (response.status !== 201) {
                        console.log(response, "aa")
                        alert('Could not update Profile Picture, please try again later')
                    }
                    else {

                        var child = children['0']
                        var data = JSON.stringify({ "user_id": child.id, "change": "image", "name": '', "image": 'https://d5c8j8afeo6fv.cloudfront.net/' + name });

                        var config = {
                            method: 'post',
                            url: `http://mr_robot.api.genio.app/update_child`,
                            headers: {
                                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                                'Content-Type': 'application/json'
                            },
                            data: data
                        };

                        axios(config)
                            .then(async (response) => {
                                var pro = route.params.profile
                                var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });
                                var config = {
                                    method: 'post',
                                    url: 'https://api.genio.app/get-out/getToken',
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
                                            url: 'https://api.genio.app/matrix/getchild/' + `?token=${response.data.token}`,
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            data: JSON.stringify({
                                                "email": pro.email,
                                            })
                                        })
                                            .then(async (response) => {
                                                var resp = response.data
                                                resp[0]['data']['image'] = 'https://d5c8j8afeo6fv.cloudfront.net/' + name
                                                await AsyncStorage.setItem('children', JSON.stringify(resp))
                                                setsource(resp[0]['data']['image'])
                                                setplace(String(parseInt(place) + 1))
                                                navigation.setParams({
                                                    children: resp,
                                                })
                                                Update({ 'children': resp })
                                                axios.post("http://ec2co-ecsel-1bslcbaqpti2m-1945288392.ap-south-1.elb.amazonaws.com/profileimageoptimize", {
                                                    "url": resp[0]['data']['image'],
                                                    "post_id": "0",
                                                    "id": children[0]['id']
                                                })
                                            })
                                            .catch((error) => {
                                                console.log(error)
                                            })
                                    })
                                    .catch(function (error) {
                                        console.log(error)
                                    });
                            }).catch((error) => {
                                console.log(error, "asd")
                                alert('Could not update Profile Picture, please try again later')
                            })


                    }
                })
            });
        }
        if (type === 'camera') {
            ImagePicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
                cropperCircleOverlay: true
            }).then(image => {
                var name = children['0']['id'] + '/' + makeid(6) + '.jpg'
                const file = {
                    uri: image.path,
                    name: name,
                    type: "image/png",
                }

                const options = {
                    keyPrefix: '',
                    bucket: "kids-linkedin-avatars",
                    region: "ap-south-1",
                    accessKey: ACCESS_KEY,
                    secretKey: SECRET_KEY,
                    successActionStatus: 201
                }
                RNS3.put(file, options).then(response => {
                    if (response.status !== 201) {
                        console.log(response, "aa")
                        alert('Could not update Profile Picture, please try again later')
                    }
                    else {
                        var child = children['0']
                        var data = JSON.stringify({ "user_id": child.id, "change": "image", "name": '', "image": 'https://d5c8j8afeo6fv.cloudfront.net/' + name });

                        var config = {
                            method: 'post',
                            url: `http://mr_robot.api.genio.app/update_child`,
                            headers: {
                                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                                'Content-Type': 'application/json'
                            },
                            data: data
                        };

                        axios(config)
                            .then(async (response) => {
                                var pro = route.params.profile
                                var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });
                                var config = {
                                    method: 'post',
                                    url: 'https://api.genio.app/get-out/getToken',
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
                                            url: 'https://api.genio.app/matrix/getchild/' + `?token=${response.data.token}`,
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            data: JSON.stringify({
                                                "email": pro.email,
                                            })
                                        })
                                            .then(async (response) => {
                                                if (!source.includes(response.data[0]['id'])) {
                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [{ name: 'Home' }],
                                                    });
                                                }
                                                var resp = response.data
                                                await AsyncStorage.setItem('children', JSON.stringify(response.data))
                                                resp[0]['data']['image'] = 'https://d5c8j8afeo6fv.cloudfront.net/' + name
                                                axios.post("http://ec2co-ecsel-1bslcbaqpti2m-1945288392.ap-south-1.elb.amazonaws.com/profileimageoptimize", {
                                                    "url": resp[0]['data']['image'],
                                                    "post_id": "0",
                                                    "id": children[0]['id']
                                                })
                                                Update({ 'children': resp })
                                            })
                                            .catch((error) => {
                                            })
                                    })
                                    .catch(function (error) {
                                    });
                            }).catch((error) => {
                                console.log(error, "asd")
                                alert('Could not update Profile Picture, please try again later')
                            })
                    }
                })
            });
        }
    }
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('Home', { screen: 'Feed' })
                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, []));
    const optionsRef = React.useRef(null);
    useEffect(() => {
        const analyse = async () => {
            var x = route.params.children;
            if (x) {
                if (Object.keys(x).length == 0) {
                    await AsyncStorage.removeItem('children');
                    x = null
                }
                analytics.screen('Profile Screen', {
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
                // console.log(JSON.stringify(response.data.token));
                setToken(response.data.token)
            })
            .catch(function (error) {
                console.log(error, 'aamb');
            });

    }, [])

    useEffect(() => {
        if (children) {
            axios.post('http://mr_robot.api.genio.app/profile', {
                'profile_id': children[0]['id'],
                'user_id': children ? children[0]['id'] : null
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then(async (response) => {
                var place = data
                place['posts'] = response['data']['data']
                place['loaded'] = true;
                await setdata(place)
                await setkey(String(parseInt(key) + 1))
            }).catch((error) => {
                console.log(error)
            })
            if (children[0]['data']['type'] == 'Teacher') {
                axios.post('http://mr_robot.api.genio.app/getmentions', {
                    'mention_id': children[0]['id'],
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
            }
            axios.post('http://mr_robot.api.genio.app/getclasses', {
                'poster_id': children[0]['id'],
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
                axios.post('http://mr_robot.api.genio.app/follow_count', {
                    'user_id': children[0]['id']
                }, {
                    headers: {
                        'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                        'Content-Type': 'application/json'
                    }
                }).then(async (response) => {
                    await setfollow(response['data']['data'])
                    await setkey(String(parseInt(key) + 1))
                    setloading(false)
                }).catch((error) => {
                    console.log(error)
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [])
    const onRefresh = () => {

    }
    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'mentions':
                return <FeedView profile={true} scrollY={scrollY} status={status} fromProfile={true} navigation={navigation} children={children} data={data.mentions} onRefresh={onRefresh} refreshing={refreshing[route.key]} feed_type={route.key} />
            case 'posts':
                return <FeedView profile={true} scrollY={scrollY} status={status} fromProfile={true} navigation={navigation} children={children} data={data.posts} onRefresh={onRefresh} refreshing={refreshing[route.key]} feed_type={route.key} />
            case 'classes':
                return (
                    <View>
                        <CompButton message={'Click to add a class'} />
                        <FeedView profile={true} scrollY={scrollY} status={status} fromProfile={true} navigation={navigation} children={children} data={data.classes} onRefresh={onRefresh} refreshing={refreshing[route.key]} feed_type={route.key} />
                    </View>)
            default:
                return null;
        }
    };
    const renderTabBar = (props) => {
        const tabY = scrollY.interpolate({
            inputRange: [0, 335],
            outputRange: [335, 0],
          });
        return (
            <Animated.View
                style={{
                transform: [{translateY: y}],
                position: 'absolute',
                marginTop: 335,
                zIndex: 5
            }}>
            <TabBar
                {...props}
                activeColor={'#327FEB'}
                inactiveColor={'black'}
                pressColor={'lightblue'}
                indicatorStyle={{ backgroundColor: 'white' }}
                style={{ backgroundColor: 'white'}}
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
    const there = () => {
        return (<>
            <Animated.View style={[styles.header, 
                {transform: [{translateY: y}]}]}>
            <ScreenHeader screen={'Profile'} icon={'settings'} fun={() => navigation.navigate('Settings')} />
            <View style={{zIndex: 1000, backgroundColor: '#f2f2f2', position: 'absolute', marginTop: 80, width: width}}>
            <View style={{ marginTop: 30, flexDirection: 'row', height: 80,  zIndex: 1000}}>
                <TouchableOpacity onPress={() => refActionSheet.current.show()} style={{ flexDirection: 'row' }}>
                    <FastImage
                        source={{
                            uri: source ? source : children[0]['data']['image'],
                        }}
                        style={{ width: 80, height: 80, borderRadius: 306, marginLeft: 30, }}
                    />
                    <View style={{ backgroundColor: '#327FEB', marginTop: 40, borderRadius: 1000, width: 40, height: 40, borderColor: '#f9f9f9', borderWidth: 2, marginLeft: -35 }}>
                        <Icon name="camera" type="Feather" style={{ color: '#f9f9f9', alignSelf: 'center', fontSize: 20, marginTop: 6 }} />
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'column', marginLeft: 30, marginTop: 2, flexWrap: 'wrap' }}>
                    <View style={{ flexDirection: 'row', height: 33, marginBottom: 4 }}>
                        <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20 }}>{titleCase(children['0']['data']['name'])}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'center', }}>{children[0]['data']['type']} {children[0]['data']['type'] == 'Teacher' ? "( "+titleCase(String(children[0]['data']['category'])) + " )" : ""}</Text>
                    </View>
                </View>
            </View>
            <View style={{ backgroundColor: 'white', width: width - 40, alignSelf: 'center', height: 60, borderRadius: 10, marginTop: 20, marginBottom: 10,  zIndex: 1000  }}>
                <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 6 }}>
                    <View key={key} style={{ flexDirection: 'column', marginLeft: 30, marginLeft: 30, marginRight: 30 }}>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{data.loaded ? data.posts.length: ""}</Text>
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
                children[0]['data']['type'] === 'Teacher' ?      
            <View style={{ width: width - 40, alignSelf: 'center', height: 40, borderRadius: 10, marginTop: 10,marginBottom: 10,  zIndex: 1000, flexDirection: 'row'  }}>
                {
                    profile['phone'] && profile['phone'] != '' ?
                <TouchableOpacity onPress={() => Linking.openURL("tel://"+profile['phone']) }>
                    <Icon type="Feather" style={{marginHorizontal: 10}} name='phone' />
                </TouchableOpacity>
                : null
                }
                {
                    children[0]['data']['fb'] && children[0]['data']['fb'] != '' && !children[0]['data']['fb'].includes('default') ?
                    <TouchableOpacity onPress={() => Linking.openURL(children[0]['data']['fb']) }>
                        <Icon type="Feather" style={{marginHorizontal: 10}} name='facebook' />
                    </TouchableOpacity>
                    : null
                }
                {
                    children[0]['data']['linkedin'] && children[0]['data']['linkedin'] != '' && !children[0]['data']['linkedin'].includes('default') ?
                    <TouchableOpacity onPress={() => Linking.openURL(children[0]['data']['linkedin']) }>
                        <Icon type="Feather" style={{marginHorizontal: 10}} name='linkedin' />
                    </TouchableOpacity>
                    : null
                }
                {
                    children[0]['data']['website'] && children[0]['data']['website'] != '' && !children[0]['data']['fb'].includes('default') ?
                    <TouchableOpacity onPress={() => Linking.openURL(children[0]['data']['website']) }>
                        <Icon type="Feather" style={{marginHorizontal: 10}} name='link' />
                    </TouchableOpacity>
                    : null
                }
                {
                    profile['email'] && profile['email'] != '' ?
                    <TouchableOpacity onPress={() => Linking.openURL("mailto:"+profile['email']) }>
                        <Icon type="Feather" style={{marginHorizontal: 10}} name='mail' />
                    </TouchableOpacity>
                    : null
                }
            </View>
            :
            null
            }
            </View>
            </Animated.View> 
            {children[0]['data']['type'] === 'Teacher' ? <TabView
                key={key}
                style={{ flex: 4 }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                scrollEnabled={true}
                renderTabBar={renderTabBar}
            />
                : (loading ? <PostLoader /> : <FeedView profile={true} scrollY={scrollY} status={status} navigation={navigation} children={children} data={data['posts']} onRefresh={onRefresh} refreshing={refreshing['posts']} feed_type={'posts'} />)
            }
            <ActionSheet
                useNativeDriver={true}
                ref={refActionSheet}
                styles={{ borderRadius: 10, margin: 10 }}
                options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Choose from Gallery</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Cancel</Text>]}
                cancelButtonIndex={1}
                onPress={(index) => { index == 0 ? pickImage('gallery') : null }}
            />
        </>)
    }
    const notthere = () => {
        return (
            <View style={{ backgroundColor: '#f9f9f9', height: height, width: width }}>
            <ScreenHeader screen={'Profile'} icon={'settings'} fun={() => navigation.navigate('Settings')} />
                <TouchableOpacity onPress={() => navigation.navigate('Login', { screen: 'Profile', type: 'profile_banner' })}><CompButton message={'Signup/Login to create profile'} /></TouchableOpacity>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Profile', type: 'profile_banner' })}>
                    <View style={{ backgroundColor: '#327FEB', height: 300, width: 300, borderRadius: 10, alignSelf: 'center', marginTop: height / 10, flexDirection: 'column' }}>
                        <Image source={require('../assets/profile.gif')} style={{ height: 200, width: 200, alignSelf: 'center', marginTop: 45 }} />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Profile', type: 'profile_banner' })}>
                    <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'black', fontFamily: 'NunitoSans-Bold', paddingHorizontal: 50, marginTop: 40, fontSize: 17 }}>Build your kid's very own portfolio using Genio and give a boost to their profile</Text>
                </TouchableWithoutFeedback>
            </View>
        )
    }
    return (
        <>
            {status == '3' ? there() : notthere()}
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

export default ProfileScreen;