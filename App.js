/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Container, Header, Content, Icon } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen'
import NotificationScreen from './screens/NotificationScreen'
import SearchScreen from './screens/SearchScreen'
import FeedScreen from './screens/FeedScreen'
import IntroScreen from './screens/IntroScreen'
import PostScreen from './screens/PostScreen'
import ServiceScreen from './screens/ServiceScreen'
import ProfileScreen from './screens/ProfileScreen'
import ImagePreview from './screens/ImagePreview'
import CameraScreen from './screens/CameraScreen'
import ChildScreen from './screens/ChildScreen'
import Gallery from './components/Gallery'
import SinglePostScreen from './screens/SinglePost'
import Searching from './screens/Searching'
import Unverified from './screens/Unverified'
import ChildSuccess from './screens/ChildSuccess'
import FileScreen from './screens/FileScreen'
import Upload from './components/Post';
import Verified from './screens/Verified'
import PostFolder from './components/PostFolder'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AnimatedTabBar, { TabsConfigsType } from 'curved-bottom-navigation-bar'
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';
const Stack = createStackNavigator();
const BottomNav = createBottomTabNavigator();
const DrawNav = createDrawerNavigator();
// console.disableYellowBox = true

  const tabs: TabsConfigsType ={
    Feed: {
      icon: () => <Icon style={{ color: "#000", fontSize: 20 }}  type="Feather" name="home" />
    },
    Search: {
      icon: () => <Icon style={{ color: '#000', fontSize: 20 }} type="Feather" name="search" />
    },
    Post: {
      icon: ({ progress }) => <Icon style={{ color: '#000', fontSize: 20, }} type="AntDesign" name="scan1" />
    },
    Files: {
      icon: ({ progress }) => <Icon style={{ color: '#000', fontSize: 20, }} type="AntDesign" name="file1" />
    },
    Notifications: {
      icon: () => <Icon style={{ color: '#000', fontSize: 20 }} type="Feather" name="bell" />
    },
    Profile: {
      icon: () => <Icon style={{ color: '#000', fontSize: 20 }} type="Feather" name="user" />
    }
  }

function Bottom(props) {

  // console.log(props.route.params);

  React.useEffect(() => {
    SplashScreen.hide();
  }, [])


  return (
    <BottomNav.Navigator
      tabBar={props => (
        <AnimatedTabBar dotColor={"#357feb"} barColor={'white'} tabs={tabs} {...props} />
      )}
    // tabBarOptions={{ activeTintColor: 'purple', adaptive: true, allowFontScaling: true, }}
    >
      <BottomNav.Screen name="Feed" component={FeedScreen} />
      <BottomNav.Screen name="Search" component={SearchScreen} />
      <BottomNav.Screen name="Post" component={Upload} />
      <BottomNav.Screen name="Notifications" component={NotificationScreen} />
      <BottomNav.Screen name="Files" component={FileScreen} />
      <BottomNav.Screen name="Profile" component={ProfileScreen} />

      {/* <BottomNav.Screen name="Scan" component={PostFolder} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: 'black', fontSize: size }} type="AntDesign" name="scan1" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10, marginTop: -5 }}>Scan</Text>) }} /> */}
    </BottomNav.Navigator>
  )
}
// function Drawer({route}) {

//   // console.log(route);

//   return (
//     <DrawNav.Navigator drawerPosition={"right"} initialRouteName="Home" >
//       <DrawNav.Screen  options={{drawerIcon:({ focused, size }) => (<Icon style={{ color: 'black', fontSize: size}} type="Feather" name="home" />), drawerLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 17, marginLeft:-20}}>Home</Text>) }} name="Home" component={Bottom} />
//       <DrawNav.Screen options={{drawerIcon:({ focused, size }) => (<Icon style={{ color: 'black', fontSize: size}} type="Feather" name="user" />), drawerLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 17, marginLeft:-20}}>Profile</Text>) }} name="Profile" component={ProfileScreen} />
//       <DrawNav.Screen options={{drawerIcon:({ focused, size }) => (<Icon style={{ color: 'black', fontSize: size}} type="Feather" name="settings" />), drawerLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 17, marginLeft:-20}}>Settings</Text>) }} name="Settings" component={Bottom} />
//       {/* <DrawNav.Screen name="Tickets" component={Tickets} />
//       <DrawNav.Screen name="Shipping" component={Shipping} /> */}
//     </DrawNav.Navigator>
//   )
// }
const App = () => {

  const containerRef = React.useRef();
  const [init, setinit] = useState('Login')
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link.url === 'https://genio.app/verified') {
          setinit('Verified')
        }
      })
      .catch(() => {
        // console.log('do nothing')
      }
      )
  }, []);
  // setInitialNavigationState(await getInitialState());

  return (
    <NavigationContainer ref={containerRef}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#357feb"
      />
      <Stack.Navigator initialRouteName={init}>
        <Stack.Screen options={{ headerShown: false }} name="Child" component={ChildScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Searching" component={Searching} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Verified" component={Verified} />
        <Stack.Screen options={{ headerShown: false }} name="Unverified" component={Unverified} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={Bottom} />
        <Stack.Screen options={{ headerShown: false }} name="Preview" component={ImagePreview} />
        <Stack.Screen options={{ headerShown: false }} name="SinglePost" component={SinglePostScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Intro" component={IntroScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Camera" component={CameraScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Gallery" component={Gallery} />
        <Stack.Screen options={{ headerShown: false }} name="ChildSuccess" component={ChildSuccess} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
