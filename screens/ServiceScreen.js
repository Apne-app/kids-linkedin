/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title, Card, CardItem } from 'native-base';
const ServiceScreen = ({ route, navigation }) => {

  return (
    <Container>
      <Header style={{ backgroundColor: '#91d7ff', borderColor: '#91d7ff', borderWidth: 0.7, flexDirection: 'row' }}>
        <Left />
        <Left />
        <Body style={{ alignItems: 'center'}}>
          <Title style={{fontFamily:'Poppins-Regular', color: "#000",  }}>Services</Title>
        </Body>
        <Right />
      </Header>
      <Content style={styles.container}>
      <Card>
      <View   style={{flexDirection: 'row'}}>
        <CardItem style={{flex: 1}} >
          <Left>
            <Image style={{height: 80, width: 80}} source={require('../assets/logo.png')} />
            
          </Left>
        </CardItem>
        <View style={{flex: 4}} >
        <CardItem >
        <Body style={{marginLeft: 40}}>
              <H3 style={{textAlign: 'left'}}>Football Club</H3>
              <Text note style={{textAlign: 'left'}}>MMM Hall, IIT Kgp</Text>
            </Body>
        </CardItem>
        <CardItem>
          <Body style={{marginLeft: 40}}>
            <Button transparent>
              <Icon  name="star" />
              <Text >4.2 Rating</Text>
            </Button>
          </Body>
          <Right>
          </Right>
        </CardItem>
        </View>
        <CardItem style={{flex: 1,}}>
        <Button transparent style={{alignSelf: 'center'}}>
              <Icon type="AntDesign" name="rightcircle" />
            </Button>
        </CardItem>
        </View>
      </Card>

      <Card >
      <View   style={{flexDirection: 'row'}}>
        <CardItem style={{flex: 1}} >
          <Left>
            <Image style={{height: 80, width: 80}} source={require('../assets/basket.jpg')} />
            
          </Left>
        </CardItem>
        <View style={{flex: 4}} >
        <CardItem >
        <Body style={{marginLeft: 40}}>
              <H3 style={{textAlign: 'left'}}>Dance Classes</H3>
              <Text note style={{textAlign: 'left'}}>LLR Hall, IIT Kgp</Text>
            </Body>
        </CardItem>
        <CardItem>
          <Body style={{marginLeft: 40}}>
            <Button transparent>
              <Icon  name="star" />
              <Text >4.2 Rating</Text>
            </Button>
          </Body>
          <Right>
          </Right>
        </CardItem>
        </View>
        <CardItem style={{flex: 1,}}>
        <Button transparent style={{alignSelf: 'center'}}>
              <Icon type="AntDesign" name="rightcircle" />
            </Button>
        </CardItem>
        </View>
      </Card>
        
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

export default ServiceScreen;