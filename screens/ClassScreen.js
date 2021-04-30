/* eslint-disable */
import React, { Component, useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Dimensions, Animated, Alert, View, ImageBackground, BackHandler, Image, TouchableOpacity, FlatList } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Chip, Thumbnail, Picker, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, Button, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { Appbar } from 'react-native-paper';
import { useFocusEffect } from "@react-navigation/native";
import CompHeader from '../Modules/CompHeader'
import { launchImageLibrary } from 'react-native-image-picker'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CompButton from '../Modules/CompButton';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image'
import DateTimePicker from '@react-native-community/datetimepicker';
import VideoPlayer from '../Modules/Video';
import { Video } from 'expo-av'
import { RNS3 } from 'react-native-aws3';
const width = Dimensions.get('window').width;
const ClassScreen = ({ route, navigation }) => {
    const [mediatype, setmediatype] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [loading, setloading] = useState(false);
    const children = route.params.children
    var videoRef = useRef();
    const [form, setform] = useState({
        'name': '',
        'date': new Date(),
        'time': new Date(),
        'subject': '',
        'link': '',
        'caption': '',
        'media': '',
    })

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

    const pick = (type) => {
        launchImageLibrary({ mediaType: type }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                if (response.uri) {
                    if (response.type) {
                        setmediatype('image');
                        setform({ ...form, 'media': response.uri })
                    } else {
                        setmediatype('video');
                        setform({ ...form, 'media': response.uri })
                    }
                    // this.props.navigation.navigate('VideoPreview', { 'video': response.uri })
                }
                else {
                    alert("Error selecting the video, please try again :)")
                }
            }
            // this.setState({ isOn: false })
            // this.setState({ imagetaken: false })
        });
    }
    Date.prototype.customFormat = function(formatString){
        var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
        YY = ((YYYY=this.getFullYear())+"").slice(-2);
        MM = (M=this.getMonth()+1)<10?('0'+M):M;
        MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
        DD = (D=this.getDate())<10?('0'+D):D;
        DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
        th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
        formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
        h=(hhh=this.getHours());
        if (h==0) h=24;
        if (h>12) h-=12;
        hh = h<10?('0'+h):h;
        hhhh = hhh<10?('0'+hhh):hhh;
        AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
        mm=(m=this.getMinutes())<10?('0'+m):m;
        ss=(s=this.getSeconds())<10?('0'+s):s;
        return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
      };

    const pickImage = () => {
        Alert.alert("Pick the type of media", "Video/Image", [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "Video",
                onPress: () => { pick('video'); null },
                style: "cancel"
            },
            { text: "Image", onPress: () => { pick('photo'); null } }
        ]);
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || form.date;
        console.log("saadsad ", currentDate)
        var timeType = 'am';
        if(mode == 'time')
        {
            var time = JSON.stringify(currentDate).split('T')[1].split(':');
            var hh = parseInt(time[0])
            var mm = parseInt(time[1])
            var ss = parseInt(time[2]);
            mm += 30
            var carry = Math.floor(mm / 60)
            mm = mm % 60
            // console.log( "1 hh: ", hh, " mm: ", mm, " carry: ", carry);
            hh += 5 + carry;
            hh = hh % 24
            if(hh >= 12) {
                timeType = 'pm';
            }
            // console.log("hh: ", hh, " mm: ", mm);
        }
        var istTime = (new Date(currentDate.getTime())).customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#")
        istTime = istTime.replace("/",'-')
        istTime = istTime.replace("/",'-')
        istTime = istTime.replace(" ", "T")
        istTime += 'Z'
        console.log("aaa: ", istTime)
        var hh;
        if(mode == 'time') {
            hh = istTime.split('T')[1].split(':')[0]
            if(hh[0] == '0') {
                hh = hh[1];
            }
        }
        setShow(Platform.OS === 'ios');
        mode == 'date' ? setform({ ...form, 'date': istTime }) : setform({ ...form, 'time': hh + ":" + istTime.split('T')[1].split('Z')[0].split(':')[1] + " " + timeType })
    };
    function randomStr(len, arr) {
        var ans = '';
        for (var i = len; i > 0; i--) {
            ans +=
                arr[Math.floor(Math.random() * arr.length)];
        }
        return ans;
    }
    const uploadToS3 = async () => {
        let file = {}
        if (mediatype == 'video') {
            var name = randomStr(10, '12345abcdepq75xyz') + '.mp4'
            file = {
                uri: form.media,
                name: name,
                type: "video/mp4",
            }
        }
        else {
            var name = randomStr(10, '12345abcdepq75xyz') + '.png'
            file = {
                uri: form.media,
                name: name,
                type: "image/png",
            }
        }

        const options = {
            keyPrefix: children[0]['id'] + '/classes/',
            bucket: "kids-linkedin",
            region: "ap-south-1",
            accessKey: ACCESS_KEY,
            secretKey: SECRET_KEY,
            successActionStatus: 201
        }
        var uri = ''
        try {
            const response = await RNS3.put(file, options)
            if (response.status !== 201) {
                uri = false
            }
            else {
                uri = "https://d2k1j93fju3qxb.cloudfront.net/" + children[0]['id'] + '/classes/' + name
            }
            return uri
        }
        catch (error) {
            console.log(error)
            return false
        }

    }
    const addclass = async () => {
        setloading(true)
        var uri = 'hello'
        if (form.media) {
            uri = await uploadToS3()
        }
        if (uri) {
            if(uri=='hello'){
                uri = ''
            }
            axios.post('http://mr_robot.api.genio.app/postclass', {
                user_id: children[0]['id'],
                acc_type: children[0]['data']['type'],
                user_image: children[0]['data']['image'],
                images: mediatype === 'image' ? uri : null,
                videos: mediatype === 'video' ? uri : null,
                youtube: '',
                caption: form.caption == '' ? 'default123' : form.caption,
                tags: '',
                user_year: null,
                user_name: children[0]['data']['name'],
                category: 'class',
                link: form.link,
                class_category: form.subject,
                class_time: form.time,
                class_date: form.date,
                class_name: form.name,
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then(async (response) => {
                if (response.data.data) {
                    await AsyncStorage.setItem('postid', response.data.data)
                    await AsyncStorage.setItem('newpost', 'true')
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                }
                else {
                    setloading(false)
                    alert('There was an error posting the class, please try again later')
                    // navigation.pop();
                }
            }).catch((err) => {
                setloading(false)
                alert('There was an error posting the class, please try again later')
                // navigation.pop();
            })
        }
        else {
            setloading(false)
            alert('There was an error posting the class, please try again alter')
        }
    }

    const months = ['Jan', 'Feb', "Mar", "April", 'May', 'June', 'July', "Aug", 'Sep', 'Oct', 'Nov', 'Dec']

    return (
        <View>
            <CompHeader screen={'Class'}
                headerType={route.params.type}
                icon={'back'}
                goback={() => {
                    if (navigation.canGoBack()) {
                        navigation.pop()
                    }
                    else {
                        navigation.navigate('Home')
                    }
                }} />
            <ScrollView style={{ margin: 20 }}>
                <TextInput
                    label="Class Name"
                    theme={theme}
                    mode='outlined'
                    style={{ marginVertical: 10 }}
                    value={form.name}
                    onChangeText={text => setform({ ...form, 'name': text })}
                />
                <TouchableOpacity onPress={showDatepicker}>
                    <TextInput
                        label="Class Date"
                        mode='outlined'
                        theme={theme}
                        style={{ marginVertical: 10 }}
                        disabled
                        value={JSON.stringify(form.date).split('T')[0].replace('"', '').split('-')[0].length == 4 ? JSON.stringify(form.date).split('T')[0].replace('"', '').split('-')[2] + " " + months[parseInt(JSON.stringify(form.date).split('T')[0].replace('"', '').split('-')[1])-1] + " " + JSON.stringify(form.date).split('T')[0].replace('"', '').split('-')[0] : JSON.stringify(form.date).split('T')[0].replace('"', '').split('-')[0] + " " + months[parseInt(JSON.stringify(form.date).split('T')[0].replace('"', '').split('-')[1])-1] + " " + JSON.stringify(form.date).split('T')[0].replace('"', '').split('-')[2]}
                    // onChangeText={text => setText(text)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={showTimepicker}>
                    <TextInput
                        label="Class Timing"
                        mode='outlined'
                        theme={theme}
                        style={{ marginVertical: 10 }}
                        disabled
                        value={form.time}
                    // onChangeText={text => setText(text)}
                    />
                </TouchableOpacity>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={mode}
                        is24Hour={false}
                        display="default"
                        onChange={onChange}
                    />
                )}
                <TextInput
                    label="Class Subject"
                    mode='outlined'
                    theme={theme}
                    style={{ marginVertical: 10 }}
                    value={form.subject}
                    onChangeText={text => setform({ ...form, 'subject': text })}
                />
                <TextInput
                    label="Class Link"
                    mode='outlined'
                    theme={theme}
                    keyboardType='url'
                    style={{ marginVertical: 10 }}
                    value={form.link}
                    onChangeText={text => setform({ ...form, 'link': text })}
                />
                <TextInput
                    label="Class Details"
                    mode='outlined'
                    multiline={true}
                    theme={theme}
                    numberOfLines={4}
                    style={{ marginVertical: 10 }}
                    value={form.caption}
                    onChangeText={text => setform({ ...form, 'caption': text })}
                />
                <Button theme={theme} mode="contained" style={{ backgroundColor: '#327feb', marginVertical: 10, marginBottom: 10, height: 50, borderRadius: 28.5, width: 200, alignSelf: 'center', paddingTop: 4 }} onPress={() => pickImage()}>
                    <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Pick Image/Video</Text>
                </Button>
                {
                    mediatype == 'image' ?
                        <FastImage
                            source={{
                                uri: form.media,
                                priority: FastImage.priority.high
                            }}
                            style={{ width: '100%', minHeight: 340, borderRadius: 0, backgroundColor: "#000", marginVertical: 10 }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        :
                        mediatype == 'video' ?
                            <VideoPlayer
                                source={{ uri: form.media }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="contain"
                                // shouldPlay
                                // usePoster={props.activity.poster?true:false}
                                // posterSource={{uri:'https://pyxis.nymag.com/v1/imgs/e8b/db7/07d07cab5bc2da528611ffb59652bada42-05-interstellar-3.2x.rhorizontal.w700.jpg'}}
                                ref={videoRef}
                                useNativeControls={true}
                                playInBackground={false}
                                playWhenInactive={false}
                                onViewportEnter={() => console.log('Entered!')}
                                onViewportLeave={() => console.log('Left!')}
                                style={{ width: width, height: 340 }}
                            />
                            :
                            null
                }
                <Button theme={theme} mode="contained" style={{ backgroundColor: '#327feb', marginVertical: 10, marginBottom: 60, height: 50, borderRadius: 28.5, width: 200, alignSelf: 'center', paddingTop: 4 }} onPress={() => addclass()}>
                    <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Post Class</Text>
                </Button>
            </ScrollView>
            {loading ? <View style={{ backgroundColor: '#327FEB', height: 310, borderTopLeftRadius: 20, borderTopRightRadius: 20, display: loading ? 'flex' : 'none', position: loading ? 'absolute' : 'relative', bottom: 0, width: width }}>
                <FastImage style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '20%' }} source={require('../assets/log_loader.gif')} />
                <Text style={{ textAlign: 'center', fontFamily: 'NunitoSans-Bold', fontSize: 20, color: 'white' }}>Posting...</Text>
            </View> : null}
        </View>
    )

}

export default ClassScreen;