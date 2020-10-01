
import React, {useState, useRef} from 'react';
import { StatusBar, StyleSheet, View, Image, ImageBackground, Dimensions, Text, TouchableOpacity} from 'react-native';
import {CropView} from 'react-native-image-crop-tools';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail,  List, ListItem,  Separator, Left, Body, Right, Title} from 'native-base';


var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;


const App: () => React$Node = (props) => {
  const [uri, setUri] = useState();
  const [croppedi, setcroppedi] = React.useState('');
  const cropViewRef = useRef();

  React.useEffect(() => {
    setUri(props.route.params.img);
  // console.log(AsyncStorage);
  }, [])


  if(croppedi == '')
  {

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/*<Button
          title={'Pick Image'}
          onPress={() => {
            ImagePicker.launchImageLibrary({noData: true}, response => {
              setUri(response.uri);
            });
          }}
        />*/}
        {uri !== undefined && <CropView
          sourceUrl={uri}
          style={styles.cropView}
          ref={cropViewRef}
          onImageCrop={async (res) => {
          setcroppedi('');
          // var scannedImg = await AsyncStorage.getItem('@scanImg');
          // console.log(scannedImg);
          
            // console.log("aaaaa");
            // try {
          await AsyncStorage.setItem('@scanImg', JSON.stringify(res) );
              

          // scannedImg = await AsyncStorage.getItem('@scanImg');
          console.log("sd");
            // } catch (error) {
            //   console.log(error)
            // // }


        

          props.navigation.navigate('Home', {
            screen: 'Post',
            params: { "reload": 1
            },
          });

          }}
          // keepAspectRatio
          // aspectRatio={{width: 16, height: 9}}
        />}
        <View>
        <TouchableOpacity onPress={() => props.navigation.pop()} style={{backgroundColor: '#fff', position: 'absolute', bottom: height*0.05, left: 20, borderWidth: 1, borderRadius: 100,}}>
            <Icon type="Entypo" name="cross" style={{color: "red", fontSize: 35, padding: 5}} />
          </TouchableOpacity>
        <TouchableOpacity onPress={async () => {
            cropViewRef.current.saveImage(true, 90);
            // cropViewRef.rotateImage(false);
            
        }} style={{backgroundColor: '#fff', position: 'absolute', bottom: height*0.05, right: 20, borderWidth: 1, borderRadius: 100}}>
            <Icon type="Entypo" name="check" style={{color: "green", fontSize: 35, padding: 5}} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={{position: 'absolute', bottom: height*0.015, width: width*0.6, backgroundColor: "#357feb", alignSelf: 'center', padding: 12, borderRadius: 20,}}>
            <Text style={{color: "#fff",  textAlign: 'center'}}>Add Kid's Details</Text>
          </TouchableOpacity>
        </View>
        {/*<Button
          title={'Save'}
          onPress={async () => {
            cropViewRef.current.saveImage(true, 90);
            // cropViewRef.rotateImage(false);
            

          }}
        />*/}
      </View>
    </>
  );
  }
  else
  {
    return (

    <View style={styles.container}>
      <Image
          style={styles.image}
          // imageStyle= {{ transform: [{ rotate: '-90deg'}]}}
          source={{
          uri: croppedi,
          }}
      />
      <Button title={'Go Back'} onPress={() => setcroppedi('')} />
    </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cropView: {
    flex: 1,
    backgroundColor: 'black'
  },

  image: {
    height: width,
    width: width,
    // margin: width*0.02,
    // elevation: 3
    // borderRadius: 30,
    
  },
});

export default App;