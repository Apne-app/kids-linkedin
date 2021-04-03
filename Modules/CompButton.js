/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect, useRef } from 'react'; 
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, KeyboardAvoidingView, Keyboard, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider, } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Title, Left, Body, Right } from 'native-base';
const width = Dimensions.get('screen').width
const CompButton = (props) => {
    const images = {
        close: require('../Icons/close.png'),
        back: require('../Icons/back.png'),
    };
    return (<Button block dark style={{  backgroundColor: '#327FEB', borderRadius: 30, height: 50, width: width+400, alignSelf: 'center', marginTop: props.profile ? 400 : 0}}>
        <Text style={{ color: "#fff", fontFamily: 'NunitoSans-SemiBold', fontSize: 14 }}>{props.message}</Text>
    </Button>
    )
}
export default CompButton