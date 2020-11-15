/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, KeyboardAvoidingView, Keyboard, ScrollView, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider, } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Title, Left, Body, Right } from 'native-base';
import { Appbar } from 'react-native-paper';
import Constants from "expo-constants";
const CompHeader = (props) => {
  const images = {
    close: require('../Icons/close.png'),
    back: require('../Icons/back.png'),
  };
  return (<Appbar.Header style={{ backgroundColor: 'white' }} statusBarHeight={Constants.statusBarHeight}>
    <View style={{ flexDirection: 'row', flex: 1, marginLeft: 10 }}>
      <TouchableOpacity onPress={() => props.goback()}>
        <Image style={{ height: 30, width: 30, backgroundColor: "transparent", marginTop:0 }} source={(props.icon == 'back' ? images.back : images.close)} />
      </TouchableOpacity>
      <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 24, marginLeft: 10, width: 200, marginTop: -5 }}>{props.screen}</Text>
    </View>
    <Body>
    </Body>
    {props.right ? <Right>
      <TouchableOpacity style={{ borderRadius: 20, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', marginRight: -25 }}
        onPress={() => props.delete()}
      >
        <Icon name="trash" type="Feather" style={{ color: props.selecting ? "red" : '#000' }} />
      </TouchableOpacity>
    </Right> : <Right />}
  </Appbar.Header>
  )
}
export default CompHeader