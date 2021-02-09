/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, RefreshControl, Dimensions, Linking, BackHandler, Alert, View, ImageBackground, Image, FlatList, PixelRatio } from 'react-native'
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
import { connect } from 'getstream';
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton'
import FeedComponent from '../Modules/FeedComponent'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { SliderBox } from "react-native-image-slider-box";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import ImagePicker from 'react-native-image-crop-picker';
import { Thumbnail } from 'react-native-thumbnail-video';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
updateStyle('activity', {
    container:
    {
        marginVertical: height * 0.01,
        backgroundColor: "#fff",
        marginHorizontal: 0,
        fontFamily: 'NunitoSans-Regular',
        borderRadius: 0
    },
    text: {
        fontFamily: 'NunitoSans-Regular'
    },
    header: {
        fontFamily: 'NunitoSans-Regular'
    }
});
updateStyle('flatFeed', {
    container:
    {
        backgroundColor: "#f9f9f9",
        paddingRight: 0,
        paddingLeft: 0,
        borderRadius: 0
    }
});
updateStyle('LikeButton', {
    text: {
        fontFamily: 'NunitoSans-Bold'
    },
});
var width = Dimensions.get('screen').width;
const fontConfig = {
    default: {
        regular: {
            fontFamily: 'NunitoSans-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'NunitoSans-Regular',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'NunitoSans-Regular',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'NunitoSans-Regular',
            fontWeight: 'normal',
        },
    },
};
const ProfileScreen = ({ navigation, route }) => {
    const children = route.params.children
    const status = route.params.status
    const [place, setplace] = useState(0)
    const [data, setdata] = useState({ 'followers': [], 'following': [], type: 'loading' })
    const [certi, setCerti] = useState([]);
    const [Loading, setLoading] = useState(false)
    const [option, setOption] = useState('');
    const [token, setToken] = useState('');
    const [courses, setCourses] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [bottomType, setBottomType] = useState('')
    const [key, setkey] = useState('1')
    const [posts, setposts] = useState(1)
    const { Update } = React.useContext(AuthContext);
    const [course, setCourse] = useState({
        org: '',
        url: '',
        name: ''
    })
    const setplacefun = async (val) => {
        const client = connect('9ecz2uw6ezt9', children[0]['data']['gsToken'], '96078');
        var user = client.feed('user', children[0]['id'] + 'id');
        var post = await user.get({ limit: 5 })
        setposts(post['results'].length)
        setplace(val)
    }
    const refActionSheet = useRef(null);
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


    const renderOptions = () => (
        <View
            scrollEnabled={false}
            style={{
                backgroundColor: '#fff',
                padding: 16,
                height: height * 0.5,
            }}
        >
            <TouchableOpacity onPress={() => { optionsRef.current.snapTo(1); setBottomType(''); setOption('') }} style={{ alignItems: 'center', paddingBottom: 10 }}><Icon name="chevron-small-down" type="Entypo" /></TouchableOpacity>
            {
                bottomType == '' && option == '' ?
                    <Button onPress={() => setOption('course')} full style={{ backgroundColor: "#327FEB" }}>
                        <Text>Add Course</Text>
                    </Button> : null
            }
            {
                bottomType == '' && option == 'course' ?
                    <View>
                        <TouchableOpacity onPress={() => { setOption(''); }} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} ><Icon name="cross" type="Entypo" /></TouchableOpacity>
                        <Text >Add Course Details!</Text>
                        <Item floatingLabel>
                            <Label>Course Organization</Label>
                            <Input value={course.org} onChangeText={text => setCourse({ ...course, org: text })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Course Name</Label>
                            <Input value={course.name} onChangeText={text => setCourse({ ...course, name: text })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Course Url</Label>
                            <Input value={course.url} onChangeText={text => setCourse({ ...course, url: text })} />
                        </Item>
                        <SpinnerButton
                            buttonStyle={{
                                borderRadius: 10,
                                margin: 20,
                                width: 200,
                                alignSelf: 'center',
                                backgroundColor: '#327FEB'
                            }}
                            isLoading={Loading}
                            spinnerType='BarIndicator'
                            onPress={async () => {
                                setLoading(true);
                                var children = route.params.children
                                children = children['0']
                                var data = JSON.stringify({ "gstoken": children['data']['gsToken'], "course_url": course.url, "course_name": course.name, "course_org": course.org });

                                var config = {
                                    method: 'post',
                                    url: 'https://barry-2z27nzutoq-as.a.run.app/updatecourses/${token}',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: data
                                };

                                axios(config)
                                    .then(function (response) {
                                        console.log(JSON.stringify(response.data));
                                        setLoading(false);
                                    })
                                    .catch(function (error) {
                                        alert(error);
                                        setLoading(false)
                                    });
                            }}
                            indicatorCount={10}
                        >
                            <Icon active type="Feather" name='chevron-right' style={{ color: 'black', fontWeight: 'bold' }} />
                        </SpinnerButton>

                    </View> : null
            }
            {
                bottomType == 'courses' ?
                    <FlatList
                        data={courses}
                        scrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            // flexGrow: 1,
                        }}
                        // style={{marginTop: 5}}
                        renderItem={({ item, i }) => (
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => console.log(courses)} >
                                <View
                                    key={i}
                                    style={{ flex: 1, alignItems: 'center', borderWidth: 0.3, margin: 4, padding: 10, borderRadius: 15, backgroundColor: "#327FEB" }}>
                                    <Text style={{ fontSize: 18, color: "#fff" }}>{item.org} : {item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        //Setting the number of column
                        numColumns={1}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    : null
            }
        </View>
    );


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
                    userID: x ? x["0"]["data"]["gsToken"] : null,
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


        const addfollows = async () => {
            var children = route.params.children
            if (children != null) {
                children = children['0']
                const client = connect('9ecz2uw6ezt9', children['data']['gsToken'], '96078');
                var user = client.feed('user', children['id'] + 'id');
                var post = await user.get({ limit: 5 })
                setposts(post['results'].length)
                var follows = await user.followers()
                var user = client.feed('timeline', children['id'] + 'id');
                var following = await user.following()
                setdata({ 'followers': follows['results'], 'following': following['results'], type: children['data']['type'] })
            }
            // console.log(follows)
        }
        addfollows()
    }, [])
    useEffect(() => {
        console.log(children['0']['data']['image'])
        const profileImage = async () => {
            var children = route.params.children
            if (children != null) {
                children = children['0']
                console.log(children['data']['image'])
                setsource(children['data']['image'])
            }
            // console.log(follows)
        }
        profileImage()
    }, [])
    useEffect(() => {
        const addCerti = async () => {
            var children = route.params.children
            if (children != null) {
                children = children['0']
                var config = {
                    method: 'get',
                    url: `https://barry-2z27nzutoq-as.a.run.app/getcerti/${children['data']['gsToken']}/${token}`,
                    headers: {}
                };
                // axios(config)
                //     .then(function (response) {
                //         // console.log((response.data));
                //         var arr = [];
                //         Object.keys(response.data).forEach(e => arr.push(response.data[e]["data"]["path"]));
                //         setCerti([...arr])
                //         // console.log(arr);
                //     })
                //     .catch(function (error) {
                //         console.log(error, "aanb");
                //     });

                config = {
                    method: 'get',
                    url: `https://barry-2z27nzutoq-as.a.run.app/getcourse/${children['data']['gsToken']}/${token}`,
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
        }
        addCerti();
    }, [])


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        const addfollows = async () => {
            var children = route.params.children
            children = children['0']
            const client = connect('9ecz2uw6ezt9', children['data']['gsToken'], '96078');
            var user = client.feed('user', children['id'] + 'id');
            var follows = await user.followers()
            var user = client.feed('timeline', children['id'] + 'id');
            var following = await user.following()
            console.log(follows)
            setdata({ 'followers': follows['results'], 'following': following['results'], followers: follows })
            // console.log(follows)
        }
        addfollows();

        const addCerti = async () => {
            var children = route.params.children
            children = children['0']
            var config = {
                method: 'get',
                url: `https://barry-2z27nzutoq-as.a.run.app/getcerti/${children['data']['gsToken']}/${token}`,
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
                url: `https://barry-2z27nzutoq-as.a.run.app/getcourse/${children['data']['gsToken']}/${token}`,
                headers: {}
            };

            axios(config)
                .then(function (response) {
                    var arr = [];
                    Object.keys(response.data).forEach(e => arr.push({ "name": response.data[e]["data"]["name"], "url": response.data[e]["data"]["url"], "org": response.data[e]["data"]["org"] }));
                    setCourses([...arr])
                    console.log(arr);
                    setRefreshing(false)
                })
                .catch(function (error) {
                    // console.log(error);
                    setRefreshing(false)
                });

        }
        addCerti();

    }, []);

    const [source, setsource] = useState('')
    const there = () => {
        return (<View key={place} style={{ backgroundColor: "#f9f9f9" }}>
            <ScrollView style={{ backgroundColor: "#f9f9f9" }} >
                <StreamApp
                    apiKey={'9ecz2uw6ezt9'}
                    appId={'96078'}
                    token={children['0']['data']['gsToken']}
                >
                    <View style={{ marginTop: 30, flexDirection: 'row', backgroundColor: "#f9f9f9" }}>
                        <TouchableOpacity onPress={() => refActionSheet.current.show()} style={{ flexDirection: 'row' }}>
                            <FastImage
                                source={{
                                    uri: source,
                                    cache: FastImage.cacheControl.web
                                }}
                                style={{ width: 80, height: 80, borderRadius: 306, marginLeft: 30, }}
                            />
                            <View style={{ backgroundColor: '#327FEB', marginTop: 40, borderRadius: 1000, width: 40, height: 40, borderColor: '#f9f9f9', borderWidth: 2, marginLeft: -35 }}>
                                <Icon name="camera" type="Feather" style={{ color: '#f9f9f9', alignSelf: 'center', fontSize: 20, marginTop: 6 }} />
                            </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'column', marginLeft: 30, marginTop: 2, flexWrap: 'wrap' }}>
                            <View style={{ flexDirection: 'row', height: 33, marginBottom: 4 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20 }}>{children['0']['data']['name'][0].toUpperCase() + children['0']['data']['name'].substring(1)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'center', }}>{'Kid'}</Text>
                                {/* <Icon onPress={()=>setplacefun(String(parseInt(place)+1))} name="refresh-ccw" type="Feather" style={{ color: 'black', alignSelf: 'center', fontSize: 18, marginLeft:10, marginTop:2}} /> */}
                            </View>
                        </View>
                    </View>
                    {/* <View style={{ backgroundColor: '#f9f9f9', width: width - 40, alignSelf: 'center', height: 100, borderRadius: 10, marginTop: 20, marginBottom: 20, }}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                            <View style={{ flexDirection: 'column', marginLeft: 30, marginLeft: 30, marginRight: 30 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>2</Text>
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
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                            <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{certi.length}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Certifications</Text>
                            </View>
                            <TouchableOpacity onPress={() => { optionsRef.current.snapTo(0); setBottomType('courses') }} style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 40, marginRight: 10 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{courses.length}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Courses</Text>
                            </TouchableOpacity>

                        </View>
                    </View> */}
                    {/* <TouchableOpacity
                        onPress={async () => {
                            var x = route.params.children;
                            analytics.track('Opened website', {
                                userID: x ? x["0"]["data"]["gsToken"] : null,
                                deviceID: getUniqueId()
                            })
                            navigation.navigate('Browser', { url: "https://eager-bohr-ef70c5.netlify.app/" + children['0']['data']['gsToken'], heading: 'Website' })
                            // Linking.openURL("https://eager-bohr-ef70c5.netlify.app/" + children['0']['data']['gsToken'])
                            //     .catch(err => {
                            //         console.error("Failed opening page because: ", err)
                            //         alert('Failed to open page')
                            //     })
                        }}

                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 15, backgroundColor: '#327FEB', color: '#f9f9f9', width: 100, textAlign: 'center', padding: 3, borderRadius: 15 }}>{'Website'}</Text>
                    </TouchableOpacity> */}
                    {posts ?
                        <View style={{ marginBottom: 400, backgroundColor: "#f9f9f9", marginTop: 20 }}>
                            <FlatFeed feedGroup="user" Activity={(data) => { return <FeedComponent props={data} status={status} children={children} navigation={navigation} route={route} place={place} setplace={setplacefun} /> }} options={{ withOwnReactions: true }} />
                        </View> :
                        <View style={{ backgroundColor: "#f9f9f9", height: height - 200, width: width }}>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('Camera')}>
                                <View style={{ backgroundColor: '#327FEB', height: 250, width: 250, borderRadius: 10, alignSelf: 'center', marginTop: height / 10, flexDirection: 'column' }}>
                                    <Image source={require('../assets/noposts.gif')} style={{ height: 200, width: 200, alignSelf: 'center', marginTop: 45 }} />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('Camera')}>
                                <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'black', fontFamily: 'NunitoSans-Bold', paddingHorizontal: 50, marginTop: 40, fontSize: 17 }}>Create a post now and share your kid's talents to the community of Genio</Text>
                            </TouchableWithoutFeedback>
                        </View>}

                </StreamApp>
            </ScrollView>
            {/* <BottomSheet
                ref={optionsRef}
                snapPoints={[height * 0.5, 0, -200]}
                initialSnap={2}
                enabledGestureInteraction={true}
                borderRadius={25}
                renderContent={renderOptions}
            /> */}
            <ActionSheet
                useNativeDriver={true}
                ref={refActionSheet}
                styles={{ borderRadius: 10, margin: 10 }}
                options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Choose from Gallery</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Open Camera</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Cancel</Text>]}
                cancelButtonIndex={2}
                onPress={(index) => { index == 0 ? pickImage('gallery') : index == 1 ? pickImage('camera') : null }}
            />
        </View>)
    }
    const notthere = () => {
        return (
            <View style={{ backgroundColor: '#f9f9f9', height: height, width: width }}>
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
    const pickImage = (type) => {
        if (type === 'gallery') {
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                cropperCircleOverlay: true
            }).then(image => {
                const file = {
                    uri: image.path,
                    name: children['0']['id'] + '.png',
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
                        var axios = require('axios');
                        var data = JSON.stringify({ "cid": child.id, "change": "image", "name": child.data.name, "school": child.data.school, "year": child.data.year, "grade": child.data.grade, "acctype": child.data.type, "gsToken": child.data.gsToken });

                        var config = {
                            method: 'post',
                            url: `https://api.genio.app/matrix/update_child/?token=${token}`,
                            headers: {
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
                                                Update({ 'children': response.data })
                                                await AsyncStorage.setItem('children', JSON.stringify(response.data))
                                                setplacefun(String(parseInt(place) + 1))
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
        if (type === 'camera') {
            ImagePicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
                cropperCircleOverlay: true
            }).then(image => {
                const file = {
                    uri: image.path,
                    name: children['0']['id'] + '.png',
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
                        var data = JSON.stringify({ "cid": child.id, "change": "image", "name": child.data.name, "school": child.data.school, "year": child.data.year, "grade": child.data.grade, "acctype": child.data.type, "gsToken": child.data.gsToken });
                        var config = {
                            method: 'post',
                            url: `https://api.genio.app/matrix/update_child/?token=${token}`,
                            headers: {
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
                                                Update({ 'children': response.data })
                                                await AsyncStorage.setItem('children', JSON.stringify(response.data))
                                                setplacefun(String(parseInt(place) + 1))
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
    const loading = () => {
        return (
            <View style={{ backgroundColor: '#f9f9f9', height: height, width: width }}>
                <Image source={require('../assets/loading.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: width / 2 }} />
            </View>
        );
    }
    return (
        <View key={key}>
            <ScreenHeader screen={'Profile'} icon={'settings'} fun={() => navigation.navigate('Settings')} />
            {status == '3' ? there() : notthere()}
        </View>
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
})

export default ProfileScreen;