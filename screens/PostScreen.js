/* eslint-disable eslint-comments/no-unlimited-disable */

// //*This is an Example of Grid Image Gallery in React Native*/
// import React, { Component } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   FlatList,
//   PermissionsAndroid,
//   Modal,
// } from 'react-native';
// import { Container, Header, Tab, Tabs, ScrollableTab } from 'native-base';
// import CameraRoll from "@react-native-community/cameraroll";
// import Camera from '../components/Camera'
// import PostFolder from '../components/PostFolder'
// var height = Dimensions.get('screen').height;
// var width = Dimensions.get('screen').width;
// // import FastImage from 'react-native-fast-image';

// const PostScreen = ({navigation}) =>  {

//     const [gallery, setGallery] = React.useState([]);

//     React.useEffect(() => {

//         const func = async () => {
//             try {
//                 const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//                 {
//                     'title': 'Access Storage',
//                     'message': 'Access Storage for the pictures'
//                 }
//                 )
//                 if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//                 console.log("You can use read from the storage");

//                  CameraRoll.getPhotos({
//                     first: 20,
//                     assetType: 'All',
//                     })
//                     .then(r => {
//                     setGallery([ ...r.edges ]);
//                     console.log(r.edges[0].node.image.uri);
//                     })
//                     .catch((err) => {
//                         //Error Loading 
//                         console.log(err);
//                 });

//                 } else {
//                 console.log("Storage permission denied")
//                 }
//             } catch (err) {
//                 console.warn(err)
//             }
//         }
//         func();
//     }, [])

  

   
//       return (
//         <Container style={styles.container}>
        
//           <Tabs renderTabBar={()=> <ScrollableTab />}>
//           <Tab heading="Gallery" style={{width: width}}>
//             <View style={{width: width, height: height*0.4}}>
//              <Image
//                     style={{height: height*0.4}}
//                     resizeMode="cover"

//                     source={{
//                       uri: "https://lh3.googleusercontent.com/R-_Cm5tTFp8CD4gVcEn1ddjSeaGjwkCnSMgTUhYIz5hXH-8Bcflf8JD5TWaQ0gpSIvG2kfPxGxE=w544-h544-l90-rj",
//                     }}
//                   />
//             </View>
//             <FlatList
//             data={gallery}
//             renderItem={({ item }) => (
//               <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
//                 <TouchableOpacity
//                   key={item.id}
//                   style={{ flex: 1 }}
//                   onPress={() => {
//                     console.log(item);
//                   }}>
//                   {/*console.log(item.node.image.uri)*/}
//                   <Image
//                     style={styles.image}
//                     source={{
//                       uri: item.node.image.uri,
//                     }}
//                   />
//                 </TouchableOpacity>
//               </View>
//             )}
//             //Setting the number of column
//             numColumns={3}
//             keyExtractor={(item, index) => index.toString()}
//           />
//           </Tab>
//           <Tab heading="Picture">
//               <PostFolder navigation={navigation} />
//           </Tab>
//           <Tab heading="Video">
            
//           </Tab>
//         </Tabs>
          
//         </Container>
//       );
    
/* eslint-disable */
import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { StatusUpdateForm, StreamApp } from 'react-native-activity-feed';
const PostScreen = () => {
  const activity = {
    actor: {
      data: {
        name: 'Terry Walker',
        profileImage: 'https://randomuser.me/api/portraits/women/48.jpg',
      },
    },
    object: 'Hey @Thierry how are you doing?',
    verb: 'post',
    time: new Date(),
  };

  return (
    <StreamApp
      apiKey={'dfm952s3p57q'}
      appId={'90935'}
      token={'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDlpZCJ9.A89Wjxxk_7hVBFyoSREkPhLCHsYY6Vq66MrBuOTm_mQ'}
    >
      <StatusUpdateForm
      />
    </StreamApp>
  );
}

export default PostScreen;
