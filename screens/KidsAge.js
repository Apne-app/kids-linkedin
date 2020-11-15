/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Alert, BackHandler, Dimensions, Image, TouchableOpacity } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer, Body } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useFocusEffect } from "@react-navigation/native";
import { Snackbar } from 'react-native-paper';
import CountDown from 'react-native-countdown-component';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const KidUser = ({ navigation, route }) => {


    return (
        <View style={{ backgroundColor: 'white', height: height }}>
            <Image source={require('../assets/locked.gif')} style={{ width: 200, height: 200, alignSelf: 'center', marginTop: '50%' }} />
            <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, paddingHorizontal: 20, textAlign: 'center' }}>Genio is currently built for kids upto 13</Text>
            <Button block style={{ marginTop: 20, borderColor: '#327FEB', backgroundColor: '#327FEB', borderWidth: 1, borderRadius: 25, width: width - 40, alignSelf: 'center', height: 60 }} onPress={() => navigation.navigate('Home')} >
                <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 18 }}>Go Back</Text>
            </Button>
            <Button block style={{ marginTop: 20, borderColor: '#327FEB', backgroundColor: 'white', borderWidth: 1, borderRadius: 25, width: width - 40, alignSelf: 'center', height: 60 }} onPress={() => navigation.navigate('Home')} >
                <Text style={{ color: "#327FEB", fontFamily: 'NunitoSans-Bold', fontSize: 18 }}>Continue as a guest</Text>
            </Button>
        </View>
    );

}
export default KidUser;