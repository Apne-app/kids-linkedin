/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, Keyboard, View, Text, Alert, BackHandler, Dimensions, Image, FlatList, TouchableOpacity, TextInput } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Spinner, Input, Toast, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer, Textarea } from 'native-base';
import axios from 'axios';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useFocusEffect } from "@react-navigation/native";
import { SliderBox } from "react-native-image-slider-box";
import { SECRET_KEY, ACCESS_KEY } from '@env'
import { RNS3 } from 'react-native-aws3';
import FastImage from 'react-native-fast-image'
import CompHeader from '../Modules/CompHeader';

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const PostScreen = ({ navigation, route }) => {
  const children = route.params.children[0]
  const goback = () => {
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
  const [tag, setTag] = useState('');
  const [caption, setCaption] = useState('')
  const [source, setsource] = useState('')
  const [last, setLast] = useState(0);
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const keyboardDidShowListener = React.useRef();
  const keyboardDidHideListener = React.useRef();
  const onKeyboardShow = event => setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);

  React.useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener('keyboardWillShow', onKeyboardShow);
    keyboardDidHideListener.current = Keyboard.addListener('keyboardWillHide', onKeyboardHide);

    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);
  function randomStr(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
      ans +=
        arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  }


  const uploadToS3 = (i, email, tagged) => {
    let file = {}
    // console.log(randomStr(20, '12345abcdepq75xyz')+'.'+explore[i].uri[explore[i].uri.length-3]+explore[i].uri[explore[i].uri.length-2]+explore[i].uri[explore[i].uri.length-1])
    var name = randomStr(20, '12345abcdepq75xyz') + '.mp4'
    if (route.params.video) {
      file = {
        // `uri` can also be a file system path (i.e. file://)
        uri: route.params.video,
        name: name,
        type: "video/mp4",
      }
    }
    else {

      var name = randomStr(20, '12345abcdepq75xyz') + '.' + images[i].uri[images[i].uri.length - 3] + images[i].uri[images[i].uri.length - 2] + images[i].uri[images[i].uri.length - 1]
      file = {
        // `uri` can also be a file system path (i.e. file://)
        uri: images[i].uri,
        name: name,
        type: "image/png",
      }
    }

    const options = {
      keyPrefix: email + "/" + tagged + "/",
      bucket: "kids-linkedin",
      region: "ap-south-1",
      accessKey: ACCESS_KEY,
      secretKey: SECRET_KEY,
      successActionStatus: 201
    }


    RNS3.put(file, options).then(response => {
      console.log("dassd")
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
      // var obj = { ...uploading };
      // var a = 0;
      // if (!a) {
      //   a++;
      //   obj[explore[i].uri] = false;
      // }

      // console.log(obj, i);

      // setUploading({
      //   ...obj
      // })

      // if (i == images.length - 2) alert("Uploaded");
      setShowToast(true);

    })
      .catch(err => {
        console.log(err);
      })
      ;
    return name;
  }

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

  const PostUpload = async (tagged) => {
    setLoading(true);
    console.log(tagged)
    var i;
    // setTimeout(() => {
    //   setModalVisible4(false)
    // }, 300);
    // var obj = { ...uploading };
    // for (i = 0; i < explore.length - 1; i++) {
    //   obj[(explore[i].uri)] = true;
    //   setUploading({
    //     ...obj
    //   });
    // }
    var children = await AsyncStorage.getItem('children')
    children = JSON.parse(children)['0']
    var allimages = [];
    var name = ''
    if (route.params.video) {
      var x = "https://d2k1j93fju3qxb.cloudfront.net/" + children['data']['gsToken'] + "/" + tagged + "/" + uploadToS3(i, children['data']['gsToken'], tagged);
      name = name + x;
    }
    else {

      for (i = 0; i < images.length; i++) {
        var x = "https://d2k1j93fju3qxb.cloudfront.net/" + children['data']['gsToken'] + "/" + tagged + "/" + uploadToS3(i, children['data']['gsToken'], tagged) + ', ';
        name = name + x;
        allimages.push(x.replace(", ", ""));
        //   if(tag == 'Certificate')
        //   {
        //     var data = JSON.stringify({"gstoken":children['data']['gsToken'],"certi_url":certi.certi_url,"certi_org":certi.certi_org,"certi_path":x});
        //     var config = {
        //       method: 'post',
        //       url: 'https://barry-2z27nzutoq-as.a.run.app/updatecerti',
        //       headers: { 
        //         'Content-Type': 'application/json'
        //       },
        //       data : data
        //     };

        //     axios(config).then(res => {
        //       if(res == "success")
        //       {
        //         console.log("success")
        //       }
        //     }).catch(err => {
        //       console.log(err);
        //     })
        //   }

      }
    }
    // setModalVisible4(false);

    // const client = connect('9ecz2uw6ezt9', children['data']['gsToken'], '96078');
    // if (route.params.video) {
    //   var activity = { "video": name, "object": caption == '' ? 'default123' : caption, "verb": "post", "tag": tagged }
    // }
    // else {
    //   var activity = { "image": name, "object": caption == '' ? 'default123' : caption, "verb": "post", "tag": tagged }
    // }
    // // var user = client.feed('timeline', '103id');
    // // user.follow('user', '49id');
    // var user = client.feed('user', String(String(children['id']) + String("id")));
    var mention = route.params.data
    axios.post('https://d6a537d093a2.ngrok.io/post', {
      user_id: children['id'],
      acc_type: children['data']['type'],
      user_image: children['data']['image'],
      images: name,
      videos: '',
      youtube: '',
      caption: caption == '' ? 'default123' : caption,
      tags: tagged,
      user_name: children['data']['name'],
      user_year: parseInt(children['data']['year']),
      mention_id: mention ? mention['id'] : null,
      mention_name: mention ? mention['name'] : null,
      mention_type: mention ? mention['type'] : null,
      mention_year: mention ? mention['year'] : null,
      mention_image: mention ? mention['image'] : null
    }, {
      headers: {
        'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
        'Content-Type': 'application/json'
      }
    }).then(async (response) => {
      if (response.data.data) {
        await AsyncStorage.setItem('postid', response.data.data)
        await AsyncStorage.setItem('newpost', 'true')
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
      else {
        console.log("error1: ", response)
        alert('There was an error posting your post, please try again later')
        navigation.pop();
      }
    }).catch((err) => {
      console.log("error1: ", err)
      alert('There was an error posting your post, please try again later')
      navigation.pop();
    })

  }

  useEffect(() => {
    setImages([...route.params.images]);
    // console.log(route.params.images)
    var arr = [];
    for (var i = 0; i < route.params.images.length; i++) {
      arr.push({ uri: route.params.images[i]["uri"], selected: i + 1 });
    }
    // console.log(arr);
    setSelection([...arr]);
    setLast(arr.length);
  }, [])

  useEffect(() => {
    const profileImage = async () => {
      var children = await AsyncStorage.getItem('children')
      if (children != null) {
        children = JSON.parse(children)['0']
        setsource(children['data']['image'])
      }
      // console.log(follows)
    }
    profileImage()
  }, [])
  return (
    <ScrollView keyboardShouldPersistTaps={'always'} style={{ backgroundColor: 'white', height: height, width: width }}>
      <CompHeader screen={'Post'} goback={goback} />
      <View style={{ height: height * 0.20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
          <FastImage style={{ width: 40, height: 40, borderRadius: 10000 }} source={{ uri: children['data']['image'] }} />
          <TextInput autoFocus={true} value={caption} onChangeText={text => setCaption(text)} numberOfLines={4} multiline={true} placeholder={'Write your caption..'} style={{ fontFamily: 'NunitoSans-Regular', fontSize: 18, textAlignVertical: 'top', width: width - 200, marginTop: -4 }} />
          <TouchableOpacity
            style={{ height: 36, display: loading ? 'none' : 'flex' }}
            onPress={() => {
              PostUpload(route.params.tag);
            }}
          >
            <View style={{ alignSelf: 'flex-end', backgroundColor: '#327FEB', width: 80, borderRadius: 5, height: 36 }}>
              <Text style={{ color: "white", alignSelf: 'center', fontSize: 17, fontFamily: 'NunitoSans-Bold', marginTop: 3.4 }}>
                Post
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('TagScreen', { screen:'VideoPreview' })} style={{ paddingHorizontal: 22, paddingVertical: 6, marginBottom: 10, flexDirection: 'row', borderWidth: 0.2}}>
          {route.params.data ? <>
              <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, color: 'black', marginLeft: 0, marginTop: 2 }}>{titleCase(route.params.data.name)}</Text>
              <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 13, color: 'black', marginLeft: 4, marginTop: 10, color: '#327FEB' }}>{route.params.data.type}</Text>
          </> :
              <View style={{ justifyContent: 'space-evenly', flexDirection: 'row' }}>
                  <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 20, color: 'black', width: width / 2 }}>Tag Teacher</Text>
                  <Icon name="chevron-right" type="Feather" style={{ width: width / 2, textAlign: 'right' }} /></View>}
      </TouchableOpacity>
      {/* <Snackbar
        visible={showToast}
        style={{ marginBottom: height * 0.1 }}
        duration={1500}
        onDismiss={() => setShowToast(false)}
        action={{
          label: 'Done',
          onPress: () => {
            // Do something
            // navigation.pop();
          },
        }}>
        Posted Successfully!
            </Snackbar> */}

      {
        route.params.video ?
          <VideoPlayer
            seekColor={'#327FEB'}
            toggleResizeModeOnFullscreen={false}
            tapAnywhereToPause={true}
            paused={true}
            disableFullscreen={true}
            disableBack={true}
            disableVolume={true}
            style={{ borderRadius: 0, width: width, height: height * 0 }}
            source={{ uri: route.params.video }}
            navigator={navigation}
          // onEnterFullscreen={()=>navigation.navigate('VideoFull',{'uri':props.activity.video})}
          />
          :
          images.length > 1 ?
            <SliderBox
              images={images}
              dotColor="#327FEB"
              inactiveDotColor="#90A4AE"
              paginationBoxVerticalPadding={20}
              sliderBoxHeight={height * 0.5}
              ImageComponentStyle={{ width: width, height: height * 0.47, }}
              circleLoop={true}
            // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
            // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
            /> :
            images.length == 1 ?
              <SliderBox
                images={images}
                dotColor="#327FEB"
                inactiveDotColor="#90A4AE"
                paginationBoxVerticalPadding={20}
                sliderBoxHeight={height * 0.5}
                ImageComponentStyle={{ width: width, height: height * 0.47, }}
                circleLoop={true}
              // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
              // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
              />
              :
              route.params.images.length == 0 ?
                null
                :
                <SliderBox
                  images={[""]}
                  dotColor="#327FEB"
                  inactiveDotColor="#90A4AE"
                  paginationBoxVerticalPadding={20}
                  sliderBoxHeight={height * 0.5}
                  ImageComponentStyle={{ width: width, height: height * 0.47, }}
                  circleLoop={true}
                // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
                />
      }
      <ScrollView>
        <FlatList
          style={{ marginTop: 10 }}
          data={selection}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={{ flexDirection: 'column', margin: 1, }} onPress={() => {
              var arr = [...selection];
              arr[index]['selected'] = !arr[index]['selected'];
              // for(var i = index+1; i < arr.length; i++)
              // {
              //   arr[index]['selected'] = arr[index]['selected']-1;
              // }
              setSelection([...arr])
              arr = [...images];
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
              if (ar.length == arr.length) {
                // console.log(ar)
                ar.push({ uri: selection[index]['uri'] })
              }
              // console.log(ar, arr);
              setImages([...ar]);
            }}>
              <View style={{ width: item.selected ? 33 : 28, height: item.selected ? 33 : 28, borderRadius: 20, backgroundColor: item.selected ? "#327feb" : "#fff", borderColor: item.selected ? "#fff" : "#327feb", borderWidth: item.selected ? 3 : 3, position: 'absolute', opacity: 1, zIndex: 100, top: 5, right: 5, alignItems: 'center', justifyContent: 'center' }} >
                {item.selected ? <Icon type="Feather" name="check" style={{ color: "#fff", fontSize: 22 }} /> : null}
              </View>
              <Image source={{ uri: item.uri }} style={{ width: height * 0.1, height: height * 0.1, opacity: selection[index]['selected'] ? 0.6 : 1 }} />
            </TouchableOpacity>
          )}
          //Setting the number of column
          // numColumns={4}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          keyExtractor={(item, index) => index.toString()}
        />
        {/* <TouchableOpacity
          style={{ height: 60 }}
          onPress={() => {
            PostUpload(route.params.tag);
            // var ar = explore;
            // var arr = [];
            // for(var i = 1; i < ar.length; i++)
            // {
            //   arr.push({ uri: 'file://'+ar[i]["uri"] })
            // }
            // navigation.navigate('CreatePost', { images: arr })
          }}
        >
          <View style={styles.Next}>
            <Text style={{ color: "#fff", flex: 1, textAlign: 'center', fontSize: 17, fontFamily: 'NunitoSans-Bold' }}>
              Post
                        </Text>
          </View>
        </TouchableOpacity> */}
      </ScrollView>
      {loading ? <View style={{ backgroundColor: '#327FEB', height: 310, borderTopLeftRadius: 20, borderTopRightRadius: 20, display: loading ? 'flex' : 'none', position: loading ? 'absolute' : 'relative', bottom: 0, width: width }}>
        <Image style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '20%' }} source={require('../assets/log_loader.gif')} />
        <Text style={{ textAlign: 'center', fontFamily: 'NunitoSans-Bold', fontSize: 20, color: 'white' }}>Posting...</Text>
      </View> : null}
    </ScrollView>
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
    backgroundColor: '#327FEB',
    // borderWidth: 1,
    borderColor: "#fff"
    // backgroundColor:'rgba(0,0,0,0.5)'
  },
  tinyLogo: {
    alignSelf: 'center',
    marginTop: 40
    // height: 80,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
    borderColor: "#327FEB",
    borderWidth: 3,
    borderStyle: "dashed",
    backgroundColor: "#fff"
    // borderStyle: 'dashed',
  },
  save: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 15,
    // margin: 5,
    backgroundColor: '#327FEB',
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
    backgroundColor: '#327FEB',
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
    borderColor: "#327FEB",
    width: width * 0.31
  },
  save3: {
    // alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    // margin: 5,
    // backgroundColor: '#327FEB',
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0,0, 0.4)',
    height: height,
    alignItems: 'center',
    justifyContent: 'center'
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
    backgroundColor: '#327FEB',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    width: 165,
    marginTop: 10,
    flex: 1,
    marginHorizontal: 20
  },
  Next2: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 8,
    // margin: 5,
    backgroundColor: '#327FEB',
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
    borderColor: "#327FEB",
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