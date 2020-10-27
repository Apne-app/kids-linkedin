/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, FlatList, Keyboard } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Nunito-Sans',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Nunito-Sans',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Nunito-Sans',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Nunito-Sans',
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
  ])
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
        <Header noShadow style={{ backgroundColor: '#fff', flexDirection: 'row', height: 60, marginTop: 35, marginBottom: 10 }}>
          
          <Item style={{width: width*0.9, borderColor: "#000", height: 45, borderRadius: 10}}>
            <Icon style={{fontSize: 30}} active name='search' type="EvilIcons" />
            <Input style={{fontSize: 16}} placeholder='Search' onResponderStart={() => navigation.navigate('Searching')}/>
          </Item>
        </Header>
        <Content style={styles.container}>
          <View >
            <Text style={{ fontWeight: 'bold', color: "#000", textAlign: 'left', fontSize: 22, marginLeft: 15 }}>Kids</Text>
          </View>
          <FlatList
            data={explore}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => alert(item.name)}>
                <View
                  key={item.id}
                  style={{ flex: 1, }}>
                  {/*console.log(item.node.image.uri)*/}
                  <ImageBackground
                    style={styles.image}
                    imageStyle={{ borderRadius: width*0.2 }}
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
                </View>
              </TouchableOpacity>
            )}
            //Setting the number of column
            numColumns={4}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={{marginTop: 30}} >
            <Text style={{ fontWeight: 'bold', color: "#000", textAlign: 'left', fontSize: 22, marginLeft: 15 }}>Services</Text>
          </View>
          <FlatList
            data={explore}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => alert(item.name)}>
                <View
                  key={item.id}
                  style={{ flex: 1, }}>
                  {/*console.log(item.node.image.uri)*/}
                  <ImageBackground
                    style={styles.image}
                    imageStyle={{ borderRadius: width*0.2,backgroundColor: 'lightgrey', }}
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
                </View>
              </TouchableOpacity>
            )}
            //Setting the number of column
            numColumns={4}
            keyExtractor={(item, index) => index.toString()}
          />
        </Content>
      </Container>
    );
  }
  const notthere = () => {
    return (
      <View style={{ backgroundColor: 'white', height: height, width: width }}>
        <Image source={require('../assets/locked.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
        <Text style={{ fontFamily: 'Nunito-Sans', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>You haven't added your child's details yet. Please add to use the social network</Text>
        <View style={{ backgroundColor: 'white' }}>
          <Button onPress={() => send()} block dark style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 10, height: 50, width: width - 40, alignSelf: 'center', marginHorizontal: 20 }}>
            <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 2 }}>Add child's details</Text>
          </Button>
        </View>
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
    children == 'notyet' ? loading() : Object.keys(children).length > 0 ? there() : notthere()
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#fafafa",
    marginTop: 20
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
    bottom: 10,
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)'
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
    borderRadius: width*0.02,

  },
})

export default SearchScreen;