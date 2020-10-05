/* eslint-disable eslint-comments/no-unlimited-disable */
//*This is an Example of Grid Image Gallery in React Native*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Modal,
  AsyncStorage,
  ScrollView
} from 'react-native';
import { Container, Header, Tab, Tabs, ScrollableTab, Footer, FooterTab, Button, Icon } from 'native-base';
import CameraRoll from "@react-native-community/cameraroll";


var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
// import FastImage from 'react-native-fast-image';

const Gallery = ({navigation, route}) =>  {

    const [gallery, setGallery] = React.useState([]);

    const[selected, setSelected] = React.useState('');


    // console.log(route.params);

    React.useEffect(() => {

        const func = async () => {

            try {
                const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    'title': 'Access Storage',
                    'message': 'Access Storage for the pictures'
                }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use read from the storage");

                 CameraRoll.getPhotos({
                    first: 100,
                    assetType: 'All',
                    })
                    .then(r => {
                    setGallery([ ...r.edges ]);
                    setSelected(r.edges[0].node.image.uri)
                    console.log(r.edges[0].node.image.uri);
                    })
                    .catch((err) => {
                        //Error Loading 
                        console.log(err);
                });

                } else {
                console.log("Storage permission denied")
                }
            } catch (err) {
                console.warn(err)
            }
        }
        func();
    }, [])

  

   
      return (
        <ScrollView style={styles.container}>
            <View style={{width: width, height: height*0.4}}>
             <Image
                    style={{height: height*0.4}}
                    resizeMode="cover"

                    source={{
                      uri: selected,
                    }}
                  />
            </View>
            <FlatList
            data={gallery}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                <TouchableOpacity
                  key={item.id}
                  style={{ flex: 1 }}
                  onPress={() => {
                    setSelected(item.node.image.uri)
                    console.log(item);  
                  }}>
                  {/*console.log(item.node.image.uri)*/}
                  <Image
                    style={styles.image}
                    source={{
                      uri: item.node.image.uri,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      );
    
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 30,
  },
  image: {
    height: 120,
    width: 120,
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    right: 9,
    position: 'absolute',
  },
});

export default Gallery;