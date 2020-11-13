/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, KeyboardAvoidingView, Keyboard, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider, } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Title, Left, Body, Right } from 'native-base';
import { Appbar } from 'react-native-paper';
const CompHeader = (props) => {
    const images = {
        close: require('../Icons/close.png'),
        back: require('../Icons/back.png'),
    };
    return (<Appbar.Header style={{backgroundColor:'white'}} statusBarHeight={30}>
        <View style={{ flexDirection: 'row', marginTop: props.screen == 'Genio' ? 0 : 6, flex: 1, marginBottom:10, marginLeft:10 }}>
            <Text style={{ fontFamily: props.screen == 'Genio' ? 'FingerPaint-Regular' : 'NunitoSans-Bold', fontSize: props.screen == 'Genio' ? 40 : 30, marginLeft: 10, color: props.screen == 'Genio' ? '#327FEB' : 'black', width: 200 }}>{props.screen}</Text>
        </View>
        <Body>
        </Body>
        <Right>
            <TouchableOpacity style={{ borderRadius: 20, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', marginTop: props.screen == 'Genio' ? -6 : 0, marginRight: -45 }}
                onPress={() => props.fun()}
            >
                <Icon name={props.icon} type="Feather" />
            </TouchableOpacity>
        </Right>
    </Appbar.Header>
    )
}
export default CompHeader