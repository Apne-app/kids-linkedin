/* eslint-disable */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, TouchableOpacity, Alert, Image, Share, Linking, TouchableHighlight, ImageStore, StatusBar, KeyboardAvoidingView, ScrollView, Keyboard, TextInput, Button } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet'
import ImageView from 'react-native-image-viewing';
import { useFocusEffect } from "@react-navigation/native";
import ImageViewer from 'react-native-image-zoom-viewer';
import { SliderBox } from "react-native-image-slider-box";
import YoutubePlayer from "react-native-youtube-iframe";
import BottomSheet from 'reanimated-bottom-sheet';
import CompHeader from '../Modules/CompHeader'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import AsyncStorage from '@react-native-community/async-storage'
import CompButton from '../Modules/CompButton'
import WebView from 'react-native-webview';
import { getUniqueId } from 'react-native-device-info';
import analytics from '@segment/analytics-react-native';
import FeedComponent from '../Modules/FeedComponent'
import FastImage from 'react-native-fast-image'
import axios from 'axios';
import { Video } from 'expo-av'
import KeyboardStickyView from 'rn-keyboard-sticky-view';
import PostLoader from '../Modules/PostLoader';
import VideoPlayer from '../Modules/Video'
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
function urlify(text) {
    var urlRegex = (/(https?:\/\/[^\s]+)/g);
    var res = text.match(urlRegex);
    return res
}

