/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
import LoginForm from  '../components/Login';
import SignUpForm from  '../components/SignUp';
var height = Dimensions.get('screen').height;


const SignupScreen = ({ route, navigation }) => {
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

  return (
    <Container style={styles.container}>
      <Content >
        <View style={{ flex: 1, marginBottom: 15}}>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/link.png')}
          />
        </View>
        <View style={{flexDirection:"row"}}>
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
        </View>
        {
          activeform ?
          <LoginForm navigation={navigation} />:
          <SignUpForm navigation={navigation} />
        }
      </Content>
    </Container>
  );
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

export default SignupScreen;