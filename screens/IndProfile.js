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
import { connect } from 'getstream';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const IndProfile = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [result, setresult] = React.useState([]);
    const [follows, setfollows] = React.useState([]);
    const [followPerson, setFollowPerson] = React.useState('Follow')
    const [currentid, setcurrentid] = React.useState('');
    useEffect(() => {
        const addfollows = async () => {
            var children = await AsyncStorage.getItem('children')
            console.log(children)
            children = JSON.parse(children)['0']
            const client = connect('dfm952s3p57q', children['data']['gsToken'], '90935');
            var user = client.feed('timeline', children['id'] + 'id');
            var follows = await user.following()
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
                    name: children['0']['data']['gsToken'] + '.jpg',
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
                const client = connect('dfm952s3p57q', children['0']['data']['gsToken'], '90935');
                client.user().update({ profileImage: 'https://d5c8j8afeo6fv.cloudfront.net/' + children['0']['data']['gsToken'] + '.jpg' });
            }
        });
    }
    return (
        <ScrollView style={{ marginBottom: 80 }}>
            <StreamApp
                apiKey={'dfm952s3p57q'}
                appId={'90935'}
                token={route['params']['data']['gsToken']}
            >
                <View style={{ marginTop: 30, flexDirection: 'row' }}>
                    <Avatar
                        size={96}
                        noShadow
                        editButton
                        onUploadButtonPress={() => pickImage()}
                        styles={{ container: { width: 80, height: 80, borderRadius: 5, margin: 5, marginLeft: 30 } }}
                    />

                    <View style={{ flexDirection: 'column', marginLeft: 30, marginTop: 31 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20 }}>{route['params']['data']['name']}</Text>
                            <TouchableOpacity onPressIn={() => followid(route.params.id)} block dark style={{ backgroundColor: '#91d7ff', height: 25, width: 80, alignSelf: 'center', marginBottom: 20, marginTop: 2, marginHorizontal: 10 }}>
                                <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 12, textAlign: 'center', marginTop: 2 }}>{followPerson}</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontFamily: 'Poppins-Regular', color: 'black', flex: 1 }}>I  am a very good boy. I am not a bad boy.</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', width: width - 40, alignSelf: 'center', height: 200, borderRadius: 10, marginTop: 20, marginBottom: 20, }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                        <View style={{ flexDirection: 'column', marginLeft: 30, marginLeft: 30, marginRight: 30 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, textAlign: 'center' }}>3</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'center', fontSize: 14, }}>Posts</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, textAlign: 'center' }}>20</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'center', fontSize: 14, }}>Followers</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, textAlign: 'center' }}>30</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'center', fontSize: 14, }}>Following</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                        <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, textAlign: 'center' }}>3</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'center', fontSize: 14, }}>Certifications</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 10, marginRight: 10 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, textAlign: 'center' }}>20</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'center', fontSize: 14, }}>Courses completed</Text>
                        </View>

                    </View>
                </View>
                <FlatFeed feedGroup="user" />
            </StreamApp>
        </ScrollView>
    );
};

export default IndProfile;