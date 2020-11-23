/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, Alert, Image, Share, Linking, ScrollView, TouchableHighlight, ImageStore, StatusBar, RefreshControl } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ReplyIcon from '../images/icons/heart.png';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import ImageView from 'react-native-image-viewing';
import VideoPlayer from 'react-native-video-controls';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { useFocusEffect } from "@react-navigation/native";
import BottomSheet from 'reanimated-bottom-sheet';
import { SliderBox } from "react-native-image-slider-box";
import { Snackbar } from 'react-native-paper';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { Chip } from 'react-native-paper';
import { clockRunning, set } from 'react-native-reanimated';
import YouTube from 'react-native-youtube';
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import ReactMoE, { MoEProperties } from 'react-native-moengage';
import { connect } from 'getstream';
var height = Dimensions.get('screen').height;
var halfHeight = height / 2;
var width = Dimensions.get('screen').width;
updateStyle('activity', {
    container:
    {
        marginVertical: height * 0.01,
        borderRadius: width * 0.05,
        backgroundColor: "#fff",
        marginHorizontal: 5,
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
        paddingRight: 20,
        paddingLeft: 20
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

    // useFocusEffect(
    //     React.useCallback(() => {
    //         const onBackPress = () => {
    //             Alert.alert("Hold on!", "Are you sure you want to Exit?", [
    //                 {
    //                     text: "Cancel",
    //                     onPress: () => null,
    //                     style: "cancel"
    //                 },
    //                 { text: "YES", onPress: () => BackHandler.exitApp() }
    //             ]);
    //             return true;
    //         };

    //         BackHandler.addEventListener("hardwareBackPress", onBackPress);

    //         return () =>
    //             BackHandler.removeEventListener("hardwareBackPress", onBackPress);

    //     }, []));

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
        var x = await AsyncStorage.getItem('children');
        analytics.track('Post Reported', {
            userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
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

    const renderComments = (props) => {
        var data = <Text></Text>
        data = actid ? <Text></Text> : <View style={{ height: height, backgroundColor: 'black' }}></View>
        // <View style={{ height: height, backgroundColor: 'black' }}></View>
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
        const footer = (id, data) => {
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
                        onPress={async () => {
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('Comment', {
                                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                                deviceID: getUniqueId()
                            });
                            console.log(id); navigation.navigate('Comments', { data: data, actid: id, token: children['0']['data']['gsToken'] })
                        }}
                    />
                    <Icon onPress={() => {
                        Linking.openURL('whatsapp://send?text=Hey! Check out this post by '+ data.activity.actor.data.name.charAt(0).toUpperCase() + data.activity.actor.data.name.slice(1)+' on the new Genio app: https://link.genio.app/?link=https://link.genio.app/post?id=3a100e54-2d98-11eb-b373-0289d2c29892%26apn=com.genioclub.app').then((data) => {
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
                Header={
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: props.activity.actor.data ? props.activity.actor.data.profileImage : '' }}
                                style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{props.activity.actor.data ? props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) : null}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB', textAlign: 'center', borderRadius: 28.5, borderColor: '#327FEB', borderWidth: 1, paddingHorizontal: 10 }}>{props.activity.actor.data ? props.activity.actor.data.type : null}</Text>
                            </View>
                            <ActionSheet
                                useNativeDriver={true}
                                ref={refActionSheet}
                                styles={{ borderRadius: 10, margin: 10 }}
                                options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                                cancelButtonIndex={2}
                                onPress={(index) => { index == 1 ? report(props.activity) : null; }}
                            />
                            <Right><Icon onPress={() => { showActionSheet(); }} name="options-vertical" type="SimpleLineIcons" style={{ fontSize: 16, marginRight: 20, color: '#383838' }} /></Right>
                        </View>
                        <View style={{ width: '80%', height: 1, backgroundColor: 'rgba(169, 169, 169, 0.2)', alignSelf: 'center', marginTop: 20 }}></View>
                    </View>
                }
                Content={
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('SinglePost', { token: children['0']['data']['gsToken'], activity: props })} style={{ padding: 20 }}>
                        {props.activity.object === 'default123' ? <View style={{ marginTop: -20 }}></View> : <Text style={{ fontFamily: 'NunitoSans-Regular', paddingHorizontal: 10 }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text>}
                        {/* {props.activity.image ? <ImageView
                            presentationStyle={{ height: height / 3 }}
                            images={images}
                            imageIndex={0}
                            visible={visible}
                            doubleTapToZoomEnabled={true}
                            swipeToCloseEnabled={true}
                            animationType={'fade'}
                            animationType={'none'}
                            onRequestClose={() => setIsVisible(false)}
                            FooterComponent={footer2}
                            HeaderComponent={() => {
                                return (
                                    <View><View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, padding: 10 }}>
                                        <Image
                                            source={{ uri: props.activity.actor.data?props.activity.actor.data.profileImage:'' }}
                                            style={{ width: 42, height: 42, borderRadius: 1000, marginLeft: 10 }}
                                        />
                                        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                                            <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: 'white' }}>{props.activity.actor.data ? props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) : null}</Text>
                                            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB', textAlign: 'center', borderRadius: 28.5, borderColor: '#327FEB', borderWidth: 1, paddingHorizontal: 10 }}>{children['0']['data']['type']}</Text>
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

                        /> : <View></View>} */}
                        <View style={{ alignSelf: 'center' }}>
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
                        </View>
                        {props.activity.object.includes('http') ?
                            <LinkPreview text={props.activity.object} containerStyle={{ backgroundColor: '#efefef', borderRadius: 10, marginTop: 10, width: width - 80, alignSelf: 'center' }} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 50) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                            : null}

                        {props.activity.video ?
                            <View style={{ width: width - 40, height: 340 }}>
                                <VideoPlayer
                                    source={{ uri: props.activity.video }}
                                    navigator={navigator}
                                /></View> : null}
                        {props.activity.youtube ?
                            <YouTube
                                videoId={props.activity.youtube} // The YouTube video ID
                                apiKey={'AIzaSyD6OI-AVRxALkG2WVshNSqrc2FuEfH2Z04'}
                                style={{ borderRadius: 10, width: width - 80, height: 340, }}
                            /> : null}
                        {props.activity.tag === 'Genio' || props.activity.tag === 'Other' || props.activity.tag === '' ? null : <View style={{ backgroundColor: '#327FEB', borderRadius: 10, width: 90, padding: 9, marginTop: 5, marginLeft: -10 }}><Text style={{ fontFamily: 'NunitoSans-Regular', color: 'white', fontSize: 10, alignSelf: 'center' }}>{props.activity.tag}</Text></View>}
                    </TouchableWithoutFeedback>
                }
                Footer={footer(props.activity.id, props)}
            />
        );
    };
    const CustomActivityDefault = (props) => {
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
        const footer = (id, data) => {
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
                        onPress={() => { analytics.track('Comment'); console.log(id); navigation.navigate('Comments', { data: data, actid: id, token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMjNpZCJ9.NZsYpdUhcRrrK9QYtouTfV3xE80_SJv_mLmUWZAfxvA' }) }}
                    />
                    <Icon onPress={() => {
                        Linking.openURL('whatsapp://send?text=Hey! Check out this post by '+ data.activity.actor.data.name.charAt(0).toUpperCase() + data.activity.actor.data.name.slice(1)+' on the new Genio app!').then((data) => {
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
        props.activity.image ? props.activity.image.split(', ').map((item) => item != '' ? images.push({ uri: item }) : null) : null
        props.activity.own_reactions['like'] ? console.log(props.activity.own_reactions['like'][0]) : null
        return (
            <Activity
                {...props}
                Header={
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: props.activity.actor.data ? props.activity.actor.data.profileImage : '' }}
                                style={{ width: 42, height: 42, borderRadius: 10000, marginLeft: 20, marginRight: 15 }}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: '#383838' }}>{props.activity.actor.data ? props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) : null}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB', textAlign: 'center', borderRadius: 28.5, borderColor: '#327FEB', borderWidth: 1, paddingHorizontal: 10 }}>{props.activity.actor.data ? props.activity.actor.data.type : 'Child'}</Text>
                            </View>
                            <ActionSheet
                                useNativeDriver={true}
                                ref={refActionSheet}
                                styles={{ borderRadius: 10, margin: 10 }}
                                options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                                cancelButtonIndex={2}
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
                            presentationStyle={{ height: height / 3 }}
                            images={images}
                            imageIndex={0}
                            visible={visible}
                            doubleTapToZoomEnabled={true}
                            swipeToCloseEnabled={true}
                            animationType={'fade'}
                            animationType={'none'}
                            onRequestClose={() => setIsVisible(false)}
                            FooterComponent={footer2}
                            HeaderComponent={() => {
                                return (
                                    <View><View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, padding: 10 }}>
                                        <Image
                                            source={{ uri: "props.activity.actor.data?props.activity.actor.data.profileImage:''" }}
                                            style={{ width: 42, height: 42, borderRadius: 1000, marginLeft: 10 }}
                                        />
                                        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                                            <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, color: 'white' }}>{props.activity.actor.data ? props.activity.actor.data.name.charAt(0).toUpperCase() + props.activity.actor.data.name.slice(1) : null}</Text>
                                            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB', textAlign: 'center', borderRadius: 28.5, borderColor: '#327FEB', borderWidth: 1, paddingHorizontal: 10 }}>{ }</Text>
                                        </View>
                                        <ActionSheet
                                            useNativeDriver={true}
                                            ref={refActionSheet}
                                            styles={{ borderRadius: 10, margin: 10 }}
                                            options={[<Text style={{ fontFamily: 'NunitoSans-Bold' }}>Share</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'red' }}>Report</Text>, <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Cancel</Text>]}
                                            cancelButtonIndex={2}
                                            onPress={(index) => { index == 1 ? report(props.activity) : null; }}
                                        />
                                        <Right><Icon onPress={() => { showActionSheet(); }} name="options" type="SimpleLineIcons" style={{ fontSize: 20, marginRight: 20, color: 'white' }} /></Right>
                                    </View>
                                        <Text style={{ fontFamily: 'NunitoSans-Regular', color: 'white', marginLeft: 30, marginTop: 10, marginRight: 30, fontSize: 14 }}>{props.activity.object === 'default123' ? '' : props.activity.object}</Text></View>)
                            }}

                        /> : <View></View>}
                        <TouchableWithoutFeedback activeOpacity={1} onPress={() => setIsVisible(true)} style={{ alignSelf: 'center' }}>
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
                        </TouchableWithoutFeedback>
                        {props.activity.object.includes('http') ?
                            <LinkPreview text={props.activity.object} containerStyle={{ backgroundColor: '#efefef', borderRadius: 10, marginTop: 10, width: width - 80, alignSelf: 'center' }} renderDescription={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 11 }}>{text.length > 100 ? text.slice(0, 50) + '...' : text}</Text>} renderText={(text) => <Text style={{ fontFamily: 'NunitoSans-Bold', marginBottom: -40 }}>{''}</Text>} />
                            : null}

                        {props.activity.video ?
                            <View style={{ width: width - 40, height: 340 }}>
                                <VideoPlayer
                                    source={{ uri: props.activity.video }}
                                    navigator={navigator}
                                /></View> : null}
                        {props.activity.youtube ?
                            <YouTube
                                videoId={props.activity.youtube} // The YouTube video ID
                                apiKey={'AIzaSyD6OI-AVRxALkG2WVshNSqrc2FuEfH2Z04'}
                                style={{ borderRadius: 10, width: width - 80, height: 340, }}
                            /> : null}
                        {props.activity.tag === 'Genio' || props.activity.tag === 'Other' ? null : <Chip style={{ backgroundColor: '#fff', margin: 4, paddingLeft: 10, paddingRight: 10, borderWidth: 0, borderColor: "#327FEB", borderRadius: 30 }} textStyle={{ color: "#327FEB", fontFamily: 'NunitoSans-Regular' }} >{props.activity.tag}</Chip>
                        }
                    </View>
                }
                Footer={footer(props.activity.id, props)}
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
            if (child != null) {
                child = JSON.parse(child)
                setchildren(child)
                // const client = connect('9ecz2uw6ezt9', child[0]['data']['gsToken'], '96078');
                // var user = client.feed('timeline', child[0]['id'] + 'id');
                // user.get({ limit: 1, id_lt: '9aaabf77-2828-11eb-9805-0a7d4ff68278' })
                //     .then((data) => {
                //         // console.log(data)
                //     })
                //     .catch((data) => {
                //         // console.log(data)
                //     })
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
                            axios.get('http://104.199.158.211:5000/getchild/' + pro.email + `/?token=${response.data.token}`)
                                .then(async (response) => {
                                    setchildren(response.data)
                                    // console.log("response");
                                    await AsyncStorage.setItem('children', JSON.stringify(response.data))
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        })
                        .catch(function (error) {
                            console.log(error);
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
                        token={'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMjNpZCJ9.NZsYpdUhcRrrK9QYtouTfV3xE80_SJv_mLmUWZAfxvA'}
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
                        }} notify navigation={navigation} feedGroup="timeline" Activity={CustomActivityDefault} options={{ withOwnReactions: true }} />
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
    useEffect(() => {
        StatusBar.setBarStyle('dark-content')
    })

    return (
        <>
            <ScreenHeader screen={'Genio'} icon={'bell'} fun={() => navigation.navigate('Notifications')} />
            {children == 'notyet' ? loading() : Object.keys(children).length > 0 && status == '3' ? there() : notthere()}
        </>

    );
};

export default FeedScreen;