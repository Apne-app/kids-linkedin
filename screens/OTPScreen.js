/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, ScrollView, View, Text, Animated, Alert, BackHandler, Dimensions, KeyboardAvoidingView, Keyboard, Image, TouchableOpacity, AppState } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Spinner, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import RNOtpVerify from 'react-native-otp-verify';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useFocusEffect } from "@react-navigation/native";
import analytics from '@segment/analytics-react-native';
import { Snackbar } from 'react-native-paper';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import CompHeader from '../Modules/CompHeader'
import CountDown from 'react-native-countdown-component';
import AuthContext from '../Context/Data';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';
  
  import styles, {
    ACTIVE_CELL_BG_COLOR,
    CELL_BORDER_RADIUS,
    CELL_SIZE,
    DEFAULT_CELL_BG_COLOR,
    NOT_EMPTY_CELL_BG_COLOR,
  } from './styles';
  

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

  const {Value, Text: AnimatedText} = Animated;
  
  const CELL_COUNT = 4;
  const source = {
    uri:
      'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
  };
  
  const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
  const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
  const animateCell = ({hasValue, index, isFocused}) => {
    Animated.parallel([
      Animated.timing(animationsColor[index], {
        useNativeDriver: false,
        toValue: isFocused ? 1 : 0,
        duration: 250,
      }),
      Animated.spring(animationsScale[index], {
        useNativeDriver: false,
        toValue: hasValue ? 0 : 1,
        duration: hasValue ? 300 : 250,
      }),
    ]).start();
  };
  

