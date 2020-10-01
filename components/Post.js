/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { RNS3 } from 'react-native-aws3';
import CameraRoll from "@react-native-community/cameraroll";
import {  ScrollView, Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, Modal, FlatList, PermissionsAndroid, Platform } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Tabs, Tab, TabHeading, Label, H1, H2, H3, Icon,Footer, FooterTab, Button, Spinner, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SECRET_KEY, ACCESS_KEY } from '@env'
import RNImageToPdf from 'react-native-image-to-pdf';
import { enableScreens } from 'react-native-screens';
import { Chip } from 'react-native-paper';
import Gallery from './Gallery'

// require the module
var RNFS = require('react-native-fs');

enableScreens(false);

// create a path you want to write to
// :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
// but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
var path = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath + '/test.txt' : RNFS.ExternalDirectoryPath + '/test.txt';

// write the file

const writeFile = () => {

console.log(path)

RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
  .then((success) => {
    console.log('FILE WRITTEN!');
  })
  .catch((err) => {
    console.log(err.message);
  });
}


async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}



var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;


const Upload = ({ route, navigation }) => {

    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisible2, setModalVisible2] = React.useState(false);

    const [uploading, setUploading] = React.useState({});

    const [active, setActive] = React.useState(1)

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
              setExplore([(JSON.parse(x)), ...explore ]);
              console.log(x);
              var y = ""+String((JSON.parse(x)).uri);
              var obj = {};
              obj[String((JSON.parse(x)).uri)] = false;
              setUploading({
                ...uploading,
                ...obj
              });
            }
          }
        }

        // console.log(route)

        if(route.params)
    {
      if(route.params.reload)
      {
        getImages();
        console.log(route.params.reload);
        console.log("asds");
        route.params.reload = 0; 
      }
    }

    const saveImages = async () => {

      if (Platform.OS === "android" && !(await hasAndroidPermission())) {
          return;
        }
        // console.log(explore[0].uri, tags[0])

      explore.map((item) => {
        try {
          CameraRoll.save(item.uri, {type:'photo', album: tags[0]})
          .then(res => 
          {
            console.log(res)
          })
          .catch(err => 
          {
            console.log(err)
          });
          ;
        } catch (error) {
          console.log(error)
        }
      })  

    }

        // getImages();

function randomStr(len, arr) { 
    var ans = ''; 
    for (var i = len; i > 0; i--) { 
        ans +=  
          arr[Math.floor(Math.random() * arr.length)]; 
    } 
    return ans; 
} 

const userid = "shashwatid"


