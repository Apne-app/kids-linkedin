/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Icon } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen'
import NotificationScreen from './screens/NotificationScreen'
import SearchScreen from './screens/SearchScreen'
import FeedScreen from './screens/FeedScreen'
import IntroScreen from './screens/IntroScreen'
import IntroSlider from './screens/IntroSlider'
import PostScreen from './screens/PostScreen'
import ServiceScreen from './screens/ServiceScreen'
import ProfileScreen from './screens/ProfileScreen'
import ImagePreview from './screens/ImagePreview'
import Camera from './components/Camera'
import ChildScreen from './screens/ChildScreen'
import Gallery from './components/Gallery'
import SinglePostScreen from './screens/SinglePost'
import Searching from './screens/Searching'
import AddText from './screens/AddText'
import Unverified from './screens/Unverified'
import ChildSuccess from './screens/ChildSuccess'
import FileScreen from './screens/FileScreen'
import Settings from './screens/Settings'
import Upload from './components/Post';
import Verified from './screens/Verified'
import PostScreenNavig from './screens/PostScreenNavig'
import PostFolder from './components/PostFolder'
import Comments from './screens/CommentScreen'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AnimatedTabBar, { TabsConfigsType } from 'curved-bottom-navigation-bar'
import messaging from '@react-native-firebase/messaging';
import IndProfile from './screens/IndProfile';
import GalleryScreen from './screens/GalleryScreen';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@segment/analytics-react-native'
import codePush from "react-native-code-push";


const Stack = createStackNavigator();
const BottomNav = createBottomTabNavigator();
const DrawNav = createDrawerNavigator();
// console.disableYellowBox = true

// function Drawer({route}) {

//   // console.log(route);

