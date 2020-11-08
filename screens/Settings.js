/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Alert, BackHandler, Dimensions, Image, TextInput, ScrollView } from 'react-native'
import { Switch } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer, Body, Title, Right, } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from "@react-navigation/native";
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const Settings = ({ navigation }) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const logout = async () => {
        var arr = await AsyncStorage.getAllKeys()
        await AsyncStorage.multiRemove(arr)
        navigation.navigate('Login')

    }
    return (
        <ScrollView>
            <Header noShadow style={{ backgroundColor: '#fff', height: 60, borderBottomWidth: 0, marginTop: 10 }}>
                <Body style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Icon type="Feather" name="arrow-left" onPress={() => navigation.navigate('Profile')} />
                    <Title style={{ fontFamily: 'NunitoSans-Regular', fontSize: 28, marginTop: -5, marginLeft: 20, color: 'black' }}>Settings</Title>
                </Body>
            </Header>
            <View style={{ margin: 25 }}>
                <Text style={{ fontSize: 16, fontFamily: "NunitoSans-SemiBold" }}>Kid's Name</Text>
                <TextInput placeholder="Kid's Name" style={{ height: 55, backgroundColor: 'white', borderRadius: 27.5, marginTop: 15, color: 'black', fontFamily: 'NunitoSans-Regular', paddingHorizontal: 20 }} />
                <Text style={{ fontSize: 16, fontFamily: "NunitoSans-SemiBold", marginTop: 35 }}>Kid's Year of Birth</Text>
                <TextInput placeholder="Kid's Year of Birth" style={{ height: 55, backgroundColor: 'white', borderRadius: 27.5, marginTop: 15, color: 'black', fontFamily: 'NunitoSans-Regular', paddingHorizontal: 20 }} />
                <View style={{ backgroundColor: 'white', marginTop: 35, borderRadius: 10, height: 56, flexDirection: 'row' }}>
                    <Text style={{ fontSize: 16, fontFamily: "NunitoSans-Bold", marginVertical: 15, marginLeft: 23 }}>Push Notifications</Text>
                    <Right style={{ marginRight: 40 }}><Switch value={isSwitchOn} onValueChange={onToggleSwitch} color={'#327FEB'} /></Right>
                </View>
                <View style={{ flexDirection: 'column', marginTop:'40%' }}>
                    <Button block rounded iconLeft style={{ marginTop: 20, flex: 1, borderColor: '#327FEB', backgroundColor: '#327FEB', borderWidth: 1, borderRadius: 25, height: 57, }} onPress={() => navigation.navigate('Home', {})} >
                        <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 17 }}>Give Feedback</Text>
                    </Button>
                    <Button block rounded style={{ marginTop: 20, flex: 1, borderColor: '#327FEB', backgroundColor: '#327FEB', borderWidth: 1, borderRadius: 25, height: 57 }} onPress={() => navigation.navigate('Home', {})} >
                        <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 17, alignSelf: 'center',  marginLeft: 40 }}>Contact Us</Text>
                        <Icon name="whatsapp" type="Fontisto" style={{ fontSize: 20, color: '#4FCE5D' }} />
                    </Button>
                    <Button block rounded iconLeft style={{ marginTop: 20, flex: 1, borderColor: 'white', backgroundColor: 'white', borderWidth: 1, borderRadius: 25, height: 57, }} onPress={() => logout()} >
                        <Text style={{ color: "grey", fontFamily: 'NunitoSans-Bold', fontSize: 17 }}>Logout</Text>
                    </Button>
                </View>
            </View>
        </ScrollView>
    );

}
export default Settings;