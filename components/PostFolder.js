/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { RNS3 } from 'react-native-aws3';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, Modal, FlatList } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Spinner, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SECRET_KEY, ACCESS_KEY } from '@env'
import ReanimatedCurvedTabBar from './react-native-curved-bottom-tabbar';
import Upload from './Post';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const PostFolder = ({ route, navigation }) => {
  const screens = [<Upload navigation={navigation}/>, <Upload navigation={navigation}/>, <Upload navigation={navigation}/>]
  const icons = ['cloud', 'aperture', 'image']
  const iconstext = ['Uploads', 'Scan', 'Gallery']
  const [num, setnum] = useState(0)
  return (
    <ReanimatedCurvedTabBar
      height={170}
      screensBackground={'white'}
      topGap={15}
      tabColor={'#b2dfdb'}
      backgroundColor={'white'}
      duration={500}
      sidesRadius={1}
      marginBottom={23}
      scaleYCircle={1.4}
      iconTranslateY={-5}
      lockTranslateYAnime={true}

      // icon scale animation
      // (default 1.4)
      iconScale={1.4}
      lockScaleAnime={true}

      // icons drop down animation
      // (default 30)
      iconDropY={30}
      allowDropAnime={true}
      // first icon will also drop down
      dropWithFirst={false}

      iconsArray={[...Array(3)].map((item, index) =>
        (<View style={{ alignSelf: 'center' }}><Icon style={{ fontSize: 20, alignSelf: 'center' }} type="Feather" name={icons[index]} /><Text style={{ fontFamily: 'Poppins-Regular', alignSelf: 'center', fontSize: 9, display: 'flex' }}>{iconstext[index]}</Text></View>)
      )}
      onPress={(btnNum) => { setnum(btnNum - 1) }}
      screensArray={screens}
      allowDropAnime={true}
    />
  );
}

export default PostFolder;