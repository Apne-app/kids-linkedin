/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useState } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, FlatList, PixelRatio } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right, Left } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, ReplyIcon, Avatar } from 'react-native-activity-feed';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
import { connect } from 'getstream';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const client = connect('dfm952s3p57q', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDlpZCJ9.A89Wjxxk_7hVBFyoSREkPhLCHsYY6Vq66MrBuOTm_mQ', '90935');
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

    const pickImage = () => {
        async function upload(uri) {
            const check = await client.images.upload(uri);
            console.log(check);
        }
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
                // profileImage: 'https://randomuser.me/api/portraits/men/11.jpg'
                client.user('49id').update({ name: 'Bhargava Macha', profileImage: 'https://randomuser.me/api/portraits/men/11.jpg' });
                setavatarSource(response.uri);
            }
        });
    }
    return (
        <ScrollView>
            <StreamApp
                apiKey={'dfm952s3p57q'}
                appId={'90935'}
                token={'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDlpZCJ9.A89Wjxxk_7hVBFyoSREkPhLCHsYY6Vq66MrBuOTm_mQ'}
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
                        source={avatarSource}
                        size={96}
                        noShadow
                        editButton
                        onUploadButtonPress={() => pickImage()}
                        styles={{ container: { width: 80, height: 80, borderRadius: 5, margin: 5, marginLeft: 30 } }}
                    />

                    <View style={{ flexDirection: 'column', marginLeft: 30, marginTop: 10 }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20 }}>Manoj Kumar</Text>
                        {/* <Text style={{ fontFamily: 'Poppins-Regular' }}>Google, India</Text> */}
                        <Text style={{ fontFamily: 'Poppins-Regular' }}>Grade II, DAVPS</Text>
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

export default ProfileScreen;