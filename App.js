/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react';
import { View, Text } from 'react-native';
import { Container, Header, Content, Icon } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignupScreen from './screens/SignupScreen'
import LoginScreen from './screens/LoginScreen'
import NotificationScreen from './screens/NotificationScreen'
import SearchScreen from './screens/SearchScreen'
import FeedScreen from './screens/FeedScreen'
import IntroScreen from './screens/IntroScreen'
import PostScreen from './screens/PostScreen'
import ServiceScreen from './screens/ServiceScreen'


const Stack = createStackNavigator();
const BottomNav = createBottomTabNavigator();
const DrawNav = createDrawerNavigator();
function Bottom() {
  return (
    <BottomNav.Navigator tabBarOptions={{ activeTintColor: 'purple', adaptive: true, allowFontScaling: true }}>
      <BottomNav.Screen name="Feed" component={FeedScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size }} type="Feather" name="home" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10, marginTop: -5 }}>Home</Text>) }} />
      <BottomNav.Screen name="Search" component={SearchScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size }} type="Feather" name="search" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10, marginTop: -5 }}>Search</Text>) }} />
      <BottomNav.Screen name="Post" component={PostScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: '#357feb', fontSize: size + 25, marginBottom: 15 }} type="AntDesign" name="pluscircle" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10 }}></Text>) }} />
      <BottomNav.Screen name="Services" component={ServiceScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size }} type="Feather" name="briefcase" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10, marginTop: -5 }}>Services</Text>) }} />
      <BottomNav.Screen name="Notifications" component={NotificationScreen} options={{ tabBarIcon: ({ focused, size }) => (<Icon style={{ color: focused ? 'purple' : 'black', fontSize: size }} type="Feather" name="bell" />), tabBarLabel: ({ focused, color }) => (<Text style={{ fontFamily: 'Poppins-Regular', color: color, fontSize: 10, marginTop: -5 }}>Notifications</Text>) }} />
    </BottomNav.Navigator>
  )
}
function Drawer() {
  return (
    <DrawNav.Navigator initialRouteName="Home" >
      <DrawNav.Screen name="Home" component={Bottom} />
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
      <Stack.Screen options={{ headerShown: false }} name="Intro" component={IntroScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Home" component={Drawer} />
      <Stack.Screen options={{ headerShown: false }} name="Signup" component={SignupScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
