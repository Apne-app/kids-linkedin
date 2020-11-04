/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text,Alert, BackHandler, Dimensions, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from "@react-navigation/native";
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const Unverified = ({ navigation }) => {

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

    const send = async () => {
        var x = await AsyncStorage.getItem('status');
        if (x) {
            if (x == '1') {
                navigation.navigate('Unverified')
            }
            if (x == '2') {
                navigation.navigate('Child')
            }
            if (x == '3') {
                navigation.navigate('Home')
            }
        }
    }
    useEffect(() => {
        const getData = async () => {
            var pro = await AsyncStorage.getItem('profile')
            pro = JSON.parse(pro)
            axios.get('http://104.199.158.211:5000/getchild/' + pro.email + '/')
                .then(async (response) => {
                    await AsyncStorage.setItem('children', JSON.stringify(response.data))
                    if (Object.keys(response.data).length) {
                        await AsyncStorage.setItem('status', '3')
                        navigation.navigate('Home')
                    }
                    else {
                        await AsyncStorage.setItem('status', '2')
                        navigation.navigate('Child')
                    }
                    console.log(response.data)
                })
            var x = await AsyncStorage.getItem('status');
        }
        getData()
    }, [])
    return (
        <View style={{ backgroundColor: 'white', height: height, width: width }}>
            <Image source={require('../assets/verified.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
            <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Your email has been verified!</Text>
            {/* <View style={{ backgroundColor: 'white' }}>
                <Button  block dark style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 10, height: 50, width: width - 40, alignSelf: 'center', marginHorizontal: 20 }}>
                    <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 16, marginTop: 2 }}>Continue</Text>
                </Button>
            </View> */}
        </View>
    );

}
export default Unverified;