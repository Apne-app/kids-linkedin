import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
var height = Dimensions.get('screen').height;

const SignUpForm = ({navigation}) => {

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

  const [signup, setSignup] = React.useState({
    username: '',
    email: '',
    password: '',
    viewPass: false
  })


    return (
        <View style={styles.form}>
          <Form>
          <Label style={{ fontFamily:'Poppins-Regular'}}>Username</Label>
          <Item rounded style={{marginTop: 12, marginBottom: 12}}>
            <Input placeholder='Enter you username' value={signup.username} onChangeText={(txt) => setSignup({...signup, username: txt})} style={{paddingLeft: 30, height: 60}} />
          </Item>
          <Label style={{ fontFamily:'Poppins-Regular'}}>Email</Label>
          <Item rounded style={{marginTop: 12, marginBottom: 12}}>
            <Input placeholder='Enter you email' value={signup.email} onChangeText={(txt) => setSignup({...signup, email: txt})} style={{paddingLeft: 30, height: 60}} />
          </Item>
          <Label style={{ fontFamily:'Poppins-Regular'}}>Password</Label>
          <Item rounded style={{marginTop: 12}}>
            <Input placeholder='Enter your password' secureTextEntry={!signup.viewPass} value={signup.password} onChangeText={(txt) => setSignup({...signup, password: txt})} style={{paddingLeft: 30, height: 60}} />
            {
              !signup.viewPass ?
              <Icon active type="Feather" name='eye' onPress={() => setSignup({...signup, viewPass: !signup.viewPass})} />:
              <Icon active type="Feather" name='eye-off' onPress={() => setSignup({...signup, viewPass: !signup.viewPass})} />
            }
          </Item>
          </Form>
          <Text style={{textAlign: 'right', color: 'rgba(56, 56, 56, 0.8)'}}>Forgot Password?</Text>
          <Button block rounded style={{backgroundColor: "#357feb", marginVertical: 15, height: 60}} onPress={() => navigation.navigate('Home', {})}>
            <Text style={{color: "#fff", fontSize: 20}}>Sign Up</Text>
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