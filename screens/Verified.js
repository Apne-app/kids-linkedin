/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const Unverified = ({ navigation }) => {
    const [profile, setprofile] = useState({ 'email': '' })
    // console.log('http://35.229.160.51:5000/send/' + profile.id + '/' + profile.email + '/')
    const send = () => {
        navigation.navigate('Child')
    }
    useEffect(() => {
        const getData = async () => {
            try {
                var pro = await AsyncStorage.getItem('profile')
                if (pro !== null) {
                    pro = JSON.parse(pro)
                    // console.log(pro)
                    setprofile(pro)
                    axios.get('http://35.229.160.51:5000/send/' + pro.id + '/' + pro.email + '/')
                        .then((response) => {
                            if(response.data=='verified'){
                                navigation.navigate('Child')
                            }
                            else{
                                navigation.navigate('Unverified')
                            }
                        })
                }
                else {
                    // console.log('helo')
                }
            } catch (e) {
                // error reading value
            }
        }
        getData()
    }, [])
    return (
        <View style={{ backgroundColor: 'white', height: height, width: width }}>
            <Image source={require('../assets/verified.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Your email has been verified!</Text>
            <View style={{ backgroundColor: 'white' }}>
                <Button onPress={() => send()} block dark style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 10, height: 50, width: width - 40, alignSelf: 'center', marginHorizontal: 20 }}>
                    <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 2 }}>Add child's details</Text>
                </Button>
            </View>
        </View>
    );

}
export default Unverified;