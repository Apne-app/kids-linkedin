/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, KeyboardAvoidingView, Keyboard, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider, } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Title, Left, Body, Right } from 'native-base';
import { Appbar } from 'react-native-paper';
import Constants from "expo-constants";
const CompHeader = (props) => {
    const images = {
        close: require('../Icons/close.png'),
        back: require('../Icons/back.png'),
    };
    // statusBarHeight={Constants.statusBarHeight + 10}
    return (<Appbar.Header style={{ backgroundColor: '#327FEB', marginBottom:10, elevation:10 }} statusBarHeight={10}>
        <View style={{ flexDirection: 'row', marginTop: props.screen == 'Genio' ? 0 : 6, flex: 1, marginBottom: 10, marginLeft: 10, width:100 }}>
            {props.left && <TouchableOpacity onPress={() => props.goback()}>
                <Image style={{ height: 30, width: 30, backgroundColor: "transparent", marginTop: 8 }} source={(images.back)} />
            </TouchableOpacity>}
            <Text style={{ fontFamily: props.screen == 'Genio' ? 'FingerPaint-Regular' : 'NunitoSans-Bold', fontSize: props.screen == 'Genio' ? 40 : 30, marginLeft: 10, color: props.screen == 'Genio' ? 'white' : 'white', width: 200 }}>{props.screen}</Text>
        </View>
        <Body>
        </Body>
         <Right>
            <TouchableOpacity style={{display:props.icon==='bell'?'none':'flex', borderRadius: 20, borderWidth: 0, borderColor: "#fff", alignSelf: 'center', marginTop: props.screen == 'Genio' ? -6 : 0, marginRight: -45 }}
                onPress={() => props.fun()}
            >
                <Icon name={props.icon} style={{color:'white'}} type="Feather" />
            </TouchableOpacity>
        </Right>
    </Appbar.Header>
    )
}
export default CompHeader