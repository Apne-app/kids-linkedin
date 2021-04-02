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
const width = Dimensions.get('window').width;
const ClassScreen = ({ route, navigation }) => {

    const [mediatype, setmediatype] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
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
                fontFamily: 'NunitoSans-SemiBold',
                fontWeight: 'normal',
            },
            medium: {
                fontFamily: 'NunitoSans-SemiBold',
                fontWeight: 'normal',
            },
            light: {
                fontFamily: 'NunitoSans-SemiBold',
                fontWeight: 'normal',
            },
            thin: {
                fontFamily: 'NunitoSans-SemiBold',
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

    const pickImage = () => {
        Alert.alert("Pick type!", "Image or video?", [
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
        setShow(Platform.OS === 'ios');
        mode == 'date' ? setform({ ...form, 'date': currentDate }) : setform({ ...form, 'time': currentDate })
    };

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
                    style={{ marginVertical: 10, fontFamily: 'NunitoSans-SemiBold' }}
                    value={form.name}
                    onChangeText={text => setform({ ...form, 'name': text })}
                />
                <TouchableOpacity onPress={showDatepicker}>
                    <TextInput
                        label="Class Date"
                        mode='outlined'
                    theme={theme}
                        style={{ marginVertical: 10, fontFamily: 'NunitoSans-SemiBold' }}
                        disabled
                        value={JSON.stringify(form.date).split('T')[0] + "\""}
                    // onChangeText={text => setText(text)}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={showTimepicker}>
                    <TextInput
                        label="Class Timing"
                        mode='outlined'
                        theme={theme}
                        style={{ marginVertical: 10, fontFamily: 'NunitoSans-SemiBold' }}
                        disabled
                        value={JSON.stringify(form.time).split('T')[1].split('.')[0]}
                    // onChangeText={text => setText(text)}
                    />
                </TouchableOpacity>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={mode == 'date' ? form.date : form.time}
                        mode={mode}
                        display="default"
                        onChange={onChange}
                    />
                )}
                <TextInput
                    label="Class Subject"
                    mode='outlined'
                    theme={theme}
                    style={{ marginVertical: 10, fontFamily: 'NunitoSans-SemiBold' }}
                    value={form.subject}
                    onChangeText={text => setform({ ...form, 'subject': text })}
                />
                <TextInput
                    label="Class Link"
                    mode='outlined'
                    theme={theme}
                    style={{ marginVertical: 10, fontFamily: 'NunitoSans-SemiBold' }}
                    value={form.link}
                    onChangeText={text => setform({ ...form, 'link': text })}
                />
                <TextInput
                    label="Class Details"
                    mode='outlined'
                    multiline={true}
                    theme={theme}
                    numberOfLines={4}
                    style={{ marginVertical: 10, fontFamily: 'NunitoSans-SemiBold' }}
                    value={form.caption}
                    onChangeText={text => setform({ ...form, 'caption': text })}
                />
                <Button mode="contained" style={{ backgroundColor: '#327feb', marginVertical: 10, marginBottom: 10, height: 50, borderRadius: 28.5, width: 200, alignSelf: 'center', paddingTop: 4 }} onPress={() => pickImage()}>
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
                                videoProps={{
                                    source: { uri: form.media },
                                    rate: 1.0,
                                    volume: 1.0,
                                    isMuted: false,
                                    videoRef: v => videoRef = v,
                                    resizeMode: Video.RESIZE_MODE_CONTAIN,
                                    // shouldPlay
                                    // usePoster={props.activity.poster?true:false}
                                    // posterSource={{uri:'https://pyxis.nymag.com/v1/imgs/e8b/db7/07d07cab5bc2da528611ffb59652bada42-05-interstellar-3.2x.rhorizontal.w700.jpg'}}
                                    playInBackground: false,
                                    playWhenInactive: false,
                                    width: width,
                                    height: 340,
                                }}
                                width={width}
                                height={340}
                                hideControlsTimerDuration={1000}
                                showControlsOnLoad={true}
                                // switchToLandscape={() => videoRef.presentFullscreenPlayer()}
                                sliderColor={'#327FEB'}
                                inFullscreen={false}
                            />
                            :
                            null
                }
                <Button mode="contained" style={{ backgroundColor: '#327feb', marginVertical: 10, marginBottom: 60, height: 50, borderRadius: 28.5, width: 200, alignSelf: 'center', paddingTop: 4 }} onPress={() => console.log(form)}>
                    <Text style={{ fontFamily: 'NunitoSans-Bold' }}>Post Class</Text>
                </Button>
            </ScrollView>
        </View>
    )

}

export default ClassScreen;