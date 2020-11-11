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
      <TouchableOpacity onPress={() => props.goback()}><Image style={{ height: 30, width: 30, backgroundColor: "transparent", marginLeft: 1, marginTop: 3.5 }} source={(props.icon == 'back' ? images.back : images.close)} /></TouchableOpacity>
      <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 22, marginLeft: 10,  width:200 }}>{props.screen}</Text>
    </View>
    <Body>
    </Body>
    {props.right ? <Right>
      <TouchableOpacity style={{ borderRadius: 20, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', marginTop: 30, marginRight: 10 }}
        onPress={() => props.delete()}
      >
        <Icon name="trash" type="Feather" style={{ color: props.selecting ? "red" : '#000' }} />
      </TouchableOpacity>
    </Right> : <Right />}
  </Header>
  )
}
export default CompHeader