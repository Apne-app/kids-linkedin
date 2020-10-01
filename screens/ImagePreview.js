
import React, {useState, useRef} from 'react';
import { ScrollView, StatusBar, Switch, StyleSheet, View, Image, TextInput, ImageBackground, Dimensions, FlatList, Text, TouchableOpacity} from 'react-native';
import {CropView} from 'react-native-image-crop-tools';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail,  List, ListItem,  Separator, Left, Body, Right, Title} from 'native-base';
import BottomSheet from 'reanimated-bottom-sheet';
import ViewShot from "react-native-view-shot";
import Draggable from 'react-native-draggable';

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

var halfHeight = height*0.5;

const App: () => React$Node = (props) => {
  const [uri, setUri] = useState();
  const [dim, setDim] = useState({ height: '50', width: '50' })
  const [croppedi, setcroppedi] = React.useState(false);
  const cropViewRef = useRef();

  const colors = [
    'black', 'white', 'red', 'pink', 'green', 'blue', 'yellow'
  ]

  React.useEffect(() => {
    setUri(props.route.params.img);
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
      console.log("do something with ", uri);
      await AsyncStorage.setItem('@scanImg', JSON.stringify({'height': 200, 'uri': url}) );
        props.navigation.navigate('Home', {
        screen: 'Post',
        params: { "reload": 1
        },
      })
    });
  }


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
        <View scrollEnabled={false} style={{alignItems: 'center', paddingTop: 20, flexDirection: 'row'}}>
          <View style={{flex: 2, alignItems: 'flex-end', marginRight: 10}}>
            <Text>Size</Text>
          </View>
          <View style={{flex: 2}}>
              <TextInput
                style={{
                  // backgroundColor: ,
                  // borderColor: '#000000',
                  borderWidth: 0.5,
                  borderRadius: 15,
                  padding: 10
                }}
                keyboardType="numeric"
                onChangeText={text => setValue({ ...value, size: text.length ? JSON.parse(text.replace(/[^0-9]/g, '')) : console.log("wrong") })}
                value={value.size}
                editable
                // maxLength={100}
              />
          </View>
          <View style={{flex: 2}} />
        </View>
        <ScrollView style={{flex: 1}} scrollEnabled={true} >
        <FlatList
            data={colors}
            scrollEnabled={true}
            contentContainerStyle={{
              flexGrow: 1,
            }}
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
      <ViewShot ref={viewShot} style={styles.container}>
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
          setUri(res.uri);
          setDim({ height: JSON.parse(res.height), width: JSON.parse(res.width) })
          setcroppedi(true)
              

          // scannedImg = await AsyncStorage.getItem('@scanImg');
          // console.log("sd");
            // } catch (error) {
            //   console.log(error)
            // // }


        

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
           <View style={styles.cropView}>
          <Image source={{uri: uri}} style={{ height: dim.height, width: dim.width }} >
          </Image>
          <Draggable x={75} y={100}  renderColor='transparen' renderText='A' shouldReverse={false} 
          children={<Text style={{backgroundColor: "transparent", color: value.color, fontSize: value.size}} >{value.value}</Text>}
          />
        </View>
        }
        
        </ViewShot>
        <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: "#000"}}>
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
        }{/*<Button
          title={'Save'}
          onPress={async () => {
            cropViewRef.current.saveImage(true, 90);
            // cropViewRef.rotateImage(false);
            

          }}
        />*/}
        <BottomSheet
        ref={sheetRef}
        snapPoints={[halfHeight, 0]}
        initialSnap = {1}
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
    backgroundColor: 'black'
  },

  // image: {
  //   height: dim.height,
  //   width: dim.width,
  //   // margin: width*0.02,
  //   // elevation: 3
  //   // borderRadius: 30,
    
  // },
});

export default App;