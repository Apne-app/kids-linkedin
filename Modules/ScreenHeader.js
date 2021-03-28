/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect, useRef } from 'react'; 
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, KeyboardAvoidingView, Keyboard, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider, } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Title, Left, Body, Right } from 'native-base';
import { Appbar } from 'react-native-paper';
const CompHeader = (props) => {
    const images = {
        close: require('../Icons/close.png'),
        back: require('../Icons/back.png'),
    };
    return (<Appbar.Header style={{ backgroundColor: '#327FEB', marginBottom: 10, elevation: 10 }} statusBarHeight={10}>
        <View style={{ flexDirection: 'row', marginTop: props.screen == 'Genio' ? 0 : 6, flex: 1, marginBottom: 10, marginLeft: 10, width: 100 }}>
            {props.left && <TouchableOpacity onPress={() => props.goback()}>
                <Image style={{ height: 30, width: 30, backgroundColor: "transparent", marginTop: 8 }} source={(images.back)} />
            </TouchableOpacity>}
            <Text style={{ fontFamily: props.screen == 'Genio' ? 'FingerPaint-Regular' : 'NunitoSans-Bold', fontSize: props.screen == 'Genio' ? 40 : 30, marginLeft: 10, color: props.screen == 'Genio' ? 'white' : 'white', width: 200 }}>{props.screen}</Text>
        </View>
        <Body>
        </Body>
        <Right>
            <TouchableOpacity style={{ borderWidth: 0, borderColor: "#fff", alignSelf: 'center', marginTop: props.screen == 'Genio' ? -6 : 0, marginRight: -45, width: 80, height: 50, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => props.fun()}
            >
                <Icon name={props.icon} style={{ color: 'white', alignSelf: 'center' }} type="Feather" />
                {props.new && <View style={{ borderRadius: 10000, backgroundColor: 'red', width: 8, height: 8, marginLeft: -11 }} />}
            </TouchableOpacity>
        </Right>
    </Appbar.Header>
    )
}
export default CompHeader