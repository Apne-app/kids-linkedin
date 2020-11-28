/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Alert, BackHandler, Dimensions, Image, TouchableOpacity } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useFocusEffect } from "@react-navigation/native";
import { Snackbar } from 'react-native-paper';
import CountDown from 'react-native-countdown-component';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const Unverified = ({ navigation, route }) => {

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


    const [profile, setprofile] = useState({ 'email': '' })
    const [visible, setVisible] = React.useState(false);
    const [active, setactive] = React.useState(false);
    const [text, settext] = useState('')
    const [time, settime] = useState('45')
    const [change, setchange] = useState(0)
    const [token, setToken] = useState('')
    // console.log('http://35.229.160.51:5000/send/' + profile.id + '/' + profile.email + '/')
    const handleDynamicLink = async (link) => {
        // Handle dynamic link inside your own application
        var pro = await AsyncStorage.getItem('profile')
        pro = JSON.parse(pro)
        if (link.url.includes(pro.uuid)) {
            navigation.navigate('Verified', { screen: Object.keys(route.params).includes('screen') ? route.params.screen : 'Home' })
        }
    };
    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
        // When the is component unmounted, remove the listener
        return () => unsubscribe();
    }, []);
    useEffect(() => {
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
    }, []);
    const send = async (num) => {
        if (active) {
            setactive(false)
            axios.get('http://104.199.146.206:5000/login/' + profile.email + `/default/?token=${token}`)
                .then(async (response) => {
                    const storeProfile = async () => {
                        try {
                            await AsyncStorage.setItem('profile', JSON.stringify(response.data))
                            await AsyncStorage.setItem('status', '1')

                        } catch (e) {
                            // saving error
                        }
                    }
                    storeProfile()
                    axios.get('http://35.229.160.51:80/send/' + response.data.uuid + '/' + response.data.email + '/')
                        .then((response) => {
                            console.log(response.data)
                            if (response.data == 'wrong id!') {
                                alert('There was an error, please try again')
                                navigation.navigate('Login')
                            }
                            else {
                                settext('Verification Email Sent!')
                                setVisible(true)
                                setTimeout(() => {
                                    setVisible(false)
                                }, 5000);
                            }
                        })
                        .catch((response) => {
                            console.log(response)
                            alert('There was an error, please try again')
                            navigation.navigate('Login')
                        })

                })
                .catch((error) => {
                    alert('There was an error, please try again')
                    navigation.navigate('Login')
                })
        }
        else {
            settext('Please wait for the timer to complete')
            setVisible(true)
            setTimeout(() => {
                setVisible(false)
            }, 5000);
        }

    }
    useEffect(() => {
        const getData = async () => {
            var pro = await AsyncStorage.getItem('profile')
            if (pro !== null) {
                pro = JSON.parse(pro)
                setprofile(pro)
            }
            else {
                console.log('Login')
            }
        }
        getData()
    }, [])
    return (
        <Container style={{ backgroundColor: 'white', width: width }}>
            <Image source={require('../assets/emailsent.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
            <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>We've sent a verification mail to{"\n"}<Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20 }}>{profile.email} {"\n"}</Text><TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ flexDirection: 'row' }}><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 18, color: '#327FEB' }}>(</Text><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 18, color: '#327FEB', textDecorationColor: '#327FEB', textDecorationLine: 'underline' }}>Change</Text><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 18, color: '#327FEB' }}>)</Text></TouchableOpacity></Text>
            <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Please verify for logging in</Text>
            <View style={{ backgroundColor: 'white' }}>
                <Button block style={{ marginTop: 20, borderColor: active ? '#327FEB' : 'grey', backgroundColor: active ? '#327FEB' : 'grey', borderWidth: 1, borderRadius: 25, width: width - 40, alignSelf: 'center', height: 60 }} onPress={() => { send(); settime(45) }}>
                    <View style={{ flexDirection: 'row' }}><Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 18 }}>Send again (</Text><View style={{ marginTop: 0, marginHorizontal: -2 }}>
                        <CountDown
                            id={String(change)}
                            until={time}
                            onFinish={() => setactive(true)}
                            size={10}
                            running={true}
                            digitStyle={{ borderColor: '#327FEB' }}
                            digitTxtStyle={{ fontFamily: 'NunitoSans-Bold', fontSize: 18 }}
                            timeToShow={['S']}
                            timeLabels={{ s: '' }}
                        /></View><Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 18, }}>s)</Text></View>
                </Button>
                <Button block style={{ marginTop: 20, borderColor: '#327FEB', backgroundColor: 'white', borderWidth: 1, borderRadius: 25, width: width - 40, alignSelf: 'center', height: 60 }} onPress={async () => { await AsyncStorage.setItem('status', '1'), navigation.navigate(Object.keys(route).includes('params') ? route.params.screen : 'Home') }} >
                    <Text style={{ color: "#327FEB", fontFamily: 'NunitoSans-Bold', fontSize: 18 }}>Continue as a guest*</Text>
                </Button>
                <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 10, textAlign: 'center', marginTop: 20 }}>*You wont be able to use the social network</Text>
            </View>
            <Snackbar visible={visible}>
                {text}
            </Snackbar>
        </Container>
    );

}
export default Unverified;