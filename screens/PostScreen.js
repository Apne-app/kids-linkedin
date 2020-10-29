/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Text, Alert, BackHandler, Dimensions, Image, FlatList, TouchableOpacity } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useFocusEffect } from "@react-navigation/native";
import { SliderBox } from "react-native-image-slider-box";

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const PostScreen = ({ navigation, route }) => {

        useFocusEffect(
        React.useCallback(() => {
        const onBackPress = () => {
            Alert.alert("Hold on!", "Are you sure you want to discard the post?", [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            { text: "YES", onPress: () => navigation.pop() }
            ]);
            return true;
        };

        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);

    }, []));

        const [images, setImages] = useState([]);
        const [selection, setSelection] = useState([])
        const [last, setLast] = useState(0);

        useEffect(() => {
            setImages([ ...route.params.images ]);
            // console.log(route.params.images)
            var arr = [];
            for(var i = 0; i < route.params.images.length; i++)
            {
              arr.push({ uri: route.params.images[i]["uri"], selected: i+1 });
            }
            // console.log(arr);
            setSelection([ ...arr ]);
            setLast(arr.length);
        }, [])

        return (
            <View style={{ backgroundColor: 'white', height: height, width: width }}>
                <SliderBox
                    images={images}
                    dotColor="#357feb"
                    inactiveDotColor="#90A4AE"
                    paginationBoxVerticalPadding={20}
                    sliderBoxHeight={height*0.5}
                    ImageComponentStyle={{ width: width, height: height*0.5,}}
                    circleLoop={true}
                // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
                /> 
                <ScrollView>
                <FlatList
                  style={{marginTop: 10}}
                  data={selection}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity style={{ flexDirection: 'column', margin: 1, }} onPress={() => {
                        var arr = [ ...selection ];
                        arr[index]['selected'] = !arr[index]['selected'];
                        // for(var i = index+1; i < arr.length; i++)
                        // {
                        //   arr[index]['selected'] = arr[index]['selected']-1;
                        // }
                        setSelection([ ...arr ])
                        arr = [ ...images ];
                        var i = 1000;
                        // for(var a = 0; a < arr.length; a++)
                        // {
                        //   if(arr[a]['uri'] == selection[index]['uri'])
                        //   {
                        //     i = a;
                        //     break;
                        //   }
                        // }
                        var ar = arr.filter(item => item['uri'] !== selection[index]['uri'])
                        if(ar.length == arr.length) 
                        {
                          // console.log(ar)
                        ar.push({ uri: selection[index]['uri'] })
                        }
                        // console.log(ar, arr);
                        setImages([ ...ar ]);
                    }}>
                        <View style={{width: 20, height: 20, borderRadius: 20, backgroundColor: '#357feb', position: 'absolute', opacity: 1, zIndex: 100, top: 3, right: 2, alignItems: 'center', justifyContent: 'center'}} >{ item.selected ? <View style={{backgroundColor:"#fff", width:12, height: 12, borderRadius: 12}}></View> : null}</View>
                        <Image source={{uri: item.uri}} style={{width: width*0.25, height: width*0.25, opacity: selection[index]['selected'] ? 0.6 : 1}} />
                    </TouchableOpacity>
                  )}
                  //Setting the number of column
                  numColumns={4}
                  keyExtractor={(item, index) => index.toString()}
                />
                </ScrollView>
            </View>
        );

    }
    export default PostScreen;