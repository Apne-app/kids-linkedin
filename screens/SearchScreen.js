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
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins-Regular',
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
      'image': 'https://scontent.famd5-1.fna.fbcdn.net/v/t1.0-9/73472702_2546600495460139_1094134431800623104_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=sZpIUgPO6fYAX9_oNE_&_nc_oc=AQlgdIn0oK_RmjPhHfnZ3Xqwi0U9-O2Kq30XhR_SekdNtiJz2a3t3siRjDuqzJJAKptXqSqcBrvMq8h9iPc_8hdf&_nc_ht=scontent.famd5-1.fna&oh=ea5012f402e51b50f8870fa9ed02cf43&oe=5F802DC5'
    },
    {
      'name': 'Bhargava  ',
      'age': 20,
      'image': 'https://scontent.famd5-1.fna.fbcdn.net/v/t1.0-9/52991262_268327267426211_8888915069430136832_n.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=QCzv3sme33QAX-cOn03&_nc_ht=scontent.famd5-1.fna&oh=1577b6f0e5834cee42a2d1aaee12e1df&oe=5F80B8B1'
    },
    {
      'name': 'Bhargava  ',
      'age': 20,
      'image': 'https://scontent.famd5-1.fna.fbcdn.net/v/t1.0-9/52991262_268327267426211_8888915069430136832_n.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=QCzv3sme33QAX-cOn03&_nc_ht=scontent.famd5-1.fna&oh=1577b6f0e5834cee42a2d1aaee12e1df&oe=5F80B8B1'
    },
    {
      'name': 'Shashwat ',
      'age': 20,
      'image': 'https://scontent.famd5-1.fna.fbcdn.net/v/t1.0-9/73472702_2546600495460139_1094134431800623104_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=sZpIUgPO6fYAX9_oNE_&_nc_oc=AQlgdIn0oK_RmjPhHfnZ3Xqwi0U9-O2Kq30XhR_SekdNtiJz2a3t3siRjDuqzJJAKptXqSqcBrvMq8h9iPc_8hdf&_nc_ht=scontent.famd5-1.fna&oh=ea5012f402e51b50f8870fa9ed02cf43&oe=5F802DC5'
    },
    {
      'name': 'Shashwat ',
      'age': 20,
      'image': 'https://scontent.famd5-1.fna.fbcdn.net/v/t1.0-9/73472702_2546600495460139_1094134431800623104_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=sZpIUgPO6fYAX9_oNE_&_nc_oc=AQlgdIn0oK_RmjPhHfnZ3Xqwi0U9-O2Kq30XhR_SekdNtiJz2a3t3siRjDuqzJJAKptXqSqcBrvMq8h9iPc_8hdf&_nc_ht=scontent.famd5-1.fna&oh=ea5012f402e51b50f8870fa9ed02cf43&oe=5F802DC5'
    },
    {
      'name': 'Shashwat ',
      'age': 20,
      'image': 'https://scontent.famd5-1.fna.fbcdn.net/v/t1.0-9/73472702_2546600495460139_1094134431800623104_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=sZpIUgPO6fYAX9_oNE_&_nc_oc=AQlgdIn0oK_RmjPhHfnZ3Xqwi0U9-O2Kq30XhR_SekdNtiJz2a3t3siRjDuqzJJAKptXqSqcBrvMq8h9iPc_8hdf&_nc_ht=scontent.famd5-1.fna&oh=ea5012f402e51b50f8870fa9ed02cf43&oe=5F802DC5'
    },
    {
      'name': 'Bhargava  ',
      'age': 20,
      'image': 'https://scontent.famd5-1.fna.fbcdn.net/v/t1.0-9/52991262_268327267426211_8888915069430136832_n.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=QCzv3sme33QAX-cOn03&_nc_ht=scontent.famd5-1.fna&oh=1577b6f0e5834cee42a2d1aaee12e1df&oe=5F80B8B1'
    },
    {
      'name': 'Bhargava  ',
      'age': 20,
      'image': 'https://scontent.famd5-1.fna.fbcdn.net/v/t1.0-9/52991262_268327267426211_8888915069430136832_n.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=QCzv3sme33QAX-cOn03&_nc_ht=scontent.famd5-1.fna&oh=1577b6f0e5834cee42a2d1aaee12e1df&oe=5F80B8B1'
    },
  ])
  const [children, setchildren] = useState({})
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
        <Header noShadow style={{ backgroundColor: '#fff', flexDirection: 'row', height: 60, marginTop: 20 }}>
          <Searchbar
            style={{ width: width - 40, height: 50, borderRadius: 10 }}
            theme={theme}
            placeholder="Search"
            onResponderStart={()=>navigation.navigate('Searching')}
          />
        </Header>
        <Content style={styles.container}>
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
                    imageStyle={{ borderRadius: 20 }}
                    source={{
                      uri: item.image,
                    }}
                  >
                    <View style={styles.personDetails}>
                      <View >
                        <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>{item.name}</Text>
                        <Text style={{ fontWeight: 'bold', color: "#fff", textAlign: 'center' }}>{item.age}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            )}
            //Setting the number of column
            numColumns={2}
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
    Object.keys(children).length > 0 ? there() : notthere()
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
    height: width * 0.45,
    width: width * 0.45,
    margin: width * 0.02,
    borderRadius: 30,

  },
})

export default SearchScreen;