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
import { useFocusEffect } from "@react-navigation/native";
import BottomSheet from 'reanimated-bottom-sheet';
import { SliderBox } from "react-native-image-slider-box";
import { Snackbar } from 'react-native-paper';
import analytics from '@segment/analytics-react-native';
import { getUniqueId } from 'react-native-device-info';
import { Chip } from 'react-native-paper';
import YoutubePlayer from "react-native-youtube-iframe";
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import WebView from 'react-native-webview';
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
    const sheetRefCom = React.useRef(null);
    const [reportedProfile, setReportedProfile] = useState({});
    const sheetRefReport = React.useRef(null);
    const [reportType, setReportType] = useState('')
    const [reportComment, setReportComment] = useState('');
    const [actionstatus, setActionStatus] = useState(0);
    const [youtube, setyoutube] = useState('https://youtube.com');

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
            analytics.screen('Feed Screen', {
                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                deviceID: getUniqueId()
            })
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
                                analytics.track('Like', {
                                    userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                                    deviceID: getUniqueId(),
                                    by: JSON.parse(x)["0"]["id"],
                                    to: parseInt(props.activity.actor.id.replace('id', '')),
                                    actid: id
                                })
                            }
                        }

                    }}>
                        {status === '3' ? <LikeButton   {...props} /> : <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}><View pointerEvents={'none'}><LikeButton   {...props} /></View></TouchableWithoutFeedback>}
                    </TouchableWithoutFeedback>
                    <Icon onPress={() => navigation.navigate('SinglePost', { image: status === '3' ? children['0']['data']['image'] : '', activity: props, token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM' })} name="message-circle" type="Feather" style={{ fontSize: 22, marginLeft: 10, marginRight: -10 }} />
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
                        Linking.openURL('whatsapp://send?text=Hey! Check out this post by ' + data.activity.actor.data.name.charAt(0).toUpperCase() + data.activity.actor.data.name.slice(1) + ' on the new Genio app: https://link.genio.app/?link=https://link.genio.app/post?id=3a100e54-2d98-11eb-b373-0289d2c29892%26apn=com.genioclub.app').then((data) => {
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
    useEffect(() => {
        const check = async () => {
            var child = await AsyncStorage.getItem('children')
            if (child != null) {
                child = JSON.parse(child)
                setchildren(child)
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
            <ScrollView style={{ height: height - 80 }}>
                <WebView source={{ uri: youtube }} />
            </ScrollView>
        )
    }
    const there = (props) => {
        return (
            <SafeAreaProvider>

                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
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
            <ScrollView refreshControl={
                <RefreshControl refreshing={true} />} style={{ backgroundColor: '#f9f9f9', height: height, width: width }}>
            </ScrollView>
        );
    }
    const notthere = () => {
        return (
            <SafeAreaProvider>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Feed' })}><CompButton message={'Signup/Login to view posts from other kids'} back={'Home'} /></TouchableWithoutFeedback>
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
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
            <View>
                <FlatList
                    data={["Feed", "Quiz", "News"]}
                    scrollEnabled={true}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 15 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => {
                                // setValue({ ...value, color: item })
                                navigation.navigate('Browser', { url: "https://quizizz.com/join/quiz/5ea4540affcaa5001b9c4782/start" })
                                // console.log(item);  
                            }}>
                            <View style={{ alignSelf: 'center', alignItems: 'center', color: "#fff", justifyContent: 'center', height: 60, width: 60, borderRadius: 20, backgroundColor: '#327feb', borderColor: '#000', marginHorizontal: 6, borderWidth: 2 }} >
                                <Text style={{ alignSelf: 'center', alignItems: 'center', color: "#fff", justifyContent: 'center' }}>{item}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    //Setting the number of column
                    // numColumns={3}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }



    return (
        <>
            <ScreenHeader screen={'Genio'} icon={'bell'} navigation={navigation} fun={() => navigation.navigate('Notifications')} />
            <Features />
            {children == 'notyet' ? loading() : Object.keys(children).length > 0 && status == '3' ? there() : notthere()}
        </>

    );
};

export default FeedScreen;