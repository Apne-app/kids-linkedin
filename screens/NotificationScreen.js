/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, Image, BackHandler, TextInput, RefreshControl } from 'react-native'
import { Icon } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import CompHeader from '../Modules/CompHeader';
import CompButton from '../Modules/CompButton'
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from '../Context/Data';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const NotificationScreen = ({ route, navigation }) => {
  const children = route.params.children
  const notifications = route.params.notifications
  const keys = notifications ? Object.keys(notifications).reverse() : []
  const [extra, setextra] = useState([])
  const status = route.params.status
  const [refreshing, setrefreshing] = useState(false)
  const [place, setplace] = useState('1')
  const { Update } = React.useContext(AuthContext);
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
      var x = children
      if (x) {
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
    }
    check()
  }, [])
  useEffect(() => {
    const check = async () => {
      if (status == '3') {
        var data = await axios({
          method: 'get',
          url: 'https://api.genio.app/magnolia/' + children[0]['id'],
          headers: {
            'Content-Type': 'application/json'
          },
          // data: JSON.stringify({
          //   "email": pro.email,
          // })
        })
        var noti = notifications
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
        Update({ notifications: data.data })
        console.log(data.data)
        AsyncStorage.setItem('notifications', JSON.stringify(data.data))
        setplace(String(Math.random()))
      }
      else {
        // console.log('helo')
      }
    }
    check()
  }, [])
  const refresh = async () => {
    setrefreshing(true)
    var data = await axios({
      method: 'get',
      url: 'https://api.genio.app/magnolia/' + children[0]['id'],
      headers: {
        'Content-Type': 'application/json'
      },
    })
    var noti = notifications
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
    Update({ notifications: data.data })
    AsyncStorage.removeItem('newnoti')
    AsyncStorage.setItem('notifications', JSON.stringify(data.data))
    setplace(String(Math.random()))
    setrefreshing(false)
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
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }>
          {!keys.length ?
            <View style={{ marginTop: '40%', alignItems: 'center', padding: 40 }}>
              <Icon type="Feather" name="x-circle" style={{ fontSize: 78 }} onPress={() => navigation.navigate('Profile')} />
              <Text style={{ textAlign: 'center', fontFamily: 'NunitoSans-Bold', fontSize: 24, marginTop: 20 }}>Notifications Empty</Text>
              <Text style={{ textAlign: 'center', fontFamily: 'NunitoSans-Regular', fontSize: 16, marginTop: 20 }}>There are no notifications in this account, discover and take a look at this later.</Text>
            </View>
            : data()}
        </ScrollView>
      </>
    );
  }
  const notthere = () => {
    return (
      <View style={{ backgroundColor: 'white', height: height, width: width }}>
        <CompButton message={'Signup/Login to view/receive notifications'} />
      </View>
    )
  }
  return (
    <>
      <CompHeader screen={'Notifications'} icon={'back'} goback={() => navigation.navigate('Home')} />
      {status == '3' ? there() : notthere()}
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