const uploadToS3 = (i) => {

  // console.log(randomStr(20, '12345abcdepq75xyz')+'.'+explore[i].uri[explore[i].uri.length-3]+explore[i].uri[explore[i].uri.length-2]+explore[i].uri[explore[i].uri.length-1])

  const file = {
    // `uri` can also be a file system path (i.e. file://)
    uri: explore[i].uri,
    name: randomStr(20, '12345abcdepq75xyz')+'.'+explore[i].uri[explore[i].uri.length-3]+explore[i].uri[explore[i].uri.length-2]+explore[i].uri[explore[i].uri.length-1],
    type: "image/png",
  }

  const options = {
    keyPrefix: userid+"/",
    bucket: "kids-linkedin",
    region: "ap-south-1",
    accessKey: ACCESS_KEY,
    secretKey: SECRET_KEY,
    successActionStatus: 201
  }

  RNS3.put(file, options).then(response => {
    console.log("dassd")
    if (response.status !== 201)
      throw new Error("Failed to upload image to S3");
    console.log(response.body);

    var obj = { ...uploading };
    var a = 0;
    if(!a)
    {
      a++;
    obj[explore[i].uri] = false;
    }

    console.log(obj, i);

    setUploading({
      ...obj
    })

  if(i == explore.length-2) alert("Uploaded");

  })
  .catch(err => {
    console.log(err);
  })
  ;

}

    const myAsyncPDFFunction = async () => {
        try {

            var arr = [];

            explore.map(item => {
              if(item.uri.length > 10)
              arr.push(item.uri.slice(5, item.uri.length));
            })
            // console.log(arr);

            const options = {
                imagePaths: arr,
                name: 'PDFName.pdf',
                maxSize: { // optional maximum image dimension - larger images will be resized
                    width: 900,
                    height: Math.round(height / width * 900),
                },
                quality: .7, // optional compression paramter
            };
            const pdf = await RNImageToPdf.createPDFbyImages(options);
            
            console.log(pdf.filePath);
        } catch(e) {
            console.log(e);
        }
    }

    const [tags, setTags] = React.useState(['Homework', 'Certificate', 'Award', 'Other' , 'Other']);
    const [tag, setTag] = React.useState('');

    if(active == 0)
    return (
      <Gallery />
    )

    return (
      <Container style={styles.container}>
      <Header style={{backgroundColor: "#000", paddingTop: 20}} >
        <Left>
          <Icon name="arrow-left" type="Feather" style={{color: "#fff"}} />
        </Left>
        <Right>
          <Icon type="MaterialCommunityIcons" name="dots-vertical" style={{color: "#fff"}} />
        </Right>
      </Header>
          <Content >
              <View style={{backgroundColor: "#000"}}>
              <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => {setModalVisible(false); setTags([]); setTag('');}} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end'}} ><Icon name="cross" type="Entypo"  /></TouchableOpacity>
                  <Text style={styles.modalText}>Add a Tag!</Text>
                    <View style={{flexDirection: 'row'}} >
                      {
                        tags.map((item, i) => {
                            return <Chip key={i} style={{backgroundColor: '#357feb', margin: 2}} textStyle={{color: "#fff"}} icon="close" onPress={() => {tags.splice(i, 1); setTags([...tags]);}} >{item}</Chip>
                        })
                      }
                    </View>  
                    <Item floatingLabel>
                      <Label>Tag</Label>
                      <Input value={tag} onChangeText={text => setTag(text)} />
                    </Item>
                    <View>
                    <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#357feb", alignSelf: 'center', margin: 5}}
                        onPress={() => {
                          if(tag != "")
                          {

                          setTags([
                            ...tags,
                            tag
                          ])
                          // writeFile();
                          }
                          // saveImages();
                          // myAsyncPDFFunction()
                          // console.log(explore)
                        }}
                      >
                        <View style={styles.save}>
                          <Text style={{color: "#fff", flex: 1, textAlign:'center'}}>
                          Add
                        </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}} >
                    <TouchableOpacity  style={{borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 5}}
                        onPress={() => {
                          // if(tag != "")
                          // {

                          // setTags([
                          //   ...tags,
                          //   tag
                          // ])
                          // // writeFile();
                          // }
                          // saveImages();
                          myAsyncPDFFunction()
                          // console.log(explore)
                        }}
                      >
                        <View style={styles.save2}>
                          <Text style={{color: "#357feb", flex: 1, textAlign:'center'}}>
                          PDF
                        </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 15}}
                      onPress={() => {
                        // console.log(randomStr(20, '12345abcdepq75xyz'));
                        var i;

                        saveImages();
                        
                      }}
                    >
                      <View style={styles.save2}>
                        <Text style={{color: "#357feb", flex: 1, textAlign:'center'}}>
                          Gallery
                        </Text>
                      </View>
                    </TouchableOpacity>
                    </View>
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible2}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => {setModalVisible2(false); ; setTags([]); setTag('');}} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end'}} ><Icon name="cross" type="Entypo"  /></TouchableOpacity>
                  <Text style={styles.modalText}>Add a Tag!</Text>
                    <View style={{flexDirection: 'row'}} >
                      {
                        tags.map((item, i) => {
                            return <Chip key={i} style={{backgroundColor: '#357feb', margin: 2}} textStyle={{color: "#fff"}} icon="close" onPress={() => {tags.splice(i, 1); setTags([...tags]);}} >{item}</Chip>
                        })
                      }
                    </View>  
                    <Item floatingLabel>
                      <Label>Tag</Label>
                      <Input value={tag} onChangeText={text => setTag(text)} />
                    </Item>
                    <View style={{flexDirection: 'row'}} >
                    <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#357feb", alignSelf: 'center', margin: 5}}
                        onPress={() => {
                          if(tag != "")
                          {

                          setTags([
                            ...tags,
                            tag
                          ])
                          // writeFile();
                          }
                          // saveImages();
                          // myAsyncPDFFunction()
                          // console.log(explore)
                        }}
                      >
                        <View style={styles.save}>
                          <Text style={{color: "#fff", flex: 1, textAlign:'center'}}>
                          Add
                        </Text>
                        </View>
                      </TouchableOpacity>
                    <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 15}}
                      onPress={() => {
                        // console.log(randomStr(20, '12345abcdepq75xyz'));
                        var i;
                        setTimeout(() => {
                        setModalVisible2(false)
                        }, 300);
                        var obj = {...uploading};
                        for(i = 0; i < explore.length-1; i++)
                        {
                          obj[(explore[i].uri)] = true;
                          setUploading({
                            ...obj
                          });
                        }
                        for(i = 0; i < explore.length-1; i++)
                        {
                          uploadToS3(i);
                        }
                        
                      }}
                    >
                      <View style={styles.save2}>
                        <Text style={{color: "#357feb", flex: 1, textAlign:'center'}}>
                          Upload
                        </Text>
                      </View>
                    </TouchableOpacity>
                    </View>
                </View>
              </View>
            </Modal>
          </View>

              
          {/*<View style={{flexDirection: 'row', alignSelf: 'center', backgroundColor: "#000"}}>
            <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#357feb", alignSelf: 'center', margin: 5}}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <View style={styles.save}>
              <Icon name="download" type="Feather" style={{color: "#fff", flex: 1}} />
                <Text style={{color: "#fff", flex: 1, marginTop: 5}}>
                  Save
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 5}}
              onPress={() => {
                // setModalVisible2(true);
                console.log(explore);
              }}
            >
              <View style={styles.save2}>
              <Icon name="upload-cloud" type="Feather" style={{color: "#357feb", flex: 1}} />
                <Text style={{color: "#357feb", flex: 1, marginTop: 5}}>
                  Upload
                </Text>
              </View>
            </TouchableOpacity>
          </View>*/}

          <View style={{flexDirection: 'row'}} >
            <FlatList
              data={tags}
              scrollEnabled={true}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              // style={{marginTop: 5}}
              renderItem={({ item, i }) => (
                 <Chip key={i} style={{backgroundColor: tag == item ? 'green' : '#357feb', margin: 4, paddingLeft: 10,paddingRight: 10}} textStyle={{color: "#fff"}}  onPress={() => setTag(item)} >{item}</Chip>
              )}
              //Setting the number of column
              // numColumns={3}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          
          <FlatList
            data={explore}
            renderItem={({ item }) => (
                <View>
                  {
                    item.height != 0 ?
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column',  }} onPress={() => console.log(uploading[item["uri"]])}>
                    <View
                    key={item.id}
                    style={{ flex: 1,}}>
                    <ImageBackground
                        style={styles.image}
                        imageStyle= {{ opacity: uploading[item["uri"]] ? 0.5 : 1 }}
                        source={{
                        uri: item.uri,
                        }}
                    >
                    {
                      uploading[item["uri"]] ?
                     <Spinner color='blue' style={{ position: 'absolute', alignSelf: 'center', top: height*0.1 }} />
                     :
                     <View />
                    }
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
                        <Icon type="AntDesign" name="plus" style={{color: "#fff"}} />
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
              </View>
        </Content>

        <TouchableOpacity style={{position: 'absolute', bottom: height*0.15, right: 6}}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Icon name="arrow-down-circle" type="Feather" style={{color: "#3cb979", fontSize: 50}} />
        </TouchableOpacity>
            <Item last style={{position: 'absolute', bottom: height*0.09}} >
              <Input placeholder="Add a caption and hashtags" />
              <Icon style={{color: "#fff"}} type="Ionicons" name='send' />
            </Item>
          
          
      </Container>
    );
}


const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    backgroundColor: "#000",
    flexDirection: 'column',
    height: height,
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
    borderRadius: 8,
    backgroundColor: '#000',
    // borderWidth: 1,
    borderColor: "#fff"
    // backgroundColor:'rgba(0,0,0,0.5)'
  },
  tinyLogo: {
    alignSelf: 'center',
    marginTop: 40
    // height: 80,
  },

  image: {
    height: width*0.48,
    width: width*0.45,
    margin: width*0.02,
    elevation: 3
    // borderRadius: 30,
    
  },
  addImg: {
    height: width*0.48,
    width: width*0.45,
    margin: width*0.02,
    // borderWidth: 2,
    // borderRadius: 15,
    backgroundColor: "#327FEB"
    // borderStyle: 'dashed',
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
  save3: {
    // alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    // margin: 5,
    // backgroundColor: '#357feb',
    // borderRadius: 30,
    // borderWidth: 5,
    // borderColor: "#3cb979",
    width: 60
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginVertical: 15,
    fontSize: 20,
    textAlign: "center"
  }
})


export default Upload;