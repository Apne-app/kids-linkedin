import React, { Component }  from 'react'; 
import { Animated, Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, FlatList, PixelRatio } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer, Body, Title, Right, Textarea } from 'native-base';
import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import analytics from '@segment/analytics-react-native';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

class PostScreenNavig extends Component {

  constructor(props) {
    super(props);
    this.sheetRef = React.createRef(null);
    this.state = { scan: 1, save: 1, feedback: 1, active: 1, visible: false }
  }

  componentDidMount() {

    this.focusListener = this.props.navigation.addListener("focus", async () => {

      const x = await AsyncStorage.getItem('camerastatus');
      // await AsyncStorage.removeItem('camerastatus')
      if(x == "3")
      {
        setTimeout(() => {
          
          this.props.navigation.navigate("Camera")
        }, 10)
      }
      else
      {
        var y = await AsyncStorage.getItem('children');
        // console.log(JSON.parse(y)["0"]["id"]);
        analytics.screen('CameraIntro', {
          userID: y ? JSON.parse(y)["0"]["id"] : null,
          deviceID: getUniqueId()
        })
        this.setState({
          ...this.state,
          visible: true
        })
        
      }
      
      // setTimeout(() => {
        
      //   this.props.navigation.navigate("Camera")
      // }, 10)
    }
    );
    this.timeout = setInterval(() => {

        if(this.state.active == 1)
        {
          this.setState({
            ...this.state,
            active: 2
          })
        }
        else if(this.state.active == 2)
        {
          this.setState({
            ...this.state,
            active: 3 
          })
        }
        else if(this.state.active == 3)
        {
          this.setState({
            ...this.state,
            active: 1 
          })
        }
    }, 2000);  
  }
  

  // componentDidMount() {
   
  //   this.timeout = setInterval(() => {

  //       if(this.state.active == 1)
  //       {
  //         this.setState({
  //           ...this.state,
  //           active: 2
  //         })
  //       }
  //       else if(this.state.active == 2)
  //       {
  //         this.setState({
  //           ...this.state,
  //           active: 3 
  //         })
  //       }
  //       else if(this.state.active == 3)
  //       {
  //         this.setState({
  //           ...this.state,
  //           active: 1 
  //         })
  //       }
  //   }, 3000);
  // }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }


  render() {

    const renderContent = () => (
        <View
            style={{
                backgroundColor: 'white',
                padding: 16,
                height: 400,
                elevation: 20,
            }}
        >
            <TouchableOpacity style={{ alignItems: 'center', paddingBottom: 10 }}>
                <View style={{ backgroundColor: 'lightgrey', borderRadius: 20, width: 60, height: 5, marginTop: -4 }}></View>
            </TouchableOpacity>
            <View style={{margin: 10, backgroundColor: '#eef9ff', height: '62%', borderRadius: 10, alignItems: 'center'}}>
            <Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 15, marginVertical: 10}}></Text>
            <Animated.Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 17, lineHeight: 20, marginVertical: 10, display: this.state.active == 1 ? 'flex' : 'none', opacity: this.state.scan}}>📷 Scan</Animated.Text>
            <Animated.Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 17, lineHeight: 20, marginVertical: 10, display: this.state.active == 2 ? 'flex' : 'none', opacity: this.state.save}}>🎞️ Save to your collection</Animated.Text>
            <Animated.Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 15, lineHeight: 20, marginVertical: 10, display: this.state.active == 3 ? 'flex' : 'none', opacity: this.state.feedback}}>👥 Get feedback from parents and teachers</Animated.Text>
            <Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 15, marginVertical: 10}}></Text>
            <Button onPress={async () => {
                AsyncStorage.setItem('camerastatus', "3");
                var x = await AsyncStorage.getItem('children');
                this.setState({
                  ...this.state,
                  visible: false
                })
                analytics.track('Go Button Pressed in CameraIntro', {
                  userID: x ? JSON.parse(x)["0"]["id"] : null,
                  deviceID: getUniqueId()
                })
                this.props.navigation.navigate("Camera")
            }} block dark style={{ marginTop: 10, backgroundColor: '#327FEB', borderRadius: 30, height: 60, width: width * 0.72, alignSelf: 'center', marginBottom: 10 }}>
                <Text style={{ color: "#fff", fontFamily: 'NunitoSans-SemiBold', fontSize: 25, marginTop: 2 }}>Go</Text>
            </Button>
            </View>
        </View>
    );

    // setInterval(() => {   
      
        

    //     // Animated.timing(
    //     //   this.state.scan,           
    //     //   {
    //     //     toValue: this.state.active == 1 ? 1 : 0,                   
    //     //     duration: 100,              
    //     //   }
    //     // ).start();
    //     // Animated.timing(
    //     //   this.state.save,           
    //     //   {
    //     //     toValue: this.state.scan == 2 ? 1 : 0,                   
    //     //     duration: 100,              
    //     //   }
    //     // ).start();
    //     // Animated.timing(
    //     //   this.state.feedback,           
    //     //   {
    //     //     toValue: this.state.scan == 3 ? 1 : 0,                   
    //     //     duration: 100,              
    //     //   }
    //     // ).start();                        
    // }, 3000);
    if(this.state.visible)
    {
      
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <View style={{height: height*0.5, alignItems: 'center'}}>
        <Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 20, marginVertical: 10, color: '#fff'}}>Hello 👋</Text>
        <Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 28, marginVertical: 5, color: '#fff'}}>What has your kid</Text>
        <Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 28, marginVertical: 5, color: '#fff'}}>done today?</Text>
        <Button onPress={async () => {
          AsyncStorage.setItem('camerastatus', "3");
          var x = await AsyncStorage.getItem('children');
          this.setState({
            ...this.state,
            visible: false
          })
          analytics.track('Scan and Save pressed CameraIntro', {
            userID: x ? JSON.parse(x)["0"]["id"] : null,
            deviceID: getUniqueId()
          })
          this.props.navigation.navigate("Camera");
        }} block dark style={{ marginTop: 10, backgroundColor: '#000', borderRadius: 40, height: 70, width: width * 0.42, alignSelf: 'center', marginBottom: 10, borderWidth: 6, borderColor: '#45b3ff' }}>
        <Text style={{ color: "#000", fontFamily: 'NunitoSans-Bold',borderRadius: 40, fontSize: 18,  height: 53, width: width*0.38, backgroundColor: '#fff', textAlign: 'center', paddingTop: 12 }}>Scan and Save</Text>
        </Button>
        </View>
        <BottomSheet
        ref={this.sheetRef}
        snapPoints={[height*0.5, -50]}
        initialSnap={0}
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
        </View>
        );
      }
      else
      {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }} />
        )
      }
      }
    }
    
    export default PostScreenNavig;