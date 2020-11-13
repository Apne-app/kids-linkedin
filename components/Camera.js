/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { PureComponent } from 'react';
import { AppRegistry, ScrollView, Alert, TextInput, Platform, Dimensions, BackHandler, StyleSheet, Text, FlatList, TouchableOpacity, Image, PermissionsAndroid, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Container, Header, Content, Spinner, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import CameraRoll from "@react-native-community/cameraroll";
import Gallery from './Gallery'
import Svg, {
  Use,
} from 'react-native-svg';
import ZoomView from './ZoomView';
import BottomSheet from 'reanimated-bottom-sheet';
import { useFocusEffect } from "@react-navigation/native";
import CompHeader from '../Modules/CompHeader';

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

const MAX_ZOOM = 7; // iOS only
const ZOOM_F = Platform.OS === 'ios' ? 0.0005 : 0.08;

export default class ExampleApp extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { zoom: 0.0, gallery: new Array(), imagetaken: false, side: RNCamera.Constants.Type.back, isGalleryOpen: false, flash: RNCamera.Constants.FlashMode.off, visible: false };
  }
  _onPinchStart = () => {
    this._prevPinch = 1
  }

  _onPinchEnd = () => {
    this._prevPinch = 1
  }

  _onPinchProgress = (p) => {
    let p2 = p - this._prevPinch
    if (p2 > 0 && p2 > ZOOM_F) {
      this._prevPinch = p
      this.setState({ ...this.state, zoom: Math.min(this.state.zoom + ZOOM_F, 1) }, () => {
      })
    }
    else if (p2 < 0 && p2 < -ZOOM_F) {
      this._prevPinch = p
      this.setState({ ...this.state, zoom: Math.max(this.state.zoom - ZOOM_F, 0) }, () => {
      })
    }
    // console.log(this.state.zoom)
  }



  

  componentDidMount() {


    const func = async () => {



      try {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
            'title': 'Access Storage',
            'message': 'Access Storage for the pictures',
            'buttonPositive': 'Ok'
        }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use read from the storage 2");
          // requestCameraPermission();

          CameraRoll.getPhotos({
            first: 100,
            assetType: 'Photos',
          })
            .then(r => {
              // setGallery([ ...r.edges ]);

              this.setState(({
                gallery: [...r.edges]
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
          // requestCameraPermission();
        }
      } catch (err) {
        console.warn(err)
      }
    }
    func();

    const { navigation } = this.props;
    this.focusListener = navigation.addListener("focus", () => {      
    // Call ur function here.. or add logic.  
    this.setState({ ...this.state, imagetaken: false })   
    });

    this.focusListener = this.props.navigation.addListener("focus", () => {

      const backAction = () => {
        if (this.state.isGalleryOpen) {
          this.setState({
            ...this.state,
            isGalleryOpen: false
          })
          this.sheetRef.snapTo(1);
        }
        else if (this.props.route.params) {
          this.props.navigation.navigate('PostScreen', { "reload": 1, "images": [...this.props.route.params.images] })
          console.log(this.props.route.params);
        }
        else {
          this.props.navigation.navigate('Home', {
            screen: 'Feed',
          })
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }
    );
    setTimeout(() => {
      this.setState({ ...this.state, visible: false })
    }, 5000);

  };
//   componentDidMount(){
    
// }


  render() {
    const renderContent = () => (
      <View
        // scrollEnabled={false}
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: height * 0.5,
          borderColor: "#fff",
          borderWidth: 0.2
        }}
      >
        <TouchableOpacity onPress={() => { this.sheetRef.snapTo(1); this.setState({ ...this.state, isGalleryOpen: false }); }} style={{ alignItems: 'center', paddingBottom: 10 }}><Icon style={{ color: "black" }} name="chevron-small-down" type="Entypo" /></TouchableOpacity>
        
      </View>
    );


    const goback = () => {
      if (this.props.route.params) {
        this.props.navigation.navigate('PostScreen', { "reload": 1, "images": [...this.props.route.params.images] })
        console.log(this.props.route.params);
      }
      else {
        this.props.navigation.navigate('Home', {
          screen: 'Feed',
        })
      }
    }
    return (
      <View style={styles.container}>
        <CompHeader screen={'Scan'} goback={goback} />
        <Button block style={{ marginTop: 100, borderColor: '#327FEB', backgroundColor: 'white', borderWidth: 1, borderRadius: 30, width: width - 40, alignSelf: 'center', height: 60, position: this.state.visible ? 'absolute' : 'relative', zIndex: 400, display: this.state.visible ? 'flex' : 'none' }} onPress={() => this.setState({ ...this.state, visible: false })} >
          <Text style={{ color: "#327FEB", fontFamily: 'NunitoSans-Bold', fontSize: 16 }}>Upload your first image</Text>
        </Button>
        <BottomSheet
          ref={ref => {
            this.sheetRef = ref;
          }}
          snapPoints={[height * 0.5, 0]}
          initialSnap={1}
          enabledGestureInteraction={false}
          borderRadius={25}
          renderContent={renderContent}
        />
        <View style={{ height: height * 0.6, }}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={this.state.side}
            zoom={this.state.zoom}
            flashMode={this.state.flash}
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
          >
            <ZoomView
              onPinchEnd={this._onPinchEnd}
              onPinchStart={this._onPinchStart}
              onPinchProgress={this._onPinchProgress}
            >
              <TouchableOpacity onPress={this.changeSide.bind(this)} style={styles.capture, { flex: 1, alignItems: 'flex-end', position: 'absolute', bottom: 10, left: 10 }}>
                <Image style={{ height: 40, width: 40, backgroundColor: "transparent", marginLeft: 10, marginBottom: 10 }} source={require('../Icons/flip_camera.png')} />
              </TouchableOpacity>

              <TouchableOpacity onPress={this.changeFlash.bind(this)} style={styles.capture, { flex: 1, alignItems: 'flex-end', position: 'absolute', bottom: 15, right: 10 }}>
                {this.state.flash == RNCamera.Constants.FlashMode.off ? <Image style={{ height: 40, width: 40, backgroundColor: "transparent", marginLeft: 10 }} source={require('../Icons/flash_on.png')} /> : <Image style={{ height: 40, width: 40, backgroundColor: "transparent", marginRight: 10 }} source={require('../Icons/flash_off.png')} />}
              </TouchableOpacity>
            </ZoomView>
          </RNCamera>
        </View>
        <View style={{ height: height * 0.13, alignItems: 'center', marginTop: height * 0.02 }} >
          <FlatList
            data={this.state.gallery}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'column', margin: 1, height: 80 }}>
                <TouchableOpacity
                  key={item.id}
                  style={{ flex: 1 }}
                  onPress={() => {
                    // setSelected(item.node.image.uri)
                    this.props.navigation.navigate('Preview', { 'img': item.node.image.uri, 'images': this.props.route.params ? this.props.route.params.images : [] });
                    console.log(item);
                  }}>
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
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('GalleryScreen', { 'images': this.props.route.params ? this.props.route.params.images : [] }) }} style={styles.capture, { flex: 1, alignItems: 'flex-start', marginLeft: width * 0.15, marginTop: 5 }}>
            <View>
              <Image style={{ height: 30, width: 30, backgroundColor: "transparent", marginLeft: 10, marginBottom: 6 }} source={require('../Icons/gallery.png')} />
              <Text style={{ fontFamily: 'NunitoSans-Regular' }}>Gallery</Text>
            </View>
          </TouchableOpacity>
          { !this.state.imagetaken ? <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture, { flex: 2, alignItems: 'center', marginTop: -10 }}>
            <Icon type="Entypo" name="circle" style={{ color: "grey", fontSize: 70 }} />
          </TouchableOpacity>
          :
          <Spinner color='blue' style={{justifyContent: 'center', marginBottom: 5}} />
          }
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('Home', {
              screen: 'Files',
            })
          }} style={styles.capture, { flex: 1, alignItems: 'flex-end', marginRight: width * 0.1, marginTop: 9 }}>
            <View>
              <Icon style={{ color: 'black', fontSize: 24, alignSelf:'center' }} type="AntDesign" name="file1" />
              <Text style={{ fontFamily: 'NunitoSans-Regular', marginTop: 6 }}>Collections</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  }

  takePicture = async () => {
    // console.log(this.state.gallery);
    this.setState({ ...this.state, imagetaken: true });
    if (this.camera) {
      const options = { quality: 0.5, base64: true, fixOrientation: true };
      const data = await this.camera.takePictureAsync(options);
      this.props.navigation.navigate('Preview', { 'img': data.uri, 'height': data.height, 'width': data.width, 'images': this.props.route.params ? this.props.route.params.images : [] });
      // console.log(data);

    }
    // console.log(this.props.route.params.images)
  };
  changeSide = async () => {
    // console.log("asd");
    if (this.camera) {
      this.setState({
        ...this.state,
        side: this.state.side == RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
      })
    }

  }

  changeFlash = async () => {
    console.log("asd");
    if (this.camera) {
      this.setState({
        ...this.state,
        flash: this.state.flash == RNCamera.Constants.FlashMode.torch ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.torch
      })
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    // width: width;
  },
  preview: {
    // flex: 1,
    height: height * 0.60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden'
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
    height: height * 0.1,
    width: height * 0.1,
  },
});
