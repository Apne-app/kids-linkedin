/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component } from 'react'; 
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button } from 'native-base';
var height = Dimensions.get('screen').height;
const IntroScreen = ({ route, navigation }) => {

  return (
    <Container>
      <Content style={styles.container}>
        <View style={{ flex: 1, }}>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/link.png')}
          />
          <H1 style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 14, textAlign: 'center' }}>Bragging rights are back with a bang!</H1>
        </View>
        <Form style={styles.form}>
          {/*<Item stackedLabel>
              <Label>Email ID</Label>
              <Input />
            </Item>
            <Item stackedLabel style={{marginTop: 20}}>
              <Label>Password</Label>
              <Input />
            </Item>*/}
          <Button block dark rounded style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 0, height: 50,  elevation:6}} onPress={() => navigation.navigate('Signup', {})} >
            <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 20, marginTop: 4 }}>Get Started</Text>
          </Button>
          <Button block dark rounded style={{ marginTop: 10, backgroundColor: 'white', borderRadius: 0, height: 50, borderColor:'#91d7ff', borderWidth:1, elevation:6}} onPress={() => navigation.navigate('Login', {})} >
            <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 20, marginTop: 4 }}>Login</Text>
          </Button>
        </Form>
        {/* <Button block rounded iconLeft primary style={{ marginTop: 30, flex: 1 }}>
          <Icon type="FontAwesome" name="linkedin" />
          <Text style={{ color: "#fff", marginTop: 5, marginLeft: 10, fontSize: 16 }}>Continue with LinkedIn</Text>
        </Button>
        <Text style={{ textAlign: 'right', margin: 10 }}>Already Registered? </Text> */}
      </Content>
      <H1 style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 16, textAlign: 'center', bottom:20 }}>How does it work?</H1>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 40,
    marginTop: height / 6
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

export default IntroScreen;