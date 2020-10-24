import React from 'react';
import {View, SafeAreaView, Text, Image, StyleSheet, TouchableOpacity, StatusBar, Dimensions} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import {Icon, Button} from 'native-base'
import AppIntroSlider from 'react-native-app-intro-slider';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;


const data = [
  {
    title: 'We connect kids ',
    text: 'Description. Say something cool ',
    image: require('../assets/intro.png'),
    bg: '#59b2ab',
  },
  {
    title: 'Title 2',
    text: 'Other cool stuff ',
    image: require('../assets/intro.png'),
    bg: '#febe29',
  },
  {
    title: 'Rocket guy',
    text: "I'm already out of descriptions. Lorem ipsum bla bla bla ",
    image: require('../assets/intro.png'),
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
    height: height*0.55,
    // marginVertical: 32,
  },
  text: {
    color: 'rgba(56, 56, 56, 0.8)',
    textAlign: 'center',
    fontSize: 16,
    width: 325,
    fontWeight: "normal",
    lineHeight: 26,
    marginTop: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: '#383838',
    marginTop: 20,
    width: 218,
    lineHeight: 33,
    textAlign: 'center',
    
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
  _renderItem = ({item}: {item: Item}) => {
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
      <Button onPress={() => {
          this.props.navigation.navigate('Home', {
            screen: 'Post'
          })
      }} block dark style={{ marginTop: 10, backgroundColor: '#357feb', borderRadius: 30, height: 60, width: width*0.86, alignSelf: 'center', marginBottom: 10}}>
        <Text style={{ color: "#fff", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 2 }}>Continue</Text>
      </Button>
    );
  };

  _renderDoneButton = () => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} block dark style={{ backgroundColor: '#fff', borderRadius: 30, width: width*0.86, alignSelf: 'center', marginBottom: 40, marginHorizontal: 20 }}>
        <Text style={{ color: "#000", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 2, alignSelf: 'center', textDecorationLine: 'underline' }}>Login</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar translucent backgroundColor="transparent" />
        <AppIntroSlider
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          renderSkipButton={this._renderDoneButton}
          renderPrevButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          renderDoneButton={this._renderNextButton}
          bottomButton={true}
          activeDotStyle={{backgroundColor: "#357feb"}}
          showSkipButton={true}
        //   showDoneButton={f}
          showPrevButton={true}
          data={data}
        />
      </View>
    );
  }
}