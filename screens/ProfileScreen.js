/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, RefreshControl, Dimensions, Linking, BackHandler, Alert, View, ImageBackground, Image, FlatList, PixelRatio } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right, Left } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
import SpinnerButton from 'react-native-spinner-button';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import CameraRoll from "@react-native-community/cameraroll";
import { SECRET_KEY, ACCESS_KEY } from '@env';
import { useFocusEffect } from "@react-navigation/native";
import { RNS3 } from 'react-native-aws3';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import BottomSheet from 'reanimated-bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'getstream';
import { set } from 'react-native-reanimated';
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import LikeButton from '../components/LikeButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ReplyIcon from '../images/icons/heart.png';
import ActionSheet from 'react-native-actionsheet'
import ImageView from 'react-native-image-viewing';
import VideoPlayer from 'react-native-video-controls';
import { SliderBox } from "react-native-image-slider-box";
import { Snackbar } from 'react-native-paper';
import { Chip } from 'react-native-paper';
import YouTube from 'react-native-youtube';
import { LinkPreview } from '@flyerhq/react-native-link-preview'
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
updateStyle('activity', {
    container:
    {
        marginVertical: height * 0.01,
        borderRadius: width * 0.05,
        backgroundColor: "#fff",
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
const ProfileScreen = ({ navigation, route }) => {
    const [children, setchildren] = useState('notyet')
    const [status, setstatus] = useState('3')
    const [place, setplace] = useState('')
    const [data, setdata] = useState({ 'followers': [], 'following': [], type: 'loading' })
    const [certi, setCerti] = useState([]);
    const [Loading, setLoading] = useState(false)
    const [option, setOption] = useState('');
    const [token, setToken] = useState('');
    const [courses, setCourses] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [bottomType, setBottomType] = useState('')
    const [course, setCourse] = useState({
        org: '',
        url: '',
        name: ''
    })


    useFocusEffect(
    React.useCallback(() => {
        const onBackPress = () => {
            navigation.navigate('Home', { screen: 'Feed' })
            return true;
        };
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, []));


    const renderOptions = () => (
        <View
            scrollEnabled={false}
            style={{
                backgroundColor: '#fff',
                padding: 16,
                height: height * 0.5,
            }}
        >
            <TouchableOpacity onPress={() => { optionsRef.current.snapTo(1); setBottomType(''); setOption('') }} style={{ alignItems: 'center', paddingBottom: 10 }}><Icon name="chevron-small-down" type="Entypo" /></TouchableOpacity>
            {
                bottomType == '' && option == '' ?
                    <Button onPress={() => setOption('course')} full style={{ backgroundColor: "#327FEB" }}>
                        <Text>Add Course</Text>
                    </Button> : null
            }
            {
                bottomType == '' && option == 'course' ?
                    <View>
                        <TouchableOpacity onPress={() => { setOption(''); }} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} ><Icon name="cross" type="Entypo" /></TouchableOpacity>
                        <Text >Add Course Details!</Text>
                        <Item floatingLabel>
                            <Label>Course Organization</Label>
                            <Input value={course.org} onChangeText={text => setCourse({ ...course, org: text })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Course Name</Label>
                            <Input value={course.name} onChangeText={text => setCourse({ ...course, name: text })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Course Url</Label>
                            <Input value={course.url} onChangeText={text => setCourse({ ...course, url: text })} />
                        </Item>
                        <SpinnerButton
                            buttonStyle={{
                                borderRadius: 10,
                                margin: 20,
                                width: 200,
                                alignSelf: 'center',
                                backgroundColor: '#327FEB'
                            }}
                            isLoading={Loading}
                            spinnerType='BarIndicator'
                            onPress={async () => {
                                setLoading(true);
                                var children = await AsyncStorage.getItem('children')
                                children = JSON.parse(children)['0']
                                var data = JSON.stringify({ "gstoken": children['data']['gsToken'], "course_url": course.url, "course_name": course.name, "course_org": course.org });

                                var config = {
                                    method: 'post',
                                    url: 'https://barry-2z27nzutoq-as.a.run.app/updatecourses/${token}',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: data
                                };

                                axios(config)
                                    .then(function (response) {
                                        console.log(JSON.stringify(response.data));
                                        setLoading(false);
                                    })
                                    .catch(function (error) {
                                        alert(error);
                                        setLoading(false)
                                    });
                            }}
                            indicatorCount={10}
                        >
                            <Icon active type="Feather" name='chevron-right' style={{ color: 'black', fontWeight: 'bold' }} />
                        </SpinnerButton>

                    </View> : null
            }
            {
                bottomType == 'courses' ?
                    <FlatList
                        data={courses}
                        scrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            // flexGrow: 1,
                        }}
                        // style={{marginTop: 5}}
                        renderItem={({ item, i }) => (
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => console.log(courses)} >
                                <View
                                    key={i}
                                    style={{ flex: 1, alignItems: 'center', borderWidth: 0.3, margin: 4, padding: 10, borderRadius: 15, backgroundColor: "#327FEB" }}>
                                    <Text style={{ fontSize: 18, color: "#fff" }}>{item.org} : {item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        //Setting the number of column
                        numColumns={1}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    : null
            }
        </View>
    );


    const optionsRef = React.useRef(null);


    useEffect(() => {

        const analyse = async () => {
            var x = await AsyncStorage.getItem('children');
            analytics.screen('Profile Screen', {
                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"]: null,   
                deviceID: getUniqueId() 
            })
        }
        analyse();

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
                setToken(response.data.token)
            })
            .catch(function (error) {
                console.log(error);
            });


        const addfollows = async () => {
            var children = await AsyncStorage.getItem('children')
            if (children != null) {
                children = JSON.parse(children)['0']
                const client = connect('9ecz2uw6ezt9', children['data']['gsToken'], '96078');
                var user = client.feed('user', children['id'] + 'id');
                var follows = await user.followers()
                var user = client.feed('timeline', children['id'] + 'id');
                var following = await user.following()
                console.log(follows)
                setdata({ 'followers': follows['results'], 'following': following['results'], type: children['data']['type']})
            }
            // console.log(follows)
        }
        addfollows()
    }, [])
    useEffect(() => {
        const profileImage = async () => {
            var children = await AsyncStorage.getItem('children')
            if (children != null) {
                children = JSON.parse(children)['0']
                setsource(children['data']['image'])
            }
            // console.log(follows)
        }
        profileImage()
    }, [])
    useEffect(() => {
        const addCerti = async () => {
            var children = await AsyncStorage.getItem('children')
            if (children != null) {
                children = JSON.parse(children)['0']
                var config = {
                    method: 'get',
                    url: `https://barry-2z27nzutoq-as.a.run.app/getcerti/${children['data']['gsToken']}/${token}`,
                    headers: {}
                };
                axios(config)
                    .then(function (response) {
                        // console.log((response.data));
                        var arr = [];
                        Object.keys(response.data).forEach(e => arr.push(response.data[e]["data"]["path"]));
                        setCerti([...arr])
                        // console.log(arr);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                config = {
                    method: 'get',
                    url: `https://barry-2z27nzutoq-as.a.run.app/getcourse/${children['data']['gsToken']}/${token}`,
                    headers: {}
                };

                axios(config)
                    .then(function (response) {
                        var arr = [];
                        Object.keys(response.data).forEach(e => arr.push({ "name": response.data[e]["data"]["name"], "url": response.data[e]["data"]["url"], "org": response.data[e]["data"]["org"] }));
                        setCourses([...arr])
                        console.log(arr)
                    })
                    .catch(function (error) {
                        // console.log(error);
                    });

            }
        }
        addCerti();
    }, [])


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        const addfollows = async () => {
            var children = await AsyncStorage.getItem('children')
            children = JSON.parse(children)['0']
            const client = connect('9ecz2uw6ezt9', children['data']['gsToken'], '96078');
            var user = client.feed('user', children['id'] + 'id');
            var follows = await user.followers()
            var user = client.feed('timeline', children['id'] + 'id');
            var following = await user.following()
            console.log(follows)
            setdata({ 'followers': follows['results'], 'following': following['results'], followers:follows })
            // console.log(follows)
        }
        addfollows();

        const addCerti = async () => {
            var children = await AsyncStorage.getItem('children')
            children = JSON.parse(children)['0']
            var config = {
                method: 'get',
                url: `https://barry-2z27nzutoq-as.a.run.app/getcerti/${children['data']['gsToken']}/${token}`,
                headers: {}
            };
            axios(config)
                .then(function (response) {
                    // console.log((response.data));
                    var arr = [];
                    Object.keys(response.data).forEach(e => arr.push(response.data[e]["data"]["path"]));
                    setCerti([...arr])
                    // console.log(arr);
                })
                .catch(function (error) {
                    console.log(error);
                });

            config = {
                method: 'get',
                url: `https://barry-2z27nzutoq-as.a.run.app/getcourse/${children['data']['gsToken']}/${token}`,
                headers: {}
            };

            axios(config)
                .then(function (response) {
                    var arr = [];
                    Object.keys(response.data).forEach(e => arr.push({ "name": response.data[e]["data"]["name"], "url": response.data[e]["data"]["url"], "org": response.data[e]["data"]["org"] }));
                    setCourses([...arr])
                    console.log(arr);
                    setRefreshing(false)
                })
                .catch(function (error) {
                    // console.log(error);
                    setRefreshing(false)
                });

        }
        addCerti();

    }, []);

    const options = {
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };
    const [source, setsource] = useState('')
    const logout = async () => {
        var keys = await AsyncStorage.getAllKeys()
        await AsyncStorage.multiRemove(keys)
        navigation.navigate('Login', {screen:'Profile'})
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
                                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"]: null,   
                                deviceID: getUniqueId()
                            });
                            console.log(id); navigation.navigate('Comments', { data: data, actid: id, token: children['0']['data']['gsToken'] })
                        }}
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
    const there = () => {
        return (<View style={{height: height}}>
            <ScrollView style={{ backgroundColor: "#f9f9f9" }} >
                <ScreenHeader screen={'Profile'} icon={'more-vertical'} fun={() => status == '3' ? navigation.navigate('Settings') : navigation.navigate('Login', {screen:'Profile'})} />
                <StreamApp
                    apiKey={'9ecz2uw6ezt9'}
                    appId={'96078'}
                    token={children['0']['data']['gsToken']}
                >
                    <View style={{ marginTop: 30, flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => pickImage()} style={{ flexDirection: 'row' }}>
                            <Image
                                source={{ uri: source }}
                                style={{ width: 80, height: 80, borderRadius: 306, marginLeft: 30, }}
                            />
                            <View style={{ backgroundColor: '#327FEB', marginTop: 40, borderRadius: 1000, width: 40, height: 40, borderColor: 'white', borderWidth: 2, marginLeft: -35 }}>
                                <Icon name="camera" type="Feather" style={{ color: 'white', alignSelf: 'center', fontSize: 20, marginTop: 6 }} />
                            </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'column', marginLeft: 30, marginTop: 2, flexWrap: 'wrap' }}>
                            <View style={{ flexDirection: 'row', height: 33, marginBottom: 4 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20 }}>{children['0']['data']['name'][0].toUpperCase() + children['0']['data']['name'].substring(1)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor: 'white', color: '#327FEB', textAlign: 'center', borderRadius: 28.5, borderColor: '#327FEB', borderWidth: 1, paddingHorizontal: 10 }}>{'Kid'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', width: width - 40, alignSelf: 'center', height: 200, borderRadius: 10, marginTop: 20, marginBottom: 20, }}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                            <View style={{ flexDirection: 'column', marginLeft: 30, marginLeft: 30, marginRight: 30 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>2</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Posts</Text>
                            </View>
                            <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{data.followers.length}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Followers</Text>
                            </View>
                            <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{data.following.length}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Following</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                            <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{certi.length}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Certifications</Text>
                            </View>
                            <TouchableOpacity onPress={() => { optionsRef.current.snapTo(0); setBottomType('courses') }} style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 40, marginRight: 10 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>{courses.length}</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center', fontSize: 14, }}>Courses</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={async () => {
                            var x = await AsyncStorage.getItem('children');
                            analytics.track('Opened website', {
                                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"]: null,   
                                deviceID: getUniqueId() 
                            })
                            Linking.openURL("https://eager-bohr-ef70c5.netlify.app/" + children['0']['data']['gsToken'])
                                .catch(err => {
                                    console.error("Failed opening page because: ", err)
                                    alert('Failed to open page')
                                })
                        }}

                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 15, backgroundColor: '#327FEB', color: 'white', width: 100, textAlign: 'center', padding: 3, borderRadius: 15 }}>{'Website'}</Text>
                    </TouchableOpacity>
                    <FlatFeed feedGroup="user"  Activity={CustomActivity} options={{ withOwnReactions: true }} />
                </StreamApp>
            </ScrollView>
            <BottomSheet
                ref={optionsRef}
                snapPoints={[height * 0.5, 0, -200]}
                initialSnap={2}
                enabledGestureInteraction={true}
                borderRadius={25}
                renderContent={renderOptions}
            />
        </View>)
    }
    const notthere = () => {
        return (
            <View style={{ backgroundColor: 'white', height: height, width: width }}>
                <ScreenHeader screen={'Profile'} icon={'more-vertical'} fun={() => status == '3' ? navigation.navigate('Settings') : navigation.navigate('Login')} />
                <TouchableOpacity onPress={()=>navigation.navigate('Login', {screen:'Profile'})}><CompButton message={'Signup/Login to create profile'}  /></TouchableOpacity>
            </View>
        )
    }
    useEffect(() => {
        const check = async () => {
            var child = await AsyncStorage.getItem('children')
            if (child != null) {
                child = JSON.parse(child)
                setchildren(child)
            }
            else{
                setchildren({})
            }
        }
        check()
    }, [])
    useEffect(() => {
        const check = async () => {
            var st = await AsyncStorage.getItem('status')
            setstatus(st)
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
                    axios.get('http://104.199.158.211:5000/getchild/' + pro.email + `/?token=${token}`)
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
    const pickImage = () => {
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
                const file = {
                    // `uri` can also be a file system path (i.e. file://)
                    uri: response.uri,
                    name: children['0']['data']['gsToken'] + '.png',
                    type: "image/png",
                }

                const options = {
                    keyPrefix: '',
                    bucket: "kids-linkedin-avatars",
                    region: "ap-south-1",
                    accessKey: ACCESS_KEY,
                    secretKey: SECRET_KEY,
                    successActionStatus: 201
                }
                RNS3.put(file, options).then(response => {
                    console.log("dassd")
                    if (response.status !== 201)
                        throw new Error("Failed to upload image to S3");
                })
            }
        });
    }
    const loading = () => {
        return (
            <View style={{ backgroundColor: 'white', height: height, width: width }}>
                <Image source={require('../assets/loading.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: width / 2 }} />
            </View>
        );
    }
    return (
        <View>
            {children == 'notyet' ? loading() : Object.keys(children).length > 0 && status == '3' ? there() : notthere()}
        </View>
    );
};

const styles = StyleSheet.create({
    Next: {
        alignSelf: 'center',
        flexDirection: 'row',
        padding: 12,
        // margin: 5,
        backgroundColor: '#327FEB',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#fff",
        width: 165,
        flex: 1,
        marginHorizontal: 20
    },
})

export default ProfileScreen;