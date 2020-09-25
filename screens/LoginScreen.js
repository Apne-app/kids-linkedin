/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import SpinnerButton from 'react-native-spinner-button';
import LoginForm from '../components/Login';
import SignUpForm from '../components/SignUp';
import axios from 'axios';
import LinkedIn from '../components/LinkedIn'
import { sha256 } from 'react-native-sha256';
import { SimpleAnimation } from 'react-native-simple-animations';
import dynamicLinks from '@react-native-firebase/dynamic-links';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const LoginScreen = ({ route, navigation }) => {
  const handleDynamicLink = link => {
    // Handle dynamic link inside your own application
    if (link.url === 'https://genio.app/verified') {
      // ...navigate to your offers screen
      navigation.navigate('Verified')
    }
  };
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the is component unmounted, remove the listener
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const check = async () => {
      var pro = await AsyncStorage.getItem('profile')
      if (pro !== null) {
        pro = JSON.parse(pro)
        axios.get('http://104.199.146.206:5000/login/' + pro.email + '/' + pro.pwd + '/none/')
          .then((response) => {
            if (response.data.verified == 'yes') {
              navigation.navigate('Home')
            }
            else if (response.data.verified == 'no') {
              navigation.navigate('Unverified')
            }
            else {
              // setscreen(response.data)
              // setLoading(false)
            }
          })
      }
      else {
        // console.log('helo')
      }
    }
    check()
  })
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
  const [everified, seteverified] = useState(false)
  const [pverified, setpverified] = useState(true)
  const [type, settype] = useState('email');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [screen, setscreen] = useState('Login/Signup using work mail-id');
  const [placeholder, setplaceholder] = useState('manoj@google.com');
  const api = () => {
    // setemail(email.split(' ')[0])
    // console.log(email)
    setLoading(true);
    if (type == 'email') {
      axios.get('http://104.199.146.206:5000/email/' + email.split(' ')[0] + '/')
        .then((response) => {
          setpverified(false)
          // console.log(response.data)
          const storeEmail = async () => {
            try {
              await AsyncStorage.setItem('email', email)
            } catch (e) {
              // saving error
            }
          }
          storeEmail()
          if (response.data === 'yes') {
            setscreen('Welcome back! Enter your password');
            setplaceholder('*********')
            settype('existing_password')
            setLoading(false)
          }
          else {
            setscreen("Hi there! You don't seem to have an account with us. Add a password to become a part of the family!");
            setplaceholder('*********')
            settype('new_password')
            setLoading(false)
          }
        })
    }
    else if (type == 'new_password') {
      sha256(password)
        .then((hash) => {
          axios.get('http://104.199.146.206:5000/signup/' + email.split(' ')[0] + '/' + hash + '/none/')
            .then((response) => {
              console.log(response.data)
              const storeProfile = async () => {
                try {
                  await AsyncStorage.setItem('profile', JSON.stringify(response.data))
                } catch (e) {
                  // saving error
                }
              }
              storeProfile()
              navigation.navigate('Unverified')
            })
        })

    }
    else {
      sha256(password)
        .then((hash) => {
          axios.get('http://104.199.146.206:5000/login/' + email.split(' ')[0] + '/' + hash + '/none/')
            .then((response) => {
              const storeProfile = async () => {
                try {
                  await AsyncStorage.setItem('profile', JSON.stringify(response.data))
                } catch (e) {
                  // saving error
                }
              }
              if (response.data.verified == 'yes') {
                storeProfile()
                navigation.navigate('Home')
              }
              else if (response.data.verified == 'no') {
                storeProfile()
                navigation.navigate('Unverified')
              }
              else {
                setscreen(response.data)
                setLoading(false)
              }
              // console.log(response.data)
            })
        })

    }
  }
  const checkemail = (text) => {
    text = text.split(' ')[0]
    if (text != '') {
      if (text.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
        if (text.includes('gmail.com')) { seteverified(false); return }
        if (text.includes('yahoo.co.in')) { seteverified(false); return }
        if (text.includes('yahoo.com')) { seteverified(false); return }
        if (text.includes('hotmail.com')) { seteverified(false); return }
        seteverified(true)
      }
      else {
        console.log('check')
        seteverified(false)
      }
    }
    else {
      console.log('check')
      seteverified(false)
    }
  }
  const checkpass = (text) => {
    if (text.length < 6) {
      setpverified(false)
    }
    else {
      setpverified(true)
    }
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* <Container style={styles.container}> */}
      <Content >
        <View style={{ flex: 1, marginBottom: 15, marginTop: 50, }}>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/link.png')}
          />
        </View>
        <View>
          <SimpleAnimation delay={500} duration={1000} fade staticType='zoom'>
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, textAlign: 'center', marginTop: 20, marginBottom: 20, padding: 10 }}>{screen}</Text>
          </SimpleAnimation>
          {type == 'email' ? <TextInput value={email} placeholderTextColor={'lightgrey'} textContentType={'emailAddress'} autoCompleteType={'email'} autoCapitalize={'none'} placeholder={placeholder} onChangeText={(text) => { setemail(text); checkemail(text); }} style={{ width: width - 40, borderRadius: 10, height: 60, backgroundColor: '#ededed', fontSize: 16, padding: 15, fontFamily: 'Poppins-Regular', borderColor: everified ? 'green' : 'orange', borderWidth: 0.5, alignSelf: 'center' }}></TextInput> :
            <TextInput value={password} placeholderTextColor={'lightgrey'} secureTextEntry={true} textContentType={'password'} placeholder={placeholder} autoCapitalize={'none'} onChangeText={(text) => { setpassword(text); checkpass(text) }} style={{ width: width - 40, borderRadius: 10, height: 60, backgroundColor: '#ededed', fontSize: 16, padding: 15, fontFamily: 'Poppins-Regular', borderColor: pverified ? 'green' : 'orange', borderWidth: 0.5, alignSelf: 'center' }}></TextInput>}
          <View style={{ alignSelf: 'center' }}>
            <SpinnerButton
              buttonStyle={{
                borderRadius: 10,
                margin: 20,
                width: 200,
                alignSelf: 'center',
                backgroundColor: everified ? (pverified ? 'lightgreen' : 'grey') : 'grey'
              }}
              isLoading={Loading}
              spinnerType='BarIndicator'
              onPress={() => {
                everified && pverified ? api() : null
              }}
              indicatorCount={10}
            >
              <Icon active type="Feather" name='chevron-right' style={{ color: 'black', fontWeight: 'bold' }} />
            </SpinnerButton>
          </View>
          <LinkedIn navigation={navigation} />
          <Button onPressIn={() => navigation.navigate('Home')} block dark style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 10, height: 60, width: width - 40, alignSelf: 'center', marginBottom: 40, marginHorizontal: 20 }}>
            <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 2 }}>Continue as Guest User</Text>
          </Button>
        </View>
      </Content>
      {/* </Container> */}
    </KeyboardAvoidingView>
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