/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, TouchableOpacity, BackHandler, Alert, Image, Share, Linking, ScrollView, TouchableHighlight, ImageStore, StatusBar, RefreshControl } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
import AuthContext from '../Context/Data';
import axios from 'axios';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import * as rssParser from 'react-native-rss-parser';
import FastImage from 'react-native-fast-image';
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
import FeedComponent from '../Modules/FeedComponent'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import * as Animatable from 'react-native-animatable';
import { Video } from 'expo-av';
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
    const [slidedisplay, setslidedisplay] = useState('none');
    const { Update } = React.useContext(AuthContext);
    const children = route.params.children
    const status = route.params.status
    const notifications = route.params.notifications
    const sheetRefLike = React.useRef(null);
    const [showToast, setShowToast] = useState(false)
    const [feedstate, setFeedState] = useState(0);
    const [reportedProfile, setReportedProfile] = useState({});
    const sheetRefReport = React.useRef(null);
    const [reportType, setReportType] = useState('')
    const [reportComment, setReportComment] = useState('');
    const [news, setNews] = useState([]);
    const slideRef = useRef(null);
    const [quizOffset, setQuizOffset] = useState(10);
    const [newsOffset, setNewsOffset] = useState(10);
    const [refreshing, setRefreshing] = useState(false);
    const [quiz, setQuiz] = useState([]);
    const [newnoti, setnewnoti] = useState(false);


    useFocusEffect(
        React.useCallback(() => {
            console.log('sadsadasd: ', route.params.goTo)
            if(route.params.goTo)
            {
                if(route.params.goTo == 'quiz')
                {
                    setFeedState(1)
                }
                if(route.params.goTo == 'news')
                {
                    setFeedState(2)
                }
                route.params.goTo = false
            }
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
                    userID: x ? x["0"]["id"] : null,
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
                        url: 'https://api.genio.app/magnolia/' + String(children[0]['id']),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        // data: JSON.stringify({
                        //   "email": pro.email,
                        // })
                    }).then(async (data) => {
                        var noti = notifications
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
                                Update({ notifications: data.data, newnoti: arr })
                                setnewnoti(true)
                            }
                            else {
                                Update({ notifications: data.data })
                            }
                        }
                        else {
                            var arr = Object.keys(data.data)
                            Update({ notifications: data.data, newnoti: arr })
                            setnewnoti(true)
                        }
                    })
                }
            }
        },
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => false,
    });
    // useEffect(() => {
    //     const check = async () => {
    //         var child = children
    //         if (child != null) {
    //             sendMessage(String(child['0']['id']))
    //             axios({
    //                 method: 'get',
    //                 url: 'https://api.genio.app/magnolia/' + String(child[0]['id']),
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 // data: JSON.stringify({
    //                 //   "email": pro.email,
    //                 // })
    //             }).then(async (data) => {
    //                 var noti = notifications
    //                 var arr = []
    //                 if (noti) {
    //                     var data1 = Object.keys(noti).reverse()
    //                     var data2 = Object.keys(data.data).reverse()
    //                     for (var i = 0; i < data2.length; i++) {
    //                         if (!data1.includes(data2[i])) {
    //                             arr.push(data2[i])
    //                         }
    //                         else {
    //                             break;
    //                         }
    //                     }
    //                     if (arr.length) {
    //                         Update({ notifications: data.data, newnoti: arr })
    //                         setnewnoti(true)
    //                     }
    //                     else {
    //                         Update({ notifications: data.data })
    //                     }
    //                 }
    //                 else {
    //                     var arr = Object.keys(data.data)
    //                     Update({ notifications: data.data, newnoti: arr })
    //                     setnewnoti(true)
    //                 }
    //             })
    //         }
    //         else {
    //         }
    //     }
    //     check()
    // }, [])

    // const Video = ({ url }) => {
    //     return (
    //         VideoPlayer.showVideoPlayer(url).then(() => {
    //             // onReachEnd
    //         })
    //     )
    // }

    const there = (props) => {
        return (
            <SafeAreaProvider style={{ display: feedstate == 0 ? 'flex' : 'none' }}>
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
                    <StreamApp
                        style={{ marginTop: 20 }}
                        apiKey="9ecz2uw6ezt9"
                        appId="96078"
                        token={children['0']['data']['gsToken']}
                    >
                        <FlatFeed
                            Footer={() => {
                                return (
                                    <BottomSheet
                                        ref={sheetRefLike}
                                        snapPoints={[height - 200, 400, 0]}
                                        initialSnap={2}
                                        borderRadius={25}
                                        renderContent={renderLikes}
                                    />
                                )
                            }} noPagination={false} notify={true} navigation={navigation} feedGroup="timeline" Activity={(data) => { return <FeedComponent props={data} status={status} children={children} navigation={navigation} route={route} /> }}  />
                        <Animatable.View style={{ display: slidedisplay }} animation="slideInRight" useNativeDriver duration={3000} ref={slideRef}>
                            <View>
                                <View style={{ position: 'absolute', right: 0, backgroundColor: feedstate === 0 ? '#327feb' : '#fff', height: 46, width: 50, bottom: 152, borderTopLeftRadius: 43, borderBottomLeftRadius: 43, elevation: 40 }}>
                                    <Icon name={'dynamic-feed'} type={'MaterialIcons'} style={{ fontSize: 20, color: feedstate == 0 ? '#fff' : '#327feb', marginLeft: 18, marginTop: 10 }} />
                                </View>
                                <View style={{ position: 'absolute', right: 0, backgroundColor: feedstate === 1 ? '#327feb' : '#fff', height: 46, width: 50, bottom: 96, borderTopLeftRadius: 43, borderBottomLeftRadius: 43, elevation: 40 }}>
                                    <Icon name={'clipboard-pencil'} type={'Foundation'} style={{ fontSize: 20, color: feedstate == 1 ? '#fff' : '#327feb', marginLeft: 18, marginTop: 10 }} />
                                </View>
                                <View style={{ position: 'absolute', right: 0, backgroundColor: feedstate === 2 ? '#327feb' : '#fff', height: 46, width: 50, bottom: 40, borderTopLeftRadius: 43, borderBottomLeftRadius: 43, elevation: 40 }}>
                                    <Icon name={'newspaper-outline'} type={'Ionicons'} style={{ fontSize: 20, color: feedstate == 2 ? '#fff' : '#327feb', marginLeft: 18, marginTop: 10 }} />
                                </View>
                            </View>
                        </Animatable.View>

                    </StreamApp>
                    <BottomSheet
                        ref={sheetRefReport}
                        snapPoints={[height - 200, 400, 0]}
                        initialSnap={2}
                        borderRadius={25}
                        renderContent={renderReport}
                    />
                    {/* <BottomSheet
                        ref={sheetYoutube}
                        enabledContentTapInteraction={false}
                        snapPoints={[height - 200, 0]}
                        // enabledContentGestureInteraction={false}
                        initialSnap={1}
                        borderRadius={2}
                        renderContent={renderYoutube}
                    /> */}
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
            <SafeAreaProvider style={{ display: feedstate == 0 ? 'flex' : 'none' }}>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Feed', 'type': 'feed_banner' })}><CompButton message={'Signup/Login to view posts from other kids'} back={'Home'} /></TouchableWithoutFeedback>
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
                        }} notify navigation={navigation} feedGroup="timeline" Activity={(data) => { return <FeedComponent props={data} status={status} children={children} navigation={navigation} route={route} /> }} options={{ withOwnReactions: true }} />
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
            <View style={{ backgroundColor: "#f9f9f9", margin: 'auto', justifyContent: 'center', zIndex: 1000, height: 60 }}>
                <FlatList
                    data={[["Feed", "dynamic-feed", "MaterialIcons"], ["Quiz", "clipboard-pencil", "Foundation"], ["News", "newspaper-outline", "Ionicons"]]}
                    scrollEnabled={true}
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignSelf: 'center'
                    }}
                    // showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 10 }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={item}
                            onPress={async () => {
                                var x = await AsyncStorage.getItem('children');
                                item[0] == 'Feed' ?
                                analytics.track('FeedSwitchedtoPosts', {
                                    userID: x ? JSON.parse(x)["0"]["id"] : null,
                                    deviceID: getUniqueId()
                                })
                                :
                                item[0] == 'Quiz' ?
                                analytics.track('FeedSwitchedtoQuiz', {
                                    userID: x ? JSON.parse(x)["0"]["id"] : null,
                                    deviceID: getUniqueId()
                                })
                                :
                                analytics.track('FeedSwitchedtoNews', {
                                    userID: x ? JSON.parse(x)["0"]["id"] : null,
                                    deviceID: getUniqueId()
                                });
                                setTimeout(() => {
                                    item[0] == 'Feed' ? setFeedState(0) : item[0] == 'Quiz' ? setFeedState(1) : setFeedState(2);
                                }, 80);
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
            <SafeAreaView style={{ flex: 1, display: 'none' }} style={{ backgroundColor: '#f9f9f9' }}
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
                                style={{ marginBottom: 50 }}
                                renderItem={({ item, index }) => (
                                    <View style={{ marginVertical: 10, backgroundColor: '#fff', elevation: 2 }}>
                                        <TouchableOpacity
                                            key={item}
                                            onPress={() => {
                                                navigation.navigate('Browser', { url: item['link'] })
                                            }}>
                                            <View style={{ backgroundColor: '#fff', padding: 5 }} >
                                                <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <TouchableWithoutFeedback >
                                                            <FastImage
                                                                source={{ uri: item.avatar,
                                                                    priority: FastImage.priority.high,
                                                                    cache: FastImage.cacheControl.web
                                                                }}
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
                                                    <FastImage
                                                        source={{ uri: item.image,
                                                            priority: FastImage.priority.high,
                                                            cache: FastImage.cacheControl.web
                                                        }}
                                                        style={{ width: width, height: 300, }}
                                                    />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal: 20 }}>
                                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={async () => {
                                                if (status === '3') {
                                                    try {

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
                                                    catch (err) {
                                                        navigation.navigate('Login', { 'type': 'feed_quiz' });
                                                    }
                                                }
                                                else {
                                                    navigation.navigate('Login', { 'type': 'feed_quiz' });
                                                }

                                            }}>
                                                <Icon type="MaterialIcons" name={status == '3' ? item.liked_by.includes(children["0"]["data"]["gsToken"]) ? "lightbulb" : "lightbulb-outline" : 'lightbulb-outline'} style={{ color: status == '3' ? item.liked_by.includes(children["0"]["data"]["gsToken"]) ? '#ffc900' : "#000" : "#000", fontSize: 32 }} />
                                                <Text style={{ marginTop: 8 }}> {item.likes_count}</Text>
                                            </TouchableOpacity>
                                            <Right>
                                                <Icon onPress={() => {
                                                    Linking.openURL('whatsapp://send?text=Hey! Check out this and many more quizzes' + ' on the new Genio app: https://link.genio.app/quiz').then((data) => {
                                                    }).catch(() => {
                                                        alert('Make sure Whatsapp installed on your device');
                                                    });
                                                }} name="whatsapp" type="Fontisto" style={{ fontSize: 28, marginLeft: '55%', color: '#4FCE5D' }} />
                                            </Right>
                                        </View>
                                    </View>
                                )}
                                //Setting the number of column
                                numColumns={1}
                                onEndReached={async () => {
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
    
    
                                }}
                                onEndReachedThreshold={4}
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
            <SafeAreaView style={{ flex: 1, display: 'none' }} style={{ backgroundColor: '#f9f9f9' }}
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
                                style={{ marginBottom: 50 }}
                                renderItem={({ item, index }) => (
                                    <View style={{ marginVertical: 10, backgroundColor: '#fff', elevation: 2 }}>
                                        <TouchableOpacity
                                            key={item}
                                            onPress={() => {
                                                navigation.navigate('Browser', { url: item['link'] })
                                            }}>
                                            <View style={{ backgroundColor: '#fff', padding: 5 }} >
                                                <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <TouchableWithoutFeedback onPress={() => console.log('asd')}>
                                                            <FastImage
                                                                source={{ uri: item.avatar,
                                                                    priority: FastImage.priority.high,
                                                                    cache: FastImage.cacheControl.web
                                                                }}
                                                                style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                                                            />
                                                        </TouchableWithoutFeedback>
                                                        <TouchableWithoutFeedback >
                                                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{item.heading.length > 26 ? ((item.heading.substring)(0, 29 - 3)) + "..." : item.heading}</Text>
                                                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: '#327feb' }}>Powered By: {item.source}</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                    {/* <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>*/}
                                                </View>
                                                <View style={{ marginVertical: 5 }}>
                                                    <Text style={{ textAlign: 'justify', marginHorizontal: 20 }}>{(((item['desc'].replace(/<[^>]*>/g, '')).substring)(0, 200 - 3)) + '...'}</Text>
                                                    <Text style={{ textAlign: 'justify', marginHorizontal: 20, fontWeight: 'bold' }}>Click here to read more...</Text>
                                                </View>
                                                <View>
                                                    <Image
                                                        source={{ uri: item['image'] }}
                                                        style={{ width: width, height: 300, }}
                                                    />
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
                                                    navigation.navigate('Login', { 'type': 'feed_news' });
                                                }

                                            }}>
                                                <Icon type="MaterialIcons" name={status == '3' ? item.liked_by.includes(children["0"]["data"]["gsToken"]) ? "lightbulb" : "lightbulb-outline" : 'lightbulb-outline'} style={{ color: status == '3' ? item.liked_by.includes(children["0"]["data"]["gsToken"]) ? '#ffc900' : "#000" : "#000", fontSize: 32 }} />
                                                <Text style={{ marginTop: 8 }}> {item.likes_count}</Text>
                                            </TouchableOpacity>
                                            <Right>
                                                <Icon onPress={() => {
                                                    Linking.openURL('whatsapp://send?text=Hey! Check out this: \n*' + item.heading + '*\nand many more news' + ' on the new Genio app: https://link.genio.app/news').then((data) => {
                                                    }).catch(() => {
                                                        alert('Make sure Whatsapp installed on your device');
                                                    });
                                                }} name="whatsapp" type="Fontisto" style={{ fontSize: 28, marginLeft: '55%', color: '#4FCE5D' }} />
                                            </Right>
                                        </View>
                                    </View>
                                )}
                                //Setting the number of column
                                numColumns={1}
                                onEndReached={async () => {
                                    // console.log('end')
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
    
    
                                }}
                                onEndReachedThreshold={4}
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
                    console.log('isclose')
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
                {/*<View style={{ height: 100, width: width }}>
                    <Video url={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'} />
            </View>*/}
                <Features style={{ backgroundColor: '#f9f9f9' }} />
                {/*children == 'notyet' ? loading() : Object.keys(children).length > 0 && status == '3' ? feedstate === 0 ? there() : feedstate === 1 ? Quiz() : News() : feedstate === 0 ? notthere() : feedstate === 1 ? Quiz() : News() */}
                {status == '3' ? there() : notthere()}
                {feedstate == 1 ? Quiz() : feedstate == 0 ? null : News()}
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