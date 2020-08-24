import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button} from 'native-base';


const SignupScreen = ({ route, navigation }) => {

    return (
      <Container>
      <ImageBackground source={require("../assets/loginbg.png")} style={styles.image}>
        <Content style={styles.container}>
        <View style={{flex: 1,}}>
          <H1>Hello.</H1>
          <H1>Welcome to </H1>
        </View>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/logo.png')}
          />
          <Form style={styles.form}>
            {/*<Item stackedLabel>
              <Label>Email ID</Label>
              <Input />
            </Item>
            <Item stackedLabel style={{marginTop: 20}}>
              <Label>Password</Label>
              <Input />
            </Item>*/}
            <Button block dark rounded style={{marginTop: 30}} onPress={() => navigation.navigate('Login', {})} >
              <Text style={{color: "#fff"}}>Sign Up With Email</Text>
            </Button>
          </Form>
          <Button block rounded iconLeft primary style={{marginTop: 30, flex: 1}}>
            <Icon type="FontAwesome" name="linkedin" />
            <Text style={{color: "#fff", marginTop: 5, marginLeft: 10, fontSize: 16}}>Continue with LinkedIn</Text>
          </Button>
          <Text style={{textAlign: 'right', margin: 10}}>Already Registered? </Text>
        </Content>
      </ImageBackground>
      </Container>
    );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    padding: 40, 
    paddingTop: 80
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
    marginTop: 40
    // height: 80,
  },
})

export default SignupScreen;