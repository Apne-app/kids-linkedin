/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useState, useRef } from 'react';
import { ScrollView, StatusBar, Switch, BackHandler, StyleSheet, View, Image, TextInput, ImageBackground, Dimensions, FlatList, Text, TouchableOpacity } from 'react-native';
import { CropView } from 'react-native-image-crop-tools';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import BottomSheet from 'reanimated-bottom-sheet';
import ViewShot from "react-native-view-shot";
import Draggable from 'react-native-draggable';
import { useFocusEffect } from "@react-navigation/native";
import CompHeader from '../Modules/CompHeader';

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

var halfHeight = height * 0.5;

const App: () => React$Node = (props) => {
  const [uri, setUri] = useState();
  const [prevUri, setPrevUri] = useState('');
  const [dim, setDim] = useState({ height: '50', width: '50' })
  const [editing, setEditing] = useState(false);
  const [croppedi, setcroppedi] = React.useState(false);
  const cropViewRef = useRef();

  const colors = [
    'black', 'white', 'red', 'pink', 'green', 'blue', 'yellow'
  ]

  React.useEffect(() => {
    setUri(props.route.params.img);
    if (props.route.params && props.route.params.reload) {

    }
    const saveOrigImages = async () => {
      var arr = await AsyncStorage.getItem("OrigImages");
      arr = JSON.parse(arr);

      if (arr) {
        arr = [...arr, props.route.params.img]
      }
      else {
        arr = [props.route.params.img];
      }

      // console.log(arr);

      await AsyncStorage.setItem("OrigImages", JSON.stringify(arr));

    }

    saveOrigImages();

    // console.log(AsyncStorage);
  }, [])

  const [value, setValue] = React.useState({
    value: '',
    color: 'black',
    size: 20
  });
  const [top, setTop] = React.useState(true)
  const viewShot = React.useRef(null);
  const sheetRef = React.useRef(null);

  const takeShot = async () => {
    // console.log(viewShot)
    // viewShot.current.capture().then(async (url) => {
    //   console.log("do something with ", uri);
    // console.log(props.route.params);
    // await AsyncStorage.setItem('@scanImg', JSON.stringify({'height': 200, 'uri': uri}) );
    var tm= new Date();
    props.navigation.navigate('PostScreen', { "reload": 1, "edited": 1, "images": [...props.route.params.images, { 'height': dim.height, 'width': dim.width, 'uri': uri, 'prevImg': prevUri}], 'time': props.route.params.time })
    // });
  }

  const backBehavior = () => {
    if (croppedi) {
      setcroppedi(false);
    }
    else {
      props.navigation.navigate('Camera')
    }
  }
  const refresh = () => {
    if (props.route.params.editing) {
      setUri(props.route.params.img);
      setDim({ height: props.route.params.height, width: props.route.params.width });
      setcroppedi(false)
      setEditing(true);
    }
    props.route.params.editing = 0;
  }
  refresh();

  useFocusEffect(

    React.useCallback(() => {
      const backAction = () => {
        // console.log(croppedi)
        backBehavior();
        return true;
      };



      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      // console.log(props.route.params)
    }, []));

  const renderContent = () => (
    <View
      scrollEnabled={false}
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: halfHeight,
      }}
    >
      <TouchableOpacity onPress={() => sheetRef.current.snapTo(1)} style={{ alignItems: 'center', paddingBottom: 10 }}><Icon name="chevron-small-down" type="Entypo" /></TouchableOpacity>
      <Text style={{ textAlign: 'center', margin: 5, fontSize: 18 }}>Enter image details</Text>
      <TextInput
        style={{
          // backgroundColor: ,
          // borderColor: '#000000',
          borderWidth: 0.5,
          borderRadius: 15,
          padding: 15
        }}
        multiline
        numberOfLines={4}
        onChangeText={text => setValue({ ...value, value: text })}
        value={value.value}
        editable
        maxLength={100}
      />
      <Text style={{ textAlign: 'center', margin: 5, fontSize: 18 }}>Size</Text>
      <View scrollEnabled={false} style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 1, flexDirection: 'row' }}>

        <TouchableOpacity onPress={() => setValue({ ...value, size: 10 })} style={{ minWidth: width * 0.1, backgroundColor: value.size == 10 ? "#4cad4a" : "#fff", borderWidth: 1, alignSelf: 'center', padding: 6, marginLeft: 10, borderRadius: 8, alignItems: 'center' }}><Text style={{ fontSize: 10, textAlign: 'center' }}>A</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setValue({ ...value, size: 20 })} style={{ minWidth: width * 0.12, backgroundColor: value.size == 20 ? "#4cad4a" : "#fff", borderWidth: 1, alignSelf: 'center', padding: 6, marginLeft: 10, borderRadius: 8, alignItems: 'center' }}><Text style={{ fontSize: 20, textAlign: 'center' }}>A</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setValue({ ...value, size: 40 })} style={{ minWidth: width * 0.15, backgroundColor: value.size == 40 ? "#4cad4a" : "#fff", borderWidth: 1, alignSelf: 'center', paddingLeft: 3, paddingRight: 3, marginLeft: 10, borderRadius: 8, alignItems: 'center' }}><Text style={{ fontSize: 40, textAlign: 'center' }}>A</Text></TouchableOpacity>

      </View>
      <ScrollView style={{ flex: 1 }} scrollEnabled={true} >
        <FlatList
          data={colors}
          scrollEnabled={true}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 15 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                setValue({ ...value, color: item })
                // console.log(item);  
              }}>
              <View style={{ height: 46, width: 46, borderRadius: 23, backgroundColor: item, marginHorizontal: 6, borderWidth: 2 }} />
            </TouchableOpacity>
          )}
          //Setting the number of column
          // numColumns={3}
          horizontal={true}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => sheetRef.current.snapTo(1)} style={{ width: width * 0.2, backgroundColor: "#327FEB", alignSelf: 'center', padding: 12, borderRadius: 20, }}>
            <Text style={{ color: "#fff", textAlign: 'center' }}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  const goback = () => {
    // var x = new Date();
    croppedi && editing ? setcroppedi(false) : editing ? props.navigation.navigate('PostScreen', { "reload": 1, "images": [...props.route.params.images] }) : props.navigation.pop()
  }
  return (
    <>
      <CompHeader screen={'Edit'} icon={'back'} goback={goback} />
      <View style={styles.container}>
        {/*<Button
          title={'Pick Image'}
          onPress={() => {
            ImagePicker.launchImageLibrary({noData: true}, response => {
              setUri(response.uri);
            });
          }}
        />*/}
        {(uri !== undefined && !croppedi) && <CropView
          sourceUrl={uri}
          style={styles.cropView}
          ref={cropViewRef}
          onImageCrop={async (res) => {
            setcroppedi('');
            // var scannedImg = await AsyncStorage.getItem('@scanImg');
            // console.log(scannedImg);

            // console.log("aaaaa");
            // try {
            // await AsyncStorage.setItem('@scanImg', JSON.stringify(res) );
            console.log(res);
            // setPrevUri(uri);
            // setUri(res.uri);
            setDim({ height: JSON.parse(res.height), width: JSON.parse(res.width) })
            setcroppedi(true)
            var tm = new Date();
            if(editing)
            {
            var ar = [...props.route.params.images];
            ar.splice(props.route.params.pos, props.route.params.pos+1, { 'height': JSON.parse(res.height), 'width': JSON.parse(res.width), 'uri': res.uri, 'prevImg': uri });
            props.navigation.navigate('PostScreen', { "reload": 1, "edited": 1, "images": [...ar], 'time': props.route.params.time })
            }
            else{
            props.navigation.navigate('PostScreen', { "reload": 1, "edited": 1, "images": [...props.route.params.images, { 'height': JSON.parse(res.height), 'width': JSON.parse(res.width), 'uri': res.uri, 'prevImg': uri }], 'time': props.route.params.time })
            }





            // props.navigation.navigate('Home', {
            //   screen: 'Post',
            //   params: { "reload": 1
            //   },
            // });

          }}
        // keepAspectRatio
        // aspectRatio={{width: 16, height: 9}}
        >
        </CropView>
        }
        {
          croppedi &&
          /*<ViewShot ref={viewShot} style={styles.cropView}>
         <Image  source={{uri: uri}} style={{ aspectRatio: (dim.width)/(dim.height), width: dim.width > dim.height ? "100%" : "auto", height: dim.width < dim.height ? "100%" : "auto", }} >
         </Image>
         <Draggable x={75} y={100}  renderColor='transparent' renderText='A' shouldReverse={false} 
         children={<Text style={{backgroundColor: "transparent", color: value.color, fontSize: value.size}} >{value.value}</Text>}
         />
       </ViewShot>*/
          <View style={styles.cropView}>
            <Image source={{ uri: uri }} style={{ aspectRatio: (dim.width) / (dim.height), width: dim.width > dim.height ? "100%" : "auto", height: dim.width < dim.height ? "100%" : "auto", }} >
            </Image>
          </View>
        }
      </View>
      {
        !croppedi &&
        <View style={{flexDirection:'row', alignSelf:'center', backgroundColor: '#efefef', height:50, marginTop:20}}>
          <TouchableOpacity onPress={() => cropViewRef.current.rotateImage(false)} style={{backgroundColor: '000'}}><Image style={{ height: 50, width: 50, backgroundColor: "transparent", elevation:80, borderRadius:360, marginRight: 50,}} source={require('../Icons/rotate_left.png')} /></TouchableOpacity>
          <TouchableOpacity onPress={() => cropViewRef.current.rotateImage(true)} style={{backgroundColor: '000'}}><Image style={{ height: 50, width: 50, backgroundColor: "transparent", elevation:80, borderRadius:360,  }} source={require('../Icons/rotate_right.png')} /></TouchableOpacity>
          </View>
      }
      <View style={{ height: height * 0.16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#efefef' }}>
        <TouchableOpacity
          style={{ height: 40 }}
          onPress={() => {
            croppedi && editing ? setcroppedi(false) : editing ? props.navigation.navigate('PostScreen', { "reload": 1, "images": [...props.route.params.images] }) : props.navigation.pop()
          }}
        >
          <View style={styles.Cancel}>
            <Text style={{ color: "#327FEB", flex: 1, textAlign: 'center', fontFamily: 'NunitoSans-Bold' }}>
              Cancel
              </Text>
          </View>
        </TouchableOpacity>
        

        {
          !croppedi ?
            <TouchableOpacity style={{ height: 40 }} onPress={async () => {
              cropViewRef.current.saveImage(true, 90)

            }} >
              <View style={styles.Next}>
                <Text style={{ color: "#fff", flex: 1, textAlign: 'center', fontFamily: 'NunitoSans-Bold' }}>
                  Next
                </Text>
              </View>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ height: 40 }} onPress={async () => {
              // cropViewRef.current.saveImage(true, 90)
              // :
              takeShot();

              // cropViewRef.rotateImage(false);

            }}>
              <View style={styles.Next}>
                <Text style={{ color: "#fff", flex: 1, textAlign: 'center', fontFamily: 'NunitoSans-Regular' }}>
                  Next
                </Text>
              </View>
            </TouchableOpacity>
        }

      </View>
      {/*<View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: "#fff"}}>
        <TouchableOpacity onPress={() =>  croppedi ? setcroppedi(false) : props.navigation.pop()} style={{backgroundColor: '#fff', position: 'absolute', bottom: height*0.13, left: 20, borderWidth: 1, borderRadius: 100,}}>
            <Icon type="Entypo" name="cross" style={{color: "red", fontSize: 35, padding: 5}} />
          </TouchableOpacity>
        {
          !croppedi ? 
          <TouchableOpacity onPress={async () => {
          cropViewRef.current.saveImage(true, 90)
            // :
            // await AsyncStorage.setItem('@scanImg', JSON.stringify(uri) );
            //   props.navigation.navigate('Home', {
            //   screen: 'Post',
            //   params: { "reload": 1
            //   },
            // });
            // cropViewRef.rotateImage(false);
            
        }} style={{backgroundColor: '#fff', position: 'absolute', bottom: height*0.13, right: 20, borderWidth: 1, borderRadius: 100}}>
            <Icon type="Entypo" name="check" style={{color: "green", fontSize: 35, padding: 5}} />
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={async () => {
          // cropViewRef.current.saveImage(true, 90)
            // :
            takeShot();
            
            // cropViewRef.rotateImage(false);
            
        }} style={{backgroundColor: '#fff', position: 'absolute', bottom: height*0.13, right: 20, borderWidth: 1, borderRadius: 100}}>
            <Icon type="Entypo" name="check" style={{color: "green", fontSize: 35, padding: 5}} />
          </TouchableOpacity>
        }
        </View>
        {
          croppedi ?
        <View>
          <TouchableOpacity onPress={() => {
            sheetRef.current.snapTo(0);
            // takeShot();
          }} style={{position: 'absolute', bottom: height*0.04, width: width*0.6, backgroundColor: "#327FEB", alignSelf: 'center', padding: 12, borderRadius: 20,}}>
            <Text style={{color: "#fff",  textAlign: 'center'}}>Add Kid's Details</Text>
          </TouchableOpacity>
        </View>:
        <View />
        }
        <BottomSheet
        ref={sheetRef}
        snapPoints={[halfHeight, 0]}
        initialSnap = {1}
        enabledGestureInteraction={false}
        borderRadius={25}
        renderContent={renderContent}
      />
      </View>*/}
    </>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 3,
  },
  cropView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#efefef',
    justifyContent: 'center',
    // marginBottom: 120
  },

  // image: {
  //   height: dim.height,
  //   width: dim.width,
  //   // margin: width*0.02,
  //   // elevation: 3
  //   // borderRadius: 30,

  // },
  Next: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 8,
    // margin: 5,
    elevation: 0.5,
    backgroundColor: '#327FEB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#327FEB",
    width: 135,
    flex: 1,
    marginHorizontal: 20
  },
  Cancel: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 8,
    // margin: 5,
    elevation: 0.5,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#327FEB",
    width: 135,
    flex: 1,
    marginHorizontal: 20
  },
});

export default App;