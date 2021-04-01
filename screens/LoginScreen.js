/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect, useRef } from 'react'; 
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, KeyboardAvoidingView, Keyboard, ScrollView, TextInput, TouchableOpacity, BackHandler } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider, } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, Spinner, H3, Icon, Button, Segment, Thumbnail, Title, Left, Body, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import SpinnerButton from 'react-native-spinner-button';
import LoginForm from '../components/Login';
import axios from 'axios';
import LinkedIn from '../components/LinkedIn'
import { useFocusEffect } from "@react-navigation/native";
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import PhoneInput from "react-native-phone-number-input";
import { sha256 } from 'react-native-sha256';
import { SimpleAnimation } from 'react-native-simple-animations';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { Snackbar } from 'react-native-paper';
import CompHeader from '../Modules/CompHeader'
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

function generateOTP() { 
          
  var digits = '0123456789'; 
  let OTP = ''; 
  for (let i = 0; i < 4; i++ ) { 
      OTP += digits[Math.floor(Math.random() * 10)]; 
  } 
  return OTP; 
} 


const LoginScreen = ({ route, navigation }) => {
  const handleDynamicLink = link => {
    // Handle dynamic link inside your own application
    if (link.url === 'https://genio.app/verified') {
      // ...navigate to your offers screen
      navigation.navigate('Verified')
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.pop()
        }
        else {
          navigation.navigate('Home')
        }
        return true
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);

    }, []));
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the is component unmounted, remove the listener
    return () => unsubscribe();
  }, []);
  const fontConfig = {
    default: {
      regular: {
        fontFamily: 'NunitoSans-Regular',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'NunitoSans-Regular',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'NunitoSans-Regular',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'NunitoSans-Regular',
        fontWeight: 'normal',
      },
    },
  };

  const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
    colors: {
      ...DefaultTheme.colors,
      primary: '#327FEB',
      accent: '#327FEB',
      underlineColor: 'transparent',
    },
    roundness: 28.5
  };

  const sendOTP = () => {
    const checkValid = phoneInput.current?.isValidNumber(phone);

    if(checkValid) {
      Keyboard.dismiss();
      setPhoneValid(true);
      setLoading(true);
      let otp = generateOTP();
      // console.log(otp);
      var config = {
        method: 'get',
        url: `https://fphzj2hy13.execute-api.ap-south-1.amazonaws.com/default/otpSender?phone=${phone.replace("+","")}&otp=${otp}`,
        headers: { }
      };
      // console.log(config)
      
      axios(config)
      .then(function (response) {
        setLoading(false);
        navigation.navigate('OTP', { otp: otp, phone: phone });
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        alert("OTP couldn't be sent, please try again.");
      });
    } 
    else {
      setPhoneValid(false);
    }
  }

  const [Loading, setLoading] = useState(false)
  const [email, setemail] = useState('');
  const [everified, seteverified] = useState(false);
  const [visible, setvisible] = useState(false);
  const [token, setToken] = useState('');
  const scrollcheck = useRef(null)
  const [loader, setLoader] = useState(false);
  const [phone, setPhone] = useState("");
  const [active, setActive] = useState("phone");
  const [phoneValid, setPhoneValid] = useState(true);
  const phoneInput = useRef(null);
  const input = useRef(null)
  useEffect(() => {

    axios.get('https://api.genio.app/get-out/loginheaders/')
    .then(loginheaders => {
      loginheaders = loginheaders.data;
      AsyncStorage.setItem('loginheaders', JSON.stringify(loginheaders));
    })

    const analyse = async () => {
      analytics.screen('Login Screen', {
        userID: null,
        deviceID: getUniqueId()
      })
    }
    analyse();

    var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });

    var config = {
      method: 'post',
      url: 'https://api.genio.app/dark-knight/getToken',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data.token));
        setToken(response.data.token)
      })
      .catch(function (error) {
        console.log(error);
      });

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollcheck.current.scrollToEnd({ animated: true })
      }
    );


    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);
  const api = async () => {
    // setemail(email.split(' ')[0])
    // console.log(email)
    analytics.track('Login Via Email', {
      userID: null,
      deviceID: getUniqueId()
    })
    setLoading(true);
    var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });

    var config = {
      method: 'post',
      url: 'https://api.genio.app/dark-knight/getToken',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        var t = `https://api.genio.app/get-out/login/?token=${response.data.token}`;
        axios({
          method: 'post',
          url: t,
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({ "email": email.split(' ')[0], "lnkdId": "default" })
        })
          .then(async (response) => {
            console.log(response.data)
            if((response.data.status && response.data.status != 'inactive') || ! response.data.status) {

              const storeProfile = async () => {
                try {
                  await AsyncStorage.setItem('profile', JSON.stringify(response.data))
                  //0 means no login
                  //1 means email sent
                  //2  means verified+no  child
                  /// 3 means child+verified
                  await AsyncStorage.setItem('status', '1')
                  
                  analytics.identify(String(response.data.id), {
                    email: response.data.email
                  })
                  
                  
                } catch (e) {
                  setLoading(false);
                  alert('There was an error, please try again')
                  console.log(e)
                }
              }
              storeProfile()
              axios.get('https://api.genio.app/shining/send2/' + response.data.uuid + '/' + response.data.email + '/')
              .then((response) => {
                console.log(response.data)
                if (response.data == 'wrong id!') {
                  setLoading(false);
                  alert('There was an error, please try again')
                }
                else {
                  setLoading(false);
                  navigation.navigate('Unverified', { screen: /*route.params.screen*/ 'Home' })
                }
              })
              .catch((response) => {
                console.log(response)
                setLoading(false);
                alert('There was an error, please try again')
              })
            }
            else {
              setLoading(false);
              alert('Your account is not verified yet. Kindly wait for the confirmation from our side.')
            }

          })
          .catch((error) => {
            console.log(error)
            setLoading(false);
            alert('There was an error, please try again')
          })
      }).catch((error) => {
        console.log(error)
        setLoading(false);
        alert('There was an error, please try again')
      })

  }
  const checkemail = (text) => {
    setvisible(false)
    text = text.split(' ')[0]
    if (text != '') {
      if (text.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
        // if (text.includes('gmail')) { seteverified(false); return }
        // if (text.includes('yahoo')) { seteverified(false); return }
        // if (text.includes('yahoo')) { seteverified(false); return }
        // if (text.includes('hotmail')) { seteverified(false); return }
        seteverified(true)
      }
      else {
        seteverified(false)
      }
    }
    else {
      seteverified(false)
    }
  }
  return (
    <ScrollView style={{minHeight: height, flex: 1}} ref={scrollcheck} keyboardShouldPersistTaps='handled' style={styles.container}>
      <CompHeader screen={'Login'}
       headerType={route.params.type}
       goback={() => {
        if (navigation.canGoBack()) {
          navigation.pop()
        }
        else {
          navigation.navigate('Home')
        }
      }} />
        {loader ? <Spinner color='blue' style={styles.loading} /> : null}
        <Content >
          <View style={{ flex: 1, marginTop: 30, }}>
            <Image
              style={styles.tinyLogo}
              source={require('../images/Logo.png')}
            />
          </View>
          <Text style={{ fontFamily: 'FingerPaint-Regular', color: "#327FEB", fontSize: 60, marginTop: -20, marginBottom: -50, textAlign: 'center' }}>Genio</Text>
          <View>
            <View style={{flexDirection: 'row', marginBottom: 20}}>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setActive('phone')}>
            <Text style={{ color: active == 'phone' ? "#000" : "grey", fontFamily: 'NunitoSans-SemiBold', fontSize: 22, paddingLeft: 30, marginBottom: 2, marginTop: 50 }}>Phone</Text>
            {active == 'phone' ? <View style={{height: 10, width: 10, borderRadius: 5, marginLeft: 30, backgroundColor: '#327feb'}} /> : null}
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setActive('email')}>
            <Text style={{ color: active != 'phone' ? "#000" : "grey", fontFamily: 'NunitoSans-SemiBold', fontSize: 22, paddingLeft: 30, marginBottom: 2, marginTop: 50 }}>Email</Text>
            {active == 'email' ? <View style={{height: 10, width: 10, borderRadius: 5, marginLeft: 30, backgroundColor: '#327feb'}} /> : null}
            </TouchableOpacity>
            </View>
            {active == 'phone' ? <KeyboardAvoidingView behavior={'padding'}>
            <PhoneInput
                ref={phoneInput}
                containerStyle={{display: 'flex', width: width - 40, borderRadius: 35, backgroundColor: 'white', fontSize: 16, paddingLeft: 10, shadowColor: '', fontFamily: 'NunitoSans-Regular', alignSelf: 'center', height: 75, elevation: 1, marginTop: 30}}
                textContainerStyle={{display: 'flex', width: width - 40, borderTopRightRadius: 35, borderBottomRightRadius: 35, backgroundColor: 'white', fontSize: 16,  shadowColor: '', fontFamily: 'NunitoSans-Regular', alignSelf: 'center', height: 75, elevation: 1}}
                defaultValue={phone}
                onFocus = {() => {
                  alert(phone.length);
                }}
                defaultCode="IN"
                onChangeFormattedText={(text) => {
                  setPhone(text);
                }}
                withShadow
                />
                <Text style={{ fontFamily: 'NunitoSans-Regular', paddingLeft: 30, color: 'red', marginTop: 10, display: !phoneValid ? 'flex' : 'none' }}>*Please enter a valid phone number</Text>
            </KeyboardAvoidingView> : null}
           {active == 'email' ? <View><LinkedIn navigation={navigation} authtoken={token} loaderHandler={() => setLoader(true)} />
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 30 }}>
              <View style={{ borderWidth: 1, height: 1, flex: 1, borderColor: "lightgrey", width: width / 3 }} />
              <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'NunitoSans-Bold', color: 'black' }} >Or</Text>
              <View style={{ borderWidth: 1, flex: 1, height: 1, borderColor: "lightgrey", width: width / 3 }} />
            </View>
            <Text style={{ color: "#3E3E3E", fontFamily: 'NunitoSans-SemiBold', fontSize: 16, paddingLeft: 20, marginBottom: 20, }}>Enter Email</Text>
            </View>: null}
            <KeyboardAvoidingView behavior={'padding'}>
              {active == 'email' ? <View><TextInput underlineColor='transparent' theme={theme} label={''} mode={'outlined'} autoCompleteType={'email'} blurOnSubmit={true} keyboardType={'email-address'} ref={input} value={email} placeholderTextColor={'lightgrey'} textContentType={'emailAddress'} autoCompleteType={'email'} autoCapitalize={'none'} placeholder={'manoj@google.com'} onChangeText={(text) => { setemail(text); checkemail(text); }} style={{ display: 'flex', width: width - 40, borderRadius: 28.5, backgroundColor: 'white', fontSize: 16, paddingLeft: 20, shadowColor: '', fontFamily: 'NunitoSans-Regular', alignSelf: 'center', height: 55, elevation: 1 }}></TextInput>
              <Text style={{ fontFamily: 'NunitoSans-Regular', paddingLeft: 30, color: 'red', marginTop: 10, display: visible ? 'flex' : 'none' }}>*Please enter a valid email ID</Text></View>: null}
              <View>
                <SpinnerButton
                  buttonStyle={{
                    borderRadius: 28.5,
                    margin: 20,
                    marginTop: 50,
                    width: 200,
                    alignSelf: 'center',
                    backgroundColor: '#327FEB',
                    height: 50
                  }}
                  isLoading={Loading}
                  spinnerType='BarIndicator'
                  onPress={() => {
                    if(active == 'email') {
                      everified ? api() : setvisible(true)
                    }
                    else {
                      sendOTP();
                      
                    }
                  }}
                  indicatorCount={10}
                >
                  <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 18, marginTop: 0 }}>Next</Text>
                </SpinnerButton>
                <TouchableOpacity onPress={() => navigation.navigate('Browser', { 'url': "https://genio.app/teacher" })}>
                <Text style={{alignSelf: 'center', textDecorationLine: 'underline', marginTop: 10}}>Looking to create a teacher account? Click here!</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Content>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    minHeight: height
    // padding: 20,
    // marginTop: 40,
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
    width: 150,
    height: 150
  },
  safeArea: {
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#efefef',
    // height: height
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'NunitoSans-SemiBold',
    paddingHorizontal: 20,
  },
  buttonStyle: {
    borderRadius: 10,
    margin: 20,
    width: 100,
    alignSelf: 'center'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0,0, 0.4)',
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

export default LoginScreen;