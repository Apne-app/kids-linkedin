
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, KeyboardAvoidingView, Keyboard, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider, } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Title, Left, Body, Right } from 'native-base';
const CompHeader = (props) => {
    return (<Header style={{ backgroundColor: 'white', height: 90 }}>
        <View style={{ flexDirection: 'row', marginTop: 40, flex:1 }}>
            <TouchableOpacity><Icon type="Feather" name="x" style={{ color: "#000", fontSize: 30, }} /></TouchableOpacity>
            <Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 16, marginLeft: 20 }}>{props.screen}</Text>
        </View>
        <Body>
        </Body>
        <Right />
    </Header>
    )
}
export default CompHeader