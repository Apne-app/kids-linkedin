'use strict';
import React, { PureComponent } from 'react';
import { AppRegistry, Dimensions, StyleSheet, Text, FlatList, TouchableOpacity, Image, PermissionsAndroid, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail,  List, ListItem,  Separator, Left, Body, Right, Title} from 'native-base';
import CameraRoll from "@react-native-community/cameraroll";
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

export default class ExampleApp extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {gallery: new Array(), side: RNCamera.Constants.Type.back};
  }

  componentDidMount() {
    
    const func = async () => {

            try {
                const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    'title': 'Access Storage',
                    'message': 'Access Storage for the pictures'
                }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use read from the storage");

                 CameraRoll.getPhotos({
                    first: 100,
                    assetType: 'All',
                    })
                    .then(r => {
                    // setGallery([ ...r.edges ]);

                    this.setState(({
                      gallery: [ ...r.edges ]
                    }))

                    // setSelected(r.edges[0].node.image.uri)
                    console.log(r.edges[0].node.image.uri);
                    })
                    .catch((err) => {
                        //Error Loading 
                        console.log(err);
                });

                } else {
                console.log("Storage permission denied")
                }
            } catch (err) {
                console.warn(err)
            }
        }
        func();

  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.state.side}
          flashMode={RNCamera.Constants.FlashMode.off}
          // style={{flex: 1,}}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View style={{height: height*0.16, alignItems: 'center', marginTop: height*0.1}} >
          <FlatList
            data={this.state.gallery}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'column', margin: 1, height: 80}}>
                <TouchableOpacity
                  key={item.id}
                  style={{ flex: 1 }}
                  onPress={() => {
                    // setSelected(item.node.image.uri)
                    this.props.navigation.navigate('Preview', {'img': item.node.image.uri});
                    console.log(item);  
                  }}>
                  {/*console.log(item.node.image.uri)*/}
                  <Image
                    style={styles.image}
                    source={{
                      uri: item.node.image.uri,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            // numColumns={3}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture, {flex: 1, alignItems: 'flex-start', marginLeft: 15, marginTop: 14}}>
            <Icon type="EvilIcons" name="image" style={{color: "#fff", fontSize: 50}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture, {flex: 2, alignItems: 'center'}}>
            <Icon type="Entypo" name="circle" style={{color: "#fff", fontSize: 70}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.changeSide.bind(this)} style={styles.capture, {flex: 1, alignItems: 'flex-end', marginRight: 15}}>
            <Icon type="Ionicons" name="camera-reverse-outline" style={{color: "#fff", fontSize: 45, marginTop: 10}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takePicture = async () => {
    // console.log(this.state.gallery);
    if (this.camera) {
      const options = { quality: 0.5, base64: true, fixOrientation: true };
      const data = await this.camera.takePictureAsync(options);
      this.props.navigation.navigate('Preview', {'img': data.uri, 'height': data.height, 'width': data.width});
      // console.log(data);

    }
  };
  changeSide = async () => {
    // console.log("asd");
    if(this.camera)
    {
      this.setState({
        ...this.state,
        side: this.state.side == RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
      })
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    // width: width;
  },
  preview: {
    // flex: 1,
    height: height*0.55,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    // backgroundColor: '#fff',
    // borderRadius: 30,
    // height: 0,
    padding: 10,
    marginBottom: 16,
    paddingHorizontal: 20,
    alignSelf: 'center',
    // margin: 10,
  },
  image: {
    height: height*0.13,
    width: height*0.13,
  },
});
