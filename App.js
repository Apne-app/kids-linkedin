/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();

import SignupScreen from './screens/SignupScreen'
import LoginScreen from './screens/LoginScreen'
import NotificationScreen from './screens/NotificationScreen'
import SearchScreen from './screens/SearchScreen'

const App: () => React$Node = () => {

  const containerRef = React.useRef();

  // setInitialNavigationState(await getInitialState());

  return (
    <NavigationContainer ref={containerRef} >
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Search" component={SearchScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Notifications" component={NotificationScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Sign Up" component={SignupScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
