/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
import axios from 'axios';
import { sha256 } from 'react-native-sha256';
var height = Dimensions.get('screen').height;

const LoginForm = ({ navigation }) => {

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

  const [login, setLogin] = React.useState({
    email: '',
    password: '',
    viewPass: false
  })

  const loginApi = () => {
    sha256(login.password)
      .then((hash) => {
        console.log(hash)
        axios.get('http://104.199.146.206:5000/login/' + login.email + '/' + hash + '/none/')
          .then((response) => {
            console.log(response.data)
          })
      })

  }

  return (
    <View style={styles.form}>
      <Form>
        <Label style={{ fontFamily: 'Poppins-Regular' }}>Work Mail-ID</Label>
        <Item style={{ marginTop: 12, marginBottom: 12 }}>
          <Input placeholder='manoj@google.com' value={login.email} onChangeText={(txt) => setLogin({ ...login, email: txt })} style={{ paddingLeft: 30, height: 60 }} />
        </Item>
        <Label style={{ fontFamily: 'Poppins-Regular' }}>Password</Label>
        <Item style={{ marginTop: 12}}>
          <Input  placeholder='*************' secureTextEntry={!login.viewPass} value={login.password} onChangeText={(txt) => setLogin({ ...login, password: txt })} style={{ paddingLeft: 30, height: 60, borderRadius:2, elevation:10 }} />
          {
            !login.viewPass ?
              <Icon active type="Feather" name='eye' onPress={() => setLogin({ ...login, viewPass: !login.viewPass })} /> :
              <Icon active type="Feather" name='eye-off' onPress={() => setLogin({ ...login, viewPass: !login.viewPass })} />
          }
        </Item>
      </Form>
      <Text style={{ textAlign: 'right', color: 'rgba(56, 56, 56, 0.8)', fontFamily: 'Poppins-Regular', marginTop:10 }}>Forgot Password?</Text>
      <Button block dark rounded style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 0, height: 50, elevation: 6 }} onPress={() => {loginApi()}}>
        <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 20, marginTop: 4 }}>LOG IN</Text>
      </Button>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:20 }}>
        <View style={{ borderWidth: 1, height: 1, flex: 1, borderColor: "rgba(56, 56, 56, 0.8);" }} />
        <Text style={{ flex: 1, textAlign: 'center' }} >Or</Text>
        <View style={{ borderWidth: 1, flex: 1, height: 1, borderColor: "rgba(56, 56, 56, 0.8);" }} />
      </View>
      <Button block rounded iconLeft style={{ marginTop: 20,  height: 50, flex: 1, borderColor: '#91d7ff', backgroundColor: '#2867B2', borderWidth: 1, borderRadius: 0, elevation: 10 }} onPress={() => navigation.navigate('Home', {})} >
        <Icon type="FontAwesome" name="linkedin" style={{ color: 'white', marginRight: 20 }} />
        <Text style={{ color: "white", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 4 }}>Log In with LinkedIn</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 40,
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
})


export default LoginForm;