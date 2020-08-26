import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail,  List, ListItem,  Separator, Left, Body, Right, Title} from 'native-base';


const SearchScreen = ({ route, navigation }) => {

    return (
      <Container>
        <Header>
          <Body style={{margin: 10}}>
            <Item rounded>
            <Icon active name='search' />
            <Input style={{color: "#fff", height: 40}} placeholder='Icon Textbox'/>
          </Item>
          </Body>
        </Header>
          <Content style={styles.container}>
          <Separator bordered style={{height: 50}}>
            <Text style={{fontSize: 18}}>Suggested Friends</Text>
          </Separator>
          <ListItem  thumbnail>
            <Left>
                <Thumbnail square source={require('../assets/logo.png')} />
              </Left>
              <Body>
            <H3 style={{fontSize: 16}}>Shashwat M. Das</H3>
                <Text style={{fontSize: 12}} note>Friends With Bhargava</Text>
              </Body>
              <Right>
                <Button style={{ backgroundColor: "transparent" }}>
                <Icon name="add-user" type="Entypo" style={{color: "#000"}} />
              </Button>
              </Right>
          </ListItem>
          <ListItem thumbnail>
            <Left>
                <Thumbnail square source={require('../assets/basket.jpg')} />
              </Left>
              <Body>
                <H3 style={{fontSize: 16}} >Bhargava Sai Macha</H3>
                <Text style={{fontSize: 12}}  note>Friends With Shashwat</Text>
              </Body>
              <Right>
                <Button style={{ backgroundColor: "transparent" }}>
                <Icon name="add-user" type="Entypo" style={{color: "#000"}} />
              </Button>
              </Right>
          </ListItem>
          <ListItem last thumbnail>
            <Left>
                <Thumbnail square source={require('../assets/logo.png')} />
              </Left>
              <Body>
            <H3 style={{fontSize: 16}}>Piyush Mayank</H3>
                <Text style={{fontSize: 12}} note>Friends With Bhargava</Text>
              </Body>
              <Right>
                <Button style={{ backgroundColor: "transparent" }}>
                <Icon name="add-user" type="Entypo" style={{color: "#000"}} />
              </Button>
              </Right>
          </ListItem>
          <Separator bordered style={{height: 50}}>
            <Text style={{fontSize: 18}}>Suggested Pages</Text>
          </Separator>
          <ListItem thumbnail>
            <Left>
                <Thumbnail square source={require('../assets/basket.jpg')} />
              </Left>
              <Body>
                <H3 style={{fontSize: 16}} >Chelsea FC</H3>
                <Text style={{fontSize: 12}}  note>Official Page of Chelsea Football Club</Text>
              </Body>
              <Right>
                <Button style={{ backgroundColor: "transparent" }}>
                <Icon name="add" type="Ionicons" style={{color: "#000"}} />
              </Button>
              </Right>
          </ListItem>
          <ListItem thumbnail>
            <Left>
                <Thumbnail square source={require('../assets/basket.jpg')} />
              </Left>
              <Body>
                <H3 style={{fontSize: 16}} >Kai Havertz</H3>
                <Text style={{fontSize: 12}}  note>German Footballer</Text>
              </Body>
              <Right>
                <Button style={{ backgroundColor: "transparent" }}>
                <Icon name="add" type="Ionicons" style={{color: "#000"}} />
              </Button>
              </Right>
          </ListItem>
          <ListItem thumbnail>
            <Left>
                <Thumbnail square source={require('../assets/basket.jpg')} />
              </Left>
              <Body>
                <H3 style={{fontSize: 16}} >Lioned Andres Messi</H3>
                <Text style={{fontSize: 12}}  note>Best Footballer on the Planet</Text>
              </Body>
              <Right>
                <Button style={{ backgroundColor: "transparent" }}>
                <Icon name="add" type="Ionicons" style={{color: "#000"}} />
              </Button>
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

export default SearchScreen;