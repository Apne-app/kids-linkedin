/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button } from 'native-base';
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
  return (
    <Container>
      <View>
      <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold',marginTop: 40, fontSize: 20, marginLeft: 20}}>Lets get started!</Text>
      <Icon onPress={()=>navigation.navigate('Intro', {})} type="Feather" name="x-square" style={{ color: 'black', marginTop: -40, fontSize: 30, marginRight: 20, textAlign:'right' }} />
      </View>
      <Content style={styles.container}>
        <View style={{ flex: 1, }}>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/link.png')}
          />
        </View>
        <Form bordered style={styles.form}>
          <TextInput
            mode={'outlined'}
            theme={theme}
            label="Work mail-id"
            selectionColor={'#91d7ff'}
            underlineColor={'#91d7ff'}
            underlineColorAndroid={'#91d7ff'}
            style={{ color: '#91d7ff', backgroundColor: 'white' }}
          // onChangeText={text => setText(text)}
          />
          <TextInput
            mode={'outlined'}
            theme={theme}
            label="Password"
            style={{ marginTop: 20, backgroundColor: 'white' }}
          // onChangeText={text => setText(text)}
          />
          <Button block dark rounded style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 0, height: 50, elevation: 6 }} onPress={() => navigation.navigate('Signup', {})} >
            <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 20, marginTop: 4 }}>SIGN UP</Text>
          </Button>
          <Text style={{ fontFamily: 'Poppins-SemiBold', textAlign: 'center', marginTop: 20 }}> ----------- OR -----------</Text>
          <Button block rounded iconLeft style={{ marginTop: 20, flex: 1, borderColor: '#91d7ff', backgroundColor: '#2867B2', borderWidth: 1, borderRadius: 0, elevation: 10 }}>
            <Icon type="FontAwesome" name="linkedin" style={{ color: 'white', marginRight: 20 }} />
            <Text style={{ color: "white", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 4 }}>Sign Up with LinkedIn</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 40,
    marginTop: 40
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