/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, BackHandler, Alert, Image, FlatList, Keyboard, ScrollView } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import ScreenHeader from '../Modules/ScreenHeader'
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import CompButton from '../Modules/CompButton'
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import AuthContext from '../Context/Data';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'NunitoSans-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'NunitoSans-Regular',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'NunitoSans-Regular',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'NunitoSans-Regular',
      fontWeight: 'normal',
    },
  },
};

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
};


const SearchScreen = ({ route, navigation }) => {
  const { Update } = React.useContext(AuthContext);
  const [joined, setjoined] = useState({})
  const [influencer, setinfluencer] = useState([])
  const [place, setplace] = useState('1')
  const children = route.params.children
  const status = route.params.status
  useEffect(() => {
    const data = async () => {
      var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });
      var config = {
        method: 'post',
        url: 'https://api.genio.app/dark-knight/getToken',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };
      var response = await axios(config)
      var response1 = await axios.get('https://api.genio.app/sherlock/recently/0' + `/?token=${response.data.token}`)
      // Update({ 'joined': response1.data })
      setjoined(response1.data)
    }
    data()
  }, [])
  useEffect(() => {
    axios.get('http://mr_robot.api.genio.app/influencer', {
      headers: {
        'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      setinfluencer(response['data']['data'])
    }).catch((error) => {
      console.log(error)
    })
  }, [])
  useEffect(() => {
    const check = async () => {
      if (children) {
        if (Object.keys(children).length == 0) {
          await AsyncStorage.removeItem('children');
          children = null
        }
        analytics.screen('Search Screen', {
          userID: children ? children["0"]["id"] : null,
          deviceID: getUniqueId()
        })
      }
      else {
        analytics.screen('Search Screen', {
          userID: null,
          deviceID: getUniqueId()
        })
      }

    }
    check()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home', { screen: 'Feed' })
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, []));
  const there = () => {
    return (
      <ScrollView style={{ marginHorizontal: 10 }} key={place}>
           <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Text style={{ color: "#000", textAlign: 'left', fontSize: 22, marginLeft: 15, fontFamily: 'NunitoSans-Bold' }}>Genio's Influencers</Text>
        </View>
        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
          {influencer.map((item) => {
            item = item['data']
            return (
              <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1, width: width / 4.5, height: 110 }} onPress={async () => {
                var x = await AsyncStorage.getItem('children');
                analytics.track('ProfileOpenedFromRecentlyJoined', {
                  userID: x ? JSON.parse(x)["0"]["id"] : null,
                  deviceID: getUniqueId()
                });
                children[0]['id'] === item['user_id'] ? navigation.navigate('Profile') : navigation.navigate('IndProf', { 'id': item['user_id'], 'data': { 'name': item['user_name'], 'image': item['user_image'], 'year': item['user_year'] } })
              }
              }
              >
                <View
                  key={item['user_id']}
                  style={{ flex: 1, }}>
                  <FastImage
                    style={styles.image}
                    imageStyle={{ borderRadius: 100000 }}
                    source={{
                      uri: item['user_image'],
                      priority: FastImage.priority.high
                    }}
                  />
                  <View>
                    <Text style={{ color: "black", textAlign: 'center', fontSize: 15, fontFamily: 'NunitoSans-Bold', marginTop: -4 }}>{item['user_name'][0].toUpperCase() + item['user_name'].substring(1)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Text style={{ color: "#000", textAlign: 'left', fontSize: 22, marginLeft: 15, fontFamily: 'NunitoSans-Bold' }}>Recently Joined</Text>
        </View>
        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
          {Object.keys(joined).map((item) => {
            return (
              <TouchableOpacity key={joined[item]['id']} style={{ flex: 1, flexDirection: 'column', margin: 1, width: width / 4.5, height: 110 }} onPress={async () => {
                var x = await AsyncStorage.getItem('children');
                analytics.track('ProfileOpenedFromRecentlyJoined', {
                  userID: x ? JSON.parse(x)["0"]["id"] : null,
                  deviceID: getUniqueId()
                });
                children[0]['id'] === joined[item]['id'] ? navigation.navigate('Profile') : navigation.navigate('IndProf', { 'id': joined[item]['id'], 'data': joined[item]['data'] })
              }
              }
              >
                <View
                  key={item.id}
                  style={{ flex: 1, }}>
                  <FastImage
                    style={styles.image}
                    imageStyle={{ borderRadius: 100000 }}
                    source={{
                      uri: joined[item]['data']['image'],
                      priority: FastImage.priority.high
                    }}
                  />
                  <View>
                    <Text style={{ color: "black", textAlign: 'center', fontSize: 15, fontFamily: 'NunitoSans-Bold', marginTop: -4 }}>{joined[item]['data']['name'][0].toUpperCase() + joined[item]['data']['name'].substring(1)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={{ marginBottom: 20 }} />
      </ScrollView>
    );
  }
  const notthere = () => {
    // console.log(children, status)
    return (
      <View style={{ backgroundColor: 'white', height: height, width: width }}>
        <TouchableOpacity onPress={() => navigation.navigate('Login', { screen: 'Search', type: 'search_banner' })}><CompButton message={'Signup/Login to search for other kids'} /></TouchableOpacity>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Profile', type: 'search_banner' })}>
          <View style={{ backgroundColor: '#327FEB', height: 300, width: 300, borderRadius: 10, alignSelf: 'center', marginTop: height / 10, flexDirection: 'column' }}>
            <FastImage source={require('../assets/search.gif')} style={{ height: 200, width: 200, alignSelf: 'center', marginTop: 45 }} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Profile' })}>
          <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'black', fontFamily: 'NunitoSans-Bold', paddingHorizontal: 50, marginTop: 40, fontSize: 17 }}>Explore what other kids are learning and working on</Text>
        </TouchableWithoutFeedback>
      </View>
    )
  }
  const loading = () => {
    return (
      <View style={{ backgroundColor: 'white', height: height, width: width }}>
        <FastImage source={require('../assets/loading.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: width / 2 }} />
      </View>
    );
  }
  return (
    <>
      <ScreenHeader screen={'Search'} icon={status === '3' ? 'search' : ''} fun={() => navigation.navigate('Searching')} />
      {status === '3' ? there() : notthere()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#fafafa",
    marginTop: 20,
    paddingHorizontal: 10
    // padding: 40, 
    // paddingTop: 80
  },
  form: {
    marginTop: 40,
    flex: 1
    // alignSelf: 'center'
  },
  //  image: {
  //   flex: 1,
  //   resizeMode: "contain",
  //   opacity: 0.4,
  //   justifyContent: "center",

  // },
  addButton: {
    right: 10,
    bottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    // flexDirection: 'row',
    // backgroundColor:'rgba(255,255,255,0.3)'
  },
  personDetails: {
    // right: width*0.15,
    bottom: 15,
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 8,
    borderRadius: 15,
    // backgroundColor: 'rgba(255,255,255, 0.7)'
  },
  tinyLogo: {
    alignSelf: 'center',
    marginTop: 40
    // height: 80,
  },

  image: {
    height: 70,
    width: 70,
    margin: 10,
    alignSelf: 'center',
    borderRadius: 100000,
  },
})

export default SearchScreen;