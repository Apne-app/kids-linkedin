/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, BackHandler, Alert, Image, FlatList, Keyboard } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import ScreenHeader from '../Modules/ScreenHeader'
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import CompButton from '../Modules/CompButton'
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image'
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
  const joined = route.params.joined
  console.log(route.params)
  const children = route.params.children
  const status = route.params.status
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
      <Container>
        <Content style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: "#000", textAlign: 'left', fontSize: 22, marginLeft: 15, fontFamily: 'NunitoSans-Bold' }}>Recently Joined</Text>
            {/* <Text style={{ color: "#327FEB", textAlign: 'right', fontSize: 13, marginLeft: 8, fontFamily: 'NunitoSans-Bold', marginTop:8, }}>See All</Text> */}
            {/* <Icon type={'Feather'} name={'arrow-right'} style={{fontSize: 13,color: "#327FEB", marginTop:13, marginLeft:2 }} /> */}
          </View>
          <FlatList
            data={Object.keys(joined)}
            renderItem={({ item }) => {
              console.log(joined[item]['id'])
              return (
                <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => navigation.navigate('IndProf', { 'id': joined[item]['id'], 'data': joined[item]['data'] })}>
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
                    >
                    </FastImage>
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
            {/* <Text style={{ color: "#000", textAlign: 'left', fontSize: 22, marginLeft: 15, fontFamily: 'NunitoSans-Bold' }}>Services</Text> */}
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
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Profile' })}>
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