import React, { Component } from 'react';
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
        'name': 'Bhargava  ',
        'added': 0,
        'age': 20,
        'image': 'https://scontent.famd5-1.fna.fbcdn.net/v/t1.0-9/52991262_268327267426211_8888915069430136832_n.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=QCzv3sme33QAX-cOn03&_nc_ht=scontent.famd5-1.fna&oh=1577b6f0e5834cee42a2d1aaee12e1df&oe=5F80B8B1'
      },
      {
        'name': 'Bhargava  ',
        'added': 0,
        'age': 20,
        'image': 'https://scontent.famd5-1.fna.fbcdn.net/v/t1.0-9/52991262_268327267426211_8888915069430136832_n.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=QCzv3sme33QAX-cOn03&_nc_ht=scontent.famd5-1.fna&oh=1577b6f0e5834cee42a2d1aaee12e1df&oe=5F80B8B1'
      },
    ])

    // console.log(navigation);

    return (
      <Container>
          <Content style={styles.container}>
          <FlatList
            data={explore}
            renderItem={({ item }) => (
                <View>
                  {
                    item.added ?
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => alert(item.name)}>
                    <View
                    key={item.id}
                    style={{ flex: 1}}>
                    <ImageBackground
                        style={styles.image}
                        // imageStyle= {{ borderRadius: 20}}
                        source={{
                        uri: item.image,
                        }}
                    >
                    <View style={styles.personDetails}>
                    <View >
                        <Text style={{fontWeight: 'bold', color: "#fff", textAlign: 'center'}}>{item.name}</Text>
                        <Text style={{fontWeight: 'bold', color: "#fff", textAlign: 'center'}}>{item.age}</Text>
                    </View>
                    </View>
                    </ImageBackground>
                    </View>
              </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => navigation.navigate('Camera', {})}>
                    <View
                    key={item.id}
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