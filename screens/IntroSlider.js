/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react';
import { View, SafeAreaView, Text, Image, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Icon, Button } from 'native-base'
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;


const data = [
  {
    title: 'Get Inspired',
    text: 'Check out what other kids are learning',
    image: require('../images/Welcome.png'),
    bg: '#59b2ab',
  },
  {
    title: 'Create',
    text: 'Upload what you have done',
    image: require('../images/Science.png'),
    bg: '#febe29',
  },
  {
    title: 'Get Feedback',
    text: "From kids around the world!",
    image: require('../images/Searching.png'),
    bg: '#22bcb5',
  },
];

var Item = typeof data[0];

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    width: width,
    height: height * 0.55,
    // marginVertical: 32,
  },
  text: {
    color: 'rgba(56, 56, 56, 0.8)',
    textAlign: 'center',
    fontSize: 16,
    width: 325,
    fontWeight: "normal",
    lineHeight: 26,
    fontFamily:'NunitoSans-SemiBold',
    marginTop: 20
  },
  title: {
    fontSize: 24,
    color: '#383838',
    marginTop: 20,
    width: 218,
    lineHeight: 33,
    textAlign: 'center',
    fontFamily:'NunitoSans-Bold'

  },
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagecontainer: {
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    // shadowRadius: 2,  
    elevation: 5
  }
});

export default class App extends React.Component {
  _renderItem = ({ item }: { item: Item }) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: "#fff",
          },
        ]}>
        <View style={styles.imagecontainer}>
          <Image source={item.image} style={styles.image} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  _keyExtractor = (item: Item) => item.title;

  _renderNextButton = () => {
    return (
      <Button onPress={async () => {
        this.props.navigation.navigate('Home', {
          screen: 'Post'
        });
        await AsyncStorage.setItem('status', '-1')
      }} block dark style={{ marginTop: 10, backgroundColor: '#327FEB', borderRadius: 30, height: 60, width: width * 0.86, alignSelf: 'center', marginBottom: 10 }}>
        <Text style={{ color: "#fff", fontFamily: 'NunitoSans-SemiBold', fontSize: 18, marginTop: 2 }}>Continue</Text>
      </Button>
    );
  };

  _renderDoneButton = () => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Login', { 'screen': 'IntroSlider' })} block dark style={{ backgroundColor: '#fff', borderRadius: 30, width: width * 0.86, alignSelf: 'center', marginBottom: 40, marginHorizontal: 20 }}>
        <Text style={{ color: "#000", fontFamily: 'NunitoSans-SemiBold', fontSize: 18, marginTop: 10, alignSelf: 'center', textDecorationLine: 'underline' }}>Sign up/Login</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" />
        <AppIntroSlider
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          renderSkipButton={this._renderDoneButton}
          renderPrevButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          renderDoneButton={this._renderNextButton}
          bottomButton={true}
          activeDotStyle={{ backgroundColor: "#327FEB", width:20 }}
          showSkipButton={true}
          showPrevButton={true}
          data={data}
        />
      </View>
    );
  }
}