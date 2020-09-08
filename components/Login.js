import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
var height = Dimensions.get('screen').height;

const LoginForm = ({navigation}) => {

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
    username: '',
    password: '',
    viewPass: false
  })

    // console.log(navigation)

    return (
        <View style={styles.form}>
          <Form>
          <Label style={{ fontFamily:'Poppins-Regular'}}>Username or Email</Label>
          <Item rounded style={{marginTop: 12, marginBottom: 12}}>
            <Input placeholder='Enter you username or email' value={login.username} onChangeText={(txt) => setLogin({...login, username: txt})} style={{paddingLeft: 30, height: 60}} />
          </Item>
          <Label style={{ fontFamily:'Poppins-Regular'}}>Password</Label>
          <Item rounded style={{marginTop: 12}}>
            <Input placeholder='Enter your password' secureTextEntry={!login.viewPass} value={login.password} onChangeText={(txt) => setLogin({...login, password: txt})} style={{paddingLeft: 30, height: 60}} />
            {
              !login.viewPass ?
              <Icon active type="Feather" name='eye' onPress={() => setLogin({...login, viewPass: !login.viewPass})} />:
              <Icon active type="Feather" name='eye-off' onPress={() => setLogin({...login, viewPass: !login.viewPass})} />
            }
          </Item>
          </Form>
          <Text style={{textAlign: 'right', color: 'rgba(56, 56, 56, 0.8)'}}>Forgot Password?</Text>
          <Button block rounded style={{backgroundColor: "#357feb", marginVertical: 15, height: 60}} onPress={() => navigation.navigate('Home', {})}>
            <Text style={{color: "#fff", fontSize: 20}}>Login</Text>
          </Button>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{borderWidth: 1, height: 1, flex: 1, borderColor: "rgba(56, 56, 56, 0.8);"}} />
          <Text style={{flex: 1, textAlign: 'center'}} >Or login with</Text>
          <View style={{borderWidth: 1, flex: 1, height: 1, borderColor: "rgba(56, 56, 56, 0.8);"}} />
          </View>
          <Button block rounded style={{backgroundColor: "#fff", marginVertical: 15, height: 60, marginTop: height*0.03, flexDirection: 'row'}} onPress={() => navigation.navigate('Home', {})}>
            <Thumbnail source={require('../assets/google.webp')} style={{height: 30, width: 30}} />
            <Text style={{color: "#000", fontSize: 20}}>  Google</Text>
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