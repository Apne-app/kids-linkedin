/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, ReplyIcon, NotificationFeed } from 'react-native-activity-feed';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const NotificationScreen = ({ route, navigation }) => {

  const [children, setchildren] = useState('notyet')
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
      <Container>
        <StreamApp
          apiKey={'dfm952s3p57q'}
          appId={'90935'}
          token={'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDlpZCJ9.A89Wjxxk_7hVBFyoSREkPhLCHsYY6Vq66MrBuOTm_mQ'}
          defaultUserData={{
            name: 'Batman',
            url: 'batsignal.com',
            desc: 'Smart, violent and brutally tough solutions to crime.',
            profileImage:
              'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
            coverImage:
              'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
          }}
        >
          <NotificationFeed
            // Group={this._renderGroup}
            // navigation={this.props.navigation}
            notify
          />
        </StreamApp>
      </Container>
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
        <Image source={require('../assets/locked.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>You haven't added your child's details yet. Please add to use the social network</Text>
        <View style={{ backgroundColor: 'white' }}>
          <Button onPress={() => send()} block dark style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 10, height: 50, width: width - 40, alignSelf: 'center', marginHorizontal: 20 }}>
            <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 2 }}>Add child's details</Text>
          </Button>
        </View>
      </View>
    )
  }
  return (
    children == 'notyet' ? loading() : Object.keys(children).length > 0 ? there() : notthere()
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
    fontFamily: 'Poppins-Regular'
  },
  time: {
    color: "#A9A9A9"
  }
})

export default NotificationScreen;