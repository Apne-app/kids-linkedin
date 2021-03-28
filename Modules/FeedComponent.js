/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, TouchableOpacity, BackHandler, Alert, Image, Share, Linking, ScrollView, TouchableHighlight, ImageStore, StatusBar, RefreshControl } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LikeButton from '../components/LikeButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from './react-native-thumbnail-video';
import axios from 'axios';
import { useFocusEffect } from "@react-navigation/native";
import SmartImage from './SmartImage';
import BottomSheet from 'reanimated-bottom-sheet';
import { SliderBox } from "react-native-image-slider-box";
import { Snackbar } from 'react-native-paper';
import analytics from '@segment/analytics-react-native';
import { getUniqueId } from 'react-native-device-info';
import { Chip } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker'
import YoutubePlayer from "react-native-youtube-iframe";
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import VideoPlayer from './Video';
import PostLoader from '../Modules/PostLoader';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const FeedComponent = ({ props, status, children, navigation, item }) => {
    const refActionSheet = useRef(null);
    const [activity, setactivity] = useState(item['item']['data'])
    const [key, setkey] = useState('0')
    const showActionSheet = () => {
        refActionSheet.current.show()
    }

    const deletepost = (id1) => {
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
                    }).then(() => {
                        if (response == 'true') {
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
                deletepost(props.activity.id)
                return
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
    const onShare = async (message) => {
        var x = await AsyncStorage.getItem('children');
        analytics.track('SharePost', {
            userID: x ? JSON.parse(x)["0"]["id"] : null,
            deviceID: getUniqueId()
        })
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
    var d = new Date();
    var year = parseInt(d.getFullYear());
    var images = []
    var options = [<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>]
    if (children) {
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
    const addorunlike = () => {
        if (status === '3') {
            var data = activity
            if (data['likes_user_id'] == children[0]['id']) {
                data['likes_user_id'] = null
                data['likes_count'] = data['likes_count'] - 1
                setactivity(data)
                setkey(String(parseInt(key) + 1))
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
    const setparentkey = () => {
        setkey(String(parseInt(key) + 1))
    }
    return (
        <View key={key} style={{ marginVertical: 9 }}>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={() => { children[0]['id'] === activity['user_id'] ? navigation.navigate('Profile') : navigation.navigate('IndProf', { data: { 'image': activity['user_image'], 'name': activity['user_name'], 'year': activity['user_year'], 'type': activity['user_type'] }, 'id': activity['user_id'].replace('id', '') }) }}>
                        <FastImage
                            source={{
                                uri: item['item']['data']['user_image'],
                                priority: FastImage.priority.high,
                            }}
                            style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                        />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { children[0]['id'] === activity['user_id'] ? navigation.navigate('Profile') : navigation.navigate('IndProf', { data: { 'image': activity['user_image'], 'name': activity['user_name'], 'year': activity['user_year'], 'type': activity['user_type'] }, 'id': activity['user_id'].replace('id', '') }) }}>
                        <View style={{ flexDirection: 'column', marginLeft: 5, width: width - 150 }}>
                            <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1)}</Text>
                            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'left' }}>{activity['acc_type'] == 'Kid' ? String(year - parseInt(activity['user_year'])) + ' years old (Managed by parents)' : activity['acc_type']}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <ActionSheet
                        useNativeDriver={true}
                        ref={refActionSheet}
                        styles={{ borderRadius: 0, margin: 10 }}
                        options={options}
                        cancelButtonIndex={2}
                        onPress={(index) => { index == 1 ? report(activity) : index == 0 ? onShare('Hey! Check out this post by ' + activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1) + ' on the new Genio app: https://genio.app/post/' + activity['post_id']) : null }}
                    />
                    <Right><TouchableOpacity style={{ width: 70, alignItems: 'center', padding: 12 }} onPress={() => { showActionSheet(); }}><Icon name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 20, marginRight: -10, color: '#383838' }} /></TouchableOpacity></Right>
                </View>
                {/* <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>*/}
            </View>
            {activity['caption'] === 'default123' ?
                <View style={{ margin: 5 }}></View> :
                <View style={{ paddingHorizontal: 10, marginLeft: 13, marginVertical: 15 }}>
                    <Text style={{ fontFamily: 'NunitoSans-Regular' }}>
                        {activity['caption'] === 'default123' ? '' : activity['caption'].length > 100 ? (activity['caption'].slice(0, 100) + '...') : activity['caption']}
                    </Text>
                </View>}
            {activity['link'] ? <Text onPress={() => { navigation.navigate('Browser', { 'url': activity['link'] }) }} style={{ fontFamily: 'NunitoSans-SemiBold', paddingHorizontal: 10, marginLeft: 14, marginTop: 0, marginBottom: 10, color: '#327FEB' }}>{'Click here to follow the link'}</Text> : null}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('SinglePost', { setparentkey: setparentkey, image: status === '3' ? children['0']['data']['image'] : '', activity: activity })}>
                <View style={{ alignSelf: 'center' }}>
                    {activity['images'] ? activity['images'].split(", ").length - 1 == 1 ? <FastImage
                        source={{
                            uri: item['item']['data']['images'].split(", ")[0] + item['item']['data']['suff_feed_feed'],
                            priority: FastImage.priority.high
                        }}
                        style={{ width: width, height: 340, borderRadius: 0 }}
                    /> : <View style={{ height: 340 }}><SliderBox
                        images={activity['images'].split(", ").filter(n => n)}
                        dotColor="#FFEE58"
                        inactiveDotColor="#90A4AE"
                        paginationBoxVerticalPadding={20}
                        sliderBoxHeight={340}
                        disableOnPress={true}
                        ImageComponentStyle={{ borderRadius: 0, width: width, height: 340, backgroundColor: 'transparent' }}
                        circleLoop={false}
                    /></View> : <View></View>}
                </View>
            </TouchableWithoutFeedback>
            {activity['caption'] ?
                (activity['caption'].includes('http') ?
                    <LinkPreview touchableWithoutFeedbackProps={{ onPress: () => { navigation.navigate('Browser', { 'url': urlify(activity['caption'])[0] }) } }} text={activity['caption']} containerStyle={{ backgroundColor: '#efefef', borderRadius: 0, marginTop: 10, width: width, alignSelf: 'center' }} renderTitle={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 12 }}>{text}</Text>} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 100) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                    : null) : null}
            {activity['videos'] ?
                <VideoPlayer navigation={navigation} video={activity['videos']} /> : null
            }
            {
                activity['youtube'] ?
                    <Thumbnail onPress={() => { navigation.navigate('SinglePost', { setparentkey: setparentkey, image: status === '3' ? children['0']['data']['image'] : '', activity: activity }) }} imageHeight={200} imageWidth={width} showPlayIcon={true} url={"https://www.youtube.com/watch?v=" + activity['youtube']} />
                    : null
            }
            <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableWithoutFeedback style={{ width: 40, height: 40, }} onPress={() => { addorunlike() }}>
                        <FastImage style={{ width: 32, height: 32, marginLeft: 10, marginRight: 0, marginTop: 2 }} source={activity['likes_user_id'] ? require('../Icons/star.png') : require('../Icons/star-outline.png')} />
                    </TouchableWithoutFeedback>
                    <Text style={{ fontFamily: 'NunitoSans-Bold', marginLeft: 5, fontSize: 16, marginBottom: 2, marginRight: 8 }}>{activity['likes_count']}</Text>
                    <Icon onPress={() => navigation.navigate('SinglePost', { setparentkey: setparentkey, id: status === '3' ? children['0']['id'] : '', name: status === '3' ? children['0']['data']['name'] : '', image: status === '3' ? children['0']['data']['image'] : '', activity: activity, type: 'comment' })} name="message-circle" type="Feather" style={{ fontSize: 28, marginLeft: 10, marginRight: -10 }} />
                    <Text style={{ fontFamily: 'NunitoSans-Bold', marginLeft: 15, fontSize: 16, marginBottom: 2 }}>{activity['comments_count']}</Text>
                    <TouchableOpacity style={{ width: 50, marginLeft: '60%', padding: 10, right: 12, alignItems: 'center' }}
                        onPress={async () => {
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('WhatsappShare', {
                                userID: x ? JSON.parse(x)["0"]["id"] : null,
                                deviceID: getUniqueId()
                            });
                            Linking.openURL('whatsapp://send?text=Hey! Check out this post by ' + activity['user_name'].charAt(0).toUpperCase() + activity['user_name'].slice(1) + ' on the new Genio app: https://genio.app/post/' + activity['post_id']).then((data) => {
                            }).catch(() => {
                                alert('Please make sure Whatsapp is installed on your device');
                            });
                        }}
                    >
                        <Icon name="whatsapp" type="Fontisto" style={{ fontSize: 28, color: '#4FCE5D' }} />
                    </TouchableOpacity>
                </View>
                {activity['tags'] === 'Genio' || activity['tags'] === 'Other' || activity['tags'] === '' ? null : <View style={{/* backgroundColor: '#327FEB', borderRadius: 0, width: 90, padding: 9,*/ marginTop: 5, marginLeft: 17 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: '#327feb', fontSize: 15, alignSelf: 'flex-start' }}>#{activity['tags']}</Text></View>}
            </View>
            <View style={{ backgroundColor: 'lightgrey', height: 1, width: width - 30, alignSelf: 'center', opacity: 0.3, borderRadius: 4, marginTop: 10 }} />
        </View >
    )
};
export default FeedComponent;