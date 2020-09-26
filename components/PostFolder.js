// /* eslint-disable eslint-comments/no-unlimited-disable */
// /* eslint-disable */
// import React, { Component, useState } from 'react';
// import { useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-community/async-storage';
// import { RNS3 } from 'react-native-aws3';
// import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, Modal, FlatList } from 'react-native'
// import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Spinner, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
// import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
// import { SECRET_KEY, ACCESS_KEY } from '@env'
// import { enableScreens } from 'react-native-screens';
// import ReanimatedCurvedTabBar from './react-native-curved-bottom-tabbar';

// import { Chip } from 'react-native-paper';

// import Upload from './Post';
// import ScanScreen from '../screens/ScanScreen';
// var height = Dimensions.get('screen').height;
// var width = Dimensions.get('screen').width;


// const PostFolder = ({ route, navigation }) => {
//   const screens = [<Upload route={route} navigation={navigation}/>, <Upload route={route} navigation={navigation}/>, <ScanScreen route={route} navigation={navigation}/>]
//   const icons = ['cloud', 'aperture', 'image']
//   const iconstext = ['Uploads', 'Scan', 'Gallery']
//   const [num, setnum] = useState(0)

//   enableScreens(false);

//   return (
//     <ReanimatedCurvedTabBar
//       height={170}
//       screensBackground={'white'}
//       topGap={15}
//       tabColor={'#357feb'}
//       backgroundColor={'white'}
//       duration={500}
//       sidesRadius={1}
//       marginBottom={23}
//       scaleYCircle={1.4}
//       iconTranslateY={-5}
//       lockTranslateYAnime={true}

//       // icon scale animation
//       // (default 1.4)
//       iconScale={1.4}
//       lockScaleAnime={true}


//       // icons drop down animation
//       // (default 30)
//       iconDropY={30}
//       allowDropAnime={true}
//       // first icon will also drop down
//       dropWithFirst={false}

//       iconsArray={[...Array(3)].map((item, index) =>
//         (<View style={{ alignSelf: 'center' }}><Icon style={{ fontSize: 20, alignSelf: 'center', color: "#fff" }} type="Feather" name={icons[index]} /><Text style={{ fontFamily: 'Poppins-Regular', alignSelf: 'center', fontSize: 9, display: 'flex', color: "#fff" }}>{iconstext[index]}</Text></View>)
//       )}
//       onPress={(btnNum) => { setnum(btnNum - 1) }}
//       screensArray={[...Array(3)].map((item, index) =>
//         screens[index]
//       )}
//     />
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     // alignItems: 'center',
//     flex: 1,
//     flexDirection: 'column',
//     // padding: 40, 
//     // paddingTop: 80
//   },
//   form: {
//     marginTop: 40,
//     flex: 1
//     // alignSelf: 'center'
//   },
//   //  image: {
//   //   flex: 1,
//   //   resizeMode: "cover",
//   //   opacity: 0.4,
//   //   justifyContent: "center",

//   // },
//   addButton: {
//     right: 10,
//     bottom: 10,
//     alignSelf: 'center',
//     position: 'absolute',
//     // flexDirection: 'row',
//     // backgroundColor:'rgba(255,255,255,0.3)'
//   },
//   personDetails: {
//     // right: width*0.15,
//     bottom: 10,
//     position: 'absolute',
//     alignSelf: 'center',
//     flexDirection: 'row',
//     padding: 10,
//     borderRadius: 15,
//     backgroundColor:'rgba(0,0,0,0.5)'
//   },
//   addIcon: {
//     // right: width*0.15,
//     bottom: "35%",
//     position: 'absolute',
//     alignSelf: 'center',
//     flexDirection: 'row',
//     padding: 20,
//     borderRadius: 15,
//     borderWidth: 1
//     // backgroundColor:'rgba(0,0,0,0.5)'
//   },
//   tinyLogo: {
//     alignSelf: 'center',
//     marginTop: 40
//     // height: 80,
//   },

//   image: {
//     height: width*0.65,
//     width: width*0.45,
//     margin: width*0.02,
//     elevation: 3
//     // borderRadius: 30,
    
//   },
//   addImg: {
//     height: width*0.65,
//     width: width*0.45,
//     margin: width*0.02,
//     borderWidth: 2,
//     borderRadius: 15,
//     borderStyle: 'dashed',
//   },
//   save: {
//     alignSelf: 'center',
//     flexDirection: 'row',
//     padding: 15,
//     // margin: 5,
//     backgroundColor: '#357feb',
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#fff",
//     width: width*0.31
//   },
//   save2: {
//     alignSelf: 'center',
//     flexDirection: 'row',
//     padding: 15,
//     // margin: 5,
//     backgroundColor: '#fff',
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#357feb",
//     width: width*0.31
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 22
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 35,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5
//   },
//   textStyle: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center"
//   },
//   modalText: {
//     marginVertical: 15,
//     fontSize: 20,
//     textAlign: "center"
//   }
// })


// export default PostFolder;