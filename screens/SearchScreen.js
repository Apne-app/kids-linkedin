/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, FlatList, Keyboard } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
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

  const [explore, setExplore] = React.useState([
    {
      'name': 'Shashwat  ',
      'age': 20,
      'image': 'http://shashwatmdas.info/shash.jpg'
    },
    {
      'name': 'Bhargava  ',
      'age': 20,
      'image': 'https://bhargavamacha.info/static/media/me.d0c8ae20.jpg'
    },
    {
      'name': 'Bhargava  ',
      'age': 20,
      'image': 'http://shashwatmdas.info/shash.jpg'
    },
    {
      'name': 'Shashwat ',
      'age': 20,
      'image': 'https://bhargavamacha.info/static/media/me.d0c8ae20.jpg'
    },
    {
      'name': 'Shashwat ',
      'age': 20,
      'image': 'http://shashwatmdas.info/shash.jpg'
    },
    {
      'name': 'Shashwat ',
      'age': 20,
      'image': 'https://bhargavamacha.info/static/media/me.d0c8ae20.jpg'
    },
    {
      'name': 'Bhargava  ',
      'age': 20,
      'image': 'http://shashwatmdas.info/shash.jpg'
    },
    {
      'name': 'Bhargava  ',
      'age': 20,
      'image': 'https://bhargavamacha.info/static/media/me.d0c8ae20.jpg'
    },
    {
      'name': "Show All"
    }
  ])
  const [children, setchildren] = useState('notyet')
  const [status, setstatus] = useState('3')
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
  // useEffect(() => {
  //   Keyboard.addListener("keyboardDidShow", _keyboardDidShow);

  //   return () => {
  //     Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
  //   };
  // }, []);

  // const _keyboardDidShow = () => {
  //   navigation.navigate('Searching') 
  // };
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
      <Container>
        <ScreenHeader screen={'Search'} icon={'search'} fun={() => navigation.navigate('Searching')} />
        <Content style={styles.container}>
          <View >
            <Text style={{ fontWeight: 'bold', color: "#000", textAlign: 'left', fontSize: 22, marginLeft: 15 }}>Kids</Text>
          </View>
          <FlatList
            data={explore}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => alert(item.name)}>
                { item.name != "Show All" ? <View
                  key={item.id}
                  style={{ flex: 1, }}>
                  {/*console.log(item.node.image.uri)*/}
                  <ImageBackground
                    style={styles.image}
                    imageStyle={{ borderRadius: width * 0.2 }}
                    source={{
                      uri: item.image,
                    }}
                  >
                    {/*<View style={styles.personDetails}>
                      <View >
                        <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>{item.name}</Text>
                        <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>{item.age}</Text>
                      </View>
                    </View>*/}
                  </ImageBackground>
                  <View >
                    <Text style={{ fontWeight: '500', color: "#797979", textAlign: 'center', fontSize: 12 }}>{item.name}</Text>
                  </View>
                </View> :
                  <View
                    style={styles.image}
                  // imageStyle={{ borderRadius: width*0.2 }}
                  // source={{
                  //   uri: item.image,
                  // }}
                  >
                    <View style={styles.personDetails}>
                      <View >
                        <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>Show </Text>
                        <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>All</Text>
                      </View>
                    </View>
                  </View>
                }
              </TouchableOpacity>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={{ marginTop: 30 }} >
            <Text style={{ fontWeight: 'bold', color: "#000", textAlign: 'left', fontSize: 22, marginLeft: 15 }}>Services</Text>
          </View>
          <FlatList
            data={explore}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => alert(item.name)}>
                { item.name != "Show All" ? <View
                  key={item.id}
                  style={{ flex: 1, }}>
                  {/*console.log(item.node.image.uri)*/}
                  <ImageBackground
                    style={styles.image}
                    imageStyle={{ borderRadius: width * 0.2 }}
                    source={{
                      uri: item.image,
                    }}
                  >
                    {/*<View style={styles.personDetails}>
                      <View >
                        <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>{item.name}</Text>
                        <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>{item.age}</Text>
                      </View>
                    </View>*/}
                  </ImageBackground>
                  <View >
                    <Text style={{ fontWeight: '500', color: "#797979", textAlign: 'center', fontSize: 12 }}>{item.name}</Text>
                  </View>
                </View> :
                  <View
                    style={styles.image}
                  // imageStyle={{ borderRadius: width*0.2 }}
                  // source={{
                  //   uri: item.image,
                  // }}
                  >
                    <View style={styles.personDetails}>
                      <View >
                        <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>Show </Text>
                        <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>All</Text>
                      </View>
                    </View>
                  </View>
                }
              </TouchableOpacity>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
        </Content>
      </Container>
    );
  }
  const notthere = () => {
    return (
      <View style={{ backgroundColor: 'white', height: height, width: width }}>
        <ScreenHeader screen={'Search'} icon={'search'} fun={() => navigation.navigate('Searching')} />
        <CompButton message={'Signup/Login to find other kids'} />
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
    children == 'notyet' ? loading() : Object.keys(children).length > 0 && status == '3' ? there() : notthere()
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#fafafa",
    marginTop: 20,
    marginHorizontal: width * 0.05
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
    height: width * 0.2,
    width: width * 0.2,
    margin: width * 0.02,
    alignSelf: 'center',
    backgroundColor: "#327FEB",
    borderRadius: width * 0.2,

  },
})

export default SearchScreen;