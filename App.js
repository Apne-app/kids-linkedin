/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Icon } from 'native-base';
import AuthContext from './Context/Data';
import { NavigationContainer } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen'
import NotificationScreen from './screens/NotificationScreen'
import SearchScreen from './screens/SearchScreen'
import FeedScreen from './screens/FeedScreen'
import VideoFullScreen from './screens/VideoFullScreen'
import IntroScreen from './screens/IntroScreen'
import IntroSlider from './screens/IntroSlider'
import { TransitionPresets } from '@react-navigation/stack';
import PostScreen from './screens/PostScreen'
import ServiceScreen from './screens/ServiceScreen'
import ProfileScreen from './screens/ProfileScreen'
import ImagePreview from './screens/ImagePreview'
import Camera from './components/Camera'
import ChildScreen from './screens/ChildScreen'
import Browser from './screens/Browser'
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
import axios from 'axios';
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
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux';
import { store, persistor } from './Store/store';
const CleverTap = require('clevertap-react-native');

const Stack = createStackNavigator();
const BottomNav = createBottomTabNavigator();
const DrawNav = createDrawerNavigator();
import RectMoE from 'react-native-moengage'

console.ignoredYellowBox = ['Warning: Failed propType: SceneView'];

const App = (props) => {
  const notifierRef = useRef(null)
  const [loading, setloading] = useState(true)
  const [status, setstatus] = useState('')
  const [profile, setprofile] = useState({})
  const [children, setchildren] = useState({})
  const [joined, setjoined] = useState({})
  const [notifications, setnotifications] = useState({})
  var data = { children: children, status: status, profile: profile, joined: joined, notifications: notifications }
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


  function Bottom(props) {
    return (
      <BottomNav.Navigator
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
        <BottomNav.Screen initialParams={data} name="Feed" component={FeedScreen} options={{ tabBarLabel: '', tabBarIcon: ({ focused }) => focused ? <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon name="home" style={{ color: "#327feb", fontSize: 24 }} type="Feather" /><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 13, color: "#327FEB", }}>Home</Text></View> : <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: "grey", fontSize: 24 }} type="Feather" name="home" /><Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 13, color: "grey", }}>Home</Text></View> }} />
        <BottomNav.Screen initialParams={data} name="Search" component={SearchScreen} options={{ tabBarLabel: '', tabBarIcon: ({ focused }) => focused ? <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: '#327FEB', fontSize: 24, marginRight: 2 }} type="Feather" name="search" /><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 13, color: "#327FEB", }}>Search</Text></View> : <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: 'grey', fontSize: 24, marginRight: 2 }} type="Feather" name="search" /><Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 13, color: "grey", }}>Search</Text></View> }} />
        <BottomNav.Screen initialParams={data} name="Post" style={{ backgroundColor: 'transparent' }} component={PostScreenNavig} options={{ tabBarLabel: '', tabBarButton: props => <TouchableOpacity {...props} style={{ bottom: 30, backgroundColor: 'transparent' }} ><LinearGradient locations={[0.9, 1]} colors={['transparent', '#f5f5f5']} style={{ borderRadius: 10000 }}><Icon name={'camera'} type="Feather" style={{ backgroundColor: '#327FEB', borderRadius: 10000, color: 'white', width: 65, height: 65, fontSize: 25, padding: 20.5, marginBottom: 4 }} /></LinearGradient></TouchableOpacity> }} />
        <BottomNav.Screen initialParams={data} name="Files" component={FileScreen} options={{ tabBarLabel: '', tabBarIcon: ({ focused }) => focused ? <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: '#327FEB', fontSize: 24 }} type="Feather" name="film" /><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 13, color: "#327FEB", }}>Collections</Text></View> : <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: 'grey', fontSize: 24 }} type="Feather" name="film" /><Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 13, color: "grey", }}>Collections</Text></View> }} />
        <BottomNav.Screen initialParams={data} name="Profile" component={ProfileScreen} options={{ tabBarLabel: '', tabBarIcon: ({ focused }) => focused ? <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: '#327FEB', fontSize: 24 }} type="Feather" name="user" /><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 13, color: "#327FEB", }}>Profile</Text></View> : <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: -14 }}><Icon style={{ color: 'grey', fontSize: 24 }} type="Feather" name="user" /><Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 13, color: "grey", }}>Profile</Text></View> }} />
      </BottomNav.Navigator>
    )
  }


  // useEffect(() => {
  //   CleverTap.recordEvent('App Opened');

  //   const send = async () => {
  //     var x = await AsyncStorage.getItem('status');
  //     if (x) {
  //       if (x == '2') {
  //         containerRef.current?.navigate('Child')
  //         setinit('Child')
  //       }
  //       if (x == '-1') {
  //         containerRef.current?.navigate('Home')
  //         setinit('Home')
  //       }
  //       if (x == '3') {
  //         containerRef.current?.navigate('Home')
  //         setinit('Home')
  //       }
  //     }
  //   }
  //   send();
  // }, [])
  useEffect(() => {
    const data = async () => {
      var stat = await AsyncStorage.getItem('status');
      var profile1 = await AsyncStorage.getItem('profile');
      var notifications1 = await AsyncStorage.getItem('notifications');
      if (profile1) {
        profile1 = JSON.parse(profile1)
      }
      var children1 = await AsyncStorage.getItem('children');
      if (children1) {
        children1 = JSON.parse(children1)
      }
      if (notifications1) {
        notifications1 = JSON.parse(notifications1)
      }
      var data = JSON.stringify({ "username": "Shashwat", "password": "GenioKaPassword" });
      var config = {
        method: 'post',
        url: 'https://api.genio.app/dark-knight/getToken',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };
      var response = await axios(config)
      axios.get('https://api.genio.app/sherlock/recently/0' + `/?token=${response.data.token}`)
        .then(async (response) => {
          setjoined(response.data)
          setstatus(stat)
          setprofile(profile1)
          setchildren(children1)
          setnotifications(notifications1)
          setloading(false)
        })
        .catch((error) => {
          console.log(error)
          setstatus(stat)
          setprofile(profile1)
          setchildren(children1)
          setnotifications(notifications1)
          setloading(false)
        })
    }
    data()
  }, [])
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
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
            var children = JSON.parse(child)
            child = JSON.parse(child)
            var status = await AsyncStorage.getItem('status');
            const client = connect('9ecz2uw6ezt9', child['0']['data']['gsToken'], '96078');
            var user = client.feed('timeline', child['0']['id'] + 'id', child['0']['data']['gsToken']);
            var id = link.url
            const addreaction = (kind, activity, data, options) => {
              client.reactions.add(
                kind,
                activity,
                data,
                options,
              )
            }
            id = id.replace('https://link.genio.app/post?id=', '')
            user.get({ id_gte: id, limit: 1, enrich: true, reactions: { own: true, counts: true, recent: true }, })
              .then((data) => {
                console.log(data)
                containerRef.current?.navigate('SinglePost', {
                  id: status === '3' ? children['0']['id'] : '', name: status === '3' ? children['0']['data']['name'] : '', image: status === '3' ? children['0']['data']['image'] : '', activity: {
                    activity: data['results'][0], onAddReaction: addreaction
                  }, token: status === '3' ? children['0']['data']['gsToken'] : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.abIBuk2wSzfz5xFw_9q0YsAN-up4Aoq_ovDzMwx10HM'
                })
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
  StatusBar.setBackgroundColor('#1A71EB')
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);

  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  const sidewaysConfig = (route, navigation) => ({
    headerShown: false,
    gestureEnabled: true,
    cardOverlayEnabled: true,
    headerStatusBarHeight:
      navigation
        .dangerouslyGetState()
        .routes.findIndex((r) => r.key === route.key) > 0
        ? 0
        : undefined,
    ...TransitionPresets.SlideFromRightIOS,
  })
  useEffect(() => {
    const check = async () => {
      var st = await AsyncStorage.getItem('status')
      if (st == '3') {
        var pro = await AsyncStorage.getItem('profile')
        if (pro !== null) {
          pro = JSON.parse(pro)
          var data = JSON.stringify({ "username": "Shashwat", "password": "GenioKaPassword" });
          var config = {
            method: 'post',
            url: 'https://api.genio.app/get-out/getToken',
            headers: {
              'Content-Type': 'application/json'
            },
            data: data
          };

          axios(config)
            .then(function (response) {
              // console.log(JSON.stringify(response.data.token));
              axios({
                method: 'post',
                url: 'https://api.genio.app/matrix/getchild/' + `?token=${response.data.token}`,
                headers: {
                  'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                  "email": pro.email,
                })
              })
                .then(async (response) => {
                  setchildren(response.data)
                  await AsyncStorage.setItem('children', JSON.stringify(response.data))
                })
                .catch((error) => {
                })
            })
            .catch(function (error) {
            });
        }
      }
      else {
        // console.log('helo')
      }
    }
    check()
  }, [])
  const authContext = React.useMemo(
    () => ({
      Update: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        setstatus(data.status)
        setchildren(data.children)
        setprofile(data.profie)
      },
    }),
    []
  );
  if (loading) {
    return <View style={{ backgroundColor: '#327feb' }} />
  }
  else {
    SplashScreen.hide()
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer ref={containerRef}>
          <Stack.Navigator initialRouteName={!status ? 'IntroSlider' : status === '2' ? 'Child' : 'Home'}>
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="Child" component={ChildScreen} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="GalleryScreen" component={GalleryScreen} />
            <Stack.Screen initialParams={data} options={({ route, navigation }) => sidewaysConfig(route, navigation)} name="IndProf" component={IndProfile} />
            <Stack.Screen initialParams={data} options={({ route, navigation }) => sidewaysConfig(route, navigation)} name="Searching" component={Searching} />
            <Stack.Screen initialParams={data} options={{ headerShown: false, gestureDirection: 'vertical', transitionSpec: { open: { animation: 'timing', config: { duration: 600 } }, close: { animation: 'timing', config: { duration: 600 } } } }} name="Login" component={LoginScreen} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="Verified" component={Verified} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="Unverified" component={Unverified} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="Home" component={Bottom} />
            <Stack.Screen initialParams={data} options={({ route, navigation }) => sidewaysConfig(route, navigation)} name="Preview" component={ImagePreview} />
            <Stack.Screen initialParams={data} options={({ route, navigation }) => sidewaysConfig(route, navigation)} name="SinglePost" component={SinglePostScreen} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="Intro" component={IntroScreen} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="Camera" component={Camera} />
            <Stack.Screen initialParams={data} options={({ route, navigation }) => sidewaysConfig(route, navigation)} name="CreatePost" component={PostScreen} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="Gallery" component={Gallery} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="AddText" component={AddText} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="PostScreen" component={Upload} />
            <Stack.Screen initialParams={data} options={({ route, navigation }) => sidewaysConfig(route, navigation)} name="Browser" component={Browser} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="ChildSuccess" component={ChildSuccess} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="IntroSlider" component={IntroSlider} />
            <Stack.Screen initialParams={data} options={({ route, navigation }) => sidewaysConfig(route, navigation)} name="Settings" component={Settings} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="Comments" component={Comments} />
            <Stack.Screen initialParams={data} options={({ route, navigation }) => sidewaysConfig(route, navigation)} name="Notifications" component={NotificationScreen} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="KidUser" component={KidUser} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="KidsAge" component={KidsAge} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="Includes" component={Includes} />
            <Stack.Screen initialParams={data} options={{ headerShown: false }} name="VideoFull" component={VideoFullScreen} />
          </Stack.Navigator>
          <NotifierRoot ref={notifierRef} />
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
};

codePush.sync({
  updateDialog: true,
  installMode: codePush.InstallMode.IMMEDIATE
});
export default codePush(App);
