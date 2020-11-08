/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, RefreshControl, Dimensions, Linking, View, ImageBackground, Image, FlatList, PixelRatio } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right, Left } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, ReplyIcon, Avatar } from 'react-native-activity-feed';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
import SpinnerButton from 'react-native-spinner-button';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import CameraRoll from "@react-native-community/cameraroll";
import { SECRET_KEY, ACCESS_KEY } from '@env';
import { RNS3 } from 'react-native-aws3';
import BottomSheet from 'reanimated-bottom-sheet';
import { connect } from 'getstream';
import { set } from 'react-native-reanimated';
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
    const [place, setplace] = useState('')
    const [data, setdata] = useState({ 'followers': [], 'following': [], type:'loading' })
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

        var data = JSON.stringify({"username":"Shashwat","password":"GenioKaPassword"});

        var config = {
        method: 'post',
        url: 'http://104.199.146.206:5000/getToken',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
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
            children = JSON.parse(children)['0']
            const client = connect('9ecz2uw6ezt9', children['data']['gsToken'], '96078');
            var user = client.feed('user', children['id'] + 'id');
            var follows = await user.followers()
            var user = client.feed('timeline', children['id'] + 'id');
            var following = await user.following()
            console.log(follows)
            setdata({ 'followers': follows['results'], 'following': following['results'], type:children['data']['type'] })
            // console.log(follows)
        }
        addfollows()
    }, [])
    useEffect(() => {
        const profileImage = async () => {
            var children = await AsyncStorage.getItem('children')
            children = JSON.parse(children)['0']
            setsource(children['data']['image'])
            // console.log(follows)
        }
        profileImage()
    }, [])
    useEffect(() => {
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
                    console.log(arr)
                })
                .catch(function (error) {
                    // console.log(error);
                });

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
            setdata({ 'followers': follows['results'], 'following': following['results'] })
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
        navigation.navigate('Login')
    }
    const there = () => {
        return (<View>
            <ScrollView style={{ backgroundColor: "#f9f9f9" }} >
                <Header noShadow style={{ backgroundColor: '#fff', flexDirection: 'row', height: 73, borderBottomWidth: 0, paddingTop: 25, paddingBottom: 20, elevation: 2 }}>
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={{ fontFamily: 'NunitoSans-Bold', color: "#000", fontSize: 28, marginTop: 0, marginLeft: -50 }}>Profile</Title>
                    </Body>
                    <Right style={{ marginRight: 25}}>
                        <Icon onPress={() => { navigation.navigate('Settings') }} style={{ color: "#000", fontSize: 28 }} type="Feather" name="settings" />
                    </Right>
                </Header>
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
                            <View style={{ flexDirection: 'row', height:33, marginBottom:4 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20 }}>{children['0']['data']['name'][0].toUpperCase() + children['0']['data']['name'].substring(1)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, backgroundColor:'white', color:'#327FEB',  textAlign:'center',  borderRadius:28.5, borderColor:'#327FEB', borderWidth:1, paddingHorizontal:10}}>{data.type}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', width: width - 40, alignSelf: 'center', height: 200, borderRadius: 10, marginTop: 20, marginBottom: 20, }}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                            <View style={{ flexDirection: 'column', marginLeft: 30, marginLeft: 30, marginRight: 30 }}>
                                <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, textAlign: 'center' }}>3</Text>
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
                         onPress={() => {
                            Linking.openURL("https://eager-bohr-ef70c5.netlify.app/" + children['0']['data']['gsToken'])
                            .catch(err => {
                                console.error("Failed opening page because: ", err)
                                alert('Failed to open page')
                        })}}
            
                         style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 15, backgroundColor:'#327FEB', color:'white', width:100, textAlign:'center', padding: 3,  borderRadius:15 }}>{'Website'}</Text>
                        </TouchableOpacity>
                    <FlatFeed feedGroup="user" />
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
                <Image source={require('../assets/locked.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
                <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>You haven't added your child's details yet. Please add to use the social network</Text>
                <View style={{ backgroundColor: 'white' }}>
                    <Button onPress={() => navigation.navigate('Child')} block dark style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 10, height: 50, width: width - 40, alignSelf: 'center', marginHorizontal: 20 }}>
                        <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 16, marginTop: 2 }}>Add child's details</Text>
                    </Button>
                </View>
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
        }
        check()
    }, [])
    useEffect(() => {
        const check = async () => {
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
            {children == 'notyet' ? loading() : Object.keys(children).length > 0 ? there() : notthere()}
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