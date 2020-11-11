/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, KeyboardAvoidingView, Keyboard, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider, } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Title, Left, Body, Right } from 'native-base';
const CompHeader = (props) => {
    const images = {
        close: require('../Icons/close.png'),
        back: require('../Icons/back.png'),
    };
    return (<Header style={{ backgroundColor: 'white', height: 90, }}>
        <View style={{ flexDirection: 'row', marginTop: 42, flex: 1 }}>
            <Text style={{ fontFamily: props.screen == 'Genio' ? 'FingerPaint-Regular' : 'NunitoSans-Regular', fontSize: 22, marginLeft: 10, color: props.screen == 'Genio' ? '#327FEB' : 'black', width:200 }}>{props.screen}</Text>
        </View>
        <Body>
        </Body>
        <Right>
            <TouchableOpacity style={{ borderRadius: 20, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', marginTop: 30, marginRight: 10 }}
                onPress={() => props.delete()}
            >
                <Icon name={props.icon} type="Feather"  />
            </TouchableOpacity>
        </Right>
    </Header>
    )
}
export default CompHeader