const OTPScreen = ({ navigation, route }) => {
    const [logging, setLogging] = useState(false);
    const [active, setactive] = useState(false);  
    const [time, settime] = useState('30');
    const [loading, setLoading] = useState(false);
    const [change, setchange] = useState(0);
    const scrollcheck = useRef(null);
    const [value, setValue] = React.useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });
    const { Update } = React.useContext(AuthContext);

    const sendOTP = () => {
      setLoading(true);
      let otp = generateOTP();
      // console.log(otp);
      var config = {
        method: 'get',
        url: `https://fphzj2hy13.execute-api.ap-south-1.amazonaws.com/default/otpSender?phone=${route.params.phone.replace("+","")}&otp=${otp}`,
        headers: { }
      };
      // console.log(config)
      
      axios(config)
      .then(function (response) {
        route.params.otp = otp;
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        alert("OTP couldn't be sent, please try again.");
      });
    }

    const api = async () => {
      setLoading(true);
      var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });
      var token;
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
          token = response.data.token;
          console.log(token);
          var t = `https://api.genio.app/get-out/loginphone/?token=${response.data.token}`;
          axios({
            method: 'post',
            url: t,
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify({ "email": "default", "phone": route.params.phone.replace('+',''), "lnkdId": "default" })
          })
            .then(async (response) => {
              console.log("parent profile: ", response.data)
              
              const storeProfile = async () => {
                try {
                  await AsyncStorage.setItem('profile', JSON.stringify(response.data))
                  //0 means no login
                  //1 means email sent
                  //2  means verified+no  child
                  /// 3 means child+verified

                  analytics.identify(String(response.data.id), {
                    email: response.data.phone
                  })

                  var pro = response.data;
                  axios({
                      method: 'post',
                      url: 'https://api.genio.app/matrix/getchildphone/' + `?token=${token}`,
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      data: JSON.stringify({
                          "phone": response.data.phone,
                      })
                  })
                      .then(async (response) => {
                          console.log("children: ", response.data)
                          await AsyncStorage.setItem('children', JSON.stringify(response.data))
                          if (Object.keys(response.data).length) {
                              Update({ children: response.data, status: '3', profile: pro, notifications: {} })
                              await AsyncStorage.setItem('status', '3')
                              navigation.reset({
                                  index: 0,
                                  routes: [{ name: route.params ? (Object.keys(route.params).includes('screen') ? (route.params.screen === "IntroSlider" ? ('Home') : (route.params.screen)) : ('Home')) : ('Home') }],
                              });
                              
                          }
                          else {
                            console.log("unsuccessful",response.data);
                              await AsyncStorage.setItem('status', '2')
                              navigation.navigate('Child', { screen: route.params ? Object.keys(route.params).includes('screen') ? route.params.screen : 'Home' : 'Home', 'fromOtp': true })
                          }
                      })
                } catch (e) {
                  setLoading(false);
                  alert('There was an error, please try again')
                  console.log(e)
                }
              }
              if((response.data.status && response.data.status != 'inactive') || ! response.data.status) {
                storeProfile()
              } else {
                setLoading(false);
                alert('Your account is not verified yet. Kindly wait for the confirmation from our side.')
              }
            })
            .catch((error) => {
              console.log(error)
              setLoading(false);
              alert('There was an error, please try again')
            })
      })
    }

    useEffect(() => {
      console.log(route.params.otp)
      const startListeningForOtp = () =>
      RNOtpVerify.getOtp()
        .then(p => RNOtpVerify.addListener(otpHandler))
        .catch(p => console.log(p));

      startListeningForOtp();
    
      const otpHandler = (message: string) => {
        try{
          setLoading(true);
          const otp = /(\d{4})/g.exec(message)[1];
          setValue(otp);
          RNOtpVerify.removeListener();
          Keyboard.dismiss();
          api();
        } catch(err) {
          console.log(err);
        }
      }
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          scrollcheck.current.scrollToEnd({ animated: true })
        }
      );
  
  
      return () => {
        keyboardDidShowListener.remove();
      };
    })

    const renderCell = ({index, symbol, isFocused}) => {
        const hasValue = Boolean(symbol);
        const animatedCellStyle = {
          backgroundColor: hasValue
            ? animationsScale[index].interpolate({
                inputRange: [0, 1],
                outputRange: [DEFAULT_CELL_BG_COLOR, DEFAULT_CELL_BG_COLOR],
              })
            : animationsColor[index].interpolate({
                inputRange: [0, 1],
                outputRange: [DEFAULT_CELL_BG_COLOR, DEFAULT_CELL_BG_COLOR],
              }),
          borderRadius: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
          }),
          transform: [
            {
              scale: animationsScale[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };
  
        setTimeout(() => {
          animateCell({hasValue, index, isFocused});
        }, 0);
    
        return (
          <AnimatedText
            key={index}
            style={[styles.cell, animatedCellStyle]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </AnimatedText>
        );
      };

    return (
      <ScrollView stickyHeaderIndices={[0]} ref={scrollcheck} keyboardShouldPersistTaps='handled' style={styles.container}>
      <CompHeader screen={'OTP'}
      goback={() => {
        if (navigation.canGoBack()) {
          navigation.pop()
        }
        else {
          navigation.navigate('Home')
        }
      }} />
      {loading ? <Spinner color='blue' style={styleLoader.loading} /> : null}
        <Content style={{backgroundColor: '#fff'}}>
        <View style={{ opacity: logging ? 0.3 : 1, minHeight: height-100 }}>
        <Image source={require('../assets/otp.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 10 }} />
        <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>We've sent an OTP to your phone{"\n"}<Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 18 }}>{route.params.phone}{'\n'}</Text><TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ flexDirection: 'row' }}><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 18, color: '#327FEB' }}>(</Text><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 18, color: '#327FEB', textDecorationColor: '#327FEB', textDecorationLine: 'underline' }}>Change</Text><Text style={{ fontFamily: 'NunitoSans-Bold', fontSize: 18, color: '#327FEB' }}>)</Text></TouchableOpacity></Text>
        <KeyboardAvoidingView behavior={'padding'} >
                <CodeField
                ref={ref}
                {...props}
                    value={value}
                    autoFocus={true}
                    onChangeText={(text) => {
                      setValue(text); 
                      if(text.length == 4) {
                        if(text == route.params.otp){
                          api() 
                        } else {
                          alert('Invalid OTP');
                          setValue('')
                        }
                      }
                    }}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={renderCell}
                />
              </KeyboardAvoidingView>
                    <Button disabled={logging} block style={{ marginTop: 20, borderColor: active ? '#327FEB' : 'grey', backgroundColor: active ? '#327FEB' : 'grey', borderWidth: 1, borderRadius: 25, width: width - 40, alignSelf: 'center', height: 60, opacity: logging ? 0.8 : 1 }} onPress={() => { sendOTP(); settime(45) }}>
                        <View style={{ flexDirection: 'row' }}><Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 18 }}>Send again (</Text><View style={{ marginTop: 0, marginHorizontal: -2 }}>
                            <CountDown
                                id={String(change)}
                                until={time}
                                onFinish={() => setactive(true)}
                                size={10}
                                running={true}
                                digitStyle={{ borderColor: '#327FEB' }}
                                digitTxtStyle={{ fontFamily: 'NunitoSans-Bold', fontSize: 18 }}
                                timeToShow={['S']}
                                timeLabels={{ s: '' }}
                            /></View><Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 18, }}>s)</Text></View>
                    </Button>
                    <Button block style={{ marginTop: 20, borderColor: '#327FEB', backgroundColor: 'white', borderWidth: 1, borderRadius: 25, width: width - 40, alignSelf: 'center', height: 60, opacity: logging ? 0.8 : 1 }} onPress={async () => { await AsyncStorage.setItem('status', '1'), navigation.navigate('Home') }} >
                        <Text style={{ color: "#327FEB", fontFamily: 'NunitoSans-Bold', fontSize: 18, }}>Continue as a guest*</Text>
                    </Button>
                    <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 10, textAlign: 'center', marginTop: 20}}>*You wont be able to use the social network</Text>
                </View>
        </Content>
      </ScrollView>
    );

}

const styleLoader = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
    // padding: 20,
    // marginTop: 40,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0,0, 0.4)',
    height: height,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default OTPScreen;