/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { RNS3 } from 'react-native-aws3';
import CameraRoll from "@react-native-community/cameraroll";
import { ScrollView, Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, Modal, FlatList, PermissionsAndroid, Platform } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Tabs, Picker, Tab, Fab, TabHeading, Label, H1, H2, H3, Icon, Footer, FooterTab, Button, Spinner, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SECRET_KEY, ACCESS_KEY } from '@env'
import RNImageToPdf from 'react-native-image-to-pdf';
import { enableScreens } from 'react-native-screens';
import { Chip } from 'react-native-paper';
import Gallery from './Gallery'
import ImageView from "react-native-image-viewing";
import { connect } from 'getstream';
import axios from 'axios'

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

  const [activefab, setActiveFab] = React.useState(false);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [modalVisible3, setModalVisible3] = React.useState(false);
  const [modalVisible4, setModalVisible4] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [certi, setCerti] = React.useState({
    certi_org: '',
    certi_path: '',
    certi_url: ''
  })

  const [uploading, setUploading] = React.useState({});

  const [active, setActive] = React.useState(1)

  const [filename, setFileName] = React.useState('')

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
    if (x) {
      if (JSON.parse(x).uri != explore[explore.length - 1]) {
        setExplore([(JSON.parse(x)), ...explore]);
        console.log(x);
        var tempImg = await AsyncStorage.getItem('tempImg');
        tempImg = JSON.parse(tempImg);
        if(!tempImg) tempImg = { "files": [], "name": "Unsaved Images", "tag": "unsaved" };
        tempImg.files.push( { "node": {"image": { "uri" : JSON.parse(x).uri }}} )
        console.log(tempImg);
        await AsyncStorage.setItem('tempImg', JSON.stringify(tempImg));
        var y = "" + String((JSON.parse(x)).uri);
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

  if (route.params) {
    if (route.params.reload) {
      getImages();
      console.log(route.params.reload);
      console.log("asds");
      route.params.reload = 0;
    }
    if (route.params.selected) {
      setExplore([...route.params.selected, { 'height': 0, 'width': '0', 'uri': '' }])
      route.params.selected = null;
    }
  }

  const saveImages = async () => {

    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
    // console.log(explore[0].uri, tags[0])

    explore.map(async (item) => {
      try {
        console.log(item.uri);
        await CameraRoll.save(item.uri, { type: 'photo', album: filename })
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          });
      } catch (error) {
        console.log(error)
      }
    })
    let x = await AsyncStorage.getItem("albums");
    let albums = JSON.parse(x);
    if (albums) {
      var c = 1;
      for (var i = 0; i < albums.length; i++) {
        if (albums[i]['albumName'] == filename) {
          c = 0;
          break;
        }
      }
      if (c) {
        albums = [...albums, { 'albumName': filename, 'tagName': tag }];
      }
      await AsyncStorage.setItem("albums", JSON.stringify(albums));
    }
    else {
      await AsyncStorage.setItem("albums", JSON.stringify([{ 'albumName': filename, 'tagName': tag }]));
    }

    setModalVisible3(false);
    alert('Images Saved');

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


  const uploadToS3 = (i, email) => {

    // console.log(randomStr(20, '12345abcdepq75xyz')+'.'+explore[i].uri[explore[i].uri.length-3]+explore[i].uri[explore[i].uri.length-2]+explore[i].uri[explore[i].uri.length-1])
    var name = randomStr(20, '12345abcdepq75xyz') + '.' + explore[i].uri[explore[i].uri.length - 3] + explore[i].uri[explore[i].uri.length - 2] + explore[i].uri[explore[i].uri.length - 1]
    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: explore[i].uri,
      name: name,
      type: "image/png",
    }

    const options = {
      keyPrefix: email + filename + "/" + tag + "/",
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
      if (!a) {
        a++;
        obj[explore[i].uri] = false;
      }

      console.log(obj, i);

      setUploading({
        ...obj
      })

      if (i == explore.length - 2) alert("Uploaded");

    })
      .catch(err => {
        console.log(err);
      })
      ;
    return name;
  }

  const myAsyncPDFFunction = async () => {

    setTimeout(() => {
      setModalVisible(false);

    }, 300)  

    try {

      var arr = [];

      explore.map(item => {
        if (item.uri.length > 10)
          arr.push(item.uri.slice(5, item.uri.length));
      })
      // console.log(arr);

      const options = {
        imagePaths: arr,
        name: `${filename}.pdf`,
        maxSize: { // optional maximum image dimension - larger images will be resized
          width: 900,
          height: Math.round(height / width * 900),
        },
        quality: .7, // optional compression paramter
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);

      let x = await AsyncStorage.getItem("albums");
      let albums = JSON.parse(x);
      var c = 1;
      for (var i = 0; i < albums.length; i++) {
        if (album[i]['albumName'] == filename) {
          c = 0;
          break;
        }
      }
      if (c) {
        albums = [...albums, { 'albumName': filename, 'tagName': tag }];
      }

      await AsyncStorage.setItem("albums", JSON.stringify(albums));

      console.log(pdf.filePath);
      alert('PDF Saved');
    } catch (e) {
      console.log(e);
    }
  }

  const [tags, setTags] = React.useState(['Homework', 'Certificate', 'Award', 'Other']);
  const [tag, setTag] = React.useState('Other');
  const [caption, setcaption] = React.useState('');

  if (active == 0)
    return (
      <Gallery />
    )
  const PostUpload = async () => {
    var i;
    setTimeout(() => {
      setModalVisible4(false)
    }, 300);
    var obj = { ...uploading };
    for (i = 0; i < explore.length - 1; i++) {
      obj[(explore[i].uri)] = true;
      setUploading({
        ...obj
      });
    }
    var children = await AsyncStorage.getItem('children')
    children = JSON.parse(children)['0']
    var name = ''
    for (i = 0; i < explore.length - 1; i++) {
      var x = "https://d2k1j93fju3qxb.cloudfront.net/" + children['data']['gsToken']  + filename + "/" + tag + "/" + uploadToS3(i, children['data']['gsToken']) + ', ';
      name = name + x;
      if(tag == 'Certificate')
      {
        var data = JSON.stringify({"gstoken":children['data']['gsToken'],"certi_url":certi.certi_url,"certi_org":certi.certi_org,"certi_path":x});
        var config = {
          method: 'post',
          url: 'https://barry-2z27nzutoq-as.a.run.app/updatecerti',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config).then(res => {
          if(res == "success")
          {
            console.log("success")
          }
        }).catch(err => {
          console.log(err);
        })
      }

    }
    // setModalVisible4(false);

    const client = connect('dfm952s3p57q', children['data']['gsToken'], '90935');
    var activity = { "image": name, "object": caption==''?'default123':caption, "verb": "post" }
    // var user = client.feed('timeline', '103id');
    // user.follow('user', '49id');
    var user = client.feed('user', String(String(children['id']) + String("id")));
    await user.addActivity(activity);
  }

  return (
    <Container style={styles.container}>
      <Header style={{ backgroundColor: "#000", paddingTop: 20 }} >
        
        <Right>
        <TouchableOpacity onPress={() => {
          setExplore([
            {
              'height': 0,
              'width': '0',
              'uri': ''
            },
          ])
        }}>
          <Icon type="Entypo" name="trash" style={{ color: "red" }} />
        </TouchableOpacity>
        </Right>
      </Header>
      <Content >
        <View style={{ backgroundColor: "#000" }}>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => { setModalVisible(false); }} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} ><Icon name="cross" type="Entypo" /></TouchableOpacity>
                  <Text style={styles.modalText}>Save as pdf!</Text>
                  <Item floatingLabel>
                    <Label>Collection Name</Label>
                    <Input value={filename} onChangeText={text => setFileName(text)} />
                  </Item>
                  <View>
                  </View>
                  <View style={{ flexDirection: 'row' }} >
                    <TouchableOpacity style={{ borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 5 }}
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
                        <Text style={{ color: "#357feb", flex: 1, textAlign: 'center' }}>
                          Save
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
              visible={modalVisible4}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => { setModalVisible4(false); }} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} ><Icon name="cross" type="Entypo" /></TouchableOpacity>
                  <Text style={styles.modalText}>Information about your certificate!</Text>
                  <Item floatingLabel>
                    <Label>Certificate Organization</Label>
                    <Input value={certi.certi_org} onChangeText={text => setCerti({ ...certi, certi_org: text })} />
                  </Item>
                  <Item floatingLabel>
                    <Label>Certificate Url</Label>
                    <Input value={certi.certi_url} onChangeText={text => setCerti({ ...certi, certi_url: text })} />
                  </Item>
                  <View>
                  </View>
                  <View style={{ flexDirection: 'row' }} >
                    <TouchableOpacity style={{ borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 5 }}
                      onPress={() => {
                        PostUpload();
                      }}
                    >
                      <View style={styles.save2}>
                        <Text style={{ color: "#357feb", flex: 1, textAlign: 'center' }}>
                          Save
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
              visible={modalVisible3}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => { setModalVisible3(false); }} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} ><Icon name="cross" type="Entypo" /></TouchableOpacity>
                  <Text style={styles.modalText}>Save in gallery!</Text>
                  <Item floatingLabel>
                    <Label>Collection Name</Label>
                    <Input value={filename} onChangeText={text => setFileName(text)} />
                  </Item>
                  <View>
                  </View>
                  <View style={{ flexDirection: 'row' }} >
                    <TouchableOpacity style={{ borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 5 }}
                      onPress={() => {
                        saveImages();
                      }}
                    >
                      <View style={styles.save2}>
                        <Text style={{ color: "#357feb", flex: 1, textAlign: 'center' }}>
                          Save
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
                  <TouchableOpacity onPress={() => { setModalVisible2(false) }} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end' }} ><Icon name="cross" type="Entypo" /></TouchableOpacity>
                  <Text style={styles.modalText}>Upload to cloud!</Text>
                  <View style={{ flexDirection: 'row' }} >

                    <TouchableOpacity style={{ borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 15 }}
                      onPress={() => {
                        // console.log(randomStr(20, '12345abcdepq75xyz'));
                        var i;
                        setTimeout(() => {
                          setModalVisible2(false)
                        }, 300);
                        var obj = { ...uploading };
                        for (i = 0; i < explore.length - 1; i++) {
                          obj[(explore[i].uri)] = true;
                          setUploading({
                            ...obj
                          });
                        }
                        for (i = 0; i < explore.length - 1; i++) {
                          uploadToS3(i);
                        }

                      }}
                    >
                      <View style={styles.save2}>
                        <Text style={{ color: "#357feb", flex: 1, textAlign: 'center' }}>
                          Upload
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          <ImageView
                images={selected}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => {setSelected([]);setVisible(false);}}
                HeaderComponent = {() => {
                    return <Text style={{color: "#fff", fontSize: 26, margin: 20}}>Picture</Text>
                }}
                FooterComponent = {() => {
                    return (
                        <View>
                        </View>
                    )
                }}
            />


          <View style={{ flexDirection: 'row', marginTop: -height*0.06 }} >
            <FlatList
              data={tags}
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              // style={{marginTop: 5}}
              renderItem={({ item, i }) => (
                <Chip key={i} style={{ backgroundColor: tag == item ? 'green' : '#357feb', margin: 4, paddingLeft: 10, paddingRight: 10 }} textStyle={{ color: "#fff" }} onPress={() => tag == item ? setTag('') : setTag(item)} >{item}</Chip>
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
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column', }} onPress={() => {setSelected([{ uri: item.uri}]); setVisible(true)}}>
                      <View
                        key={item.id}
                        style={{ flex: 1, }}>
                        <ImageBackground
                          style={styles.image}
                          imageStyle={{ opacity: uploading[item["uri"]] ? 0.5 : 1 }}
                          source={{
                            uri: item.uri,
                          }}
                        >
                          {
                            uploading[item["uri"]] ?
                              <Spinner color='blue' style={{ position: 'absolute', alignSelf: 'center', top: height * 0.1 }} />
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
                        style={{ flex: 1 }}>
                        <View
                          style={styles.addImg}
                        >
                          <View style={styles.addIcon}>
                            <View >
                              <Icon type="AntDesign" name="plus" style={{ color: "#fff" }} />
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

      {/*        <TouchableOpacity style={{position: 'absolute', bottom: height*0.15, right: 6}}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Icon name="arrow-down-circle" type="Feather" style={{color: "#3cb979", fontSize: 50}} />
        </TouchableOpacity>*/}
      <Item last style={{ position: 'absolute', bottom: height * 0.11 }} >
        <Input onChangeText={(text) => {
          setcaption(text)
        }}value={caption} placeholder="Add a caption and hashtags" />
        <Icon onPress={() => tag == 'Certificate' ? setModalVisible4(true): PostUpload()} style={{ color: "#fff" }} type="Ionicons" name='send' />
      </Item>

      <View style={{ height: height * 0.07 }} />
      <Fab
        active={activefab}
        direction="up"
        containerStyle={{ right: 8 }}
        style={{ backgroundColor: 'transparent', bottom: height * 0.15 }}
        position="bottomRight"
        onPress={() => setActiveFab(!activefab)}>
        <Icon name="arrow-down-circle" type="Feather" style={{ color: "#3cb979", fontSize: 50 }} />
        <Button onPress={() => setModalVisible3(true)} style={{ backgroundColor: '#3B5998', marginBottom: height * 0.15 }}>
          <Icon name="image" type="Feather" />
        </Button>
        <Button onPress={() => setModalVisible(true)} style={{ backgroundColor: '#DD5144', marginBottom: height * 0.15 }}>
          <Icon name="file-pdf" type="FontAwesome5" />
        </Button>
        <Button style={{ backgroundColor: '#3B5998', marginBottom: height * 0.15 }}
          onPress={() => {
            setModalVisible2(true);
            // console.log(explore);
          }}
        >
          <Icon name="upload-cloud" type="Feather" style={{ color: "#fff" }} />
        </Button>
      </Fab>

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
    backgroundColor: 'rgba(0,0,0,0.5)'
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
    height: width * 0.48,
    width: width * 0.45,
    margin: width * 0.02,
    elevation: 3
    // borderRadius: 30,

  },
  addImg: {
    height: width * 0.48,
    width: width * 0.45,
    margin: width * 0.02,
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
    width: width * 0.31
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
    width: width * 0.31
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