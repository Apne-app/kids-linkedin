/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, Animated, View, Text, Alert, Linking, Keyboard, TouchableOpacity, BackHandler, Dimensions, Image, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Switch } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer, Body, Title, Right, Textarea } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import email from 'react-native-email'
import analytics from '@segment/analytics-react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { StackActions } from '@react-navigation/native';
import { getUniqueId, getManufacturer, getVersion } from 'react-native-device-info';
import { useFocusEffect } from "@react-navigation/native";
import CompHeader from '../Modules/CompHeader'
import { Snackbar } from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import AuthContext from '../Context/Data';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const Settings = ({ navigation, route }) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const children = route.params.children
    const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false);
    const [logging, setlogging] = React.useState(false);
    const [newname, setnewname] = React.useState('default123');
    const status = route.params.status
    const [key, setkey] = useState('2')
    const [change, setchange] = useState(false)
    const [keyboardOffset, setKeyboardOffset] = useState(400);
    const [showToast, setShowToast] = useState(false)
    const { Update } = React.useContext(AuthContext);
    const onKeyboardShow = event => {
        setKeyboardOffset(event.endCoordinates.height + 400);
    }

    const onKeyboardHide = () => setKeyboardOffset(400);

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", onKeyboardShow);
        Keyboard.addListener("keyboardDidHide", onKeyboardHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", onKeyboardShow);
            Keyboard.removeListener("keyboardDidHide", onKeyboardHide);
        };
    }, []);

    const onToggleSwitch = async () => {
        var x = await AsyncStorage.getItem('children');
        if (isSwitchOn) {
            analytics.track('Push Notifications Turned Off', {
                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                deviceID: getUniqueId()
            })
        }
        else {
            analytics.track('Push Notifications Turned On', {
                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                deviceID: getUniqueId()
            })
        }
        setIsSwitchOn(!isSwitchOn)
    };
    const logout = async () => {
        Alert.alert(
            "Alert",
            "Are you sure you want to logout?",
            [
                {
                    text: "No",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "Yes", onPress: () => out() }
            ],
            { cancelable: false }
        )
        const out = async () => {
            setlogging(true)
            var x = await AsyncStorage.getItem('children');
            analytics.track('Logged Out', {
                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                deviceID: getUniqueId()
            })
            var arr = await AsyncStorage.getAllKeys()
            var index = arr.indexOf("camerastatus");
            if (index > -1) {
              arr.splice(index, 1);
            }
            index = arr.indexOf("loginheaders");
            if (index > -1) {
              arr.splice(index, 1);
            }
            // console.log(arr)
            await AsyncStorage.multiRemove(arr)
            await AsyncStorage.setItem('status', '0')
            Update({ children: null, notifications: null, newnoti: null, status: '0', 'logout': true })
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }

    }

    const sheetRef = React.useRef(null);
    const [feedback, setfeedback] = useState('')
    const renderContent = () => (
        <View
            style={{
                backgroundColor: 'white',
                padding: 16,
                height: 400,
                elevation: 20,
            }}
        >

            <TouchableOpacity onPress={() => sheetRef.current.snapTo(1)} style={{ alignItems: 'center', paddingBottom: 10 }}>
                <View style={{ backgroundColor: 'lightgrey', borderRadius: 20, width: 100, height: 5, marginTop: -4 }}></View>
            </TouchableOpacity>
            <Text style={{ margin: 15, marginTop: 20, fontSize: 20, fontFamily: 'NunitoSans-Bold' }}>Give Feedback</Text>

            <Form>
                <Textarea onChangeText={(text) => { setfeedback(text) }} style={{ fontFamily: 'NunitoSans-Regular', borderRadius: 10 }} rowSpan={4} bordered placeholder="Enter your message here" />
            </Form>
            <Button onPress={async () => {
                axios({
                    method: 'post',
                    url: 'https://waitlist-2z27nzutoq-el.a.run.app/feedback/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        'email': status === '3' ? children['0']['id'] : 'anonymous', 'feedback': feedback
                    })
                })
                    .then(async (response) => {
                        alert('Thank you for your feedback!')
                        sheetRef.current.snapTo(1)

                    })
                    .catch((error) => {
                        console.log(error)
                        alert('Thank you for your feedback!')
                        sheetRef.current.snapTo(1)
                    })
            }} block dark style={{ marginTop: 10, backgroundColor: '#327FEB', borderRadius: 30, height: 60, width: width * 0.86, alignSelf: 'center', marginBottom: 10 }}>
                <Text style={{ color: "#fff", fontFamily: 'NunitoSans-SemiBold', fontSize: 18, marginTop: 2 }}>Submit</Text>
            </Button>
        </View>
    );

    useEffect(() => {
        const analyse = async () => {
            var x = await AsyncStorage.getItem('children');
            if (x) {
                x = JSON.parse(x)
                if (Object.keys(x).length == 0) {
                    await AsyncStorage.removeItem('children');
                    x = null
                }
                analytics.screen('Settings Screen', {
                    userID: x ? x["0"]["data"]["gsToken"] : null,
                    deviceID: getUniqueId()
                })
            }
            else {
                analytics.screen('Settings Screen', {
                    userID: null,
                    deviceID: getUniqueId()
                })
            }

        }
        analyse();
    })
    const save = async () => {
        var child = await AsyncStorage.getItem('children')
        var pro = await AsyncStorage.getItem('profile')
        pro = JSON.parse(pro)
        child = JSON.parse(child)[0]
        var data = JSON.stringify({ "cid": child.id, "change": "name", "name": newname.toLowerCase(), "school": child.data.school, "year": child.data.year, "grade": child.data.grade, "acctype": child.data.type, "gsToken": child.data.gsToken });
        var data1 = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });
        var token = '';
        var config1 = {
            method: 'post',
            url: 'https://api.genio.app/dark-knight/getToken',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data1
        };
        axios(config1)
            .then(async function (response) {
                var config = {
                    method: 'post',
                    url: `https://api.genio.app/matrix/update_child/?token=${response.data.token}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                axios(config)
                    .then(async (response1) => {
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
                                await AsyncStorage.setItem('children', JSON.stringify(response.data))
                                Update({ children: response.data })
                                navigation.dispatch(
                                    StackActions.replace('Home')
                                );
                                setkey(newname)
                                setchange(true)
                                setShowToast(true)
                            })
                    }).catch((error) => {
                        console.log(error, "asd")
                        alert('Could not update Name, please try again later')
                        setnewname('default123')
                    })
            })
    }
    return (
        <View key={key} style={{ height: height }}>
            <Animated.View
                style={{
                    backgroundColor: 'black', position: 'absolute', opacity: 0.5, flex: 1, left: 0, right: 0, width: bottomSheetOpen ? width : 0, zIndex: 10, height: bottomSheetOpen ? height : 0
                }}>
                <Button
                    style={{
                        width: bottomSheetOpen ? width : 0,
                        height: bottomSheetOpen ? height : 0,
                        backgroundColor: 'transparent',
                    }}
                    activeOpacity={1}
                    onPress={() => sheetRef.current.snapTo(1)}
                />
            </Animated.View>
            <CompHeader screen={'Settings'} goback={() => navigation.navigate('Profile')} icon={'back'} />
            <ScrollView keyboardShouldPersistTaps={'handled'} style={{ opacity: logging ? 0.2 : 1 }}>
                <View style={{ margin: 25 }}>
                    <View >
                        <Text style={{ fontSize: 16, fontFamily: "NunitoSans-SemiBold" }}>Kid's Name</Text>
                        <TextInput editable={status === '3' ? true : false} keyboardType={'name-phone-pad'} value={status === '3' ? newname == 'default123' ? children['0']['data']['name'][0].toUpperCase() + children['0']['data']['name'].substring(1) : newname : 'Login to edit Kid\'s Name'} onChangeText={(text) => { setnewname(text); setchange(false) }} editable={status === '3' ? true : false} placeholder={status === '3' ? '' : 'Please Login to edit Kid\'s Name'} placeholderTextColor={status === '3' ? 'grey' : 'lightgrey'} style={{ height: 55, backgroundColor: 'white', borderRadius: 27.5, marginTop: 15, color: 'black', fontFamily: 'NunitoSans-Regular', paddingHorizontal: 20 }} />
                        <Button block rounded iconLeft style={{ marginTop: 20, flex: 1, borderColor: 'white', backgroundColor: '#327FEB', borderWidth: 1, borderRadius: 25, height: 57, display: newname === 'default123' || change ? 'none' : 'flex' }} onPress={() => save()} >
                            <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 17 }}>{'Save'}</Text>
                        </Button>
                        <Text style={{ fontSize: 16, fontFamily: "NunitoSans-SemiBold", marginTop: 35 }}>Kid's Year of Birth</Text>
                        <TextInput editable={false} placeholder={status === '3' ? children['0']['data']['year'] : 'Login to edit Kid\'s Year of birth'} placeholderTextColor={status === '3' ? 'grey' : 'lightgrey'} style={{ height: 55, backgroundColor: 'white', borderRadius: 27.5, marginTop: 15, color: 'black', fontFamily: 'NunitoSans-Regular', paddingHorizontal: 20 }} />
                        {/*<View style={{ backgroundColor: 'white', marginTop: 35, borderRadius: 10, height: 56, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16, fontFamily: "NunitoSans-Bold", marginVertical: 15, marginLeft: 23 }}>Push Notifications</Text>
                        <Right style={{ marginRight: 40 }}><Switch value={isSwitchOn} onValueChange={onToggleSwitch} color={'#327FEB'} /></Right>
                    </View>*/}
                    </View>
                    <View style={{ flexDirection: 'column', marginTop: '40%' }}>
                        <Button block rounded iconLeft style={{ marginTop: 20, flex: 1, borderColor: '#327FEB', backgroundColor: '#327FEB', borderWidth: 1, borderRadius: 25, height: 57, }} onPress={() => {
                            sheetRef.current.snapTo(0);
                            const onBackPress = () => {
                                sheetRef.current.snapTo(1);
                                const onBackNew = () => {
                                    navigation.navigate('Home')
                                    return true;
                                };
                                BackHandler.addEventListener("hardwareBackPress", onBackNew);
                                return () =>
                                    BackHandler.removeEventListener("hardwareBackPress", onBackNew);
                            };
                            BackHandler.addEventListener("hardwareBackPress", onBackPress);
                            return () =>
                                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
                        }} >
                            <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 17 }}>Give Feedback</Text>
                        </Button>
                        <Button block rounded style={{ marginTop: 20, flex: 1, borderColor: '#327FEB', backgroundColor: '#327FEB', borderWidth: 1, borderRadius: 25, height: 57 }} onPress={() => Linking.openURL('whatsapp://send?text=&phone=+918861024466')} >
                            <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 17, alignSelf: 'center', marginLeft: 40 }}>Contact Us</Text>
                            <Icon name="whatsapp" type="Fontisto" style={{ fontSize: 20, color: '#4FCE5D' }} />
                        </Button>
                        <Button block rounded iconLeft style={{ marginTop: 20, flex: 1, borderColor: 'white', backgroundColor: 'white', borderWidth: 1, borderRadius: 25, height: 57, }} onPress={() => status === '3' ? logout() : navigation.navigate('Login', { type:'settings_login' })} >
                            <Text style={{ color: "grey", fontFamily: 'NunitoSans-Bold', fontSize: 17 }}>{status === '3' ? 'Logout' : 'Login'}</Text>
                        </Button>
                        <Text style={{ color: "grey", fontFamily: 'NunitoSans-Bold', fontSize: 13, textAlign: 'center', marginTop: 2 }}>v{getVersion()}</Text>
                    </View>
                </View>
            </ScrollView>
            <BottomSheet
                ref={sheetRef}
                snapPoints={[keyboardOffset, 0]}
                initialSnap={1}
                onOpenStart={() => {
                    setBottomSheetOpen(true);
                }}
                onCloseStart={() => {
                    setBottomSheetOpen(false);
                }}
                enabledGestureInteraction={true}
                borderRadius={30}
                renderContent={renderContent}
            />
            <View style={{ position: logging ? 'absolute' : 'relative', bottom: '10%', zIndex: 1000, backgroundColor: '#327FEB', alignSelf: 'center', height: 70, width: width - 50, borderRadius: 25, padding: 20, flexDirection: 'row', alignContent: 'center', display: logging ? 'flex' : 'none' }}>
                <Image source={require('../assets/log_loader.gif')} style={{ width: 50, height: 50, alignSelf: 'center', marginLeft: (width - 50) / 10 }} />
                <Text style={{ textAlign: 'right', fontFamily: 'NunitoSans-Bold', fontSize: 18, color: 'white', marginLeft: 20 }}>Logging you out</Text>
            </View>
            <Snackbar
                visible={showToast}
                style={{ bottom: 80, }}
                duration={1500}
                onDismiss={() => setShowToast(false)}
            >
                <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'white' }}> Successfully Saved</Text>
            </Snackbar>
        </View>
    );

}
export default Settings;