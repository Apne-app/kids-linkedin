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
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import LikeButton from '../components/LikeButton'
import FeedComponent from '../Modules/FeedComponent'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { SliderBox } from "react-native-image-slider-box";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import ImagePicker from 'react-native-image-crop-picker';
import { Thumbnail } from 'react-native-thumbnail-video';
import PostLoader from '../Modules/PostLoader'
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const ProfileScreen = ({ navigation, route }) => {
    const children = route.params.children
    const status = route.params.status
    const [place, setplace] = useState(0)
    const [data, setdata] = useState({ 'followers': 0, 'following': 0 })
    const [token, setToken] = useState('');
    const [loading, setloading] = useState(true);
    const [key, setkey] = useState('1')
    const [posts, setposts] = useState([])
    const { Update } = React.useContext(AuthContext);
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
                'user_id': children[0]['id']
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setposts(response['data']['data'])
                axios.post('http://mr_robot.api.genio.app/follow_count', {
                    'user_id': children[0]['id']
                }, {
                    headers: {
                        'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    setdata(response['data']['data'])
                    setloading(false)
                }).catch((error) => {
                    console.log(error)
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [])
    const there = () => {
        return (<View key={place} style={{ backgroundColor: "#f9f9f9" }}>
            <ScrollView style={{ backgroundColor: "#f9f9f9" }} >
                <View style={{ marginTop: 30, flexDirection: 'row', backgroundColor: "#f9f9f9" }}>
                    <TouchableOpacity onPress={() => refActionSheet.current.show()} style={{ flexDirection: 'row' }}>
                        <FastImage
                            source={{
                                uri: children[0]['data']['image-profile'] ? children[0]['data']['image-profile'] : children[0]['data']['image'],
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
                <View style={{ backgroundColor: 'white', width: width - 40, alignSelf: 'center', height: 100, borderRadius: 10, marginTop: 20, marginBottom: 20, }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                        <View style={{ flexDirection: 'column', marginLeft: 30, marginLeft: 30, marginRight: 30 }}>
                            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{posts.length}</Text>
                            <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Posts</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{data.followers}</Text>
                            <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Followers</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{data.following}</Text>
                            <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Following</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginBottom: 200, backgroundColor: "#f9f9f9", marginTop: 20 }}>
                    {loading ? <PostLoader /> : <FlatList
                        data={posts}
                        renderItem={(item) => { return (<FeedComponent status={status} children={children} navigation={navigation} item={item} />) }}
                        keyExtractor={item => item['data']['post_id']}
                        ListEmptyComponent={() => {
                            return (
                                <View style={{ backgroundColor: "#f9f9f9", height: height - 200, width: width }}>
                                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Camera')}>
                                        <View style={{ backgroundColor: '#327FEB', height: 250, width: 250, borderRadius: 10, alignSelf: 'center', marginTop: height / 10, flexDirection: 'column' }}>
                                            <Image source={require('../assets/noposts.gif')} style={{ height: 200, width: 200, alignSelf: 'center', marginTop: 45 }} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Camera')}>
                                        <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'black', fontFamily: 'NunitoSans-Bold', paddingHorizontal: 50, marginTop: 40, fontSize: 17 }}>Create a post now and share your kid's talents to the community of Genio</Text>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        }
                        }
                    />}
                </View>

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
                function makeid(length) {
                    var result           = '';
                    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var charactersLength = characters.length;
                    for ( var i = 0; i < length; i++ ) {
                       result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                 }
                 var name = children['0']['id']+'/' + makeid(6) + '.jpg'
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
                        var data = JSON.stringify({ "user_id": child.id, "change": "image", "name": '', "image":'https://d5c8j8afeo6fv.cloudfront.net/'+name });

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
                                                if (!source.includes(response.data[0]['id'])) {
                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [{ name: 'Home' }],
                                                    });
                                                }
                                                await AsyncStorage.setItem('children', JSON.stringify(response.data))
                                                resp[0]['data']['image'] = 'https://d5c8j8afeo6fv.cloudfront.net/'+name
                                                Update({ 'children': resp })
                                                setplace(String(parseInt(place) + 1))
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
                                                if (!source.includes(response.data[0]['id'])) {
                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [{ name: 'Home' }],
                                                    });
                                                }
                                                var resp = response.data
                                                await AsyncStorage.setItem('children', JSON.stringify(response.data))
                                                resp[0]['data']['image'] = 'https://d5c8j8afeo6fv.cloudfront.net/' + response.data[0]['id'] + '.png'
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