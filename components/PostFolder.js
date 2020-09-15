import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, FlatList, AsyncStorage } from 'react-native'
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

    React.useEffect(() => {
      
      const func = async () => {
        // await AsyncStorage.setItem('@scannedImg', JSON.stringify([]));
        const x = await AsyncStorage.getItem('@scannedImg')
        console.log(x);
        setExplore([...explore, ...JSON.parse(x)]);
      }

      func();

    }, [])

    // console.log(navigation);

    return (
      <Container>
          <Content style={styles.container}>
          <FlatList
            data={explore}
            renderItem={({ item }) => (
                <View>
                  {
                    item.height != 0 ?
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => console.log(explore)}>
                    <View
                    key={item.id}
                    style={{ flex: 1}}>
                    <ImageBackground
                        style={styles.image}
                        // imageStyle= {{ borderRadius: 20}}
                        source={{
                        uri: item.uri,
                        }}
                    >
                    <View style={styles.personDetails}>
                    </View>
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
    borderRadius: 1,
    borderStyle: 'dashed',
  },
})

export default PostFolder;