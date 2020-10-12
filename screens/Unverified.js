/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const Unverified = ({ navigation }) => {
    const [profile, setprofile] = useState({ 'email': '' })
    // console.log('http://35.229.160.51:5000/send/' + profile.id + '/' + profile.email + '/')
    const handleDynamicLink = async(link) => {
        // Handle dynamic link inside your own application
        var pro = await AsyncStorage.getItem('profile')
            pro = JSON.parse(pro)
            console.log(pro, link, link.url.includes(pro.uuid), "sadad")
            if (link.url.includes(pro.uuid)) {
                console.log(link.url.includes(pro.uuid))
                // ...navigate to your offers screen
                // navigation.navigate('Verified')
            }
        };
        useEffect(() => {
            const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
            // When the is component unmounted, remove the listener
            return () => unsubscribe();
        }, []);
        const send = () => {
            axios.get('http://35.229.160.51:80/send/' + profile.uuid + '/' + profile.email + '/')
                .then((response) => {
                    console.log(response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        useEffect(() => {
            const getData = async () => {
                var pro = await AsyncStorage.getItem('profile')
                if (pro !== null) {
                    pro = JSON.parse(pro)
                    // console.log(pro)
                    setprofile(pro)
                    axios.get('http://35.229.160.51:80/send/' + pro.uuid + '/' + pro.email + '/')
                        .then((response) => {
                            console.log(response.data)
                        })
                        .catch((response) => {
                            console.log(response)
                        })
                }
                else {
                    console.log('Login')
                }
            }
            getData()
        }, [])
        return (
            <View style={{ backgroundColor: 'white', height: height, width: width }}>
                <Image source={require('../assets/emailsent.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>We've sent an email to{"\n"}<Text style={{ textDecorationLine: 'underline', textDecorationColor: 'lightblue' }}>{profile.email}</Text>{"\n"}for verification</Text>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Please verify for becoming a part of the community</Text>
                <View style={{ backgroundColor: 'white' }}>
                    <Button onPress={() => send()} block dark style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 10, height: 50, width: width - 40, alignSelf: 'center', marginHorizontal: 20 }}>
                        <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 2 }}>Send again</Text>
                    </Button>
                    <Button onPress={() => navigation.navigate('Home')} block dark style={{ marginTop: 10, backgroundColor: 'lightgreen', borderRadius: 10, height: 50, width: width - 40, alignSelf: 'center', marginBottom: 40, marginHorizontal: 20 }}>
                        <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 2 }}>Continue without verification*</Text>
                    </Button>
                    <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 10, textAlign: 'center' }}>*You wont be able to use the social network</Text>
                </View>
            </View>
        );

    }
    export default Unverified;