/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react'
import { Video } from 'expo-av';
import VideoPlayer from 'expo-video-player'
import { Dimensions, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, BackHandler } from 'react-native'
import CompHeader from '../Modules/CompHeader'
import FastImage from 'react-native-fast-image';
import { RNS3 } from 'react-native-aws3';
import { SECRET_KEY, ACCESS_KEY } from '@env'
import { Snackbar } from 'react-native-paper';
import { connect } from 'getstream';
import ImagePicker from 'react-native-image-crop-picker';
import { useFocusEffect } from "@react-navigation/native";
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const VideoPreview = ({ navigation, route }) => {
    var videoRef = useRef(null)
    const [ShowToast, setShowToast] = useState(false)
    const [loading, setloading] = useState(false)
    const [caption, setcaption] = useState('')
    var children = route.params.children['0']
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.pop()
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
            var activity = { "video": name, "object": caption == '' ? 'default123' : caption, "verb": "post", "tag": '' }
            const client = connect('9ecz2uw6ezt9', children['data']['gsToken'], '96078');
            var user = client.feed('user', String(String(children['id']) + String("id")));
            var dat = await user.addActivity(activity);
            setShowToast(true)
            setloading(false)
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })
            console.log(response.body);
        }).catch(err => {
            console.log(err);
        })
        return
    }
    return (
        <>
            <View style={{ flex: 1, opacity: loading ? 0.5 : 1 }}>
                <CompHeader screen={'Create post'} icon={'back'} goback={() => navigation.pop()} />
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <FastImage style={{ width: 60, height: 60, borderRadius: 10000, margin: 10 }} source={{ uri: children['data']['image'] }} />
                    <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: 15, fontFamily: 'NunitoSans-Regular' }}>{children['data']['name'][0].toUpperCase() + children['data']['name'].slice(1)}</Text>
                </View>
                <View>
                    <TextInput autoFocus={true} value={caption} onChangeText={(value) => setcaption(value)} numberOfLines={4} multiline={true} placeholder={'What awesome thing did your kid do today?'} style={{ fontFamily: 'NunitoSans-Regular', fontSize: 18, padding: 10, textAlignVertical: 'top' }} />
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
                        height: 340,

                    }}
                    width={width}
                    height={340}
                    hideControlsTimerDuration={1000}
                    showControlsOnLoad={true}
                    switchToLandscape={() => videoRef.presentFullscreenPlayer()}
                    sliderColor={'#327FEB'}
                    inFullscreen={false}
                />
                <TouchableOpacity
                    style={{ height: 60, display: loading ? 'none' : 'flex', marginTop: 50 }}
                    onPress={() => {
                        PostUpload();
                    }}
                >
                    <View style={styles.Next}>
                        <Text style={{ color: "#fff", flex: 1, textAlign: 'center', fontSize: 17, fontFamily: 'NunitoSans-Bold' }}>
                            Post
                    </Text>
                    </View>
                </TouchableOpacity>
                <Snackbar
                    visible={ShowToast}
                    style={{ marginBottom: height * 0.1 }}
                    duration={1500}
                    onDismiss={() => setShowToast(false)}
                    action={{
                        label: 'Done',
                        onPress: () => {
                            // Do something
                            // navigation.pop();
                        },
                    }}>
                    Posted Successfully!
            </Snackbar>
            </View>
            <View style={{ backgroundColor: '#327FEB', height: 70, borderTopLeftRadius: 10, borderTopRightRadius: 10, display: loading ? 'flex' : 'none' }}>
                <Image style={{ width: 60, height: 60, alignSelf: 'center', marginTop: 10 }} source={require('../assets/log_loader.gif')} />
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
})
export default VideoPreview