//   return (
//     <DrawNav.Navigator drawerPosition={"right"} initialRouteName="Home" >
//       <DrawNav.Screen  options={{drawerIcon:({ focused, size }) => (<Icon style={{ color: '#327FEB', fontSize: size}} type="Feather" name="home" />), drawerLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'NunitoSans-Regular', color: color, fontSize: 17, marginLeft:-20}}>Home</Text>) }} name="Home" component={Bottom} />
//       <DrawNav.Screen options={{drawerIcon:({ focused, size }) => (<Icon style={{ color: '#327FEB', fontSize: size}} type="Feather" name="user" />), drawerLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'NunitoSans-Regular', color: color, fontSize: 17, marginLeft:-20}}>Profile</Text>) }} name="Profile" component={ProfileScreen} />
//       <DrawNav.Screen options={{drawerIcon:({ focused, size }) => (<Icon style={{ color: '#327FEB', fontSize: size}} type="Feather" name="settings" />), drawerLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'NunitoSans-Regular', color: color, fontSize: 17, marginLeft:-20}}>Settings</Text>) }} name="Settings" component={Bottom} />
//       {/* <DrawNav.Screen name="Tickets" component={Tickets} />
//       <DrawNav.Screen name="Shipping" component={Shipping} /> */}
//     </DrawNav.Navigator>
//   )
// }
const App = (props) => {
  React.useEffect(() => {
    console.log("aaa", props);
  }, [])
  useEffect(() => {
    StatusBar.setBarStyle('dark-content')
  })

  const containerRef = React.useRef();


  const tabs: TabsConfigsType = {
    Feed: {
      icon: () => <Icon style={{ color: "#327FEB", fontSize: 24 }} type="Feather" name="home" />
    },
    Search: {
      icon: () => <Icon style={{ color: '#327FEB', fontSize: 24 }} type="Feather" name="search" />
    },
    Post: {
      icon: ({ progress }) => <Icon onPress={() => console.log('navigate')} style={{ color: '#327FEB', fontSize: 24, }} type="AntDesign" name="scan1" />
    },
    Files: {
      icon: ({ progress }) => <Icon style={{ color: '#327FEB', fontSize: 24, }} type="AntDesign" name="file1" />
    },
    Notifications: {
      icon: () => <Icon style={{ color: '#327FEB', fontSize: 24 }} type="Feather" name="bell" />
    },
    Profile: {
      icon: () => <Icon style={{ color: '#327FEB', fontSize: 24 }} type="Feather" name="user" />
    }
  }

  function Bottom(props) {

    // console.log(props.route.params);
    React.useEffect(() => {
      SplashScreen.hide();
    }, [])
    SplashScreen.hide();

    return (
      <BottomNav.Navigator
        // tabBar={props => (
        //   <AnimatedTabBar dotColor={"#327FEB"} barColor={'white'} tabs={tabs} {...props} />
        // )} 
        tabBarOptions={{
          activeTintColor: 'purple', adaptive: true, allowFontScaling: true, style: {
            height: 65, borderWidth: 0.5,
            borderBottomWidth: 1,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderColor: 'transparent',
            elevation: 20
          }
        }}
      >
        <BottomNav.Screen name="Feed" component={FeedScreen} options={{ tabBarLabel: '', tabBarIcon: ({ focused }) => focused ? <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: "#327FEB", fontSize: 24 }} type="Feather" name="home" /><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 13, color: "#327FEB", }}>Home</Text></View> : <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: "grey", fontSize: 24 }} type="Feather" name="home" /><Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 13, color: "grey", }}>Home</Text></View> }} />
        <BottomNav.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: '', tabBarIcon: ({ focused }) => focused ? <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: '#327FEB', fontSize: 24, marginRight: 2 }} type="Feather" name="search" /><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 13, color: "#327FEB", }}>Search</Text></View> : <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: 'grey', fontSize: 24, marginRight: 2 }} type="Feather" name="search" /><Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 13, color: "grey", }}>Search</Text></View> }} />
        <BottomNav.Screen name="Post" style={{ backgroundColor: 'transparent' }} component={PostScreenNavig} options={{ tabBarLabel: '', tabBarButton: props => <TouchableOpacity {...props} style={{bottom: 30, backgroundColor:'transparent'}} ><LinearGradient locations={[0.9, 1]} colors={['transparent', '#f5f5f5']} style={{ borderRadius: 10000 }}><Icon name={'camera'} type="Feather" style={{ backgroundColor: '#327FEB', borderRadius: 10000, color: 'white', width: 65, height: 65, fontSize: 25, padding: 20.5, marginBottom: 4 }} /></LinearGradient></TouchableOpacity> }} />
        <BottomNav.Screen name="Files" component={FileScreen} options={{ tabBarLabel: '', tabBarIcon: ({ focused }) => focused ? <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: '#327FEB', fontSize: 24 }} type="AntDesign" name="file1" /><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 13, color: "#327FEB", }}>Collections</Text></View> : <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: 'grey', fontSize: 24 }} type="AntDesign" name="file1" /><Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 13, color: "grey", }}>Collections</Text></View> }} />
        <BottomNav.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: '', tabBarIcon: ({ focused }) => focused ? <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: '#327FEB', fontSize: 24 }} type="Feather" name="user" /><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 13, color: "#327FEB", }}>Profile</Text></View> : <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: 'grey', fontSize: 24 }} type="Feather" name="user" /><Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 13, color: "grey", }}>Profile</Text></View> }} />
        {/* <BottomNav.Screen name="Scan" component={PostFolder} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: '#327FEB', fontSize: size }} type="AntDesign" name="scan1" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'NunitoSans-Regular', color: color, fontSize: 10, marginTop: -5 }}>Scan</Text>) }} /> */}
      </BottomNav.Navigator>
    )
  }



  const [init, setinit] = useState('Login')
  useEffect(() => {

    const send = async () => {
      var x = await AsyncStorage.getItem('status');
      // console.log(x);
      if (x) {
        if (x == '2') {
          containerRef.current?.navigate('Child')
          setinit('Child')
        }
        if (x == '-1') {
          containerRef.current?.navigate('Home')
          setinit('Home')
        }
        if (x == '3') {
          containerRef.current?.navigate('Home')
          setinit('Home')
        }
      }
      SplashScreen.hide();
    }
    send();
  }, [])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);




  useEffect(() => {

    const segmentInitialize = async () => {
      await analytics.setup('A43k9qNF1Cof0lLE4DeTil5iMfSxCiap', {
        // Record screen views automatically!
        recordScreenViews: true,
        // Record certain application events automatically!
        trackAppLifecycleEvents: true
      })
    }
    segmentInitialize();

    dynamicLinks()
      .getInitialLink()
      .then(async (link) => {
        console.log(link)
        var pro = await AsyncStorage.getItem('profile')
        pro = JSON.parse(pro)
        console.log(pro, link, link.url.includes(pro.uuid))
        if (link.url.includes(pro.uuid)) {
          containerRef.current?.navigate('Verified')
          setinit('Verified')
        }
        else {
          containerRef.current?.navigate('Unverified')
        }
      })
      .catch(() => {
        // console.log('do nothing')
        SplashScreen.hide();
      }
      )
  }, []);
  // setInitialNavigationState(await getInitialState());
  return (
    <NavigationContainer ref={containerRef}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#327FEB"
      />
      <Stack.Navigator initialRouteName={'IntroSlider'}>
        <Stack.Screen options={{ headerShown: false }} name="Child" component={ChildScreen} />
        <Stack.Screen options={{ headerShown: false }} name="GalleryScreen" component={GalleryScreen} />
        <Stack.Screen options={{ headerShown: false }} name="IndProf" component={IndProfile} />
        <Stack.Screen options={{ headerShown: false }} name="Searching" component={Searching} />
        <Stack.Screen options={{ headerShown: false, gestureDirection: 'vertical', transitionSpec: { open: { animation: 'timing', config: { duration: 700 } }, close: { animation: 'timing', config: { duration: 700 } } } }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Verified" component={Verified} />
        <Stack.Screen options={{ headerShown: false }} name="Unverified" component={Unverified} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={Bottom} />
        <Stack.Screen options={{ headerShown: false }} name="Preview" component={ImagePreview} />
        <Stack.Screen options={{ headerShown: false }} name="SinglePost" component={SinglePostScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Intro" component={IntroScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Camera" component={Camera} />
        <Stack.Screen options={{ headerShown: false }} name="CreatePost" component={PostScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Gallery" component={Gallery} />
        <Stack.Screen options={{ headerShown: false }} name="AddText" component={AddText} />
        <Stack.Screen options={{ headerShown: false }} name="PostScreen" component={Upload} />
        <Stack.Screen options={{ headerShown: false }} name="ChildSuccess" component={ChildSuccess} />
        <Stack.Screen options={{ headerShown: false }} name="IntroSlider" component={IntroSlider} />
        <Stack.Screen options={{ headerShown: false }} name="Settings" component={Settings} />
        <Stack.Screen options={{ headerShown: false }} name="Comments" component={Comments} />
        <Stack.Screen options={{ headerShown: false }} name="Notifications" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default codePush(App);
