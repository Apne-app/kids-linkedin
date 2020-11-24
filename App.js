/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
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
import Includes from './Modules/Includes';
import GalleryScreen from './screens/GalleryScreen';
import KidUser from './screens/KidUser';
import KidsAge from './screens/KidsAge';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@segment/analytics-react-native'
import codePush from "react-native-code-push";
import { connect } from 'getstream';
import { NotifierRoot, Easing, Notifier } from 'react-native-notifier';
import firebase from '@react-native-firebase/app';
import OneSignal from 'react-native-onesignal';
const Stack = createStackNavigator();
const BottomNav = createBottomTabNavigator();
const DrawNav = createDrawerNavigator();
import RectMoE from 'react-native-moengage'

console.ignoredYellowBox = ['Warning: Failed propType: SceneView'];

const App = (props) => {
  const notifierRef = useRef(null)
  React.useEffect(() => {
    console.log("aaa", props);
  }, [])
  useEffect(() => {
    StatusBar.setBarStyle('dark-content')
  })
  const onReceived = (notification) => {
    console.log("Notification received: ", notification);
  }

  const onOpened = (openResult) => {
    containerRef.current?.navigate(openResult.notification.payload.additionalData.screen)
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  const onIds = (device) => {
    // console.log('Device info: ', device);
  }
  useEffect(() => {
    //Remove this method to stop OneSignal Debugging 
    OneSignal.setLogLevel(6, 0);

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init("45264e11-664b-45ca-9181-9559110376f9", { kOSSettingsKeyAutoPrompt: false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption: 2 });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);
    []
  })
  useEffect(() => {
    const hello = () => {
      OneSignal.removeEventListener('received', onReceived);
      OneSignal.removeEventListener('opened', onOpened);
      OneSignal.removeEventListener('ids', onIds);
    }
    return (
      hello
    )
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
    // React.useEffect(() => {
    //   SplashScreen.hide();
    // }, [])
    // SplashScreen.hide();

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
        <BottomNav.Screen name="Post" style={{ backgroundColor: 'transparent' }} component={PostScreenNavig} options={{ tabBarLabel: '', tabBarButton: props => <TouchableOpacity {...props} style={{ bottom: 30, backgroundColor: 'transparent' }} ><LinearGradient locations={[0.9, 1]} colors={['transparent', '#f5f5f5']} style={{ borderRadius: 10000 }}><Icon name={'camera'} type="Feather" style={{ backgroundColor: '#327FEB', borderRadius: 10000, color: 'white', width: 65, height: 65, fontSize: 25, padding: 20.5, marginBottom: 4 }} /></LinearGradient></TouchableOpacity> }} />
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
      // alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // console.log(remoteMessage)
      // Notifier.showNotification({
      //   title: remoteMessage.notification.title,
      //   description: remoteMessage.notification.body,
      //   duration: 3000,
      //   showAnimationDuration: 800,
      //   showEasing: Easing.bounce,
      //   hideOnPress: true,
      // });
    });

    return unsubscribe;
  }, []);
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    alert('Message handled in the background!', remoteMessage.data);
  });



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
        var pro = await AsyncStorage.getItem('profile')
        pro = JSON.parse(pro)
        if (pro) {
          if (link.url.includes(pro.uuid)) {
            containerRef.current?.navigate('Verified')
            setinit('Verified')
          }
          else {
            if (link.url.includes('verify')) {
              containerRef.current?.navigate('Unverified')
            }
            if (link.url.includes('post')) {
              console.log(link)
              containerRef.current?.navigate('Home')
            }
          }
        }
        else {
          // containerRef.current?.navigate('Login', { screen: 'Home' })
        }
      })
      .catch(() => {
        // console.log('do nothing')
        SplashScreen.hide();
      }
      )
  }, []);
  // setInitialNavigationState(await getInitialState());
  const handleDynamicLink = async (link) => {
    var pro = await AsyncStorage.getItem('profile')
    pro = JSON.parse(pro)
    if (pro) {
      if (link.url.includes(pro.uuid)) {
        containerRef.current?.navigate('Verified')
        setinit('Verified')
      }
      else {
        if (link.url.includes('verify')) {
          containerRef.current?.navigate('Unverified')
        }
        if (link.url.includes('post')) {
          var child = await AsyncStorage.getItem('children')
          if (child) {
            child = JSON.parse(child)
            const client = connect('9ecz2uw6ezt9', child['0']['data']['gsToken'], '96078');
            var user = client.feed('timeline', child['0']['id'] + 'id');
            var id = link.url
            id = id.replace('https://link.genio.app/post?id=', '')
            user.getActivityDetail(id)
              .then((data) => {
                console.log(data)
                containerRef.current?.navigate('Home')
              })
              .catch((data) => {
                console.log(data)
                containerRef.current?.navigate('Home')
              })
          }
          else {
            containerRef.current?.navigate('Child')
          }
        }
      }
    }
    else {
      containerRef.current?.navigate('Login', { screen: 'Home' })
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);
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
        <Stack.Screen options={{ headerShown: false, gestureDirection: 'vertical', transitionSpec: { open: { animation: 'timing', config: { duration: 600 } }, close: { animation: 'timing', config: { duration: 600 } } } }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Verified" component={Verified} />
        <Stack.Screen options={{ headerShown: false }} name="Unverified" component={Unverified} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={Bottom} />
        <Stack.Screen options={{ headerShown: false }} name="Preview" component={ImagePreview} />
        <Stack.Screen options={{ headerShown: false, gestureDirection: 'horizontal', transitionSpec: { open: { animation: 'timing', config: { duration: 300 } }, close: { animation: 'timing', config: { duration: 300 } } } }} name="SinglePost" component={SinglePostScreen} />
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
        <Stack.Screen options={{ headerShown: false }} name="KidUser" component={KidUser} />
        <Stack.Screen options={{ headerShown: false }} name="KidsAge" component={KidsAge} />
        <Stack.Screen options={{ headerShown: false }} name="Includes" component={Includes} />
      </Stack.Navigator>
      <NotifierRoot ref={notifierRef} />
    </NavigationContainer>
  );
};

export default codePush(App);
