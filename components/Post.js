/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { RNS3 } from 'react-native-aws3';
import CameraRoll from "@react-native-community/cameraroll";
import Share from 'react-native-share';
import { Animated, ScrollView, TouchableWithoutFeedback, Text, Keyboard, StyleSheet, Dimensions, Alert, View, BackHandler, ImageBackground, Image, TouchableOpacity, Modal, FlatList, PermissionsAndroid, Platform } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Tabs, Picker, Tab, Fab, TabHeading, Label, H1, H2, H3, Icon, Footer, FooterTab, Button, Spinner, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SECRET_KEY, ACCESS_KEY } from '@env'
import RNImageToPdf from 'react-native-image-to-pdf';
import { enableScreens } from 'react-native-screens';
import { Chip } from 'react-native-paper';
import { Snackbar } from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';
import { Overlay } from 'react-native-elements';
import Gallery from './Gallery';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import ImageView from "react-native-image-viewing";
import { connect } from 'getstream';
import axios from 'axios'
import CompHeader from '../Modules/CompHeader';

// require the module
var RNFS = require('react-native-fs');

enableScreens(false);

// create a path you want to write to
// :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
// but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
var pathDir = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath;



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
  const [visibleImg, setVisibleImg] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [certi, setCerti] = React.useState({
    certi_org: '',
    certi_path: '',
    certi_url: ''
  })

  const [uploading, setUploading] = React.useState({});
  const status = route.params.status
  const [active, setActive] = React.useState(1)
  const [openImg, setopenImage] = React.useState(0);
  const [filename, setFileName] = React.useState('')
  const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState('Select All')
  const [deleteCount, setDeleteCount] = React.useState(0)
  const [orig, setOrig] = React.useState('');
  const [origImages, setOrigImages] = React.useState([])
  const [time, setTime] = React.useState('');
  const [selecting, setSelecting] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [tags, setTags] = React.useState(['Homework', 'Certificate', 'Award', 'Other']);
  const [selectedTag, setTag] = React.useState('Genio');
  const [explore, setExplore] = React.useState([
    {
      'height': 0,
      'width': '0',
      'uri': ''
    },
  ])

  const sheetRef = React.useRef(null);
  const closeRef = React.useRef(null);

  const shareImage = async () => {
    var ar = explore;
    var arr = [];
    for (var i = 1; i < ar.length; i++) {
      // var base64data = await RNFS.readFile('file://' + ar[i]["uri"], 'base64').then();
      // console.log(ar[i]["uri"]);
      arr.push( ar[i]["uri"].includes('http') ? ar[i]["uri"] : 'file://' + ar[i]["uri"])
    }
    console.log(arr)
    const shareOptions = {
      title: 'Genio',
      subject: 'Check out my collection. Create your own such collections at Genio',
      message: 'Check out my collection. Create your own such collections at Genio',
      urls: arr,
    };
    return Share.open(shareOptions);
  };

  const backButtonChange = () => {

    const backAction = async () => {

      setSelecting(false);
      // setDeleteCount(0);


      const backNew = () => {
        // saveImages(); deleteOrigImages(); navigation.navigate('Home', { screen: 'Feed' })

        setBottomSheetOpen(true)
        closeRef.current.snapTo(0)
      }

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backNew
      );

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backNew);


      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);

  }

  const backButtonChange2 = () => {

    const backAction = async () => {

      sheetRef.current.snapTo(1);

      const backNew = () => {
        // saveImages(); deleteOrigImages(); navigation.navigate('Home', { screen: 'Feed' })

        closeRef.current.snapTo(0)
      }

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backNew
      );

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backNew);


      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);

  }

  const backButtonChange3 = () => {

    const onBackPress = () => {
      sheetRef.current.snapTo(1);
      const onBackNew = () => {
          navigation.navigate('Home')
          return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackNew);
      return () =>
          BackHandler.removeEventListener("hardwareBackPress", onBackNew);
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);

  }



  React.useEffect(() => {

    const sevent = async () => {

      var x = await AsyncStorage.getItem('children');
      if (x) {
        x = JSON.parse(x)
        if (Object.keys(x).length == 0) {
          await AsyncStorage.removeItem('children');
          x = null
        }
        analytics.screen('Post Screen', {
          userID: x ? x["0"]["data"]["gsToken"] : null,
          deviceID: getUniqueId()
        })
      }
      analytics.screen('Post Screen', {
        userID:  null,
        deviceID: getUniqueId()
      })
    }
    sevent();
    const backAction = async () => {

      closeRef.current.snapTo(0)


      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    if (route.params.selected) {

      for (var i = 0; i < route.params.selected.length; i++) {
        route.params.selected[i]['selected'] = false;
      }

      setExplore([{ 'height': 0, 'width': '0', 'uri': '' }, ...route.params.selected])

    }

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        backAction
      );
    };

  }, [])





  const getImages = async () => {
    for (var i = 0; i < route.params.images.length; i++) {
      route.params.images[i]['selected'] = false;
    }
    if(route.params.images.length == 1)
    {
      setShowToast(true);
    }
    setExplore([{ 'height': 0, 'width': '0', 'uri': '' }, ...route.params.images])
  }

  var x = []

  if (route.params) {
    if (route.params.reload) {
      getImages();
      route.params.reload = 0;
    }
    else if (route.params.textAdded) {
      var arr = [...explore];
      for (var i = 1; i < arr.length; i++) {
        if (route.params.changedimage.prevuri.split('cache/')[1] == arr[i]['uri'].split('cache/')[1]) {
          arr[i]['uri'] = route.params.changedimage.uri;
          arr[i]['height'] = route.params.changedimage.height;
          arr[i]['width'] = route.params.changedimage.width;
          setExplore([...arr]);
          break;
        }
      }
      route.params.textAdded = 0;

    }
  }


  const saveImages = async (item, tm, i) => {

    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }

    var tme = new Date(tm);
    tme = tme.toString();
    tme = tme.replace(/:/g, "-");
    try {

      const saveFile = async (base64) => {
        const albumPath = `${pathDir}/Images/${tme}`;

        const fileName = `${selectedTag}_${tm}-${i}.png`;
        const filePathInCache = item.uri;
        const filePathInAlbum = `${albumPath}/${fileName}`;

        // console.log( "aaaa ", fileName, filePathInCache, filePathInAlbum);
        return RNFS.mkdir(albumPath)
          .then(() => {
            RNFS.copyFile(filePathInCache, filePathInAlbum)
              .then(() => {
                uploadToS3(tm, fileName, filePathInAlbum);
                console.log("Dir Made");
              });
          })
          .catch((error) => {
            console.log('Could not create dir', error);
          });
      };

      await saveFile();
    } catch (error) {
      console.log(error)
    }

  }

  if (route.params.time) {
    setTime(route.params.time);
    // console.log(route.params.images[route.params.images.length-1], "asaaaaaaaaaaaaaaa")
    saveImages(route.params.images[route.params.images.length - 1], route.params.time, route.params.images.length - 1);
    route.params.time = 0;
  }


  React.useEffect(() => {
    const backBehaviour = () => {
      // console.log("bllah")

      const backAction = async () => {

        console.log(route.params.edited)
        if (route.params.edited) {

          closeRef.current.snapTo(0)
        }
        else {
          navigation.navigate('Home', { screen: 'Files' })
        }


        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }
    backBehaviour();
  })


  function randomStr(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
      ans +=
        arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  }

  const userid = "shashwatid"


  const uploadToS3 = async (tm, filename, filepath) => {
    var x = await AsyncStorage.getItem('children')
    x = JSON.parse(x)["0"]["data"]["gsToken"]
    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: 'file://' + filepath,
      name: filename,
      type: "image/png",
    }

    const options = {
      keyPrefix: `collections/${x}/${tm}/`,
      bucket: "kids-linkedin",
      region: "ap-south-1",
      accessKey: ACCESS_KEY,
      secretKey: SECRET_KEY,
      successActionStatus: 201
    }

    RNS3.put(file, options).then(response => {
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
      console.log(response.body);
    })
      .catch(err => {
        console.log(err);
      })
      ;
    // return name;
  }

  if (route.params.edit) {
    route.params.edit = 0;
    setTime(route.params.newTime);

  }

  const myAsyncPDFFunction = async () => {

    setTimeout(() => {
      setModalVisible(false);

    }, 300)

    try {

      var arr = [];

      explore.map(item => {
        if (item.uri.length > 10) {
          var a = item.uri;
          a = a.replace('file:///', '');
          a = a.replace('file:/', '');
          arr.push(a);
        }
      })

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
        if (albums[i]['albumName'] == filename) {
          c = 0;
          break;
        }
      }


      console.log(pdf.filePath);
      alert('PDF Saved');
      sheetRef.current.snapTo(1)
    } catch (e) {
      console.log(e);
      sheetRef.current.snapTo(1)
    }
  }

  const deleteSingleImage = async (item) => {
    RNFS.unlink(item)
      .then(() => {
        console.log('FILE DELETED');
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch((err) => {
        console.log(err.message);
      });
    var x = await AsyncStorage.getItem('children')
    x = JSON.parse(x)["0"]["data"]["gsToken"];
    var config = {
      method: 'get',
      url: `https://gvsa1w2ib3.execute-api.ap-south-1.amazonaws.com/default/deleteFromS3?token=${x}&time=${time}&filename=${item.split('_')[1]}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // console.log(config);
    axios(config)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })

  }

  const deleteImages = async () => {
    var tme = new Date(time);
    tme = tme.toString();
    tme = tme.replace(/:/g, "-");
    var delDir = `${pathDir}/Images/`;
    RNFS.exists(delDir)
      .then((result) => {
        console.log("file exists: ", result);
        RNFS.readDir(delDir)
          .then(res => {
            // console.log(res);
            res.map((item, i) => {
              // console.log(item.name)
              if (item.name == tme)
                return RNFS.unlink(item.path)
                  .then(() => {
                    console.log('FILE DELETED');
                  })
                  // `unlink` will throw an error, if the item to unlink does not exist
                  .catch((err) => {
                    console.log(err.message);
                  });
            })
          })
          .catch(err => {
            console.log(err);
          })
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const [caption, setcaption] = React.useState('');

  if (active == 0)
    return (
      <Gallery />
    )

  const openImageViewer = (am) => {

    var selectedImg = [];
    for (var i = 1; i < explore.length; i++) {
      selectedImg.push({ uri: explore[i]["uri"].includes("http") ? explore[i]["uri"] : "file://" + explore[i]["uri"], 'orginUri': "" });
    }
    setSelected([...selectedImg]);
    setopenImage(am - 1);
    setVisibleImg(am - 1);
    setOrig(origImages[am - 1]);

  }

  const deleteOrigImages = async () => {

    try {
      await AsyncStorage.removeItem("OrigImages");
      console.log("Success")
      return true;
    }
    catch (exception) {
      console.log("Exception");
      return false;
    }

  }
  const goback = () => {
    if (selecting) {
      setSelecting(false)
    }
    else {
      setBottomSheetOpen(true)
      closeRef.current.snapTo(0);
    }
  }
  const deletes = async () => {
    setDeleteCount(0);
    var x = await AsyncStorage.getItem('children');
    analytics.track('Delete Images', {
      userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
      deviceID: getUniqueId()
    })
    setSelecting(true);
    backButtonChange();
    var tempArr = [...explore];
    var cnt = 0;
    for (var i = 1; i < tempArr.length; i++) {
      if (tempArr[i]['selected']) {
        cnt++;
      }
    }
    setDeleteCount(cnt);
    if (selecting) {
      var array = [...explore];
      for (var i = 1; i < array.length; i++) {
        if (array[i]['selected']) {
          deleteSingleImage(array[i]['uri'])
          array.splice(i, 1);
          i--;
        }
      }
      setExplore([...array]);
      setSelecting(false);
      if(array.length == 1)
      {
        console.log("s", array.length)
        const onBackPress = () => {
          const onBackNew = () => {
              navigation.navigate('Home')
              return true;
          };
          BackHandler.addEventListener("hardwareBackPress", onBackNew);
          return () =>
              BackHandler.removeEventListener("hardwareBackPress", onBackNew);
        };
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      }
    }
  }

  const renderContent = () => (
    <View
      scrollEnabled={false}
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 300,
        elevation: 20
      }}
    >
      <TouchableOpacity onPress={() => sheetRef.current.snapTo(1)} style={{ alignItems: 'center', paddingBottom: 10 }}>
        <View style={{ backgroundColor: 'lightgrey', borderRadius: 20, width: 100, height: 5, marginTop: -4 }}></View>
      </TouchableOpacity>
      <Text style={{ margin: 15, marginTop: 20, fontSize: 20, fontFamily: 'NunitoSans-Bold' }}>Download PDF</Text>

      <Form>
        <Item fixedLabel>
          <Label style={{ fontFamily: 'NuntoSans-Regular' }}>PDF Name</Label>
          <Input
            onChangeText={text => setFileName(text)}
            value={filename} />
        </Item>
      </Form>
      <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 40 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={{ height: 50 }}
            onPress={async () => {
              var x = await AsyncStorage.getItem('children');
              analytics.track('PDF Saved', {
                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                deviceID: getUniqueId()
              })
              myAsyncPDFFunction()
            }}
          >
            <View style={styles.Next}>
              <Text style={{ color: "#fff", flex: 1, textAlign: 'center', fontSize: 17, fontFamily: 'NunitoSans-Bold', marginBottom: 4 }}>
                Download
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderClosing = () => (
    <View
      scrollEnabled={false}
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 300,
        elevation: 20
      }}
    >
      <TouchableOpacity onPress={() => closeRef.current.snapTo(1)} style={{ alignItems: 'center', paddingBottom: 10 }}>
        <View style={{ backgroundColor: 'lightgrey', borderRadius: 20, width: 100, height: 5, marginTop: -4 }}></View>
      </TouchableOpacity>
      <Text style={{ margin: 15, marginTop: 20, fontSize: 20, fontFamily: 'NunitoSans-Bold' }}>Save your collection?</Text>

      <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 100 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={{ height: 50 }}
            onPress={async () => {
              var x = await AsyncStorage.getItem('children');
              analytics.track('Did not save collection', {
                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                deviceID: getUniqueId()
              })
              deleteImages();
              navigation.navigate('Home', { screen: 'Feed' })
            }}
          >
            <View style={styles.Cancel}>
              <Text style={{ color: "#000", flex: 1, textAlign: 'center', fontSize: 17, fontFamily: 'NunitoSans-Bold', marginBottom: 4 }}>
                No
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={{ height: 50 }}
            onPress={async () => {
              var x = await AsyncStorage.getItem('children');
              analytics.track('Collection Saved', {
                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                deviceID: getUniqueId()
              })
              saveImages(); deleteOrigImages(); navigation.navigate('Home', { screen: 'Feed' })

            }}
          >
            <View style={styles.Next}>
              <Text style={{ color: "#fff", flex: 1, textAlign: 'center', fontSize: 17, fontFamily: 'NunitoSans-Bold', marginBottom: 4 }}>
                Yes
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );


  return (

    <View style={styles.container}>
      {/* <Header style={{ backgroundColor: "#fff" }} >
        <Left>
          <TouchableOpacity onPress={() =>
            { 
              
            }}>
          <Icon type="Feather" name="x" style={{ color: "#000", fontSize: 30 }} />
          </TouchableOpacity>
        </Left>
        <Right>
        <TouchableOpacity style={{ borderRadius: 20, borderWidth: 2, borderColor: "#fff", alignSelf: 'center',  }}
          onPress={() => {
            analytics.track('Delete Images in Post');
            setSelecting(true);
            if(selecting)
            {
              var array = [...explore];
              for(var i = 1; i < array.length; i++)
              {
                if(array[i]['selected'])
                {
                  array.splice(i, 1);
                  i--;
                }
              }
              setExplore([ ...array ]);
              setSelecting(false);
            }
          }}
        >
          <Icon name="trash" type="Feather" style={{ color:  selecting ? "red" : '#000' }} />
        </TouchableOpacity>
        </Right>
      </Header> */}
      <CompHeader goback={goback} icon="close" screen={selecting ? "Delete" : "Preview"} style={{ zIndex: 1 }} right={true} delete={deletes} selecting={selecting} />

      <Animated.View
        style={{
          backgroundColor: 'black', position: 'absolute', opacity: 0.5, flex: 1, left: 0, right: 0, width: bottomSheetOpen ? width : 0, zIndex: 10, height: bottomSheetOpen ? height : 0
        }}>
        <Button
          style={{
            width: bottomSheetOpen ? width : 0,
            height: bottomSheetOpen ? height : 0,
            backgroundColor: 'transparent',
          }}
          activeOpacity={1}
          onPress={() => closeRef.current.snapTo(1)}
        />
      </Animated.View>
      <View style={{ backgroundColor: "#fff" }}>

        <ImageView
          images={selected}
          imageIndex={openImg}
          animationType={"fade"}
          // isVisible={true}
          onImageIndexChange={imageIndex => {
            // alert("asd");
            setVisibleImg(imageIndex);
          }}
          backgroundColor={"#F5F5F5"}
          visible={visible}
          onRequestClose={() => { setSelected([]); setVisible(false); }}
          HeaderComponent={() => {
            return (<Header style={{ backgroundColor: 'white', height: 60 }}>
              <View style={{ flexDirection: 'row', marginTop: 14, flex: 1 }}>
                <TouchableOpacity onPress={() => { setSelected([]); setVisible(false); }}><Image style={{ height: 30, width: 30, backgroundColor: "transparent", marginLeft: 1, marginTop: 3.5 }} source={require('../Icons/close.png')} /></TouchableOpacity>
              </View>
              <Body>
              </Body>
            </Header>)
          }}
          FooterComponent={() => {
            return (
              <View style={{ height: height * 0.1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                {explore[visibleImg + 1]['prevImg'] ? <TouchableOpacity
                  style={{ height: 40 }}
                  onPress={() => {
                    var ar = [...explore]; ar.splice(0, 1);
                    setSelected([]); setVisible(false);
                    navigation.navigate('Preview', { 'img': explore[visibleImg + 1]['prevImg'], height: Image.getSize(explore[visibleImg + 1]['prevImg'], (width, height) => height), width: Image.getSize(explore[visibleImg + 1]['prevImg'], (width, height) => width), 'images': ar, 'editing': 1, 'pos': visibleImg });

                  }}
                >
                  <View style={styles.Cancel}>
                    <Text style={{ color: "#327FEB", flex: 1, textAlign: 'center', fontFamily: 'NunitoSans-Bold' }}>
                      Edit {explore[visibleImg + 1]['prevImg'] ? 'Original' : null}
                    </Text>
                  </View>
                </TouchableOpacity> : null}
                <TouchableOpacity
                  style={{ height: 40 }}
                  onPress={() => {
                    setSelected([]); setVisible(false);
                    if (explore[visibleImg + 1]['width'] == undefined) {
                      Image.getSize(selected[visibleImg]['uri'].includes('://file') ? selected[visibleImg]['uri'].split('://')[1] : selected[visibleImg]['uri'], (width, height) => {
                        navigation.navigate('AddText', { img: { 'origUri': '', 'uri': selected[visibleImg]['uri'] }, 'height': height, 'width': width });
                      });

                    }
                    else {

                      navigation.navigate('AddText', { img: { 'origUri': '', 'uri': selected[visibleImg]['uri'] }, 'height': explore[visibleImg + 1]['height'], 'width': explore[visibleImg + 1]['width'] });
                    }
                  }}
                >
                  <View style={styles.Next2}>
                    <Text style={{ color: "#fff", flex: 1, textAlign: 'center', fontFamily: 'NunitoSans-Bold' }}>
                      Add Text
                              </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }}
        />
        <ScrollView style={{ height: selecting ? height * 0.9 : height * 0.6, backgroundColor: '#f9f9f9' }}>
          <FlatList
            data={explore}
            style={{ marginLeft: width * 0.05, marginRight: width * 0.06, marginVertical: width * 0.03 }}
            renderItem={({ item, index }) => (
              <View>
                {
                  item.height != 0 ?
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column', }} onPress={() => {
                      if (selecting) {
                        var array = [...explore];
                        if (array[index]['selected']) {
                          setDeleteCount(deleteCount - 1);
                        }
                        else {
                          setDeleteCount(deleteCount + 1);
                        }
                        array[index]['selected'] = !array[index]['selected'];
                        setExplore([...array])
                      }
                      else {
                        openImageViewer(index); setVisible(true);
                      }
                    }}
                      onLongPress={() => {
                        setSelecting(true); backButtonChange();
                        var tempArr = [...explore];
                        var cnt = 0;
                        for (var i = 1; i < tempArr.length; i++) {
                          if (tempArr[i]['selected']) {
                            cnt++;
                          }
                        }
                        setDeleteCount(cnt);
                      }}
                    >
                      <View
                        key={item.id}
                        style={{ flex: 1, }}>
                        <ImageBackground
                          style={styles.image}
                          imageStyle={{ opacity: selecting && item.selected ? 0.5 : 1, borderRadius: 20 }}
                          source={{
                            uri: item.uri.includes("http") ? item.uri : "file://" + item.uri,
                          }}
                        >
                          {
                            selecting ?
                              <View style={{ width: 25, height: 25, borderRadius: 20, backgroundColor: item.selected ? "#327feb" : "#fff", borderColor: "#327feb", borderWidth: item.selected ? 0 : 3, position: 'absolute', opacity: 1, zIndex: 100, top: 10, right: 10, alignItems: 'center', justifyContent: 'center' }} >
                                {item.selected ? <Icon type="Feather" name="check" style={{ color: "#fff", }} /> : null}
                              </View>
                              :
                              <View />
                          }
                        </ImageBackground>
                      </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => {
                      if (selecting) {
                        var array = [...explore];
                        var cnt = 0;
                        for (var i = 1; i < array.length; i++) {
                          // if()
                          selectedStatus == 'Select All' ? array[i]['selected'] = true : array[i]['selected'] = false;
                        }
                        selectedStatus == 'Select All' ? setDeleteCount(array.length - 1) : setDeleteCount(0);
                        setExplore([...array])
                        if (selectedStatus == 'Select All') {
                          setSelectedStatus('Deselect All')
                        }
                        else {
                          setSelectedStatus('Select All')
                        }
                      }
                      else {
                        var ar = [...explore]; ar.splice(0, 1); navigation.navigate('Camera', { "images": ar, 'time': time })
                      }
                    }}>
                      <View
                        key={item.uri}
                        style={{ flex: 1 }}>
                        <View
                          style={styles.addImg}
                        >
                          <View style={styles.addIcon}>
                            <View >
                              {
                                !selecting ?
                                  <Icon type="AntDesign" name="plus" style={{ color: "#fff" }} />
                                  :
                                  <Text style={{ color: "#fff", fontFamily: 'NunitoSans-Bold' }}>{selectedStatus}</Text>
                              }
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
        </ScrollView>

      </View>


      {/*        <TouchableOpacity style={{position: 'absolute', bottom: height*0.15, right: 6}}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Icon name="arrow-down-circle" type="Feather" style={{color: "#3cb979", fontSize: 50}} />
        </TouchableOpacity>*/}

      {
        selecting ?
          <TouchableOpacity
            style={{ height: 50, position: 'absolute', bottom: 15, alignSelf: 'center' }}
            onPress={() => {
              var array = [...explore];
              for (var i = 1; i < array.length; i++) {
                if (array[i]['selected']) {
                  array.splice(i, 1);
                  i--;
                }
              }
              setDeleteCount(0);
              setExplore([...array]);
              setSelecting(false);
            }}
          >
            <View style={styles.Next}>
              <Text style={{ color: "#fff", flex: 1, textAlign: 'center', fontSize: 17, fontFamily: 'NunitoSans-Bold' }}>
                Delete {deleteCount} items
              </Text>
            </View>
          </TouchableOpacity>
          : null
      }

      <View style={{ height: height * 0.25, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'lightgrey', display: selecting ? 'none' : 'flex' }}>
        <View style={{ marginTop: 10 }} >
          <FlatList
            data={tags}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              marginLeft: 10
            }}
            // style={{marginTop: 5}}
            renderItem={({ item, i }) => (
              <Chip key={i} style={{ backgroundColor: selectedTag == item ? '#327FEB' : '#fff', margin: 4, paddingLeft: 10, paddingRight: 10, borderWidth: selectedTag != item ? 1 : 0, borderColor: "#327FEB", borderRadius: 30 }} textStyle={{ color: selectedTag == item ? "#fff" : "#327FEB", fontFamily: 'NunitoSans-Regular' }} onPress={() => selectedTag == item ? setTag('') : setTag(item)} >{item}</Chip>
            )}
            //Setting the number of column
            // numColumns={3}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={{ height: height * 0.1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ height: 50, width: width * 0.3, alignItems: 'center' }}
            onPress={async () => {
              var x = await AsyncStorage.getItem('children');
              analytics.track('Collection Shared', {
                userID: x ? JSON.parse(x)["0"]["data"]["gsToken"] : null,
                deviceID: getUniqueId()
              })
              shareImage();
            }}
          >
            <Icon name="share" type="Entypo"  />
            <Text style={{ fontSize: 10, fontFamily: 'NunitoSans-Bold', marginLeft: 10 }} >Share </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ height: 50, width: width * 0.1, alignItems: 'center' }}
            onPress={() => {
              // setModalVisible(true);
              setBottomSheetOpen(true);
              setFileName(new Date().toISOString().split('T')[0])
              sheetRef.current.snapTo(0)
              setBottomSheetOpen(true);
              backButtonChange2();
            }}
          >
            <Icon name="download" type="Feather" />
            <Text style={{ fontSize: 10, fontFamily: 'NunitoSans-Bold', marginLeft: 2 }} >PDF </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ height: 50, width: width * 0.3, alignItems: 'center' }}
            onPress={() => {
              saveImages(); deleteOrigImages();
              navigation.navigate('Home', {
                screen: 'Files',
              })
            }}
          >
            <Icon name="file" type="Feather" />
            <Text style={{ fontSize: 10, fontFamily: 'NunitoSans-Bold', marginLeft: 10 }} >Collection  </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: height * 0.1 }}>
          <TouchableOpacity
            style={{ height: 50 }}
            onPress={() => {
              var ar = explore;
              var arr = [];
              for (var i = 1; i < ar.length; i++) {
                arr.push({ uri: ar[i]["uri"].includes("http") ? ar[i]["uri"] : 'file://' + ar[i]["uri"] })
              }
              status === '3' ? navigation.navigate('CreatePost', { images: arr, tag: selectedTag }) : navigation.navigate('Login', { screen: 'Post' })
            }}
          >
            <View style={styles.Next}>
              <Text style={{ color: "#fff", flex: 1, textAlign: 'center', fontSize: 17, fontFamily: 'NunitoSans-Bold' }}>
                Create Post
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/*<Item last style={{ position: 'absolute', bottom: height * 0.03, width: width*0.85, alignItems: 'center', alignSelf: 'center' }} >
        <Input onChangeText={(text) => {
          setcaption(text)
        }}value={caption} placeholder="Add a caption and hashtags"  />
        <Icon onPress={() => {tag == 'Certificate' ? setModalVisible4(true): PostUpload(); analytics.track('Posted')}} style={{ color: "#327FEB" }} type="FontAwesome" name='send' />
      </Item>*/}
      </View>
      <Snackbar
          visible={showToast}
          style={{ marginBottom: height * 0.04 }}
          duration={1500}
          onDismiss={() => setShowToast(false)}
          action={{
              label: 'Done',
              onPress: () => {
                  // Do something
                  setShowToast(false);
              },
          }}>
          A new collection was created
      </Snackbar>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[300, -200]}
        initialSnap={1}
        onOpenStart={() => {
          setBottomSheetOpen(true);
        }}
        onCloseStart={() => {
          setBottomSheetOpen(false);
        }}
        enabledGestureInteraction={true}
        borderRadius={30}
        renderContent={renderContent}
      />
      <BottomSheet
        ref={closeRef}
        snapPoints={[300, -200]}
        initialSnap={1}
        onOpenStart={() => {
          setBottomSheetOpen(true);
        }}
        onCloseStart={() => {
          setBottomSheetOpen(false);
        }}
        enabledGestureInteraction={true}
        borderRadius={30}
        renderContent={renderClosing}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: 'column',
    height: height,
    overflow: 'hidden'
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
    bottom: "29%",
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 14,
    borderRadius: width,
    backgroundColor: '#327FEB',
    // borderWidth: 1,
    borderColor: "#fff",
    marginBottom: 10
    // backgroundColor:'rgba(0,0,0,0.5)'
  },
  tinyLogo: {
    alignSelf: 'center',
    marginTop: 40
    // height: 80,
  },

  image: {
    height: width * 0.39,
    width: width * 0.39,
    margin: width * 0.03,
    borderRadius: 30,

  },
  addImg: {
    height: width * 0.39,
    width: width * 0.39,
    margin: width * 0.03,
    // borderWidth: 2,
    borderRadius: 20,
    borderColor: "#327FEB",
    borderWidth: 3,
    borderStyle: "dashed",
    backgroundColor: "#fff"
    // borderStyle: 'dashed',
  },
  save: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 15,
    // margin: 5,
    backgroundColor: '#327FEB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fff",
    width: width * 0.31
  },
  saveAsPDF: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 8,
    // margin: 5,
    backgroundColor: '#327FEB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    width: 135
  },
  save2: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 15,
    // margin: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#327FEB",
    width: width * 0.31
  },
  save3: {
    // alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    // margin: 5,
    // backgroundColor: '#327FEB',
    // borderRadius: 30,
    // borderWidth: 5,
    // borderColor: "#3cb979",
    width: 60
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
    alignItems: "center",
    // marginTop: 22
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
  Next: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 4,
    backgroundColor: '#327FEB',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    width: width * 0.4,
    flex: 1,
    marginHorizontal: 20
  },
  Next2: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 8,
    // margin: 5,
    backgroundColor: '#327FEB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    width: 135,
    flex: 1,
    marginHorizontal: 20
  },
  Cancel: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 4,
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#327FEB",
    width: width*0.4,
    flex: 1,
    marginHorizontal: 20
  },
  modalText: {
    marginVertical: 15,
    fontSize: 20,
    textAlign: "center",
    fontFamily: 'NunitoSans-Regular'
  }
})


export default Upload;