import React, { Component } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, FlatList } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail,  List, ListItem,  Separator, Left, Body, Right, Title} from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';


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


const PostFolder = ({ route, navigation }) => {

    const [explore, setExplore] = React.useState([
      {
        'height': 0,
        'width': '0',
        'uri': ''
      },
    ])


    

        const getImages = async () => {
          let x = await AsyncStorage.getItem("@scanImg");
          console.log(x);
          if(x)
          {
            if(JSON.parse(x).uri != explore[explore.length-1])
            {
              setExplore([ ...explore, (JSON.parse(x)) ]);
              console.log(x);
            }
          }
        }

        // console.log(route.params)

        if(route.params)
    {
      if(route.params.reload)
      {
        getImages();
        console.log("asds");
        route.params.reload = 0; 
      }
    }

        // getImages();


    return (
      <Container>
          <Content style={styles.container}>
          
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#357feb", alignSelf: 'center', margin: 5}}>
              <View style={styles.save}>
              <Icon name="download" type="Feather" style={{color: "#fff", flex: 1}} />
                <Text style={{color: "#fff", flex: 1, marginTop: 5}}>
                  Save
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 5}}>
              <View style={styles.save2}>
              <Icon name="upload-cloud" type="Feather" style={{color: "#357feb", flex: 1}} />
                <Text style={{color: "#357feb", flex: 1, marginTop: 5}}>
                  Upload
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <FlatList
            data={explore}
            renderItem={({ item }) => (
                <View>
                  {
                    item.height != 0 ?
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => console.log(explore)}>
                    <View
                    key={item.id}
                    style={{ flex: 1,}}>
                    <ImageBackground
                        style={styles.image}
                        imageStyle= {{ borderRadius: 20}}
                        source={{
                        uri: item.uri,
                        }}
                    >
                    </ImageBackground>
                    </View>
              </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => navigation.navigate('Camera', {})}>
                    <View
                    key={item.uri}
                    style={{ flex: 1}}>
                    <View
                        style={styles.addImg}
                    >
                    <View style={styles.addIcon}>
                    <View >
                        <Icon type="AntDesign" name="plus"  />
                    </View>
                    </View>
                    </View>
                    </View>
              </TouchableOpacity>
                  }
                  </View>
                
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
        </Content>
      </Container>
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
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  addIcon: {
    // right: width*0.15,
    bottom: "35%",
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1
    // backgroundColor:'rgba(0,0,0,0.5)'
  },
  tinyLogo: {
    alignSelf: 'center',
    marginTop: 40
    // height: 80,
  },

  image: {
    height: width*0.65,
    width: width*0.45,
    margin: width*0.02,
    elevation: 3
    // borderRadius: 30,
    
  },
  addImg: {
    height: width*0.65,
    width: width*0.45,
    margin: width*0.02,
    borderWidth: 2,
    borderRadius: 15,
    borderStyle: 'dashed',
  },
  save: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 15,
    // margin: 5,
    backgroundColor: '#357feb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fff",
    width: width*0.31
  },
  save2: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 15,
    // margin: 5,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#357feb",
    width: width*0.31
  },

})

export default PostFolder;