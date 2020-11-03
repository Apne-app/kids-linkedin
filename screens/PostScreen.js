/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Text, Alert, BackHandler, Dimensions, Image, FlatList, TouchableOpacity } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer, Textarea } from 'native-base';
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
                {
                  images.length > 1 ?
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
                /> : 
                  images.length == 1 ?
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
                :
                <SliderBox
                    images={[""]}
                    dotColor="#357feb"
                    inactiveDotColor="#90A4AE"
                    paginationBoxVerticalPadding={20}
                    sliderBoxHeight={height*0.5}
                    ImageComponentStyle={{ width: width, height: height*0.5,}}
                    circleLoop={true}
                // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
                /> 
                }
                <ScrollView>
                <FlatList
                  style={{marginTop: 10, height: height*0.2}}
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
                        <View style={{width: 20, height: 20, borderRadius: 20, backgroundColor: item.selected ? '#fff' : '#357feb', borderWidth: item.selected ? 4 : 0, borderColor: "#357feb" , position: 'absolute', opacity: 1, zIndex: 100, top: 3, right: 2, alignItems: 'center', justifyContent: 'center'}} ></View>
                        <Image source={{uri: item.uri}} style={{width: width*0.25, height: width*0.25, opacity: selection[index]['selected'] ? 0.6 : 1}} />
                    </TouchableOpacity>
                  )}
                  //Setting the number of column
                  // numColumns={4}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  keyExtractor={(item, index) => index.toString()}
                />
                </ScrollView>
                <View style={{height: height*0.3, borderTopWidth: 1,borderLeftWidth: 1,borderRightWidth: 1, borderColor: 'lightgrey'}}>
                  <Content padder>
                    <Form>
                      <Textarea rowSpan={4} placeholder="Add Caption" />
                    </Form>
                    <TouchableOpacity
                      style={{height: 50}}
                      onPress={() => {
                        var ar = explore;
                        var arr = [];
                        for(var i = 1; i < ar.length; i++)
                        {
                          arr.push({ uri: 'file://'+ar[i]["uri"] })
                        }
                        navigation.navigate('CreatePost', { images: arr })
                      }}
                    >
                      <View style={styles.Next}>
                        <Text style={{ color: "#fff", flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>
                          Create Post
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Content>
                </View>
            </View>
        );

    }



const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: 'column',
    height: height,
    overflow: 'hidden'
    // padding: 40, 
    // paddingTop: 80
  },
  form: {
    marginTop: 40,
    flex: 1
    // alignSelf: 'center'
  },
  //  image: {
  //   flex: 1,
  //   resizeMode: "cover",
  //   opacity: 0.4,
  //   justifyContent: "center",

  // },
  addButton: {
    right: 10,
    bottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    // flexDirection: 'row',
    // backgroundColor:'rgba(255,255,255,0.3)'
  },
  personDetails: {
    // right: width*0.15,
    bottom: 10,
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  addIcon: {
    // right: width*0.15,
    bottom: "29%",
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 20,
    borderRadius: width,
    backgroundColor: '#357feb',
    // borderWidth: 1,
    borderColor: "#fff"
    // backgroundColor:'rgba(0,0,0,0.5)'
  },
  tinyLogo: {
    alignSelf: 'center',
    marginTop: 40
    // height: 80,
  },

  image: {
    height: width * 0.39,
    width: width * 0.39,
    margin: width * 0.03,
    borderRadius: 30,

  },
  addImg: {
    height: width * 0.39,
    width: width * 0.39,
    margin: width * 0.03,
    // borderWidth: 2,
    borderRadius: 20,
    borderColor: "#357feb",
    borderWidth: 3,
    borderStyle:"dashed",
    backgroundColor: "#fff"
    // borderStyle: 'dashed',
  },
  save: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 15,
    // margin: 5,
    backgroundColor: '#357feb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fff",
    width: width * 0.31
  },
  saveAsPDF: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 8,
    // margin: 5,
    backgroundColor: '#357feb',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    width: 135
  },
  save2: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 15,
    // margin: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#357feb",
    width: width * 0.31
  },
  save3: {
    // alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    // margin: 5,
    // backgroundColor: '#357feb',
    // borderRadius: 30,
    // borderWidth: 5,
    // borderColor: "#3cb979",
    width: 60
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
    alignItems: "center",
    // marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  Next: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 12,
    // margin: 5,
    backgroundColor: '#357feb',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    width: 165,
    flex: 1,
    marginHorizontal: 20
  },
   Next2: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 8,
    // margin: 5,
    backgroundColor: '#357feb',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    width: 135,
    flex: 1,
    marginHorizontal: 20
  },
  Cancel: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 8,
    // margin: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#357feb",
    width: 135,
    flex: 1,
    marginHorizontal: 20
  },
  modalText: {
    marginVertical: 15,
    fontSize: 20,
    textAlign: "center"
  }
})


    export default PostScreen;