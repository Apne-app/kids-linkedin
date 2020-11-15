/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Alert, BackHandler, Dimensions, View, ImageBackground, Image, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
import SpinnerButton from 'react-native-spinner-button';
import AsyncStorage from '@react-native-community/async-storage';
import LoginForm from '../components/Login';
import SignUpForm from '../components/SignUp';
import axios from 'axios';
import LinkedIn from '../components/LinkedIn'
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { sha256 } from 'react-native-sha256';
import { SimpleAnimation } from 'react-native-simple-animations';
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const ChildScreen = ({ route, navigation }) => {
    const scrollcheck = useRef(null)
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

    const [activeform, setActiveForm] = React.useState(1);

    const [login, setLogin] = React.useState({
        username: '',
        password: '',
        viewPass: false
    })
    const flow = ['type', 'name', 'year']
    const screen = ["Please choose who's creating the account", "What's his/her name?", 'Which year was he/she born?']
    const [Loading, setLoading] = useState(false)
    const [current, setcurrent] = useState(0)
    const [type, settype] = useState('name');
    const [name, setname] = useState('');
    const [year, setyear] = useState(0);
    const [school, setschool] = useState('');
    const [grade, setgrade] = useState('');
    const [active, setactive] = useState(false);
    const [text, settext] = useState();
    const api = async () => {
        if (current == 1) {
            var x = await AsyncStorage.getItem('profile');
            analytics.track('Child Name Entered', {
                userID: x ? JSON.parse(x)['uuid'] : null,
                deviceID: getUniqueId()
            })
            if (name == '') {
                settext('*Please Enter a valid name')
                setactive(true)
                return
            }
            else {
                setactive(false)
                setcurrent(2)
            }
        }
        else if (current == 2) {
            var x = await AsyncStorage.getItem('profile');
            analytics.track('Child Birth Year Entered', {
                userID: x ? JSON.parse(x)['uuid'] : null,
                deviceID: getUniqueId()
            })
            if (year == 0) {
                settext('*Please enter a valid year')
                setactive(true)
                return
            }
            else if (year > parseInt(new Date().getFullYear())) {
                settext('*Please enter a valid year')
                setactive(true)
                return
            }
            else if (year < parseInt(new Date().getFullYear()) - 13) {
                navigation.navigate('KidsAge')
                return
            }
            else {
                setactive(false)
                setLoading(true)
                Keyboard.dismiss()
                var pro = await AsyncStorage.getItem('profile');
                pro = JSON.parse(pro);
                console.log(pro, "sad");
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
                    axios.get('http://104.199.158.211:5000/child/' + name.toLowerCase() + '/' + year + '/' + 'none' + '/' + 'none' + '/' + pro.email + '/child/' + `?token=${response.data.token}`)
                    .then(async (response) => {
                        if (response.data.split(', ').length == 2) {
                            await AsyncStorage.setItem('status', '3')
                            // console.log(response.data)
                            navigation.navigate('ChildSuccess')
                        }
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
                

            }

        }

    }
    const inputtype = () => {
        if (current == 0) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
                    <TouchableOpacity onPress={async () => {
                        var x = await AsyncStorage.getItem('profile');
                        analytics.track('I am a Kid', {
                            userID: x ? JSON.parse(x)['uuid'] : null,
                            deviceID: getUniqueId()
                        })
                        navigation.navigate('KidUser');
                    }} style={{ borderColor: 'lightgrey', borderWidth: 2, borderRadius: 10, width: 180, marginRight: 10, height: 170 }}>
                        <Image source={require('../images/kids.png')} style={{ width: 130, height: 114, alignSelf: 'center', marginTop: 13 }} />
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, textAlign: 'center', paddingHorizontal: 20 }}>I am a kid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={async () => {
                        var x = await AsyncStorage.getItem('profile');
                        analytics.track('I am a parent', {
                            userID: x ? JSON.parse(x)['uuid'] : null,
                            deviceID: getUniqueId()
                        })
                        setcurrent(1);
                    }} style={{ borderColor: 'lightgrey', borderWidth: 2, borderRadius: 10, width: 180, height: 170 }}>
                        <Image source={require('../images/parent.png')} style={{ width: 130, height: 130, alignSelf: 'center' }} />
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, textAlign: 'center', paddingHorizontal: 20 }}>I am a parent</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else if (current == 1) {
            return (
                <TextInput value={name} onChangeText={(text) => { setname(text); setactive(false) }} style={{ display: 'flex', width: width - 40, borderRadius: 28.5, backgroundColor: 'white', fontSize: 16, paddingLeft: 20, shadowColor: '', fontFamily: 'NunitoSans-Regular', alignSelf: 'center', height: 55, elevation: 1 }}></TextInput>
            )
        }
        else if (current == 2) {
            return (
                <TextInput keyboardType='numeric' value={year} onChangeText={(text) => { setyear(text); setactive(false) }} style={{ display: 'flex', width: width - 40, borderRadius: 28.5, backgroundColor: 'white', fontSize: 16, paddingLeft: 20, shadowColor: '', fontFamily: 'NunitoSans-Regular', alignSelf: 'center', height: 55, elevation: 1 }}></TextInput>
            )
        }
    }
    return (
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }} ref={scrollcheck} style={styles.container}>
            <KeyboardAvoidingView>
                <View>
                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, paddingHorizontal: 20 }}>Help us out with a few details </Text>
                    <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, marginTop: 20, marginBottom: 20, padding: 20 }}>{screen[current]}</Text>
                    <View>
                        {inputtype()}
                        <Text style={{ color: "red", fontFamily: 'NunitoSans-Bold', fontSize: 12, marginTop: 4, display: active ? 'flex' : 'none', marginLeft: 20 }}>{text}</Text>
                    </View>
                    <View style={{ alignSelf: 'center', display: current ? 'flex' : 'none' }}>
                        <SpinnerButton
                            buttonStyle={{
                                borderRadius: 28.5,
                                margin: 20,
                                width: 200,
                                alignSelf: 'center',
                                backgroundColor: '#327FEB',
                                height: 50
                            }}
                            isLoading={Loading}
                            spinnerType='BarIndicator'
                            onPress={() => {
                                api()
                            }}
                            indicatorCount={10}
                        >
                            <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 18, marginTop: 0 }}>Next</Text>
                            {/* <Text style={styles.buttonText}>Next</Text> */}
                        </SpinnerButton>
                    </View>
                </View>
            </KeyboardAvoidingView>
            <TouchableOpacity onPress={async() => {await AsyncStorage.setItem('status', '1'), navigation.navigate(Object.keys(route).includes('params') ? route.params.screen : 'Home')}} block dark style={{ alignSelf:'flex-end'}}>
                <Text style={{ color: "#000", fontFamily: 'NunitoSans-SemiBold', fontSize: 18, marginTop: 10, alignSelf: 'center', textDecorationLine: 'underline' }}>Continue as guest</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    form: {
        marginTop: 40,
        flex: 1
        // alignSelf: 'center'
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    tinyLogo: {
        alignSelf: 'center',
        width: 100,
        height: 100
    },
    safeArea: {
        backgroundColor: '#F5FCFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'NunitoSans-SemiBold',
        paddingHorizontal: 20,
    },
    buttonStyle: {
        borderRadius: 10,
        margin: 20,
        width: 100,
        alignSelf: 'center'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
})

export default ChildScreen;