/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TextInput } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import CompHeader from '../Modules/CompHeader';
import CompButton from '../Modules/CompButton'
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const NotificationScreen = ({ route, navigation }) => {

  const [children, setchildren] = useState('notyet')
  const [status, setstatus] = useState('0')
  useEffect(() => {
    const check = async () => {
      var child = await AsyncStorage.getItem('children')
      if (child != null) {
        child = JSON.parse(child)
        setchildren(child)
      }
    }
    check()
  }, [])
  useEffect(() => {
    const check = async () => {
      var st = await AsyncStorage.getItem('status')
      setstatus(status)
    }
    check()
  }, [])
  useEffect(() => {
    const check = async () => {
      var st = await AsyncStorage.getItem('status')
      if (st == '3') {
        var pro = await AsyncStorage.getItem('profile')
        if (pro !== null) {
          pro = JSON.parse(pro)
          axios.get('http://104.199.158.211:5000/getchild/' + pro.email + '/')
            .then(async (response) => {
              setchildren(response.data)
              await AsyncStorage.setItem('children', JSON.stringify(response.data))
            })
            .catch((error) => {
              console.log(error)
            })
        }
      }
      else {
        // console.log('helo')
      }
    }
    setTimeout(() => {
      check()
    }, 3000);
  }, [])
  const there = () => {

    return (
      <View>
        <CompHeader screen={'Notifications'} icon={'back'} goback={() => navigation.navigate('Home')} />
        <View style={{ marginTop: '40%', alignItems: 'center', padding: 40 }}>
          <Icon type="Feather" name="x-circle" style={{ fontSize: 78 }} onPress={() => navigation.navigate('Profile')} />
          <Text style={{ textAlign: 'center', fontFamily: 'NunitoSans-Bold', fontSize: 24, marginTop: 20 }}>Notifications Empty</Text>
          <Text style={{ textAlign: 'center', fontFamily: 'NunitoSans-Regular', fontSize: 16, marginTop: 20 }}>There are no notifications in this account, let’s discover and take a look this later.</Text>
        </View>
      </View>
    );
  }
  const loading = () => {
    return (
      <View style={{ backgroundColor: 'white', height: height, width: width }}>
        <Image source={require('../assets/loading.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: width / 2 }} />
      </View>
    );
  }
  const notthere = () => {
    return (
      <View style={{ backgroundColor: 'white', height: height, width: width }}>
        <CompHeader screen={'Notifications'} icon={'back'} goback={() => navigation.navigate('Home')} />
        <CompButton message={'Signup/Login to view/recieve notifications'} />
      </View>
    )
  }
  return (
    children == 'notyet' ? loading() : Object.keys(children).length > 0 && status == '3' ? there() : notthere()
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    // padding: 40, 
    // paddingTop: 80
  },
  sep: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: height * 0.05,
    lineHeight: 25,
    backgroundColor: '#fff',
    borderColor: "#fff",
    color: "#383838",
  },
  form: {
    marginTop: 40,
    flex: 1
    // alignSelf: 'center'
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  tinyLogo: {
    alignSelf: 'center',
    marginTop: 40
    // height: 80,
  },
  txt: {
    fontFamily: 'NunitoSans-Regular'
  },
  time: {
    color: "#A9A9A9"
  }
})

export default NotificationScreen;