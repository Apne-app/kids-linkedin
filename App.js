/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react';
import { View, Text } from 'react-native';
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
<<<<<<< HEAD
import ScanScreen from './screens/ScanScreen'
=======
import SinglePostScreen from './screens/SinglePost'
>>>>>>> 201ee8708d79247eaa48794a565e9e5c068df185
const Stack = createStackNavigator();
const BottomNav = createBottomTabNavigator();
const DrawNav = createDrawerNavigator();
function Bottom() {
  return (
    <BottomNav.Navigator tabBarOptions={{ activeTintColor: 'purple', adaptive: true, allowFontScaling: true, }}>
      <BottomNav.Screen name="Feed" component={FeedScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size }} type="Feather" name="home" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10, marginTop: -5 }}>Home</Text>) }} />
      <BottomNav.Screen name="Search" component={SearchScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size }} type="Feather" name="search" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10, marginTop: -5 }}>Search</Text>) }} />
      <BottomNav.Screen name="Post" component={PostScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: '#357feb', fontSize: size + 15, marginBottom: -20 }} type="AntDesign" name="scan1" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10 }}></Text>) }} />
      <BottomNav.Screen name="Notifications" component={NotificationScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size }} type="Feather" name="bell" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10, marginTop: -5 }}>Notifications</Text>) }} />
      <BottomNav.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size }} type="Feather" name="user" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10, marginTop: -5 }}>Profile</Text>) }} />
      <BottomNav.Screen name="Scan" component={ScanScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size }} type="AntDesign" name="scan1" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10, marginTop: -5 }}>Scan</Text>) }} />
    </BottomNav.Navigator>
  )
}
function Drawer() {
  return (
    <DrawNav.Navigator drawerPosition={"right"} initialRouteName="Home" >
      <DrawNav.Screen options={{drawerIcon:({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size}} type="Feather" name="home" />), drawerLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 17, marginLeft:-20}}>Home</Text>) }} name="Home" component={Bottom} />
      <DrawNav.Screen options={{drawerIcon:({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size}} type="Feather" name="user" />), drawerLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 17, marginLeft:-20}}>Profile</Text>) }} name="Profile" component={ProfileScreen} />
      <DrawNav.Screen options={{drawerIcon:({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size}} type="Feather" name="settings" />), drawerLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 17, marginLeft:-20}}>Settings</Text>) }} name="Settings" component={Bottom} />
      {/* <DrawNav.Screen name="Tickets" component={Tickets} />
      <DrawNav.Screen name="Shipping" component={Shipping} /> */}
    </DrawNav.Navigator>
  )
}
const App = () => {

  const containerRef = React.useRef();

  // setInitialNavigationState(await getInitialState());

  return (
    <NavigationContainer ref={containerRef}>
      <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="Home" component={Drawer} />
      <Stack.Screen options={{ headerShown: false }} name="Preview" component={ImagePreview} />
      <Stack.Screen options={{ headerShown: false }} name="SinglePost" component={SinglePostScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Child" component={ChildScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Intro" component={IntroScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
