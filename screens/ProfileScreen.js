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
updateStyle('activity', {
    container:
    {
        marginVertical: height * 0.01,
        borderRadius: width * 0.05,
        backgroundColor: "#fff",
        fontFamily: 'Poppins-Regular'
    },
    text: {
        fontFamily: 'Poppins-Regular'
    },
    header: {
        fontFamily: 'Poppins-Regular'
    }
});
updateStyle('flatFeed', {
    container:
    {
        backgroundColor: "#f9f9f9",
        paddingRight: width * 0.04,
        paddingLeft: width * 0.04
    }
});


updateStyle('uploadImage', {
    image:
    {
        width: 10,
        height: 10
    }
});

const CustomActivity = (props) => {

    const [commentVisible, setCmv] = React.useState('none');

    return (
        <Activity
            {...props}
            Footer={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LikeButton {...props} />
                    <Icon name="comment" type="EvilIcons" />
                </View>
            }
        />
    );
};

var width = Dimensions.get('screen').width;
const fontConfig = {
    default: {
        regular: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
    },
};
const ProfileScreen = ({ navigation, route }) => {
    const [avatarSource, setavatarSource] = useState('https://randomuser.me/api/portraits/men/11.jpg')
    const options = {
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };
    const [children, setchildren] = useState({})
    const [current, setcurrent] = useState(0)
    const there = () => {
        return (<ScrollView>
            <StreamApp
                apiKey={'dfm952s3p57q'}
                appId={'90935'}
                token={children['0']['data']['gsToken']}
            >
                {/* <Header noShadow style={{ backgroundColor: '#fff', flexDirection: 'row', height: 60, borderBottomWidth: 0, marginBottom: -45 }}>
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={{ fontFamily: 'Poppins-Regular', color: "#000", fontSize: 30, marginTop: 0, marginLeft: -20 }}>Profile</Title>
                    </Body>
                    <Right style={{ marginRight: 30, marginTop: 0 }}>
                        <Icon onPress={() => { navigation.toggleDrawer(); }} name="menu" type="Feather" />
                    </Right>
                </Header> */}
                <View style={{ marginTop: 30, flexDirection: 'row' }}>
                    <Avatar
                        size={96}
                        noShadow
                        editButton
                        onUploadButtonPress={() => pickImage()}
                        styles={{ container: { width: 80, height: 80, borderRadius: 5, margin: 5, marginLeft: 30 } }}
                    />

                    <View style={{ flexDirection: 'column', marginLeft: 30, marginTop: 31 }}>
                        <Text {...console.log(children)} style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20 }}>{children['0']['data']['name']}</Text>
                        {/* <Text style={{ fontFamily: 'Poppins-Regular' }}>Google, India</Text> */}
                        {/* <Text style={{ fontFamily: 'Poppins-Regular' }}>Grade II, DAVPS</Text> */}
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
        </ScrollView>)
    }
    const notthere = () => {
        return (
            <View style={{ backgroundColor: 'white', height: height, width: width }}>
                <Image source={require('../assets/locked.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>You haven't added your child's details yet. Please add to use the social network</Text>
                <View style={{ backgroundColor: 'white' }}>
                    <Button onPress={() => navigation.navigate('Child')} block dark style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 10, height: 50, width: width - 40, alignSelf: 'center', marginHorizontal: 20 }}>
                        <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 2 }}>Add child's details</Text>
                    </Button>
                </View>
            </View>
        )
    }
    useEffect(() => {
        const check = async () => {
            var child = await AsyncStorage.getItem('children')
            if (child != null) {
                child = JSON.parse(child)
                setchildren(child)
            }
        }
        check()
    }, [])
    useEffect(() => {
        const check = async () => {
            var pro = await AsyncStorage.getItem('profile')
            if (pro !== null) {
                pro = JSON.parse(pro)
                axios.get('http://104.199.158.211:5000/getchild/' + pro.email + '/')
                    .then(async (response) => {
                        setchildren(response.data)
                        await AsyncStorage.setItem('children', JSON.stringify(response.data))
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            else {
                // console.log('helo')
            }
        }
        setTimeout(() => {
            check()
        }, 3000);
    }, [])
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
                    name: children['0']['data']['gsToken']+'.jpg',
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
                client.user().update({ profileImage:'https://d5c8j8afeo6fv.cloudfront.net/'+children['0']['data']['gsToken']+'.jpg' });
            }
        });
    }
    return (
        Object.keys(children).length > 0 ? there() : notthere()
    );
};

export default ProfileScreen;