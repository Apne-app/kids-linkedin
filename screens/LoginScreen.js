/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TextInput } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
import SpinnerButton from 'react-native-spinner-button';
import LoginForm from '../components/Login';
import SignUpForm from '../components/SignUp';
import axios from 'axios';
import LinkedIn from '../components/LinkedIn'
import { sha256 } from 'react-native-sha256';
import { SimpleAnimation } from 'react-native-simple-animations';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const LoginScreen = ({ route, navigation }) => {
  const fontConfig = {
    default: {
      regular: {
        fontFamily: 'Poppins-Regular',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'Poppins-Regular',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'Poppins-Regular',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'Poppins-Regular',
        fontWeight: 'normal',
      },
    },
  };

  const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
  };

  const [activeform, setActiveForm] = React.useState(1);

  const [login, setLogin] = React.useState({
    username: '',
    password: '',
    viewPass: false
  })
  const [Loading, setLoading] = useState(false)
  const [type, settype] = useState('email');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [screen, setscreen] = useState('Get started using work mail-id');
  const [placeholder, setplaceholder] = useState('manoj@google.com');
  const api = () => {
    if (type == 'email') {
      sha256(password)
        .then((hash) => {
          console.log(hash)
          axios.get('http://104.199.146.206:5000/signup/' + email + '/' + hash + '/none/')
            .then((response) => {
              console.log(response.data)
              if (response.data === 'User already exists') {
                setscreen('Welcome back! Enter your password');
                setplaceholder('*********')
                settype('password')
                setLoading(false)
              }
            })
        })
    }
  }
  return (
    <Container style={styles.container}>
      <Content >
        <View style={{ flex: 1, marginBottom: 15, marginTop: 50 }}>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/link.png')}
          />
        </View>
        <View>
          <SimpleAnimation delay={500} duration={1000} fade staticType='zoom'>
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, textAlign: 'center', marginTop: 20, marginBottom: 20 }}>{screen}</Text>
          </SimpleAnimation>
          {type=='email'?<TextInput value={email} placeholderTextColor={'grey'} textContentType={'emailAddress'} placeholder={placeholder} onChangeText={(text) => setemail(text)} style={{ width: width - 40, borderRadius: 10, height: 70, backgroundColor: '#ededed', fontSize: 20, padding: 10, fontFamily: 'Poppins-Regular', borderColor: 'green', borderWidth: 1 }}></TextInput>:
          <TextInput value={password} passwordRules={'required: upper; required: lower; required: digit; minlength: 8'} placeholderTextColor={'grey'} secureTextEntry={'true'} textContentType={'password'} placeholder={placeholder} onChangeText={(text) => setpassword(text)} style={{ width: width - 40, borderRadius: 10, height: 70, backgroundColor: '#ededed', fontSize: 20, padding: 10, fontFamily: 'Poppins-Regular', borderWidth: 1 }}></TextInput>}
          <View style={{ alignSelf: 'center' }}>
            <SpinnerButton
              buttonStyle={styles.buttonStyle}
              isLoading={Loading}
              spinnerType='BarIndicator'
              onPress={() => {
                setLoading(true); api()
              }}
              indicatorCount={10}
            >
              <Icon active type="Feather" name='chevron-right' />
              {/* <Text style={styles.buttonText}>Next</Text> */}
            </SpinnerButton>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
            <View style={{ borderWidth: 1, height: 1, flex: 1, borderColor: "rgba(56, 56, 56, 0.8);" }} />
            <Text style={{ flex: 1, textAlign: 'center', fontFamily:'Poppins-Regular' }} >Or</Text>
            <View style={{ borderWidth: 1, flex: 1, height: 1, borderColor: "rgba(56, 56, 56, 0.8);" }} />
          </View>
          <LinkedIn navigation={navigation} />
        </View>
        {/* <View style={{flexDirection:"row"}}>
         <Button transparent style={{flex: 2, flexDirection: 'column'}} onPress={() => setActiveForm(!activeform)}>
           <Text style={{textAlign: 'right', fontSize: 20, fontFamily:'Poppins-Regular', color:  activeform ?  "#000" : "#A9A9A9"}}>Login</Text>
           <View style={{borderWidth: 4, borderColor: "#357feb", borderRadius: 4, opacity: activeform ? 1 : 0}} />
         </Button>
         <Button transparent style={{flex: 2, flexDirection: 'column'}} onPress={() => setActiveForm(!activeform)}>
          <Text style={{textAlign: 'right', fontSize: 20, fontFamily:'Poppins-Regular', color:  !activeform ?  "#000" : "#A9A9A9"}}>Sign Up</Text>
           <View style={{borderWidth: 4, borderColor: "#357feb", borderRadius: 4, opacity: !activeform ? 1 : 0}} />
         </Button>
         <View style={{flex: 1}} />
         <View style={{flex: 1}} />
        </View> */}
        {/* {
          activeform ?
          <LoginForm navigation={navigation} />:
          <SignUpForm navigation={navigation} />
        } */}

      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    // marginTop: 40,
    backgroundColor: "#f9f9f9",
  },
  form: {
    marginTop: 40,
    flex: 1
    // alignSelf: 'center'
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  tinyLogo: {
    alignSelf: 'center',
    width: 100,
    height: 100
  },
  safeArea: {
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: 20,
  },
  buttonStyle: {
    borderRadius: 10,
    margin: 20,
    width: 100,
    alignSelf: 'center'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

export default LoginScreen;