const SinglePostScreen = ({ navigation, route }) => {
    var videoRef = React.createRef();
    const [activity, setactivity] = useState()
    const [key, setkey] = useState('0')
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
    const keyboardDidShowListener = React.useRef();
    const scrollref = React.useRef();
    const keyboardDidHideListener = React.useRef();
    const [comments, setcomments] = useState([])
    const [loader, setloader] = useState(true)
    const [comment, setcomment] = useState('')
    const [loading, setloading] = useState(1)
    const [autofocus, setautofocus] = useState(false)
    const [place, setplace] = useState('1')
    const status = route.params.status
    const children = route.params.children
    var d = new Date();
    useEffect(() => {
        console.log(route.params.id)
        var data = JSON.stringify({
            post_id: route.params.id,
            user_id: status === '3' ? children[0]['id'] : null
        })
        var config = {
            method: 'post',
            url: 'http://mr_robot.api.genio.app/getpost',
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config).then((response) => {
            setactivity(response.data.data[0]['data'])
            setloading(response.data.data[0]['data']['comments_count'])
            setloader(false)
        }).catch((response) => {
            console.log(response)
        })
    }, [])
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
    useEffect(() => {
        axios.post('http://mr_robot.api.genio.app/getcomments', {
            post_id: route.params.id
        }, {
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            setcomments(response['data']['data'])
            setloading(0)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    const onShare = async (message) => {
        try {
            const result = await Share.share({
                message:
                    message,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    var year = parseInt(d.getFullYear());
    const addorunlike = () => {
        if (status === '3') {
            var data = activity
            if (data['likes_user_id'] == children[0]['id']) {
                data['likes_user_id'] = null
                data['likes_count'] = data['likes_count'] - 1
                setactivity(data)
                setkey(String(parseInt(key) + 1))
                route.params.setparentkey ? route.params.setparentkey() : null
                axios.post('http://mr_robot.api.genio.app/like', {
                    post_id: data['post_id'],
                    user_id: children[0]['id'],
                    user_name: children[0]['data']['name'],
                    user_image: children[0]['data']['image'],
                    response: 'unlike',
                }, {
                    headers: {
                        'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {

                }).catch((error) => {

                })
            }
            else {
                data['likes_user_id'] = children[0]['id']
                data['likes_count'] = data['likes_count'] + 1
                setactivity(data)
                setkey(String(parseInt(key) + 1))
                route.params.setparentkey ? route.params.setparentkey() : null
                axios.post('http://mr_robot.api.genio.app/like', {
                    post_id: data['post_id'],
                    user_id: children[0]['id'],
                    user_name: children[0]['data']['name'],
                    user_image: children[0]['data']['image'],
                    response: 'like',
                }, {
                    headers: {
                        'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    analytics.track('Like', {
                        userID: children["0"]["id"],
                        deviceID: getUniqueId(),
                        by: children["0"]["id"],
                        byname: children["0"]['data']["name"],
                        byimage: children["0"]['data']["image"],
                        to: activity['user_id'],
                        actid: activity['post_id']
                    })
                }).catch((error) => {

                })
            }
        } else {
            navigation.navigate('Login', { 'screen': 'Feed', 'type': 'feed_like' })
        }
    }
    var options = [<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>]
    if (children && activity) {
        if (activity['user_id'] == children['0']['id']) {
            options.push(<Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Delete Post</Text>)
        }
        else {
            options.push(<Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>)
        }
    }
    else {
        options.push(<Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>)
    }
    options.push(<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>)
    const CustomActivity = ({ props }) => {
        const refActionSheet = useRef(null);
        const showActionSheet = () => {
            refActionSheet.current.show()
        }
        const oncommentclick = () => {
            if (status != '3') {
                navigation.navigate('Login', { screen: 'Feed', type: 'feed_comment' })
            }
        }
        const Footer = (id, data) => {
            return (<View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -12 }}>
                    <TouchableWithoutFeedback onPressIn={() => { addorunlike() }}>
                        <FastImage style={{ width: 32, height: 32, marginLeft: 10, marginRight: 0, marginTop: -1 }} source={activity['likes_user_id'] ? require('../Icons/star.png') : require('../Icons/star-outline.png')} />
                    </TouchableWithoutFeedback>
                    <Icon onPress={() => { setautofocus(true); setkey(String(parseInt(key) + 1)); oncommentclick() }} name="message-circle" type="Feather" style={{ fontSize: 28, marginLeft: 10, marginRight: 5 }} />
                    <Icon onPress={() => onShare('Hey! Check out this post by ' + activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1) + ' on the new Genio app: https://genio.app/post/' + activity['post_id'])} name="share-outline" type='MaterialCommunityIcons' style={{ fontSize: 28, marginLeft: 8, marginRight: -10, marginTop: -3 }} />
                    <TouchableOpacity style={{ width: 50, marginLeft: '58%', alignItems: 'center' }}
                        onPress={async () => {
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('WhatsappShare', {
                                userID: x ? JSON.parse(x)["0"]["id"] : null,
                                deviceID: getUniqueId()
                            });
                            Linking.openURL('whatsapp://send?text=Hey! Check out this post by ' + activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1) + ' on the new Genio app: https://genio.app/post/' + activity['post_id']).then((data) => {
                            }).catch((error) => {
                                alert('Please make sure Whatsapp is installed on your device');
                            });
                        }}
                    >
                        <Icon name="whatsapp" type="Fontisto" style={{ fontSize: 28, color: '#4FCE5D' }} />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1, width: width, backgroundColor: 'grey', opacity: 0.1, marginTop: 9, }} />
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <Text onPress={() => navigation.navigate('LikesList', { 'post_id': activity['post_id'] })} style={{ fontFamily: 'NunitoSans-SemiBold', marginLeft: 15, fontSize: 14, marginBottom: 2, marginRight: 8 }}>{activity['likes_count']} likes</Text>
                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', marginLeft: 7, fontSize: 14, marginBottom: 2 }}>{activity['comments_count']} comments</Text>
                </View>
                <View style={{ height: 1, width: width, backgroundColor: 'grey', opacity: 0.1, marginTop: 8, marginBottom: 5 }} />

                {loading ? <Image source={require('../assets/loading.gif')} style={{ width: 40, height: 40, marginLeft: 10 }} />
                    : comments.map((item) => {
                        return (
                            <View key={item['id']} style={{ flexDirection: 'row', padding: 10 }}>
                                <FastImage source={{ uri: item['data']['comments_user_image'] }} style={{ width: 25, height: 25, borderRadius: 10000 }} />
                                <Text style={{ fontSize: 13, color: 'black', paddingLeft: 10, fontFamily: 'NunitoSans-Regular' }}>
                                    {item['data']['comment']}
                                </Text>
                            </View>
                        )
                    })}
            </View>)
        }
        const deletepost = () => {
            Alert.alert("Alert", "Are you sure you want to delete the post? The action cannot be reversed", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "YES", onPress: () => {
                        axios.post('http://mr_robot.api.genio.app/delpost', {
                            post_id: activity['post_id'],
                        }, {
                            headers: {
                                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                                'Content-Type': 'application/json'
                            }
                        }).then((response) => {
                            if (response.data) {
                                alert('Successfully deleted your post!')
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Home' }],
                                })
                            }
                            else {
                                alert(
                                    "There was an error deleting your post, please try again later."
                                )
                            }
                        }).catch(() => {
                            alert(
                                "There was an error deleting your post, please try again later."
                            )
                        })
                    }
                }
            ]);
        }
        const report = async () => {
            if (children) {
                console.log(activity['user_id'] == children['0']['id'])
                if (activity['user_id'] == children['0']['id']) {
                    deletepost()
                }
                else {
                    var y = await AsyncStorage.getItem('children');
                    var q = await AsyncStorage.getItem('profile');
                    if (q) {
                        q = JSON.parse(q)
                    }
                    analytics.track('Post Reported', {
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
                                alert('Succesfully reported post');
                            }
                            console.log(response.data)
                        })
                        .catch(function (error) {
                            alert(error);
                            // setLoading(false)
                        });
                }
            }
            else {
                var y = await AsyncStorage.getItem('children');
                var q = await AsyncStorage.getItem('profile');
                if (q) {
                    q = JSON.parse(q)
                }
                analytics.track('Post Reported', {
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
                            alert('Succesfully reported post');
                        }
                        console.log(response.data)
                    })
                    .catch(function (error) {
                        alert(error);
                        // setLoading(false)
                    });
            }

        }
        const [visible, setIsVisible] = React.useState(false);
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var class_date = activity['class_date'] ? new Date(activity['class_date'].split('T')[0].split("-").reverse().join("-")) : ''
        const Content = React.memo(() => (
            <View key={'content'} style={{ paddingVertical: 20 }}>
                {activity['class_time'] ?
                    <View style={{ marginRight: 8, marginLeft: 14, marginBottom: 10 }}>
                        <Text style={{ fontFamily: 'NunitoSans-Regular' }}>
                            Class on <Text style={{ color: '#327FEb', fontFamily: 'NunitoSans-Bold' }}>{activity['class_category']}</Text>
                        </Text>
                    </View> : null}
                {activity['caption'] === 'default123' ?
                    <View style={{ margin: 5 }}></View> :
                    <View style={{ marginRight: 8, marginLeft: 14, marginBottom: 10 }}>
                        <Text style={{ fontFamily: 'NunitoSans-Regular' }}>
                            {activity['caption'] === 'default123' ? '' : activity['caption']}
                        </Text>
                    </View>}
                {class_date ?
                    <View style={{ marginRight: 8, marginLeft: 14, marginBottom: 10 }}>
                        <Text style={{ fontFamily: 'NunitoSans-Regular', color: '#327FEB' }}>
                            Timings: {String(class_date.getDate()) + ' ' + monthNames[class_date.getMonth()] + ' ' + String(class_date.getFullYear()) + '@' + activity['class_time'].split('T')[1].split('.')[0].slice(0, 5)}
                        </Text>
                    </View> : null}
                {activity['link'] ? <Text onPress={() => { navigation.navigate('Browser', { 'url': activity['link'] }) }} style={{ fontFamily: 'NunitoSans-SemiBold', paddingHorizontal: 10, marginLeft: 5, marginTop: 0, marginBottom: 10, color: '#327FEB' }}>{'Click here to follow the link'}</Text> : null}
                {activity['mention_id'] ? <Text onPress={() => navigation.navigate('IndProf', { data: { 'image': activity['mention_image'], 'name': activity['mention_name'], 'year': activity['mention_year'], 'type': activity['mention_type'] }, 'id': activity['mention_id'].replace('id', '') })} style={{ fontFamily: 'NunitoSans-Bold', paddingHorizontal: 10, marginVertical: 1, fontSize: 16, color: '#327FEB' }}>{'@' + activity['mention_name'].charAt(0).toUpperCase() + activity['mention_name'].slice(1)}</Text> : null}
                {activity['images'] ?
                    <ImageView
                        key={'2'}
                        presentationStyle={{ height: height / 3 }}
                        images={images}
                        imageIndex={0}
                        visible={visible}
                        doubleTapToZoomEnabled={true}
                        swipeToCloseEnabled={true}
                        animationType={'fade'}
                        animationType={'none'}
                        onRequestClose={() => setIsVisible(false)}
                    /> : <View></View>}
                <TouchableWithoutFeedback onPress={() => setIsVisible(true)} style={{ alignSelf: 'center' }}>
                    {activity['images'] ? activity['images'].split(", ").length - 1 == 1 ? <FastImage
                        source={{
                            uri: activity['images'].split(", ")[0],
                            priority: FastImage.priority.high
                        }}
                        style={{ width: width, height: 340, marginTop: 20 }}
                    /> : <View style={{ height: 340 }}><SliderBox
                        images={activity['images'].split(", ").filter(n => n)}
                        dotColor="#FFEE58"
                        inactiveDotColor="#90A4AE"
                        paginationBoxVerticalPadding={20}
                        sliderBoxHeight={340}
                        ImageComponentStyle={{ width: width, height: 340, }}
                        circleLoop={true}
                    /></View> : <View></View>}
                </TouchableWithoutFeedback>
                {activity['caption'].includes('http') ?
                    <LinkPreview touchableWithoutFeedbackProps={{ onPress: () => { navigation.navigate('Browser', { 'url': urlify(activity['caption'])[0] }) } }} renderTitle={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 12 }}>{text}</Text>} text={activity['caption']} containerStyle={{ backgroundColor: '#efefef', borderRadius: 0, marginTop: 40, width: width, alignSelf: 'center' }} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 100) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                    : null}
                <View style={{ marginTop: 13 }}>
                    {activity['videos'] ?
                        <Video
                            source={{ uri: activity['videos'] }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="contain"
                            shouldPlay
                            // usePoster={props.activity.poster?true:false}
                            // posterSource={{uri:'https://pyxis.nymag.com/v1/imgs/e8b/db7/07d07cab5bc2da528611ffb59652bada42-05-interstellar-3.2x.rhorizontal.w700.jpg'}}
                            ref={videoRef}
                            useNativeControls={true}
                            playInBackground={false}
                            playWhenInactive={false}
                            style={{ width: width, height: 340, backgroundColor: 'black' }}
                        /> : null}
                    {activity['youtube'] ?
                        <YoutubePlayer
                            videoId={activity['youtube']} // The YouTube video ID
                            height={250}
                            width={width}
                            forceAndroidAutoplay={true}
                            play={true}
                        />
                        : null}
                </View>
                {activity['tags'] === 'Genio' || activity['tags'] === 'Other' || activity['tags'] === '' ? null : <View style={{/* backgroundColor: '#327FEB', borderRadius: 0, width: 90, padding: 9,*/ marginTop: 5, marginLeft: 17 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: '#327feb', fontSize: 15, alignSelf: 'flex-start' }}>#{activity['tags']}</Text></View>}
            </View>))
        var images = []

        activity['images'] ? activity['images'].split(', ').map((item) => item != '' ? images.push({ uri: item }) : null) : null
        return (
            <View style={{ marginTop: 20, marginBottom: 100 }} ref={scrollref}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableWithoutFeedback onPress={() => { children ? (children[0]['id'] === activity['user_id'] ? navigation.navigate('Profile') : navigation.push('IndProf', { data: { 'image': activity['user_image'], 'name': activity['user_name'], 'year': activity['user_year'], 'type': activity['acc_type'] }, 'id': activity['user_id'].replace('id', '') })) : navigation.push('IndProf', { data: { 'image': activity['user_image'], 'name': activity['user_name'], 'year': activity['user_year'], 'type': activity['acc_type'] }, 'id': activity['user_id'].replace('id', '') }) }}>
                            <FastImage
                                source={{
                                    uri: activity['user_image'],
                                    priority: FastImage.priority.high
                                }}
                                style={{ width: 60, height: 60, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                            />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { children ? (children[0]['id'] === activity['user_id'] ? navigation.navigate('Profile') : navigation.push('IndProf', { data: { 'image': activity['user_image'], 'name': activity['user_name'], 'year': activity['user_year'], 'type': activity['acc_type'] }, 'id': activity['user_id'].replace('id', '') })) : navigation.push('IndProf', { data: { 'image': activity['user_image'], 'name': activity['user_name'], 'year': activity['user_year'], 'type': activity['acc_type'] }, 'id': activity['user_id'].replace('id', '') }) }}>
                            <View style={{ flexDirection: 'column', marginLeft: 5, width: width - 150 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1)}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB' }}>{activity['acc_type'] == 'Kid' ? String(year - parseInt(activity['user_year'])) + ' years old (Managed by parents)' : activity['acc_type']}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <ActionSheet
                            useNativeDriver={true}
                            ref={refActionSheet}
                            styles={{ borderRadius: 0, margin: 10 }}
                            options={options}
                            cancelButtonIndex={2}
                            onPress={(index) => { index == 1 ? report() : index == 0 ? onShare('Hey! Check out this post by ' + activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1) + ' on the new Genio app: https://genio.app/post/' + activity['post_id']) : null }}
                        />
                        <Right><TouchableOpacity style={{ width: 60, alignItems: 'center', padding: 12 }} onPress={() => { showActionSheet(); }} ><Icon name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 16, color: '#383838' }} /></TouchableOpacity></Right>
                    </View>
                </View>
                <Content />
                <Footer />
            </View>
        );
    };
    const addcomment = () => {
        if (comment) {
            var data = activity
            var comm = comment
            setcomment('')
            data['comments_count'] = data['comments_count'] + 1
            setactivity(data)
            setcomments([...comments, { 'data': { 'comments_user_image': children[0]['data']['image'], comment: comm }, 'id': key }])
            setkey(String(parseInt(key) + 1))
            route.params.setparentkey ? route.params.setparentkey() : null
            axios.post('http://mr_robot.api.genio.app/comment', {
                post_id: data['post_id'],
                user_id: children[0]['id'],
                user_name: children[0]['data']['name'],
                user_image: children[0]['data']['image'],
                comment: comm,
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                console.log(response)
                analytics.track('Comment', {
                    userID: children[0]['id'],
                    deviceID: getUniqueId(),
                    by: children[0]['id'],
                    byname: children[0]['data']['name'],
                    byimage: children[0]['data']['image'],
                    to: activity['user_id'],
                    actid: activity['post_id'],
                    comment: comm
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    }
    const there = () => {
        return (<View key={key} style={styles.container}>
            <CompHeader style={{ position: 'absolute' }} screen={'Post'} icon={'back'} goback={() => navigation.pop()} />
            <ScrollView>
                <CustomActivity />
            </ScrollView>
            {status === '3' ? 0 ? <CompButton message={'You have been temporarily banned from commenting'} back={'Home'} /> :
                <KeyboardStickyView style={styles.textInputView}>
                    <FastImage
                        source={{
                            uri: children[0]['data']['image'],
                            cache: FastImage.cacheControl.web
                        }}
                        style={{ width: 40, height: 40, borderRadius: 306, marginLeft: 2, }}
                    />
                    <TextInput
                        value={comment}
                        autoFocus={autofocus}
                        onChangeText={setcomment}
                        onSubmitEditing={() => addcomment()}
                        placeholder="Add a comment..."
                        style={styles.textInput}
                        enablesReturnKeyAutomatically={true}
                    />
                    {comment ? <Icon onPress={() => addcomment()} type="MaterialIcons" name="send" style={{ color: '#327FEB' }} /> : null}
                </KeyboardStickyView> :
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Feed', type: 'feed_comment' })}><CompButton message={'Signup/Login to add comments for this post'} back={'Home'} /></TouchableWithoutFeedback>}
        </View>)
    }
    const notthere = () => {
        return (
            <View key={key} style={styles.container}>
                <CompHeader style={{ position: 'absolute' }} screen={'Post'} icon={'back'} goback={() => navigation.pop()} />
                <PostLoader />
            </View>
        )
    }
    return (
        loader ? notthere() : there()
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    textInputView: {
        padding: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: 'white',
        elevation: 20
    },
    textInput: {
        flexGrow: 1,
        padding: 10,
        width: width - 200,
        fontSize: 16,
        marginRight: 20,
        textAlignVertical: "top",
        fontFamily: 'NunitoSans-Regular'
    },
    textInputButton: {
        flexShrink: 1,
    },
    mediaPlayer: {
        height: 340,
        width: width,
        backgroundColor: "black",
    },
});
export default SinglePostScreen