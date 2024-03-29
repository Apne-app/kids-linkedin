/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, Text, Alert, BackHandler, Dimensions, Image, TouchableOpacity } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useFocusEffect } from "@react-navigation/native";
import { Snackbar } from 'react-native-paper';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import CountDown from 'react-native-countdown-component';
import AuthContext from '../Context/Data';
import CodePush from 'react-native-code-push';
import useWebSocket, { ReadyState } from 'react-use-websocket';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

const Unverified = ({ navigation, route }) => {
    const [logging, setlogging] = useState(false)
    const { Update } = React.useContext(AuthContext);
    const login = () => {
        var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });
        var token = '';
        var config = {
            method: 'post',
            url: 'https://api.genio.app/dark-knight/getToken',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
            .then(async function (response) {
                // console.log(JSON.stringify(response.data.token));
                var pro = await AsyncStorage.getItem('profile')
                pro = JSON.parse(pro)
                axios({
                    method: 'post',
                    url: 'https://api.genio.app/matrix/getchild/' + `?token=${response.data.token}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        "email": pro.email,
                    })
                })
                    .then(async (response) => {
                        console.log(response.data)
                        if (Object.keys(response.data).length) {
                            await AsyncStorage.setItem('children', JSON.stringify(response.data))
                            var response2 = await axios.get('https://api.genio.app/magnolia/' + response.data[0]['id'])
                            await Update({ children: response.data, status: '3', profile: pro, notifications: response2.data })
                            await AsyncStorage.setItem('status', '3')
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        }
                        else {
                            await AsyncStorage.setItem('status', '2')
                            navigation.navigate('Child', { screen: route.params ? Object.keys(route.params).includes('screen') ? route.params.screen : 'Home' : 'Home' })
                        }
                    })
                var x = await AsyncStorage.getItem('status');
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    // useEffect(() => {
    //     const getData = async () => {
    //         var pro = await AsyncStorage.getItem('profile')
    //         pro = JSON.parse(pro)
    //         var ws = new WebSocket('ws://login.api.genio.app:8765');
    //         ws.onopen = () => {
    //             // connection opened
    //             ws.send(pro.uuid); // send a message
    //         };
    //         ws.onmessage = (e) => {
    //             // a message was received
    //             console.log(e)
    //             if (e.data === 'verified') {
    //                 setlogging(true)
    //                 login()
    //             }
    //         };
    //         ws.onerror = (e) => {
    //             console.log(e)
    //         };
    //         ws.onclose = (e) => {
    //             // connection closed
    //             console.log(e)
    //         };
    //     }
    //     getData()
    // },[])
    const socketUrl = 'ws://login.api.genio.app:8765';
    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket
    } = useWebSocket(socketUrl, {
        onOpen: async () => {
            var pro = await AsyncStorage.getItem('profile')
            pro = JSON.parse(pro)
            console.log('opened');
            sendMessage(pro.uuid)
        },
        onMessage: (message) => {
            console.log(message);
            if (message.data === 'verified') {
                setlogging(true)
                login()
            }
        },
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
    });
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('Login')
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);

        }, []));


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
        var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });
        var config = {
            method: 'post',
            url: 'https://api.genio.app/dark-knight/getToken',
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
            axios({
                method: 'post',
                url: `https://api.genio.app/get-out/login/?token=${token}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ "email": profile.email, "lnkdId": "default" })
            }).then(async (response) => {
                const storeProfile = async () => {
                    try {
                        await AsyncStorage.setItem('profile', JSON.stringify(response.data))
                        await AsyncStorage.setItem('status', '1')

                    } catch (e) {
                        // saving error
                    }
                }
                storeProfile()
                axios.get('https://api.genio.app/shining/send2/' + response.data.uuid + '/' + response.data.email + '/')
                    .then((response) => {
                        console.log(response.data)
                        if (response.data == 'wrong id!') {
                            alert('There was an error, please try again')
                            navigation.navigate('Login')
                        }
                        else {
                            settext('Verification email sent!')
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
                    console.log(error)
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
            <View style={{ opacity: logging ? 0.3 : 1, }}>
                <Image source={require('../assets/emailsent.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
                <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>We've sent a verification mail to{"\n"}<Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 20 }}>{profile.email} {"\n"}</Text><TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ flexDirection: 'row' }}><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 18, color: '#327FEB' }}>(</Text><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 18, color: '#327FEB', textDecorationColor: '#327FEB', textDecorationLine: 'underline' }}>Change</Text><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 18, color: '#327FEB' }}>)</Text></TouchableOpacity></Text>
                <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Please verify for logging in</Text>
                <View>
                    <Button disabled={logging} block style={{ marginTop: 20, borderColor: active ? '#327FEB' : 'grey', backgroundColor: active ? '#327FEB' : 'grey', borderWidth: 1, borderRadius: 25, width: width - 40, alignSelf: 'center', height: 60, opacity: logging ? 0.8 : 1 }} onPress={() => { send(); settime(45) }}>
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
                    <Button disabled={logging} block style={{ marginTop: 20, borderColor: '#327FEB', backgroundColor: 'white', borderWidth: 1, borderRadius: 25, width: width - 40, alignSelf: 'center', height: 60, opacity: logging ? 0.8 : 1 }} onPress={async () => { await AsyncStorage.setItem('status', '1'), navigation.navigate(Object.keys(route).includes('params') ? route.params.screen : 'Home') }} >
                        <Text style={{ color: "#327FEB", fontFamily: 'NunitoSans-Bold', fontSize: 18, }}>Continue as a guest*</Text>
                    </Button>
                    <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 10, textAlign: 'center', marginTop: 20 }}>*You wont be able to use the social network</Text>
                </View>
                <Snackbar visible={visible}>
                    {text}
                </Snackbar>
            </View>
            <View style={{ position: logging ? 'absolute' : 'relative', bottom: '6%', zIndex: 1000, backgroundColor: '#327FEB', alignSelf: 'center', height: 70, width: width - 50, borderRadius: 25, padding: 20, flexDirection: 'row', alignContent: 'center', display: logging ? 'flex' : 'none' }}>
                <Image source={require('../assets/log_loader.gif')} style={{ width: 50, height: 50, alignSelf: 'center', marginLeft: (width - 50) / 10 }} />
                <Text style={{ textAlign: 'right', fontFamily: 'NunitoSans-Bold', fontSize: 18, color: 'white', marginLeft: 20 }}>Logging In...</Text>
            </View>
        </Container>
    );

}
export default Unverified;