/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component } from 'react'; 
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
import axios from 'axios';
import LinkedIn from '../components/LinkedIn'
import { sha256 } from 'react-native-sha256';
var height = Dimensions.get('screen').height;


const LoginForm = ({ navigation }) => {

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
        axios.get('https://api.genio.app/get-out/login/' + login.email + '/' + hash + '/none/')
          .then((response) => {
            console.log(response.data)
          })
      })

  }

  return (
    <View style={styles.form}>
      <Form>
        <Label style={{ fontFamily: 'NunitoSans-Regular' }}>Work Mail-ID</Label>
        <Item rounded style={{ marginTop: 12, marginBottom: 12, backgroundColor: "#fff" }}>
          <Input placeholder='manoj@google.com' value={login.email} onChangeText={(txt) => setLogin({ ...login, email: txt })} style={{ paddingLeft: 30, height: 60 }} />
        </Item>
        <Label style={{ fontFamily: 'NunitoSans-Regular' }}>Password</Label>
        <Item rounded style={{ marginTop: 12, backgroundColor: "#fff"}}>
          <Input  placeholder='*************' secureTextEntry={!login.viewPass} value={login.password} onChangeText={(txt) => setLogin({ ...login, password: txt })} style={{ paddingLeft: 30, height: 60, borderRadius:2, }} />
          {
            !login.viewPass ?
              <Icon active type="Feather" name='eye' onPress={() => setLogin({ ...login, viewPass: !login.viewPass })} /> :
              <Icon active type="Feather" name='eye-off' onPress={() => setLogin({ ...login, viewPass: !login.viewPass })} />
          }
        </Item>
      </Form>
      <Text style={{ textAlign: 'right', color: 'rgba(56, 56, 56, 0.8)', fontFamily: 'NunitoSans-Regular', marginTop:10 }}>Forgot Password?</Text>
      <Button rounded block dark  style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 25, height: 50,  }} onPress={() => {loginApi()}}>
        <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 20, marginTop: 4 }}>LOG IN</Text>
      </Button>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:20 }}>
        <View style={{ borderWidth: 1, height: 1, flex: 1, borderColor: "rgba(56, 56, 56, 0.8);" }} />
        <Text style={{ flex: 1, textAlign: 'center' }} >Or</Text>
        <View style={{ borderWidth: 1, flex: 1, height: 1, borderColor: "rgba(56, 56, 56, 0.8);" }} />
      </View>
      <LinkedIn navigation={navigation} />
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