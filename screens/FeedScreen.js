/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, TouchableOpacity, BackHandler, Alert, Image, Share, Linking, ScrollView, TouchableHighlight, ImageStore, StatusBar, RefreshControl } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import VideoPlayer from 'react-native-video-controls';
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
import axios from 'axios';
import * as rssParser from 'react-native-rss-parser';
import { useFocusEffect } from "@react-navigation/native";
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
import WebView from 'react-native-webview';
import useWebSocket, { ReadyState } from 'react-use-websocket';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
function urlify(text) {
    var urlRegex = (/(https?:\/\/[^\s]+)/g);
    var res = text.match(urlRegex);
    return res
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

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
const FeedScreen = ({ navigation, route }) => {
    const [actid, setactid] = useState('f137b98f-0d0d-11eb-8255-128a130028af');
    const [type, settype] = useState('like');
    const [display, setdisplay] = useState('none');
    const [children, setchildren] = useState('notyet')
    const [status, setstatus] = useState('0')
    const [options, setoptions] = useState({})
    const sheetRefLike = React.useRef(null);
    const sheetYoutube = React.useRef(null)
    const [showToast, setShowToast] = useState(false)
    const [feedstate, setFeedState] = useState(0);
    const sheetRefCom = React.useRef(null);
    const [reportedProfile, setReportedProfile] = useState({});
    const sheetRefReport = React.useRef(null);
    const [reportType, setReportType] = useState('')
    const [reportComment, setReportComment] = useState('');
    const [selecting, setSelecting] = useState(false)
    const [actionstatus, setActionStatus] = useState(0);
    const [news, setNews] = useState([]);
    const [quizOffset, setQuizOffset] = useState(10);
    const [newsOffset, setNewsOffset] = useState(10);
    const [refreshing, setRefreshing] = useState(false);
    const [quiz, setQuiz] = useState([]);
    const [newnoti, setnewnoti] = useState(false);
    const [numnoti, setnumnoti] = useState(0);
    const [youtube, setyoutube] = useState('https://youtube.com');

    // In functional React component

    // This can also be an async getter function. See notes below on Async Urls.

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert("Hold on!", "Are you sure you want to Exit?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);

        }, []));

    useEffect(() => {



        const analyse = async () => {
            var x = await AsyncStorage.getItem('children');
            if (x) {
                x = JSON.parse(x)
                if (Object.keys(x).length == 0) {
                    await AsyncStorage.removeItem('children');
                    x = null
                }
                analytics.screen('Feed Screen', {
                    userID: x ? x["0"]["data"]["gsToken"] : null,
                    deviceID: getUniqueId()
                })
            }
            else {
                analytics.screen('Feed Screen', {
                    userID: null,
                    deviceID: getUniqueId()
                })
            }
        }
        analyse();
    })
    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener('state', (data) => {
    //         console.log(data.data.state.history)
    //     });

    //     return unsubscribe;
    // }, [navigation]);
    const report = async (x) => {

        // console.log(children);
        var y = await AsyncStorage.getItem('children');
        analytics.track('Post Reported', {
            userID: y ? JSON.parse(y)["0"]["data"]["gsToken"] : null,
            deviceID: getUniqueId()
        })
        var now = new Date();
        var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

        var body = {
            "created_by": children["0"]["data"]["gsToken"],
            "reported_name": x["actor"]["data"]["name"],
            "post_id": x["id"],
            "images": x["image"],
            "reported_id": x["actor"]["id"].split("id")[0],
            "reported_time": datetime
        }

        var config = {
            method: 'post',
            url: 'https://the-office-2z27nzutoq-el.a.run.app/report',
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
                    setShowToast(true);
                }
            })
            .catch(function (error) {
                alert(error);
                // setLoading(false)
            });

        // console.log(body);

    }

    const renderLikes = (props) => {
        if (type === 'like') {
            return <View style={{ height: height, backgroundColor: 'lightgrey' }}><LikeList reactionKind={'like'} {...props} activityId={actid} /></View>
        }
        return <View style={{ height: height, backgroundColor: 'lightgrey' }}><CommentList {...props} activityId={actid} /><CommentBox {...props} /></View>
        // <View style={{ height: height, backgroundColor: 'black' }}></View>
        // 

    }

    const renderReport = () => (
        <View
            scrollEnabled={false}
            style={{
                backgroundColor: '#fff',
                padding: 16,
                height: height * 0.5,
            }}
        >
            <TouchableWithoutFeedback onPress={() => { sheetRefReport.current.snapTo(2); }} style={{ alignItems: 'center', paddingBottom: 10 }}><Icon name="chevron-small-down" type="Entypo" /></TouchableWithoutFeedback>
            <Text style={{ alignSelf: 'center', marginBottom: 5, fontSize: 15 }} >Report {!(Object.keys(reportedProfile).length === 0 && reportedProfile.constructor === Object) ? reportedProfile.actor.data.name : ''}'s Post</Text>
            <FlatList
                data={["Improper Content", "Faking to be someone else"]}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    // flexGrow: 1,
                }}
                // style={{marginTop: 5}}
                renderItem={({ item, i }) => (
                    <Chip key={i} style={{ backgroundColor: reportType == item ? 'red' : '#327FEB', margin: 4, paddingLeft: 10, paddingRight: 10, height: 35 }} textStyle={{ color: "#fff" }} onPress={() => reportType == item ? setReportType('') : setReportType(item)} >{item}</Chip>
                )}
                //Setting the number of column
                // numColumns={3}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
            />
            <Form style={{ marginBottom: height * 0.17 }}>
                <Textarea value={reportComment} onChangeText={(text) => setReportComment(text)} rowSpan={5} bordered placeholder="Add Remarks" />
            </Form>
        </View>
    );
    const CustomActivity = (props) => {
        const refActionSheet = useRef(null);
        const showActionSheet = () => {
            refActionSheet.current.show()
        }
        const footer = (id, data) => {
            return (<View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={async () => {
                        if (status === '3') {
                            var x = await AsyncStorage.getItem('children');
                            var done = 0
                            data.activity.own_reactions.like ? data.activity.own_reactions.like.map((item) => {
                                var by = String(JSON.parse(x)["0"]["id"]) + 'id'
                                if ((item.user_id) == by) {
                                    done = 1
                                }
                            }) : null
                            if (done == 0) {
                                console.log('doing')
                                x = JSON.parse(x)
                                analytics.track('Like', {
                                    userID: x["0"]["data"]["gsToken"],
                                    deviceID: getUniqueId(),
                                    by: x["0"]["id"],
                                    byname: x["0"]['data']["name"],
                                    byimage: x["0"]['data']["image"],
                                    to: parseInt(props.activity.actor.id.replace('id', '')),
                                    actid: id
                                })
                            }
                        }

                    }}>
                        {status === '3' ? <LikeButton   {...props} /> : <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}><View pointerEvents={'none'}><LikeButton   {...props} /></View></TouchableWithoutFeedback>}
                    </TouchableWithoutFeedback>
                    <Icon onPress={() => navigation.navigate('SinglePost', { id: status === '3' ? children['0']['id'] : '', name: status === '3' ? children['0']['data']['name'] : '', image: status === '3' ? children['0']['data']['image'] : '', activity: props, token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' })} name="message-circle" type="Feather" style={{ fontSize: 22, marginLeft: 10, marginRight: -10 }} />
                    <ReactionIcon
                        labelSingle=" "
                        labelPlural=" "
                        counts={props.activity.reaction_counts}
                        kind="comment"
                        width={-80}
                        onPress={async () => {
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('Comment', {
                                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                                deviceID: getUniqueId()
                            });
                            navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', activity: props, token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' })
                        }}
                    />
                    <Icon onPress={() => {
                        Linking.openURL('whatsapp://send?text=Hey! Check out this post by ' + data.activity.actor.data.name.charAt(0).toUpperCase() + data.activity.actor.data.name.slice(1) + ' on the new Genio app: https://link.genio.app/?link=https://link.genio.app/post?id='+data.activity+'%26apn=com.genioclub.app').then((data) => {
                        }).catch(() => {
                            alert('Make sure Whatsapp installed on your device');
                        });
                    }} name="whatsapp" type="Fontisto" style={{ fontSize: 20, marginLeft: '55%', color: '#4FCE5D' }} />
                </View>
            </View>)
        }
        var images = []
        props.activity.image ? props.activity.image.split(', ').map((item) => item != '' ? images.push({ uri: item }) : null) : null
        return (
            <Activity
                Header={
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('IndProf', { 'id': props.activity.actor.id.replace('id', ''), 'data': props.activity.actor.data })}>
                                <Image
                                    source={{ uri: props.activity.actor.data ? props.activity.actor.data.profileImage : '' }}
                                    style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                                />
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('IndProf', { 'id': props.activity.actor.id.replace('id', ''), 'data': props.activity.actor.data })}>
                                <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                    <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{props.activity.actor.data ? props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) : null}</Text>
                                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327FEB', textAlign: 'left' }}>{props.activity.actor.data ? props.activity.actor.data.type : null}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <ActionSheet
                                useNativeDriver={true}
                                ref={refActionSheet}
                                styles={{ borderRadius: 0, margin: 10 }}
                                options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                                cancelButtonIndex={2}
                                onPress={(index) => { index == 1 ? report(props.activity) : null; }}
                            />
                            <Right><Icon onPress={() => { showActionSheet(); }} name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 16, marginRight: 20, color: '#383838' }} /></Right>
                        </View>
                        {/* <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>*/}
                    </View>
                }
                Content={
                    <View>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', activity: props })}>
                            {props.activity.object === 'default123' ? <View style={{ margin: 5 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10, marginLeft: 14, marginVertical: 10 }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text>}
                            <View style={{ alignSelf: 'center' }}>
                                {props.activity.image ? props.activity.image.split(", ").length - 1 == 1 ? <Image
                                    source={{ uri: props.activity.image.split(", ")[0] }}
                                    style={{ width: width, height: 340, marginTop: 20, borderRadius: 0 }}
                                /> : <View style={{ height: 340 }}><SliderBox
                                    images={props.activity.image.split(", ").filter(n => n)}
                                    dotColor="#FFEE58"
                                    inactiveDotColor="#90A4AE"
                                    paginationBoxVerticalPadding={20}
                                    sliderBoxHeight={340}
                                    disableOnPress={true}
                                    ImageComponentStyle={{ borderRadius: 0, width: width, height: 340, backgroundColor: 'transparent' }}
                                    circleLoop={true}
                                /></View> : <View></View>}
                            </View>
                        </TouchableWithoutFeedback>
                        {props.activity.object.includes('http') ?
                            <LinkPreview touchableWithoutFeedbackProps={{ onPress: () => { navigation.navigate('Browser', { 'url': urlify(props.activity.object)[0] }) } }} text={props.activity.object} containerStyle={{ backgroundColor: '#efefef', borderRadius: 0, marginTop: 10, width: width, alignSelf: 'center' }} renderTitle={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 12 }}>{text}</Text>} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 100) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                            : null}
                        {props.activity.video ?
                            <VideoPlayer
                                seekColor={'#327FEB'}
                                toggleResizeModeOnFullscreen={false}
                                tapAnywhereToPause={true}
                                paused={true}
                                disableFullscreen={true}
                                disableBack={true}
                                disableVolume={true}
                                style={{ borderRadius: 0, width: width, height: 340, }}
                                source={{ uri: props.activity.video }}
                                navigator={navigation}
                            // onEnterFullscreen={()=>navigation.navigate('VideoFull',{'uri':props.activity.video})}
                            /> : null}
                        {props.activity.youtube ?
                            <Thumbnail onPress={() => { navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM', activity: props }) }} imageHeight={200} imageWidth={width} showPlayIcon={true} url={"https://www.youtube.com/watch?v=" + props.activity.youtube} />
                            : null}
                        {props.activity.tag === 'Genio' || props.activity.tag === 'Other' || props.activity.tag === '' || !Object.keys(props.activity).includes('tag') ? null : <View style={{/* backgroundColor: '#327FEB', borderRadius: 0, width: 90, padding: 9,*/ marginTop: 5, marginLeft: 17 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: '#327feb', fontSize: 15, alignSelf: 'flex-start' }}>#{props.activity.tag}</Text></View>}
                    </View>
                }
                Footer={footer(props.activity.id, props)}
            />
        );
    };

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

    const theme = {
        ...DefaultTheme,
        fonts: configureFonts(fontConfig),
    };
    const notifi = () => {
        return (<NewActivitiesNotification labelSingular={'Post'} labelPlural={'Posts'} />)
    }
    useEffect(() => {
        const check = async () => {
            var st = await AsyncStorage.getItem('status')
            setstatus(st)
        }
        check()
    }, [])
    var ws = ''
    const socketUrl = 'ws://35.154.132.35:8765/';
    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket
    } = useWebSocket(socketUrl, {
        onOpen: () => {
            console.log('opened');
            // sendMessage(child['0']['id'])
        },
        onMessage: (message) => {
            console.log(message);
            if (Object.keys(message).includes('data')) {
                if (!message.data.includes('opened')) {
                    axios({
                        method: 'get',
                        url: 'https://magnolia-2z27nzutoq-el.a.run.app/' + String(children[0]['id']),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        // data: JSON.stringify({
                        //   "email": pro.email,
                        // })
                    }).then(async (data) => {
                        var noti = await AsyncStorage.getItem('notifications')
                        noti = JSON.parse(noti)
                        var arr = []
                        if (noti) {
                            var data1 = Object.keys(noti).reverse()
                            var data2 = Object.keys(data.data).reverse()
                            for (var i = 0; i < data2.length; i++) {
                                if (!data1.includes(data2[i])) {
                                    arr.push(data2[i])
                                }
                                else {
                                    break;
                                }
                            }
                            if (arr.length) {
                                AsyncStorage.setItem('newnoti', String(arr))
                                setnewnoti(true)
                            }
                        }
                        else {
                            setnewnoti(true)
                        }
                        AsyncStorage.setItem('notifications', JSON.stringify(data.data))
                    })
                }
            }
        },
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
    });
    useEffect(() => {
        const check = async () => {
            var child = await AsyncStorage.getItem('children')
            if (child != null) {
                child = JSON.parse(child)
                // console.log(webSocket.current)
                // if (webSocket.current == null) {
                //     webSocket.current = new WebSocket("ws://35.154.132.35:8765/");
                //     webSocket.current.onopen = (data) => {
                //         alert('alert')
                //     }
                //     webSocket.current.onmessage = (message) => {
                //         alert(message)
                //     };
                // }

                // return () => webSocket.current.close();
            }
            else {
            }
        }
        check()
    }, [])
    useEffect(() => {
        const check = async () => {
            var child = await AsyncStorage.getItem('children')
            if (child != null) {
                child = JSON.parse(child)
                setchildren(child)
                sendMessage(String(child['0']['id']))
                axios({
                    method: 'get',
                    url: 'https://magnolia-2z27nzutoq-el.a.run.app/' + String(child[0]['id']),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // data: JSON.stringify({
                    //   "email": pro.email,
                    // })
                }).then(async (data) => {
                    var noti = await AsyncStorage.getItem('notifications')
                    noti = JSON.parse(noti)
                    var arr = []
                    if (noti) {
                        var data1 = Object.keys(noti).reverse()
                        var data2 = Object.keys(data.data).reverse()
                        for (var i = 0; i < data2.length; i++) {
                            if (!data1.includes(data2[i])) {
                                arr.push(data2[i])
                            }
                            else {
                                break;
                            }
                        }
                        if (arr.length) {
                            AsyncStorage.setItem('newnoti', String(arr))
                            setnewnoti(true)
                        }
                    }
                    AsyncStorage.setItem('notifications', JSON.stringify(data.data))
                })
            }
            else {
                setchildren({})
            }
        }
        check()
    }, [])

    useEffect(() => {
        const check = async () => {
            var st = await AsyncStorage.getItem('status')
            if (st == '3') {
                var pro = await AsyncStorage.getItem('profile')
                if (pro !== null) {
                    pro = JSON.parse(pro)
                    var data = JSON.stringify({ "username": "Shashwat", "password": "GenioKaPassword" });

                    var config = {
                        method: 'post',
                        url: 'http://104.199.146.206:5000/getToken',
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
                                url: 'http://104.199.158.211:5000/getchild/' + `?token=${response.data.token}`,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                data: JSON.stringify({
                                    "email": pro.email,
                                })
                            })
                                .then(async (response) => {
                                    setchildren(response.data)
                                    await AsyncStorage.setItem('children', JSON.stringify(response.data))
                                })
                                .catch((error) => {
                                })
                        })
                        .catch(function (error) {
                        });
                }
            }
            else {
                // console.log('helo')
            }
        }
        setTimeout(() => {
            check()
        }, 3000);
    }, [])
    const renderYoutube = () => {
        return (
            <SafeAreaView style={{ flex: 1 }} style={{ height: height - 80 }}>
                <WebView source={{ uri: youtube }} />
            </SafeAreaView>
        )
    }
    const there = (props) => {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1 }} style={{ flex: 1 }} forceInset={{ top: 'always' }}>
                    <StreamApp
                        style={{ marginTop: 20 }}
                        apiKey="9ecz2uw6ezt9"
                        appId="96078"
                        token={children['0']['data']['gsToken']}
                    >
                        <FlatFeed Footer={() => {
                            return (
                                <BottomSheet
                                    ref={sheetRefLike}
                                    snapPoints={[height - 200, 400, 0]}
                                    initialSnap={2}
                                    borderRadius={25}
                                    renderContent={renderLikes}
                                />
                            )
                        }} notify={true} navigation={navigation} feedGroup="timeline" Activity={CustomActivity} options={{ withOwnReactions: true }} />
                    </StreamApp>
                    <BottomSheet
                        ref={sheetRefReport}
                        snapPoints={[height - 200, 400, 0]}
                        initialSnap={2}
                        borderRadius={25}
                        renderContent={renderReport}
                    />
                    <BottomSheet
                        ref={sheetYoutube}
                        enabledContentTapInteraction={false}
                        snapPoints={[height - 200, 0]}
                        // enabledContentGestureInteraction={false}
                        initialSnap={1}
                        borderRadius={2}
                        renderContent={renderYoutube}
                    />
                </SafeAreaView>
                <Snackbar
                    visible={showToast}
                    style={{ marginBottom: height * 0.04 }}
                    duration={1500}
                    onDismiss={() => setShowToast(false)}
                    action={{
                        label: 'Done',
                        onPress: () => {
                            // Do something
                        },
                    }}>
                    Post Reported
                </Snackbar>
            </SafeAreaProvider>
        );
    }
    const loading = () => {
        return (
            <SafeAreaView style={{ flex: 1 }} refreshControl={
                <RefreshControl refreshing={true} />} style={{ backgroundColor: '#f9f9f9', height: height, width: width }}>
            </SafeAreaView>
        );
    }
    const notthere = () => {
        return (
            <SafeAreaProvider>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Feed' })}><CompButton message={'Signup/Login to view posts from other kids'} back={'Home'} /></TouchableWithoutFeedback>
                <SafeAreaView style={{ flex: 1 }} style={{ flex: 1 }} forceInset={{ top: 'always' }}>
                    <StreamApp
                        style={{ marginTop: 20 }}
                        apiKey="9ecz2uw6ezt9"
                        appId="96078"
                        token={'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM'}
                    >
                        <FlatFeed Footer={() => {
                            return (
                                <BottomSheet
                                    ref={sheetRefLike}
                                    snapPoints={[height - 200, 400, 0]}
                                    initialSnap={2}
                                    borderRadius={25}
                                    renderContent={renderLikes}
                                />
                            )
                        }} notify navigation={navigation} feedGroup="timeline" Activity={CustomActivity} options={{ withOwnReactions: true }} />
                    </StreamApp>
                    <BottomSheet
                        ref={sheetRefReport}
                        snapPoints={[height - 200, 400, 0]}
                        initialSnap={2}
                        borderRadius={25}
                        renderContent={renderReport}
                    />
                </SafeAreaView>
                <Snackbar
                    visible={showToast}
                    style={{ marginBottom: height * 0.04 }}
                    duration={1500}
                    onDismiss={() => setShowToast(false)}
                    action={{
                        label: 'Done',
                        onPress: () => {
                            // Do something
                        },
                    }}>
                    Post Reported
                </Snackbar>
            </SafeAreaProvider>
        )
    }

    const Features = () => {
        return (
            <View style={{ backgroundColor: "#f9f9f9", margin: 'auto', justifyContent: 'center' }}>
                <FlatList
                    data={[["Feed", "dynamic-feed", "MaterialIcons"], ["Quiz", "clipboard-pencil", "Foundation"], ["News", "newspaper-outline", "Ionicons"]]}
                    scrollEnabled={true}
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignSelf: 'center'
                    }}
                    // showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 15 }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => {
                                // setValue({ ...value, color: item })
                                item[0] == 'Feed' ? setFeedState(0) : item[0] == 'Quiz' ? setFeedState(1) : setFeedState(2);
                                // console.log(i)
                                // navigation.navigate('Browser', { url: "https://quizizz.com/join/quiz/5ea4540affcaa5001b9c4782/start" })
                                // console.log(item);  
                            }}>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', color: "#fff", justifyContent: 'center', height: 40, width: 100, borderRadius: 20, backgroundColor: feedstate == index ? "#327feb" : '#fff', marginHorizontal: 6, marginBottom: 3, elevation: 3 }} >
                                <Icon name={item[1]} type={item[2]} style={{ fontSize: 20, color: feedstate == index ? '#fff' : '#327feb' }} />
                                <Text style={{ alignSelf: 'center', alignItems: 'center', color: feedstate == index ? "#fff" : "#327feb", justifyContent: 'center' }}> {item[0]}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    //Setting the number of column
                    numColumns={3}
                    // horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        setQuiz([]);
        setNews([]);
        setRefreshing(false)

    }, []);

    const Quiz = () => {

        if (quiz.length < 1) {
            const asyncQuiz = async () => {
                var axios = require('axios');
                var data = JSON.stringify({ "request_type": "get", "offset": 0 });

                var config = {
                    method: 'post',
                    url: 'https://9c9qtqg8x7.execute-api.ap-south-1.amazonaws.com/default/quizAggregator',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {
                        // console.log(JSON.stringify(response.data));
                        setQuiz([...response.data]);
                    })
                    .catch(function (error) {
                        setQuiz(['err'])
                    });


            }
            asyncQuiz();
        }


        return (
            <SafeAreaView style={{ flex: 1 }} style={{ backgroundColor: '#f9f9f9' }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {
                    quiz.length < 1 ?
                        <View>
                            <View style={{ elevation: 20, marginTop: 5 }}>
                                <Image source={require('../assets/card-loader.gif')} style={{ height: 200, width: width, alignSelf: 'center', }} />
                            </View>
                            <View style={{ elevation: 20, marginTop: 5 }}>
                                <Image source={require('../assets/card-loader.gif')} style={{ height: 200, width: width, alignSelf: 'center', }} />
                            </View>
                            <View style={{ elevation: 20, marginTop: 5 }}>
                                <Image source={require('../assets/card-loader.gif')} style={{ height: 200, width: width, alignSelf: 'center', }} />
                            </View>
                        </View>
                        :
                        quiz[0] == 'err' ?
                            <View style={{ marginTop: 20, height: height, backgroundColor: '#f9f9f9', alignItems: 'center' }}>
                                <Icon type="Feather" name="frown" />
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>There seems to be an issue with your network. {'\n'}Try again later</Text>
                            </View>
                            :
                            <FlatList
                                data={quiz}
                                scrollEnabled={true}
                                contentContainerStyle={{
                                    flexGrow: 1,
                                }}
                                style={{ marginTop: 15 }}
                                renderItem={({ item, index }) => (
                                    <View style={{ marginVertical: 2, backgroundColor: '#fff', elevation: 2 }}>
                                        <TouchableOpacity
                                            key={item}
                                            onPress={() => {
                                                navigation.navigate('Browser', { url: item['link'] })
                                            }}>
                                            <View style={{ backgroundColor: '#fff', padding: 5 }} >
                                                <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <TouchableWithoutFeedback onPress={() => console.log('asd')}>
                                                            <Image
                                                                source={{ uri: 'data:image/jpeg;base64,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' }}
                                                                style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                                                            />
                                                        </TouchableWithoutFeedback>
                                                        <TouchableWithoutFeedback >
                                                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{item.by}</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                    {/* <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>*/}
                                                </View>
                                                <View style={{ marginVertical: 5 }}>
                                                    <Text style={{ textAlign: 'justify', marginHorizontal: 20 }}>{item['desc']}</Text>
                                                    <Text style={{ textAlign: 'justify', marginHorizontal: 20, fontWeight: 'bold', color: "#327feb" }}>Click here to go to quiz</Text>
                                                </View>
                                                <View>
                                                    <Image
                                                        source={{ uri: item.link }}
                                                        style={{ width: width, height: 300, }}
                                                    />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 20 }}>
                                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={async () => {
                                                if (status === '3') {
                                                    var arr = quiz;
                                                    if (item.liked_by.includes(children["0"]["data"]["gsToken"])) {
                                                        // console.log(index)
                                                        arr[index].liked_by = item.liked_by.replace(children["0"]["data"]["gsToken"] + ',', '');
                                                        arr[index].likes_count -= 1;
                                                        setQuiz([...arr]);
                                                        var axios = require('axios');
                                                        var data = JSON.stringify({ "request_type": "unliked", "id": item.id, "likes_count": arr[index].likes_count, "liked_by": arr[index].liked_by });

                                                        var config = {
                                                            method: 'post',
                                                            url: 'https://9c9qtqg8x7.execute-api.ap-south-1.amazonaws.com/default/quizAggregator',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            data: data
                                                        };

                                                        axios(config)
                                                            .then(function (response) {
                                                                // console.log(JSON.stringify(response.data));
                                                            })
                                                            .catch(function (error) {
                                                                console.log(error);
                                                            });

                                                        // console.log(item.liked_by)
                                                    }
                                                    else {
                                                        // console.log(children["0"]["data"]["gsToken"])
                                                        arr[index].liked_by += children["0"]["data"]["gsToken"] + ',';
                                                        arr[index].likes_count += 1;
                                                        setQuiz([...arr])
                                                        var axios = require('axios');
                                                        var data = JSON.stringify({ "request_type": "liked", "id": item.id, "likes_count": arr[index].likes_count, "liked_by": arr[index].liked_by });

                                                        var config = {
                                                            method: 'post',
                                                            url: 'https://9c9qtqg8x7.execute-api.ap-south-1.amazonaws.com/default/quizAggregator',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            data: data
                                                        };

                                                        axios(config)
                                                            .then(function (response) {
                                                                console.log(JSON.stringify(response.data));
                                                            })
                                                            .catch(function (error) {
                                                                console.log(error);
                                                            });
                                                    }
                                                }
                                                else {
                                                    navigation.navigate('Login');
                                                }

                                            }}>
                                                <Icon type="MaterialIcons" name={item.liked_by.includes(children["0"]["data"]["gsToken"]) ? "lightbulb" : "lightbulb-outline"} style={{ color: item.liked_by.includes(children["0"]["data"]["gsToken"]) ? '#ffc900' : "#000", fontSize: 26 }} />
                                                <Text style={{ marginTop: 3 }}> {item.likes_count}</Text>
                                            </TouchableOpacity>
                                            <Right>
                                                <Icon onPress={() => {
                                                    Linking.openURL('whatsapp://send?text=Hey! Check out this quiz' + ' on the new Genio app:' + item['link'] + ' \n Find more such quizzes at: https://link.genio.app/?link=https://link.genio.app/post?id=3a100e54-2d98-11eb-b373-0289d2c29892%26apn=com.genioclub.app').then((data) => {
                                                    }).catch(() => {
                                                        alert('Make sure Whatsapp installed on your device');
                                                    });
                                                }} name="whatsapp" type="Fontisto" style={{ fontSize: 20, marginLeft: '55%', color: '#4FCE5D' }} />
                                            </Right>
                                        </View>
                                    </View>
                                )}
                                //Setting the number of column
                                numColumns={1}
                                // horizontal={true}
                                keyExtractor={(item, index) => index.toString()}
                            />}
            </SafeAreaView>
        )

    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }

    const News = () => {

        if (news.length < 1) {
            const asyncNews = async () => {
                var axios = require('axios');
                var data = JSON.stringify({ "request_type": "get", "offset": 0 });

                var config = {
                    method: 'post',
                    url: 'https://uv4nn2mtxa.execute-api.ap-south-1.amazonaws.com/default/newsAggregator',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {
                        // console.log(JSON.stringify(response.data));
                        setNews([...response.data]);
                    })
                    .catch(function (error) {
                        console.log(error)
                        setNews(['err'])
                    });


            }
            asyncNews();
        }


        return (
            <SafeAreaView style={{ flex: 1 }} style={{ backgroundColor: '#f9f9f9' }}
                // onScroll={({nativeEvent}) => {
                //     if (isCloseToBottom(nativeEvent)) {
                //       console.log("end")
                //     }
                //   }}
                scrollEventThrottle={400}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {
                    news.length < 1 ?
                        <View>
                            <View style={{ elevation: 20, marginTop: 5 }}>
                                <Image source={require('../assets/card-loader.gif')} style={{ height: 200, width: width, alignSelf: 'center', }} />
                            </View>
                            <View style={{ elevation: 20, marginTop: 5 }}>
                                <Image source={require('../assets/card-loader.gif')} style={{ height: 200, width: width, alignSelf: 'center', }} />
                            </View>
                            <View style={{ elevation: 20, marginTop: 5 }}>
                                <Image source={require('../assets/card-loader.gif')} style={{ height: 200, width: width, alignSelf: 'center', }} />
                            </View>
                        </View>
                        :
                        news[0] == 'err' ?
                            <View style={{ marginTop: 20, height: height, backgroundColor: '#f9f9f9', alignItems: 'center' }}>
                                <Icon type="Feather" name="frown" />
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>There seems to be an issue with your network. {'\n'}Try again later</Text>
                            </View>
                            :
                            <FlatList
                                data={news}
                                scrollEnabled={true}
                                contentContainerStyle={{
                                    flexGrow: 1,
                                }}
                                style={{ marginTop: 15 }}
                                renderItem={({ item, index }) => (
                                    <View style={{ marginVertical: 2, backgroundColor: '#fff', elevation: 2 }}>
                                        <TouchableOpacity
                                            key={item}
                                            onPress={() => {
                                                navigation.navigate('Browser', { url: item['link'] })
                                            }}>
                                            <View style={{ backgroundColor: '#fff', padding: 5 }} >
                                                <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <TouchableWithoutFeedback onPress={() => console.log('asd')}>
                                                            <Image
                                                                source={{ uri: 'data:image/jpeg;base64,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' }}
                                                                style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                                                            />
                                                        </TouchableWithoutFeedback>
                                                        <TouchableWithoutFeedback >
                                                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{((item.heading.substring)(0, 35 - 3)) + '...'}</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                    {/* <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>*/}
                                                </View>
                                                <View style={{ marginVertical: 5 }}>
                                                    <Text style={{ textAlign: 'justify', marginHorizontal: 20 }}>{(((item['desc'].replace(/<[^>]*>/g, '')).substring)(0, 200 - 3)) + '...'}</Text>
                                                    <Text style={{ textAlign: 'justify', marginHorizontal: 20, fontWeight: 'bold' }}>Click here to read more...</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 20 }}>
                                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={async () => {
                                                if (status === '3') {
                                                    var arr = news;
                                                    if (item.liked_by.includes(children["0"]["data"]["gsToken"])) {
                                                        // console.log(index)
                                                        arr[index].liked_by = item.liked_by.replace(children["0"]["data"]["gsToken"] + ',', '');
                                                        arr[index].likes_count -= 1;
                                                        setNews([...arr]);
                                                        var axios = require('axios');
                                                        var data = JSON.stringify({ "request_type": "unliked", "id": item.id, "likes_count": arr[index].likes_count, "liked_by": arr[index].liked_by });

                                                        var config = {
                                                            method: 'post',
                                                            url: 'https://uv4nn2mtxa.execute-api.ap-south-1.amazonaws.com/default/newsAggregator',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            data: data
                                                        };

                                                        axios(config)
                                                            .then(function (response) {
                                                                console.log(JSON.stringify(response.data));
                                                            })
                                                            .catch(function (error) {
                                                                console.log(error);
                                                            });

                                                        // console.log(item.liked_by)
                                                    }
                                                    else {
                                                        // console.log(children["0"]["data"]["gsToken"])
                                                        arr[index].liked_by += children["0"]["data"]["gsToken"] + ',';
                                                        arr[index].likes_count += 1;
                                                        setNews([...arr])
                                                        var axios = require('axios');
                                                        var data = JSON.stringify({ "request_type": "liked", "id": item.id, "likes_count": arr[index].likes_count, "liked_by": arr[index].liked_by });

                                                        var config = {
                                                            method: 'post',
                                                            url: 'https://uv4nn2mtxa.execute-api.ap-south-1.amazonaws.com/default/newsAggregator',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            data: data
                                                        };

                                                        axios(config)
                                                            .then(function (response) {
                                                                console.log(JSON.stringify(response.data));
                                                            })
                                                            .catch(function (error) {
                                                                console.log(error);
                                                            });
                                                    }
                                                }
                                                else {
                                                    navigation.navigate('Login');
                                                }

                                            }}>
                                                <Icon type="MaterialIcons" name={item.liked_by.includes(children["0"]["data"]["gsToken"]) ? "lightbulb" : "lightbulb-outline"} style={{ color: item.liked_by.includes(children["0"]["data"]["gsToken"]) ? '#ffc900' : "#000", fontSize: 26 }} />
                                                <Text style={{ marginTop: 3 }}> {item.likes_count}</Text>
                                            </TouchableOpacity>
                                            <Right>
                                                <Icon onPress={() => {
                                                    Linking.openURL('whatsapp://send?text=Hey! Check out this news' + ' on the new Genio app:' + item['link'] + ' \n Find more such articles at: https://link.genio.app/?link=https://link.genio.app/post?id=3a100e54-2d98-11eb-b373-0289d2c29892%26apn=com.genioclub.app').then((data) => {
                                                    }).catch(() => {
                                                        alert('Make sure Whatsapp installed on your device');
                                                    });
                                                }} name="whatsapp" type="Fontisto" style={{ fontSize: 20, marginLeft: '55%', color: '#4FCE5D' }} />
                                            </Right>
                                        </View>
                                    </View>
                                )}
                                //Setting the number of column
                                numColumns={1}
                                // horizontal={true}
                                keyExtractor={(item, index) => index.toString()}
                            />}
            </SafeAreaView>
        )

    }

    const openImagePicker = () => {
        const options = {
            title: 'Choose how to proceed',
            mediaType: 'photo',

            //   storageOptions:{
            //     skipBackup:true,
            //     path:'images'
            //   }
        }
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('user cancelled');
            } else if (response.error) {
                console.log('ERROR' + response.error);

            } else if (response.customButton) {
                console.log('user tapped' + response.customButton);
            } else {
                // console.log(response)
                navigation.navigate('CreatePost', { 'images': [{ uri: response.uri }] })
            }


        })

    }
    const openVideoPicker = () => {
        const options = {
            title: 'Choose how to proceed',
            mediaType: 'video',
            durationLimit: 120
            //   storageOptions:{
            //     skipBackup:true,
            //     path:'images'
            //   }
        }
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('user cancelled');
            } else if (response.error) {
                console.log('ERROR' + response.error);

            } else if (response.customButton) {
                console.log('user tapped' + response.customButton);
            } else {
                navigation.navigate('CreatePost', { 'images': [], 'video': response.uri })
            }


        })

    }

    const setnewnotifun = () => {
        setnewnoti(false)
    }
    return (
        <>
            <ScreenHeader new={newnoti} screen={'Genio'} icon={'bell'} navigation={navigation} fun={() => { navigation.navigate('Notifications'); setnewnoti(false) }} />
            <SafeAreaView style={{ flex: 1 }}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        if (feedstate == 2) {
                            const asyncNews = async () => {
                                var axios = require('axios');
                                var data = JSON.stringify({ "request_type": "get", "offset": newsOffset });

                                var config = {
                                    method: 'post',
                                    url: 'https://uv4nn2mtxa.execute-api.ap-south-1.amazonaws.com/default/newsAggregator',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: data
                                };

                                axios(config)
                                    .then(function (response) {
                                        // console.log(JSON.stringify(response.data));
                                        // if(response.data.length == 0)
                                        // {
                                        //     alert("No more news to show!")
                                        // }
                                        setNews([...news, ...response.data]);
                                        setNewsOffset(newsOffset + response.data.length);
                                    })
                                    .catch(function (error) {
                                        console.log(error)
                                        setNews(['err'])
                                    });


                            }
                            asyncNews();
                        }
                        else if (feedstate == 1) {
                            const asyncQuiz = async () => {
                                var axios = require('axios');
                                var data = JSON.stringify({ "request_type": "get", "offset": quizOffset });

                                var config = {
                                    method: 'post',
                                    url: 'https://9c9qtqg8x7.execute-api.ap-south-1.amazonaws.com/default/quizAggregator',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: data
                                };

                                axios(config)
                                    .then(function (response) {
                                        // console.log(JSON.stringify(response.data));
                                        // if(response.data.length == 0)
                                        // {
                                        //     alert("No more quizzes available right now")
                                        // }

                                        setQuiz([...quiz, ...response.data]);
                                        setQuizOffset(quizOffset + response.data.length);
                                    })
                                    .catch(function (error) {
                                        setQuiz(['err'])
                                    });


                            }
                            asyncQuiz();
                        }
                    }
                }}
            >
                <Features style={{ backgroundColor: '#f9f9f9' }} />
                {children == 'notyet' ? loading() : Object.keys(children).length > 0 && status == '3' ? feedstate === 0 ? there() : feedstate === 1 ? Quiz() : News() : notthere()}
            </SafeAreaView>
            {/* <Fab
                active={selecting}
                direction="up"
                containerStyle={{ right: 8 }}
                style={{ backgroundColor: '#327FEB' }}
                position="bottomRight"
                onPress={() => setSelecting(!selecting)}
            >
                <Icon type="Ionicons" name='add' style={{ color: "#fff", fontSize: 35 }} />
                <Button onPress={() => navigation.navigate('CreatePost', { 'images': [] })} style={{ backgroundColor: '#34A34F' }}>
                    <Icon name="pencil" type="FontAwesome" />
                </Button>
                <Button onPress={() => openImagePicker()} style={{ backgroundColor: '#3B5998' }}>
                    <Icon name="folder-images" type="Entypo" />
                </Button>
                <Button onPress={() => openVideoPicker()} style={{ backgroundColor: 'orange' }}>
                    <Icon name="video" type="Feather" />
                </Button>
            </Fab> */}
        </>

    );
};

export default FeedScreen;