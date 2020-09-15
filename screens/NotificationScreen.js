/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, ReplyIcon, NotificationFeed } from 'react-native-activity-feed';
var height = Dimensions.get('screen').height;

const NotificationScreen = ({ route, navigation }) => {

  return (
    <Container>
      <StreamApp
        apiKey={'dfm952s3p57q'}
        appId={'90935'}
        token={'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDlpZCJ9.A89Wjxxk_7hVBFyoSREkPhLCHsYY6Vq66MrBuOTm_mQ'}
        defaultUserData={{
          name: 'Batman',
          url: 'batsignal.com',
          desc: 'Smart, violent and brutally tough solutions to crime.',
          profileImage:
            'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
          coverImage:
            'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
        }}
      >
        <NotificationFeed
          // Group={this._renderGroup}
          // navigation={this.props.navigation}
          notify
        />
      </StreamApp>
      {/* <Header noShadow style={{ backgroundColor: '#fff',  flexDirection: 'row', height: height*0.06, borderBottomWidth: 0 }}>
        
        <Body style={{ alignItems: 'center'}}>
          <Title  style={{fontFamily:'Poppins-Regular', color: "#000", fontSize: 30, marginTop: height*0.03 }}>Notifications</Title>
        </Body>
      </Header>
      <Content style={styles.container}>
        <Separator bordered style={styles.sep}>
          <Text style={{ fontSize: 20, fontFamily:'Poppins-Regular' }}>Today</Text>
        </Separator>
        <ListItem avatar style={{marginTop: height*0.02}} >
          <Left>
            <Thumbnail source={require('../assets/logo.png')} />
          </Left>
          <Body style={{borderColor: "#fff"}}>
            <Text style={styles.txt}><Text style={{fontWeight: "bold"}}> Kumar Pratik</Text> Doing what you like will always keep you happy ..</Text>
          </Body>
          <Right style={{borderColor: "#fff"}}>
            <Text note style={styles.time}>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem last avatar style={{marginTop: height*0.02}}>
          <Left>
            <Thumbnail source={require('../assets/basket.jpg')} />
          </Left>
          <Body style={{borderColor: "#fff"}}>
            <Text style={styles.txt}><Text style={{fontWeight: "bold"}}> Kumar Pratik</Text> Doing what you like will always keep you happy ..</Text>
          </Body>
          <Right style={{borderColor: "#fff"}}>
            <Text note style={styles.time}>3:43 pm</Text>
          </Right>
        </ListItem>
        <Separator bordered style={styles.sep}>
          <Text style={{ fontSize: 20, fontFamily:'Poppins-Regular' }}>This Week</Text>
        </Separator>
        <ListItem avatar style={{marginTop: height*0.02}}>
          <Left>
            <Thumbnail source={require('../assets/logo.png')} />
          </Left>
          <Body style={{borderColor: "#fff"}}>
            <Text style={styles.txt}><Text style={{fontWeight: "bold"}}> Kumar Pratik</Text> Doing what you like will always keep you happy ..</Text>
          </Body>
          <Right style={{borderColor: "#fff"}}>
            <Text note style={styles.time}>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem last avatar style={{marginTop: height*0.02}}>
          <Left>
            <Thumbnail source={require('../assets/basket.jpg')} />
          </Left>
          <Body style={{borderColor: "#fff"}}>
            <Text style={styles.txt}><Text style={{fontWeight: "bold"}}> Kumar Pratik</Text> Doing what you like will always keep you happy ..</Text>
          </Body>
          <Right style={{borderColor: "#fff"}}>
            <Text note style={styles.time}>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem avatar style={{marginTop: height*0.02}}>
          <Left>
            <Thumbnail source={require('../assets/logo.png')} />
          </Left>
          <Body style={{borderColor: "#fff"}}>
            <Text style={styles.txt}><Text style={{fontWeight: "bold"}}> Kumar Pratik</Text> Doing what you like will always keep you happy ..</Text>
          </Body>
          <Right style={{borderColor: "#fff"}}>
            <Text note style={styles.time}>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem avatar style={{marginTop: height*0.02}}>
          <Left>
            <Thumbnail source={require('../assets/basket.jpg')} />
          </Left>
          <Body style={{borderColor: "#fff"}}>
            <Text style={styles.txt}><Text style={{fontWeight: "bold"}}> Kumar Pratik</Text> Doing what you like will always keep you happy ..</Text>
          </Body>
          <Right style={{borderColor: "#fff"}}>
            <Text note style={styles.time}>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem avatar style={{marginTop: height*0.02}}>
          <Left>
            <Thumbnail source={require('../assets/logo.png')} />
          </Left>
          <Body style={{borderColor: "#fff"}}>
            <Text style={styles.txt}><Text style={{fontWeight: "bold"}}> Kumar Pratik</Text> Doing what you like will always keep you happy ..</Text>
          </Body>
          <Right style={{borderColor: "#fff"}}>
            <Text note style={styles.time}>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem avatar style={{marginTop: height*0.02}}>
          <Left>
            <Thumbnail source={require('../assets/basket.jpg')} />
          </Left>
          <Body style={{borderColor: "#fff"}}>
            <Text style={styles.txt}><Text style={{fontWeight: "bold"}}> Kumar Pratik</Text> Doing what you like will always keep you happy ..</Text>
          </Body>
          <Right style={{borderColor: "#fff"}}>
            <Text note style={styles.time}>3:43 pm</Text>
          </Right>
        </ListItem>
        <ListItem last avatar style={{marginTop: height*0.02}}>
          <Left>
            <Thumbnail source={require('../assets/basket.jpg')} />
          </Left>
          <Body style={{borderColor: "#fff"}}>
            <Text style={styles.txt}><Text style={{fontWeight: "bold"}}> Kumar Pratik</Text> Doing what you like will always keep you happy ..</Text>
          </Body>
          <Right style={{borderColor: "#fff"}}>
            <Text note style={styles.time}>3:43 pm</Text>
          </Right>
        </ListItem>

      </Content> */}
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
  sep: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: height * 0.05,
    lineHeight: 25,
    backgroundColor: '#fff',
    borderColor: "#fff",
    color: "#383838",
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
  txt: {
    fontFamily: 'Poppins-Regular'
  },
  time: {
    color: "#A9A9A9"
  }
})

export default NotificationScreen;