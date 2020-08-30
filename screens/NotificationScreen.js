/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
const NotificationScreen = ({ route, navigation }) => {

  return (
    <Container>
      <Header>
        <Left />
        <Left />
        <Body style={{ alignItems: 'center'}}>
          <Title style={{fontFamily:'Poppins-Regular' }}>Notifications</Title>
        </Body>
        <Right />
      </Header>
      <Content style={styles.container}>
        <Separator bordered style={{ height: 50 }}>
          <Text style={{ fontSize: 23 }}>New</Text>
        </Separator>
        <ListItem avatar>
          <Left>
            <Thumbnail source={require('../assets/logo.png')} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem last avatar>
          <Left>
            <Thumbnail source={require('../assets/basket.jpg')} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
        <Separator bordered style={{ height: 50 }}>
          <Text style={{ fontSize: 23 }}>Earlier</Text>
        </Separator>
        <ListItem avatar>
          <Left>
            <Thumbnail source={require('../assets/logo.png')} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem last avatar>
          <Left>
            <Thumbnail source={require('../assets/basket.jpg')} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem avatar>
          <Left>
            <Thumbnail source={require('../assets/logo.png')} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem avatar>
          <Left>
            <Thumbnail source={require('../assets/basket.jpg')} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem avatar>
          <Left>
            <Thumbnail source={require('../assets/logo.png')} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem avatar>
          <Left>
            <Thumbnail source={require('../assets/basket.jpg')} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem last avatar>
          <Left>
            <Thumbnail source={require('../assets/basket.jpg')} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>

      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    // padding: 40, 
    // paddingTop: 80
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

export default NotificationScreen;