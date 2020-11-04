/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, FlatList, PixelRatio } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right, Left } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, ReplyIcon, Avatar } from 'react-native-activity-feed';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { SECRET_KEY, ACCESS_KEY } from '@env';
import { RNS3 } from 'react-native-aws3';
import BottomSheet from 'reanimated-bottom-sheet';
import { connect } from 'getstream';
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
    const [data, setdata] = useState({ 'followers': [], 'following': [] })
    const optionsRef = React.useRef(null);
    useEffect(() => {
        // console.log(route.params)
        const addfollows = async () => {
            var children = await AsyncStorage.getItem('children')
            console.log(children)
            children = JSON.parse(children)['0']
            const client = connect('dfm952s3p57q', children['data']['gsToken'], '90935');
            var user = client.feed('timeline', children['id'] + 'id');
            var follows = await user.following()
            // var profile = client.feed('user', route['params']['id']+'id');
            // var profFollow = await profile.followers();
            // var profFollowing = await profile.followers();
            // console.log("asdaaaa",profile)
            // setdata({ 'followers': profFollow['results'], 'following': profFollowing['results'] });
            var data = []
            follows['results'].map(item => {
                data.push(item['target_id'].replace('user:', '').replace('id', ''))
            })
            setfollows(data)
            data.includes(String(route.params.id)) ? setFollowPerson('Following') : null;
        }
        addfollows()
    }, [])

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
        addCerti();
    }, [])

    useEffect(() => {
        const addfollows = async () => {
            var children = await AsyncStorage.getItem('children')
            console.log(children)
            children = JSON.parse(children)['0']
            setcurrentid(children['id'])
        }
        addfollows()
    }, [])
    const followid = (id) => {
        // console.log("asd");
        if (followPerson == 'Follow') {
            console.log('http://104.199.158.211:5000/follow/' + currentid + '/' + id)
            axios.get('http://104.199.158.211:5000/follow/' + currentid + '/' + id)
                .then(async (response) => {
                    if (response.data == 'success') {
                        var place = follows;
                        place.push(String(id));
                        setfollows(place)
                        setFollowPerson('Following');
                    }
                })
        }
        else {
            axios.get('http://104.199.158.211:5000/unfollow/' + currentid + '/' + id)
                .then(async (response) => {
                    if (response.data == 'success') {
                        var place = follows;
                        const index = place.indexOf(id);
                        if (index > -1) {
                            place.splice(index, 1);
                        }
                        setfollows(place)
                        setFollowPerson('Follow');
                    }
                })
        }

    }
    const [source, setsource] = useState('https://d5c8j8afeo6fv.cloudfront.net/profile.png')
    const pickImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // upload(response.uri);
                const file = {
                    // `uri` can also be a file system path (i.e. file://)
                    uri: response.uri,
                    name: route['params']['data']['gsToken'] + '.jpg',
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
                    console.log("dassd")
                    if (response.status !== 201)
                        throw new Error("Failed to upload image to S3");

                })
                const client = connect('dfm952s3p57q', route['params']['data']['gsToken'], '90935');
                client.user().update({ profileImage: 'https://d5c8j8afeo6fv.cloudfront.net/' + route['params']['data']['gsToken'] + '.jpg' });
            }
        });
    }
    return (
        <View>
            <ScrollView style={{ backgroundColor: "#f9f9f9" }} >
                <Header noShadow style={{ backgroundColor: '#fff', flexDirection: 'row', height: 60, borderBottomWidth: 0, marginTop:10, marginBottom:10 }}>
                    <Body style={{ alignItems: 'center', flexDirection:'row' }}>
                        <Icon type="Feather" name="arrow-left" onPress={() => navigation.navigate('Searching')} />
                        <Title style={{ fontFamily: 'NunitoSans-Regular', color: "#000", fontSize: 30, marginTop: 0, marginLeft: 20}}>Profile</Title>
                    </Body>
                    <Right style={{ marginRight: 25, marginTop: 0 }}>
                        <Icon onPress={() => {}} style={{ color: "#000", fontSize: 25 }} type="Feather" name="more-vertical" />
                    </Right>
                </Header>
                <StreamApp
                    apiKey={'dfm952s3p57q'}
                    appId={'90935'}
                    token={route['params']['data']['gsToken']}
                >
                    <View style={{ marginTop: 30, flexDirection: 'row' }}>
                        <TouchableOpacity style={{ flexDirection: 'row' }}>
                            <Image
                                onLoad={() => setsource('https://d5c8j8afeo6fv.cloudfront.net/' + route['params']['data']['gsToken'] + '.png')}
                                source={{ uri: source }}
                                style={{ width: 80, height: 80, borderRadius: 306, marginLeft: 30 }}
                            />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 10, flexWrap: 'wrap' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20 }}>{route['params']['data']['name'][0].toUpperCase() + route['params']['data']['name'].substring(1)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: '#327FEB', color: 'white', width: 50, textAlign: 'center', borderRadius: 10 }}>{'Kid'}</Text>
                            </View>
                            <TouchableOpacity onPressIn={() => followid(route.params.id)} block dark style={{ backgroundColor: '#91d7ff', height: 25, width: 80, alignSelf: 'center', marginBottom: 20, marginTop: 2, borderRadius:10, marginLeft:-20 }}>
                                <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 12, textAlign: 'center', marginTop: 2 }}>{followPerson}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', width: width - 40, alignSelf: 'center', height: 200, borderRadius: 10, marginTop: 20, marginBottom: 20, }}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
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
                    </View>
                    <FlatFeed feedGroup="user" />
                </StreamApp>
            </ScrollView>
        </View>
    );
};

export default IndProfile;