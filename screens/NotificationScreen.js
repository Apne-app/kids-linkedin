/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, Image, BackHandler, TextInput, RefreshControl } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList, NotificationFeed } from 'react-native-activity-feed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CompHeader from '../Modules/CompHeader';
import CompButton from '../Modules/CompButton'
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from 'react-native-gesture-handler';
import { saveNotifications } from "../Actions/saveNotifications"
import { connect } from "react-redux";
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const NotificationScreen = ({ route, navigation }) => {

  const [children, setchildren] = useState('notyet')
  const [notifications, setnotifications] = useState({})
  const [keys, setkeys] = useState([])
  const [extra, setextra] = useState([])
  const [fetched, setfetched] = useState(false)
  const [status, setstatus] = useState('0')
  const [refreshing, setrefreshing] = useState(false)
  const [place, setplace] = useState('1')

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.pop()
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, []));

  useEffect(() => {
    const check = async () => {
      var x = await AsyncStorage.getItem('children');
      if (x) {
        x = JSON.parse(x)
        if (Object.keys(x).length == 0) {
          await AsyncStorage.removeItem('children');
          x = null
        }
        analytics.screen('Notifications Screen', {
          userID: x ? x["0"]["data"]["gsToken"] : null,
          deviceID: getUniqueId()
        })
      }
      else {
        analytics.screen('Notifications Screen', {
          userID: null,
          deviceID: getUniqueId()
        })
      }

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
      var noti = await AsyncStorage.getItem('notifications')
      setstatus(st)
      if (st === '3') {
        var newnoti = await AsyncStorage.getItem('newnoti')
        if (noti) {
          noti = JSON.parse(noti)
          setfetched(true)
          setnotifications(noti)
          setkeys(Object.keys(noti).reverse())
          if (newnoti) {
            newnoti = Array(newnoti)
            setextra(newnoti)
          }
        }
      }
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
          var data = JSON.stringify({ "username": "Shashwat", "password": "GenioKaPassword" });

          var config = {
            method: 'post',
            url: 'https://api.genio.app/dark-knight/getToken',
            headers: {
              'Content-Type': 'application/json'
            },
            data: data
          };

          axios(config)
            .then(function (response) {
              // console.log(JSON.stringify(response.data.token));
              axios({
                method: 'post',
                url: 'https://api.genio.app/matrix/getchild/' + `?token=${response.data.token}`,
                headers: {
                  'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                  "email": pro.email,
                })
              })
                .then(async (response) => {
                  setchildren(response.data)
                  console.log(response.data[0]['id'])
                  axios({
                    method: 'get',
                    url: 'https://api.genio.app/magnolia/' + response.data[0]['id'],
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    // data: JSON.stringify({
                    //   "email": pro.email,
                    // })
                  }).then(async (data) => {
                    setfetched(true)
                    setnotifications(data.data)
                    setplace(String(Math.random()))
                    var noti = await AsyncStorage.getItem('notifications')
                    noti = JSON.parse(noti)
                    var arr = []
                    var data1 = Object.keys(noti).reverse()
                    var data2 = Object.keys(data.data).reverse()
                    for (var i = 0; i < data2.length; i++) {
                      if (!data1.includes(data2[i])) {
                        arr.push(data2[i])
                      }
                      else {
                        break;
                      }
                    }
                    setextra(arr)
                    AsyncStorage.removeItem('newnoti')
                    AsyncStorage.setItem('notifications', JSON.stringify(data.data))
                    setkeys(data2)
                  })
                  // console.log(response);
                  await AsyncStorage.setItem('children', JSON.stringify(response.data))
                })
                .catch((error) => {
                  console.log(error)
                })
            })
            .catch(function (error) {
              console.log(error);
            });

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
  const refresh = () => {
    setrefreshing(true)
    axios({
      method: 'get',
      url: 'https://api.genio.app/magnolia/' + children[0]['id'],
      headers: {
        'Content-Type': 'application/json'
      },
      // data: JSON.stringify({
      //   "email": pro.email,
      // })
    }).then(async (data) => {
      setfetched(true)
      setnotifications(data.data)
      var noti = await AsyncStorage.getItem('notifications')
      noti = JSON.parse(noti)
      var arr = []
      var data1 = Object.keys(noti).reverse()
      var data2 = Object.keys(data.data).reverse()
      for (var i = 0; i < data2.length; i++) {
        if (!data1.includes(data2[i])) {
          arr.push(data2[i])
        }
        else {
          break;
        }
      }
      setextra(arr)
      setrefreshing(false)
      setkeys(data2)
      AsyncStorage.removeItem('newnoti')
      AsyncStorage.setItem('notifications', JSON.stringify(data.data))
    })
  }
  const data = () => {
    var arr = []
    keys.map((item) => {
      arr.push(
        notifications[item]['name'] == 'admin' ?
          <View key={item}>
            <View style={{ flexDirection: 'row', marginVertical: 7, paddingLeft: 10 }}>
              {extra.includes(item) && <View style={{ borderRadius: 10000, backgroundColor: '#327FEB', width: 6, height: 6, marginLeft: 0, marginTop: 16, marginRight: 5 }} />}
              <Image style={{ width: 40, height: 40, borderRadius: 1000, }} source={{ uri: notifications[item]['image'] }} />
              <Text style={{ color: 'black', fontFamily: 'NunitoSans-SemiBold', fontSize: 14, margin: 10, paddingRight: 40 }}>{notifications[item]['type']}</Text>
            </View>
            <View style={{ width: width - 80, alignSelf: 'center', height: 0.5, backgroundColor: 'lightgrey', marginVertical: 5 }}></View>
          </View> :
          <View key={item}>
            <View style={{ flexDirection: 'row', marginVertical: 7, paddingLeft: 10, }}>
              {extra.includes(item) && <View style={{ borderRadius: 10000, backgroundColor: '#327FEB', width: 6, height: 6, marginLeft: 2, marginTop: 16, marginRight: 10 }} />}
              <Image style={{ width: 40, height: 40, borderRadius: 1000 }} source={{ uri: notifications[item]['image'] }} />
              <Text style={{ color: 'black', fontFamily: 'NunitoSans-SemiBold', fontSize: 14, margin: 10, paddingRight: 40 }}>{notifications[item]['name'][0].toUpperCase() + notifications[item]['name'].substring(1) + ' ' + notifications[item]['type'] + ' your post'}</Text>
            </View>
            <View style={{ width: width - 80, alignSelf: 'center', height: 0.5, backgroundColor: 'lightgrey', marginVertical: 5 }}></View>
          </View>
      )
    })
    return arr
  }
  const there = () => {
    return (
      <>
        {!keys.length && fetched &&
          <View style={{ marginTop: '40%', alignItems: 'center', padding: 40 }}>
            <Icon type="Feather" name="x-circle" style={{ fontSize: 78 }} onPress={() => navigation.navigate('Profile')} />
            <Text style={{ textAlign: 'center', fontFamily: 'NunitoSans-Bold', fontSize: 24, marginTop: 20 }}>Notifications Empty</Text>
            <Text style={{ textAlign: 'center', fontFamily: 'NunitoSans-Regular', fontSize: 16, marginTop: 20 }}>There are no notifications in this account, discover and take a look at this later.</Text>
          </View>
        }
        {!fetched &&
          loading()
        }
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }>
          {data()}
        </ScrollView>
      </>
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
        <CompButton message={'Signup/Login to view/recieve notifications'} />
      </View>
    )
  }
  return (
    <>
      <CompHeader screen={'Notifications'} icon={'back'} goback={() => navigation.navigate('Home')} />
      {children == 'notyet' ? loading() : Object.keys(children).length > 0 && status == '3' ? there() : notthere()}
    </>
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


export default NotificationScreen