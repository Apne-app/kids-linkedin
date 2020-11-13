/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { PureComponent } from 'react';
import { AppRegistry, ScrollView, Alert, TextInput, Platform, Dimensions, BackHandler, StyleSheet, Text, FlatList, TouchableOpacity, Image, PermissionsAndroid, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import CameraRoll from "@react-native-community/cameraroll";
import Gallery from '../components/Gallery'
import CompHeader from '../Modules/CompHeader';
var height = Dimensions.get('screen').height;
const GalleryScreen = ({navigation, route}) => {
    console.log(route.params)
    return (
        <View
            // scrollEnabled={false}
            style={{
                backgroundColor: 'white',
                height: height,
            }}
        >
            <CompHeader screen={'Gallery'} />
            <Gallery images={route.params.images} navigation={navigation} />
        </View>
    )
}
export default GalleryScreen