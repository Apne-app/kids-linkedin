/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, BackHandler, Alert, Image, FlatList, Keyboard } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import ScreenHeader from '../Modules/ScreenHeader'
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import CompButton from '../Modules/CompButton'
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from 'react-native-gesture-handler';
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

  const [joined, setjoined] = React.useState({ '0': { 'data': { 'name': 'Loading', 'profileImage': '' }, 'id': '0' } })
  const [children, setchildren] = useState('notyet')
  const [status, setstatus] = useState('3')
  useEffect(() => {
    const check = async () => {
      var x = await AsyncStorage.getItem('children');
      analytics.screen('Search Screen', {
        userID: JSON.parse(x)["0"] ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
        deviceID: getUniqueId()
      })
      var child = await AsyncStorage.getItem('children')
      if (child != null) {
        child = JSON.parse(child)
        setchildren(child)
      }
      else {
        setchildren({})
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
  useEffect(() => {
    const check = async () => {
      var st = await AsyncStorage.getItem('status')
      setstatus(st)
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
            url: 'http://104.199.146.206:5000/getToken',
            headers: {
              'Content-Type': 'application/json'
            },
            data: data
          };
          axios(config)
            .then(async function (response) {
              console.log(JSON.stringify(response.data.token));
              axios.get('http://35.221.164.203:5000/recently/0' + `/?token=${response.data.token}`)
                .then(async (response) => {
                  setjoined(response.data)
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
    check()
  }, [])
  const there = () => {
    return (
      <Container>
        <Content style={styles.container}>
          <View style={{flexDirection:'row'}}>
            <Text style={{ color: "#000", textAlign: 'left', fontSize: 22, marginLeft: 15, fontFamily: 'NunitoSans-Bold' }}>Recently Joined</Text>
            <Text style={{ color: "#327FEB", textAlign: 'right', fontSize: 13, marginLeft: 8, fontFamily: 'NunitoSans-Bold', marginTop:8, }}>See All</Text>
            <Icon type={'Feather'} name={'arrow-right'} style={{fontSize: 13,color: "#327FEB", marginTop:13, marginLeft:2 }} />
          </View>
          <FlatList
            data={Object.keys(joined)}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => alert(joined['item']['data']['name'])}>
                  <View
                    key={item.id}
                    style={{ flex: 1, }}>
                    <ImageBackground
                      style={styles.image}
                      imageStyle={{ borderRadius: 100000 }}
                      source={{
                        uri: joined[item]['data']['image'],
                      }}
                    >
                    </ImageBackground>
                    <View>
                      <Text style={{ color: "black", textAlign: 'center', fontSize: 15, fontFamily: 'NunitoSans-Bold', marginTop: -4 }}>{joined[item]['data']['name']}</Text>
                    </View>
                  </View>
                  {/* <View
                        style={styles.image}
                      imageStyle={{ borderRadius: width*0.2 }}
                      source={{
                        uri: item.image,
                      }}
                      >
                        <View style={styles.personDetails}>
                          <View >
                            <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>Show </Text>
                            <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>All</Text>
                          </View>
                        </View>
                       </View> */}
                </TouchableOpacity>
              )
            }}
            //Setting the number of column
            numColumns={parseInt(width / 100)}
            keyExtractor={(item, index) => index.toString()}
          />
          <View >
            <Text style={{ color: "#000", textAlign: 'left', fontSize: 22, marginLeft: 15, fontFamily: 'NunitoSans-Bold' }}>Services</Text>
          </View>
        </Content>
      </Container>
    );
  }
  const notthere = () => {
    console.log(children, status)
    return (
      <View style={{ backgroundColor: 'white', height: height, width: width }}>
        <TouchableOpacity onPress={() => navigation.navigate('Login', { screen: 'Search' })}><CompButton message={'Signup/Login to find other kids'} /></TouchableOpacity>
      </View>
    )
  }
  const loading = () => {
    return (
      <View style={{ backgroundColor: 'white', height: height, width: width }}>
        <Image source={require('../assets/loading.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: width / 2 }} />
      </View>
    );
  }
  return (
    <>
      <ScreenHeader screen={'Search'} icon={'search'} fun={() => navigation.navigate('Searching')} />
      {children == 'notyet' ? loading() : Object.keys(children).length > 0 && status == '3' ? there() : notthere()}
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
  //   resizeMode: "cover",
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