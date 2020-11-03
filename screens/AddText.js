
import React, {useState, useRef} from 'react';
import { ScrollView, StatusBar, Switch,BackHandler, StyleSheet, View, Image, TextInput, ImageBackground, Dimensions, FlatList, Text, TouchableOpacity} from 'react-native';
import {CropView} from 'react-native-image-crop-tools';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail,  List, ListItem,  Separator, Left, Body, Right, Title} from 'native-base';
import BottomSheet from 'reanimated-bottom-sheet';
import ViewShot from "react-native-view-shot";
import Draggable from 'react-native-draggable';
import { useFocusEffect } from "@react-navigation/native";

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

var halfHeight = height*0.5;

const App: () => React$Node = (props) => {
  const [uri, setUri] = useState();
  const [dim, setDim] = useState({ height: '50', width: '50' })
  const [croppedi, setcroppedi] = React.useState(true);
  const cropViewRef = useRef();

  const colors = [
    'black', 'white', 'red', 'pink', 'green', 'blue', 'yellow'
  ]

  React.useEffect(() => {
    setUri(props.route.params.img.uri);
    setDim({ height: props.route.params.height, width: props.route.params.width })
    console.log(props.route.params);
    // const saveOrigImages = async () => {
    //   var arr = await AsyncStorage.getItem("OrigImages");
    //   arr = JSON.parse(arr);

    //   if(arr)
    //   {
    //     arr = [ ...arr , props.route.params.img ]
    //   }
    //   else
    //   {
    //     arr = [ props.route.params.img ];
    //   }

    //   console.log(arr);

    //   await AsyncStorage.setItem("OrigImages", JSON.stringify(arr));

    // }

    // saveOrigImages();
    
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
    viewShot.current.capture().then(async (url) => {
    //   console.log("do something with ", uri);
    // console.log(props.route.params);
    //   await AsyncStorage.setItem('@scanImg', JSON.stringify({'height': 200, 'uri': uri}) );
        props.navigation.navigate('PostScreen', { "textAdded": 1, "changedimage":  {'height': dim.height, 'prevuri': uri, 'width': dim.width, 'uri': url}  })
    });
  }

  const backBehavior = () => {
    if(croppedi)
    {
      setcroppedi(false);
    }
    else
    {
      props.navigation.navigate('Camera')
    }
  }

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

    //   console.log(props.route.params)
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
      <TouchableOpacity onPress={() => sheetRef.current.snapTo(1)} style={{alignItems: 'center',paddingBottom: 10}}><Icon name="chevron-small-down" type="Entypo" /></TouchableOpacity>
       <Text style={{textAlign: 'center', margin: 5, fontSize: 18}}>Enter image details</Text>
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
        <Text style={{textAlign: 'center', margin: 5, fontSize: 18}}>Size</Text>
        <View scrollEnabled={false} style={{alignItems: 'center', justifyContent: 'center', paddingTop: 1, flexDirection: 'row'}}>

          <TouchableOpacity onPress={() => setValue({ ...value, size: 10 })} style={{  minWidth: width*0.1, backgroundColor: value.size == 10? "#4cad4a":"#fff", borderWidth: 1, alignSelf: 'center', padding: 6, marginLeft: 10, borderRadius: 8, alignItems: 'center'}}><Text style={{fontSize: 10, textAlign: 'center'}}>A</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setValue({ ...value, size: 20 })} style={{  minWidth: width*0.12, backgroundColor:value.size == 20? "#4cad4a": "#fff", borderWidth: 1, alignSelf: 'center', padding: 6, marginLeft: 10, borderRadius: 8, alignItems: 'center'}}><Text style={{fontSize: 20, textAlign: 'center'}}>A</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setValue({ ...value, size: 40 })} style={{  minWidth: width*0.15, backgroundColor:value.size == 40? "#4cad4a": "#fff", borderWidth: 1, alignSelf: 'center', paddingLeft: 3, paddingRight: 3, marginLeft: 10, borderRadius: 8, alignItems: 'center'}}><Text style={{fontSize: 40, textAlign: 'center'}}>A</Text></TouchableOpacity>
        
        </View>
        <ScrollView style={{flex: 1}} scrollEnabled={true} >
        <FlatList
            data={colors}
            scrollEnabled={true}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 15}}
            renderItem={({ item }) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setValue({ ...value, color: item })
                    // console.log(item);  
                  }}>
                    <View style={{height: 46, width: 46, borderRadius: 23, backgroundColor: item, marginHorizontal: 6, borderWidth: 2}} />
                </TouchableOpacity>
            )}
            //Setting the number of column
            // numColumns={3}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
          />
          </ScrollView>
        <View style={{alignItems: 'center',flexDirection: 'row'}}>
        <View style={{flex: 1, alignItems: 'center'}}>
        <TouchableOpacity onPress={() => sheetRef.current.snapTo(1)} style={{width: width*0.2, backgroundColor: "#357feb", alignSelf: 'center', padding: 12, borderRadius: 20,}}>
            <Text style={{color: "#fff",  textAlign: 'center'}}>Done</Text>
          </TouchableOpacity>
        </View>
        </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Header noShadow style={{ backgroundColor: '#fff',  height: height*0.05}}>
              <Left style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={() =>  props.navigation.pop()}><Icon type="Feather" name="x" style={{ color: "#000", fontSize: 30,}} /></TouchableOpacity>
          </Left>
          <Body>
             
          </Body>
          <Right>
          
          </Right>
      </Header>
      <View style={styles.container}>
       
           <ViewShot ref={viewShot} style={styles.cropView}>
          <ImageBackground  source={{uri: uri}} style={{ aspectRatio: (dim.width)/(dim.height), width: dim.width > dim.height ? "100%" : "auto", height: dim.width < dim.height ? "100%" : "auto", }} >
          <Draggable x={75} y={100}  renderColor='transparent' renderText='A' shouldReverse={false} 
          children={<Text style={{backgroundColor: "transparent", color: value.color, fontSize: value.size}} >{value.value}</Text>}
          />
          </ImageBackground>
        </ViewShot>
        
        </View>
        <View style={{flex: 1}}>
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
          }} style={{position: 'absolute', bottom: height*0.04, width: width*0.6, backgroundColor: "#357feb", alignSelf: 'center', padding: 12, borderRadius: 20,}}>
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
      </View>
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
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#357feb',
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
    padding: 8,
    // margin: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#357feb",
    width: 135,
    flex: 1,
    marginHorizontal: 20
  },
});

export default App;