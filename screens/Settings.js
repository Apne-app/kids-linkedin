/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, Animated, View, Text, Alert, Linking, TouchableOpacity, BackHandler, Dimensions, Image, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Switch } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer, Body, Title, Right, Textarea } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import email from 'react-native-email'
import analytics from '@segment/analytics-react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { useFocusEffect } from "@react-navigation/native";
import CompHeader from '../Modules/CompHeader'
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const Settings = ({ navigation }) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false);
    const [status, setstatus] = useState('1')
    const handleEmail = () => {
        const to = ['support@genio.app'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            // cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
            // bcc: 'mee@mee.com', // string or array of email addresses
            subject: 'Your Genio Feedback',
            body: 'Write your feedback here'
        }).catch(console.error)
    }
    useEffect(() => {
        const check = async () => {
            var st = await AsyncStorage.getItem('status')
            setstatus(st)
        }
        check()
    }, [])
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
        var x = await AsyncStorage.getItem('children');
        analytics.track('Logged Out', {
            userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
            deviceID: getUniqueId()
        })
        var arr = await AsyncStorage.getAllKeys()
        await AsyncStorage.multiRemove(arr)
        AsyncStorage.setItem('status', '-1')
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });

    }

    const sheetRef = React.useRef(null);

    const renderContent = () => (
            <ScrollView
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
                    <Textarea style={{ fontFamily: 'NunitoSans-Regular', borderRadius: 10 }} rowSpan={4} bordered placeholder="Enter your message here" />
                </Form>
                <Button onPress={async () => {

                }} block dark style={{ marginTop: 10, backgroundColor: '#327FEB', borderRadius: 30, height: 60, width: width * 0.86, alignSelf: 'center', marginBottom: 10 }}>
                    <Text style={{ color: "#fff", fontFamily: 'NunitoSans-SemiBold', fontSize: 18, marginTop: 2 }}>Submit</Text>
                </Button>
            </ScrollView>
    );

    useEffect(() => {
        const analyse = async () => {
            var x = await AsyncStorage.getItem('children');
            analytics.screen('Settings Screen', {
                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                deviceID: getUniqueId()
            })
        }
        analyse();
    })

    return (
        <View style={{height: height}}>
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
            <ScrollView >
                <View style={{ margin: 25 }}>
                <View >
                    <Text style={{ fontSize: 16, fontFamily: "NunitoSans-SemiBold" }}>Kid's Name</Text>
                    <TextInput editable={false} placeholder={status === '3' ? "Kid's Name" : 'Please Login to edit Kid\'s Name'} placeholderTextColor={status === '3' ? 'grey' : 'lightgrey'} style={{ height: 55, backgroundColor: 'white', borderRadius: 27.5, marginTop: 15, color: 'black', fontFamily: 'NunitoSans-Regular', paddingHorizontal: 20 }} />
                    <Text style={{ fontSize: 16, fontFamily: "NunitoSans-SemiBold", marginTop: 35 }}>Kid's Year of Birth</Text>
                    <TextInput editable={false} placeholder={status === '3' ? "Kid's Year of Birth" : 'Please Login to edit Kid\'s Year of birth'} placeholderTextColor={status === '3' ? 'grey' : 'lightgrey'} style={{ height: 55, backgroundColor: 'white', borderRadius: 27.5, marginTop: 15, color: 'black', fontFamily: 'NunitoSans-Regular', paddingHorizontal: 20 }} />
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
                        <Button block rounded style={{ marginTop: 20, flex: 1, borderColor: '#327FEB', backgroundColor: '#327FEB', borderWidth: 1, borderRadius: 25, height: 57 }} onPress={() => Linking.openURL('whatsapp://send?text=Type Your Query&phone=+918861024466')} >
                            <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 17, alignSelf: 'center', marginLeft: 40 }}>Contact Us</Text>
                            <Icon name="whatsapp" type="Fontisto" style={{ fontSize: 20, color: '#4FCE5D' }} />
                        </Button>
                        <Button block rounded iconLeft style={{ marginTop: 20, flex: 1, borderColor: 'white', backgroundColor: 'white', borderWidth: 1, borderRadius: 25, height: 57, }} onPress={() => logout()} >
                            <Text style={{ color: "grey", fontFamily: 'NunitoSans-Bold', fontSize: 17 }}>{status === '3' ? 'Logout' : 'Login'}</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
            <BottomSheet
                ref={sheetRef}
                snapPoints={[400, -200]}
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
        </View>
    );

}
export default Settings;