/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component } from 'react'; 
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
import axios from 'axios';
import { sha256 } from 'react-native-sha256';
var height = Dimensions.get('screen').height;

const SignUpForm = ({ navigation }) => {

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

  const [signup, setSignup] = React.useState({
    email: '',
    password: '',
    viewPass: false
  })
  const signupApi = () => {
    sha256(signup.password)
      .then((hash) => {
        console.log(hash)
        axios.get('https://api.genio.app/get-out/signup/' + signup.email + '/' + hash + '/none/')
          .then((response) => {
            console.log(response.data)
          })
      })

  }

  return (
    <View style={styles.form}>
      <Form>
        <Label style={{ fontFamily: 'NunitoSans-Regular' }}>Work Mail-Id</Label>
        <Item rounded style={{ marginTop: 12, marginBottom: 12, backgroundColor: "#fff" }}>
          <Input placeholder='manoj@google.com' value={signup.email} onChangeText={(txt) => setSignup({ ...signup, email: txt })} style={{ paddingLeft: 30, height: 60 }} />
        </Item>
        <Label style={{ fontFamily: 'NunitoSans-Regular' }}>Password</Label>
        <Item rounded style={{ marginTop: 12, backgroundColor: "#fff" }}>
          <Input placeholder='*******' secureTextEntry={!signup.viewPass} value={signup.password} onChangeText={(txt) => setSignup({ ...signup, password: txt })} style={{ paddingLeft: 30, height: 60 }} />
          {
            !signup.viewPass ?
              <Icon active type="Feather" name='eye' onPress={() => setSignup({ ...signup, viewPass: !signup.viewPass })} /> :
              <Icon active type="Feather" name='eye-off' onPress={() => setSignup({ ...signup, viewPass: !signup.viewPass })} />
          }
        </Item>
      </Form>
      <Text style={{ textAlign: 'right', color: 'rgba(56, 56, 56, 0.8)', fontFamily: 'NunitoSans-Regular', marginTop: 10 }}>Forgot Password?</Text>
      <Button block dark rounded style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 25, height: 50, }} onPress={() => { loginApi() }}>
        <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 20, marginTop: 4 }}>SIGN UP</Text>
      </Button>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
        <View style={{ borderWidth: 1, height: 1, flex: 1, borderColor: "rgba(56, 56, 56, 0.8);" }} />
        <Text style={{ flex: 1, textAlign: 'center' }} >Or</Text>
        <View style={{ borderWidth: 1, flex: 1, height: 1, borderColor: "rgba(56, 56, 56, 0.8);" }} />
      </View>
      <Button block rounded iconLeft style={{ marginTop: 20, flex: 1, borderColor: '#91d7ff', backgroundColor: '#2867B2', borderWidth: 1, borderRadius: 25, height: 50, }} onPress={() => navigation.navigate('Home', {})} >
        <Icon type="FontAwesome" name="linkedin" style={{ color: 'white', marginRight: 20 }} />
        <Text style={{ color: "white", fontFamily: 'NunitoSans-SemiBold', fontSize: 16, marginTop: 4 }}>Signup with LinkedIn</Text>
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


export default SignUpForm;