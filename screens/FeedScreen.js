/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, Alert, Image, Share, Linking, TouchableHighlight, ImageStore } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReplyIcon from '../images/icons/heart.png';
import ActionSheet from 'react-native-actionsheet'
import ImageView from 'react-native-image-viewing';
import VideoPlayer from 'react-native-video-controls';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { useFocusEffect } from "@react-navigation/native";
import BottomSheet from 'reanimated-bottom-sheet';
import { SliderBox } from "react-native-image-slider-box";
import { Snackbar } from 'react-native-paper';
import analytics from '@segment/analytics-react-native';
import { Chip } from 'react-native-paper';
import { clockRunning, set } from 'react-native-reanimated';
import YouTube from 'react-native-youtube';
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
var height = Dimensions.get('screen').height;
var halfHeight = height / 2;
var width = Dimensions.get('screen').width;

updateStyle('activity', {
    container:
    {
        marginVertical: height * 0.01,
        borderRadius: width * 0.05,
        backgroundColor: "#fff",
        marginHorizontal: 15,
        elevation: 0.2,
        fontFamily: 'NunitoSans-Regular'
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
const FeedScreen = ({ navigation, route }) => {
    const [actid, setactid] = useState('f137b98f-0d0d-11eb-8255-128a130028af');
    const [type, settype] = useState('like');
    const [display, setdisplay] = useState('none');
    const [children, setchildren] = useState('notyet')
    const [status, setstatus] = useState('0')
    const [options, setoptions] = useState({})
    const sheetRefLike = React.useRef(null);
    const [showToast, setShowToast] = useState(false)
    const sheetRefCom = React.useRef(null);
    const [reportedProfile, setReportedProfile] = useState({});
    const sheetRefReport = React.useRef(null);
    const [reportType, setReportType] = useState('')
    const [reportComment, setReportComment] = useState('');
    const [actionstatus, setActionStatus] = useState(0);

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

    const report = (x) => {

        // console.log(children);
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
                console.log(JSON.stringify(response.data));
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
            return <View style={{ height: height, backgroundColor: 'lightgrey' }}><LikeList reactionKind={'like'} {...options} activityId={actid} /></View>
        }
        return <View style={{ height: height, backgroundColor: 'lightgrey' }}><CommentList {...options} activityId={actid} /><CommentBox {...options} /></View>
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
            <TouchableOpacity onPress={() => { sheetRefReport.current.snapTo(2); }} style={{ alignItems: 'center', paddingBottom: 10 }}><Icon name="chevron-small-down" type="Entypo" /></TouchableOpacity>
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

    const renderComments = (props) => {
        var data = <Text></Text>
        data = actid ? <Text></Text> : <View style={{ height: height, backgroundColor: 'black' }}></View>
        // <View style={{ height: height, backgroundColor: 'black' }}></View>
        // 

    }
    const CustomActivity = (props) => {

        let img = props.activity.image ? props.activity.image.split(", ").length - 1 > 1 ? props.activity.image.split(", ").pop : props.activity.image : '';

        const [commentVisible, setCmv] = React.useState('none');
        const refActionSheet = useRef(null);
        const onShare = async () => {

        };
        const nulre = () => {
            return null
        }
        const showActionSheet = () => {
            refActionSheet.current.show()
        }
        const footer = (id) => {
            return (<View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LikeButton  {...props} />
                    <Icon onPress={() => props.navigation.navigate('SinglePost', { activity: props })} name="message-circle" type="Feather" style={{ fontSize: 22, marginLeft: 10, marginRight: -10 }} />
                    <ReactionIcon
                        labelSingle=" "
                        labelPlural=" "
                        counts={props.activity.reaction_counts}
                        kind="comment"
                        width={-80}
                        onPress={() => { analytics.track('Comment'); console.log(id); setoptions(props); settype('comment'); setactid(id); sheetRefLike.current.snapTo(1) }}
                    />
                    <Icon onPress={() => {
                        Linking.openURL('whatsapp://send?text=check').then((data) => {
                            console.log('WhatsApp Opened');
                        }).catch(() => {
                            alert('Make sure Whatsapp installed on your device');
                        });
                    }} name="whatsapp" type="Fontisto" style={{ fontSize: 20, marginLeft: '55%', color: '#4FCE5D' }} />
                </View>
                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ReactionIcon
                        labelSingle="Star"
                        labelPlural="Stars"
                        counts={props.activity.reaction_counts}
                        kind="like"
                        height={0}
                        width={0}
                        onPress={() => { analytics.track('Like'); console.log(id); setoptions(props); settype('like'); setactid(id); sheetRefLike.current.snapTo(1) }}
                    />
                    <Text style={{ marginRight: -15, marginLeft: 5 }}>•</Text>
                    <ReactionIcon
                        labelSingle="comment"
                        labelPlural="comments"
                        counts={props.activity.reaction_counts}
                        kind="comment"
                        height={0}
                        width={-20}
                        onPress={() => { analytics.track('Comment'); console.log(id); setoptions(props); settype('comment'); setactid(id); sheetRefLike.current.snapTo(1) }}
                    />
                </View> */}
                {/* <CommentBox
                onSubmit={(text) =>
                    props.onAddReaction('comment', props.activity.id, {
                        data: { 'text': text },
                    })
                }
                noAvatar
                textInputProps={{ placeholder: 'Add a comment....', height: 45, marginTop: 10, marginLeft: -1, placeholderTextColor: 'grey', }}
                styles={{ container: { maxHeight: 45, elevation: 0, color: 'black' } }}
            /> */}
            </View>)
        }
        const footer2 = () => {
            return (<View style={{ padding: 14, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LikeButton {...props} />
                    <Icon onPress={() => props.navigation.navigate('SinglePost', { activity: props })} name="comment" type="EvilIcons" style={{ fontSize: 30, marginLeft: 10, color: 'white' }} />
                    <Icon onPress={() => {
                        Linking.openURL('whatsapp://send?text=check').then((data) => {
                            // console.log('WhatsApp Opened');
                        }).catch(() => {
                            alert('Make sure Whatsapp is installed on your device');
                        });
                    }} name="whatsapp" type="Fontisto" style={{ fontSize: 22, marginLeft: 15, color: '#4FCE5D' }} />
                    <Right>
                        <View style={{ flexDirection: 'row', alignItems: 'center', color: 'white' }}>
                            <ReactionIcon
                                labelSingle="like"
                                labelPlural="likes"
                                counts={props.activity.reaction_counts}
                                kind="like"
                                height={0}
                                labelFunction={(text) => { return (<Text style={{ color: 'white', fontFamily: 'NunitoSans-Regular' }}>{String(text.count) + ' ' + (text.count === 1 ? 'like' : 'likes')}</Text>) }}
                                width={0}
                                onPress={() => props.navigation.navigate('SinglePost', { activity: props })}
                            />
                            <Text style={{ marginRight: -15, marginLeft: 5, color: 'white', fontFamily: 'NunitoSans-Regular' }}>•</Text>
                            <ReactionIcon
                                labelSingle="comment"
                                labelPlural="comments"
                                counts={props.activity.reaction_counts}
                                kind="comment"
                                height={0}
                                width={-20}
                                labelFunction={(text) => { return (<Text style={{ color: 'white', fontFamily: 'NunitoSans-Regular' }}>{String(text.count) + ' ' + (text.count === 1 ? 'comment' : 'comments')}</Text>) }}
                                onPress={() => props.navigation.navigate('SinglePost', { activity: props })}
                            />
                        </View>
                    </Right>
                </View>
                {/* <CommentBox
                onSubmit={(text) =>
                    props.onAddReaction('comment', props.activity.id, {
                        data: { 'text': text },
                    })
                }
                noAvatar
                textInputProps={{ placeholder: 'Add a comment....', height: 45, marginTop: 10, marginLeft: -1, placeholderTextColor: 'grey', }}
                styles={{ container: { maxHeight: 45, elevation: 0, color: 'black' } }}
            /> */}
            </View>)
        }
        const [visible, setIsVisible] = React.useState(false);
        var images = []
        const [source, setsource] = useState('https://d5c8j8afeo6fv.cloudfront.net/profile.png')
        // console.log(props.activity.id)
        props.activity.image ? props.activity.image.split(', ').map((item) => item != '' ? images.push({ uri: item }) : null) : null
        props.activity.own_reactions['like'] ? console.log(props.activity.own_reactions['like'][0]) : null
        return (
            <Activity
                {...props}
                Header={
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                // onLoad={() => setsource('https://d5c8j8afeo6fv.cloudfront.net/' + children['0']['data']['gsToken'] + '.png')}
                                source={{ uri: props.activity.user ? props.activity.user.data.profileImage : 'https://d5c8j8afeo6fv.cloudfront.net/profile.png' }}
                                style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{props.activity.actor.data ? props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) : null}</Text>
                            </View>
                            <ActionSheet
                                ref={refActionSheet}
                                options={['Share', 'Report', 'Close']}
                                cancelButtonIndex={2}
                                destructiveButtonIndex={1}
                                onPress={(index) => { index == 1 ? report(props.activity) : null; }}
                            />
                            <Right><Icon onPress={() => { showActionSheet(); }} name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 16, marginRight: 20, color: '#383838' }} /></Right>
                        </View>
                        <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>
                    </View>
                }
                Content={
                    <View style={{ padding: 20 }}>
                        {props.activity.object === 'default123' ? <View style={{ marginTop: -20 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10 }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text>}
                        {props.activity.image ? <ImageView
                            images={images}
                            imageIndex={0}
                            visible={visible}
                            doubleTapToZoomEnabled={true}
                            animationType={'none'}
                            onRequestClose={() => setIsVisible(false)}
                            FooterComponent={footer2}
                            HeaderComponent={() => {
                                return (
                                    <View><View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, padding: 10 }}>
                                        <Image
                                            onLoad={() => setsource('https://d5c8j8afeo6fv.cloudfront.net/' + children['0']['data']['gsToken'] + '.png')}
                                            source={{ uri: source }}
                                            style={{ width: 60, height: 60, borderRadius: 1000, marginLeft: 10 }}
                                        />
                                        <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                            <Text style={{ fontFamily: 'NunitoSans-Regular', color: 'white' }}>{props.activity.actor.data ? props.activity.actor.data.name : null}</Text>
                                            <Text style={{ fontFamily: 'NunitoSans-Regular', color: 'white' }}>{props.activity.actor.created_at.split('T')[0].replace('-', '/')}</Text>
                                        </View>
                                        <ActionSheet
                                            ref={refActionSheet}
                                            options={['Share', 'Report', 'Close']}
                                            cancelButtonIndex={2}
                                            destructiveButtonIndex={1}
                                            onPress={(index) => { index == 1 ? report(props.activity) : null; }}
                                        />
                                        <Right><Icon onPress={() => { showActionSheet(); }} name="options" type="SimpleLineIcons" style={{ fontSize: 20, marginRight: 20, color: 'white' }} /></Right>
                                    </View>
                                        <Text style={{ fontFamily: 'NunitoSans-Regular', color: 'white', marginLeft: 30, marginTop: 10, marginRight: 30, fontSize: 14 }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text></View>)
                            }}

                        /> : <View></View>}
                        <TouchableOpacity activeOpacity={1} onPress={() => setIsVisible(true)} style={{ alignSelf: 'center' }}>
                            {props.activity.image ? props.activity.image.split(", ").length - 1 == 1 ? <Image
                                source={{ uri: props.activity.image.split(", ")[0] }}
                                style={{ width: width - 80, height: 340, marginTop: 20, borderRadius: 10 }}
                            /> : <View style={{ height: 340 }}><SliderBox
                                images={props.activity.image.split(", ").filter(n => n)}
                                dotColor="#FFEE58"
                                inactiveDotColor="#90A4AE"
                                paginationBoxVerticalPadding={20}
                                sliderBoxHeight={340}
                                ImageComponentStyle={{ borderRadius: 10, width: width - 80, height: 340, }}
                                circleLoop={true}
                            // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                            // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
                            /></View> : <View></View>}
                            {props.activity.video ?
                                <View style={{ width: width - 40, height: 340 }}>
                                    <VideoPlayer
                                        source={{ uri: props.activity.video }}
                                        navigator={navigator}
                                    /></View> : null}
                            <View style={{ backgroundColor: 'lightgreen', borderRadius: 10, width: 90, padding: 9, marginTop: 4 }}><Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 1 }}>Assignment</Text></View>
                        </TouchableOpacity>
                    </View>
                }
                Footer={footer(props.activity.id)}
            />
        );
    };

    var width = Dimensions.get('screen').width;
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
            // console.log(child)
            if (child != null) {
                child = JSON.parse(child)
                setchildren(child)
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
                    axios.get('http://104.199.158.211:5000/getchild/' + pro.email + '/')
                        .then(async (response) => {
                            setchildren(response.data)
                            await AsyncStorage.setItem('children', JSON.stringify(response.data))
                        })
                        .catch((error) => {
                            console.log(error)
                        })
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
    const there = (props) => {
        return (
            <SafeAreaProvider>
                <ScreenHeader screen={'Genio'} icon={'bell'} fun={() => navigation.navigate('Notifications')} />
                {/* <YouTube
                    videoId="KVZ-P-ZI6W4" // The YouTube video ID
                    apiKey={'AIzaSyD6OI-AVRxALkG2WVshNSqrc2FuEfH2Z04'}
                    // onReady={e => this.setState({ isReady: true })}
                    // onChangeState={e => this.setState({ status: e.state })}
                    // onChangeQuality={e => this.setState({ quality: e.quality })}
                    // onError={e => this.setState({ error: e.error })}
                    style={{ alignSelf: 'stretch', height: 300 }}
                /> */}
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
                    <StreamApp
                        style={{ marginTop: 20 }}
                        apiKey="9ecz2uw6ezt9"
                        appId="96078"
                        token={children['0']['data']['gsToken']}
                    >
                        {/* <View style={{backgroundColor:'#F5F5F5', position:'relative'}}><Text style={{ fontFamily: 'NunitoSans-Bold', color: "#000", fontSize: 20, padding: 20 }}>Welcome {children['0']['data']['name']}!</Text></View> */}
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
        );
    }
    const loading = () => {
        return (
            <View style={{ backgroundColor: 'white', height: height, width: width }}>
                <Image source={require('../assets/loading.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: width / 2 }} />
            </View>
        );
    }
    const notthere = () => {
        return (
            <SafeAreaProvider>
                <ScreenHeader screen={'Genio'} icon={'bell'} fun={() => navigation.navigate('Notifications')} />
                <TouchableOpacity onPress={()=>navigation.navigate('Login')}><CompButton message={'Signup/Login to view posts from other kids'} /></TouchableOpacity>
                {/* <YouTube
                    videoId="KVZ-P-ZI6W4" // The YouTube video ID
                    apiKey={'AIzaSyD6OI-AVRxALkG2WVshNSqrc2FuEfH2Z04'}
                    // onReady={e => this.setState({ isReady: true })}
                    // onChangeState={e => this.setState({ status: e.state })}
                    // onChangeQuality={e => this.setState({ quality: e.quality })}
                    // onError={e => this.setState({ error: e.error })}
                    style={{ alignSelf: 'stretch', height: 300 }}
                /> */}
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
                    <StreamApp
                        style={{ marginTop: 20 }}
                        apiKey="9ecz2uw6ezt9"
                        appId="96078"
                        token={'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMjNpZCJ9.NZsYpdUhcRrrK9QYtouTfV3xE80_SJv_mLmUWZAfxvA'}
                    >
                        {/* <View style={{backgroundColor:'#F5F5F5', position:'relative'}}><Text style={{ fontFamily: 'NunitoSans-Bold', color: "#000", fontSize: 20, padding: 20 }}>Welcome {children['0']['data']['name']}!</Text></View> */}
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
    return (
        children == 'notyet' ? loading() : Object.keys(children).length > 0 && status == '3' ? there() : notthere()

    );
};

export default FeedScreen;