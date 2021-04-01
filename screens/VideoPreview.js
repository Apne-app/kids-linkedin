/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, BackHandler, Alert, ScrollView } from 'react-native'
import CompHeader from '../Modules/CompHeader'
import FastImage from 'react-native-fast-image';
import { RNS3 } from 'react-native-aws3';
import { SECRET_KEY, ACCESS_KEY } from '@env'
import { Snackbar } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios'
import { useFocusEffect } from "@react-navigation/native";
import VideoPlayer from '../Modules/Video';
import { Video } from 'expo-av';
import { Icon } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const VideoPreview = ({ navigation, route }) => {
    var videoRef = useRef(null)
    var sheetRef = useRef(null)
    const [ShowToast, setShowToast] = useState(false)
    const [loading, setloading] = useState(false)
    const [caption, setcaption] = useState('')
    var children = route.params.children['0']
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert("Hold on!", "Are you sure you want to discard the post?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: "YES", onPress: () => navigation.pop() }
                ]);
                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);

        }, []));
    const PostUpload = async () => {
        setloading(true)
        var name = String(Math.floor(Date.now() / 1000)) + '.mp4'
        var file = {
            // `uri` can also be a file system path (i.e. file://)
            uri: route.params.video,
            name: name,
            type: "video/mp4"
        }
        const options = {
            keyPrefix: children['id'] + "/videos/",
            bucket: "kids-linkedin",
            region: "ap-south-1",
            accessKey: ACCESS_KEY,
            secretKey: SECRET_KEY,
            successActionStatus: 201
        }

        RNS3.put(file, options).then(async response => {
            if (response.status !== 201) {
                alert("Failed to upload video, try again");
                return
            }
            name = "https://d2k1j93fju3qxb.cloudfront.net/" + children['id'] + "/videos/" + name
            axios.post('http://mr_robot.api.genio.app/post', {
                user_id: children['id'],
                acc_type: children['data']['type'],
                user_image: children['data']['image'],
                images: '',
                videos: name,
                youtube: '',
                caption: caption == '' ? 'default123' : caption,
                tags: '',
                user_name: children['data']['name'],
                user_year: parseInt(children['data']['year'])
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then(async (response) => {
                if (response.data.data) {
                    await AsyncStorage.setItem('postid', response.data.data)
                    await AsyncStorage.setItem('newpost', 'true')
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                }
                else {
                    alert('There was an error posting your post, please try again later')
                    navigation.pop();
                }
            }).catch(() => {
                alert('There was an error posting your post, please try again later')
                navigation.pop();
            })

        }).catch(err => {
            console.log(err);
            alert('There was an error posting your post, please try again later')
            navigation.pop();
        })
        return
    }
    const backalert = () => {
        Alert.alert("Hold on!", "Are you sure you want to discard the post?", [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            { text: "YES", onPress: () => navigation.pop() }
        ]);
    }
    return (
        <>
            <CompHeader screen={'Post'} icon={'back'} goback={() => backalert()} />
            <ScrollView style={{backgroundColor:'#efefef'}}>
                <View style={{ flex: 1, opacity: loading ? 0.5 : 1 }}>
                    <View style={{ flexDirection: 'row', margin: 10 }}>
                        <FastImage style={{ width: 60, height: 60, borderRadius: 10000, margin: 10 }} source={{ uri: children['data']['image'] }} />
                        <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: 15, fontFamily: 'NunitoSans-Regular' }}>{children['data']['name'][0].toUpperCase() + children['data']['name'].slice(1)}</Text>
                    </View>
                    <TouchableOpacity
                        style={{ height: 36, display: loading ? 'none' : 'flex', marginTop: -67, marginRight: 20 }}
                        onPress={() => {
                            PostUpload();
                        }}
                    >
                        <View style={{ alignSelf: 'flex-end', backgroundColor: '#327FEB', width: 80, borderRadius: 5, height: 36 }}>
                            <Text style={{ color: "white", alignSelf: 'center', fontSize: 17, fontFamily: 'NunitoSans-Bold', marginTop: 3.4 }}>
                                Post
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <TextInput autoFocus={true} value={caption} onChangeText={(value) => setcaption(value)} numberOfLines={4} multiline={true} placeholder={'What awesome thing did your kid do today?'} style={{ fontFamily: 'NunitoSans-Regular', fontSize: 18, padding: 10, textAlignVertical: 'top', height: 130, marginTop: 40 }} />
                    </View>
                    <VideoPlayer
                        videoProps={{
                            source: { uri: route.params.video },
                            rate: 1.0,
                            volume: 1.0,
                            isMuted: false,
                            videoRef: v => videoRef = v,
                            resizeMode: Video.RESIZE_MODE_CONTAIN,
                            // shouldPlay
                            // usePoster={props.activity.poster?true:false}
                            // posterSource={{uri:'https://pyxis.nymag.com/v1/imgs/e8b/db7/07d07cab5bc2da528611ffb59652bada42-05-interstellar-3.2x.rhorizontal.w700.jpg'}}
                            playInBackground: false,
                            playWhenInactive: false,
                            width: width,
                            height: height * 0.36,

                        }}
                        width={width}
                        height={340}
                        hideControlsTimerDuration={1000}
                        showControlsOnLoad={true}
                        switchToLandscape={() => videoRef.presentFullscreenPlayer()}
                        sliderColor={'#327FEB'}
                        inFullscreen={false}
                    />
                </View>
                <View style={{ backgroundColor: 'white', marginTop: 30, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: height * 0.2 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('TagScreen')} style={{ margin: 22, flexDirection: 'row' }}>
                        {route.params.data ? <>
                            <Icon name="tag" type="SimpleLineIcons" style={{ fontSize: 20,}} />
                            <Image source={{ uri: route.params.data.image }} style={{ width: 40, height: 40, borderRadius: 500 }} />
                            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, color: 'black', marginLeft: 20, marginTop:2 }}>{route.params.data.name[0].toUpperCase() + route.params.data.name.slice(1)}</Text>
                        </> :
                            <><Icon name="user-plus" type="Feather" />
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, color: 'black', marginLeft: 20 }}>Tag Teacher</Text></>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ backgroundColor: '#327FEB', height: 310, borderTopLeftRadius: 20, borderTopRightRadius: 20, display: loading ? 'flex' : 'none' }}>
                <Image style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '20%' }} source={require('../assets/log_loader.gif')} />
                <Text style={{ textAlign: 'center', fontFamily: 'NunitoSans-Bold', fontSize: 20, color: 'white' }}>Posting...</Text>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    Next: {
        alignSelf: 'center',
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#327FEB',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#fff",
        width: 165,
        marginTop: 10,
        flex: 1,
        marginHorizontal: 20
    },
    mediaPlayer: {
        height: 340,
        width: width,
        backgroundColor: "black",
    },
})
export default VideoPreview