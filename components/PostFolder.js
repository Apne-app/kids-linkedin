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
<<<<<<< HEAD
import { Chip } from 'react-native-paper';

=======
import ReanimatedCurvedTabBar from './react-native-curved-bottom-tabbar';
import Upload from './Post';
>>>>>>> d0718764fb67d18acbf4c86cb534f0794299a316
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const PostFolder = ({ route, navigation }) => {
<<<<<<< HEAD

    const [modalVisible, setModalVisible] = React.useState(false);

    const [uploading, setUploading] = React.useState({});

    const [explore, setExplore] = React.useState([
      {
        'height': 0,
        'width': '0',
        'uri': ''
      },
    ])


    

        const getImages = async () => {
          let x = await AsyncStorage.getItem("@scanImg");
          console.log(x);
          if(x)
          {
            if(JSON.parse(x).uri != explore[explore.length-1])
            {
              setExplore([(JSON.parse(x)), ...explore ]);
              var y = ""+String((JSON.parse(x)).uri);
              var obj = {};
              obj[String((JSON.parse(x)).uri)] = false;
              setUploading({
                ...uploading,
                ...obj
              });
            }
          }
        }

        // console.log(route.params)

        if(route.params)
    {
      if(route.params.reload)
      {
        getImages();
        console.log("asds");
        route.params.reload = 0; 
      }
    }

        // getImages();



const uploadToS3 = (i) => {

  // console.log(randomStr(20, '12345abcdepq75xyz')+'.'+explore[i].uri[explore[i].uri.length-3]+explore[i].uri[explore[i].uri.length-2]+explore[i].uri[explore[i].uri.length-1])

  const file = {
    // `uri` can also be a file system path (i.e. file://)
    uri: explore[i].uri,
    name: randomStr(20, '12345abcdepq75xyz')+'.'+explore[i].uri[explore[i].uri.length-3]+explore[i].uri[explore[i].uri.length-2]+explore[i].uri[explore[i].uri.length-1],
    type: "image/png",
  }

  const options = {
    keyPrefix: userid+"/",
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
    console.log(response.body);
    /**
    * {
    *   postResponse: {
    *     bucket: "your-bucket",
    *     etag : "9f620878e06d28774406017480a59fd4",
    *     key: "uploads/image.png",
    *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
    *   }
    * }
    */

    var obj = { ...uploading };
    var a = 0;
    if(!a)
    {
      a++;
    obj[explore[i].uri] = false;
    }

    console.log(obj, i);

    setUploading({
      ...obj
    })

  if(i == explore.length-2) alert("Uploaded");

  })
  .catch(err => {
    console.log(err);
  })
  ;

}

    const [tags, setTags] = React.useState([]);
    const [tag, setTag] = React.useState('');

    return (
      <Container>
          <Content style={styles.container}>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                alert("Modal has been closed.");
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end'}} ><Icon name="cross" type="Entypo"  /></TouchableOpacity>
                  <Text style={styles.modalText}>Add a Tag!</Text>
                    <View style={{flexDirection: 'row'}} >
                      {
                        tags.map((item, i) => {
                            return <Chip key={i} style={{backgroundColor: '#357feb', margin: 1}} textStyle={{color: "#fff"}} icon="close">{item}</Chip>
                        })
                      }
                    </View>  
                    <Item floatingLabel>
                      <Label>Tag</Label>
                      <Input value={tag} onChangeText={text => setTag(text)} />
                    </Item>
                    <View style={{flexDirection: 'row'}} >
                    <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#357feb", alignSelf: 'center', margin: 5}}
                        onPress={() => {
                          setTags([
                            ...tags,
                            tag
                          ])
                          console.log(tag)
                        }}
                      >
                        <View style={styles.save}>
                          <Text style={{color: "#fff", flex: 1, textAlign:'center'}}>
                          Add
                        </Text>
                        </View>
                      </TouchableOpacity>
                    <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 15}}
                      onPress={() => {
                        // console.log(randomStr(20, '12345abcdepq75xyz'));
                        var i;
                        setTimeout(() => {
                        setModalVisible(false)
                        }, 300);
                        var obj = {...uploading};
                        for(i = 0; i < explore.length-1; i++)
                        {
                          obj[(explore[i].uri)] = true;
                          setUploading({
                            ...obj
                          });
                        }
                        for(i = 0; i < explore.length-1; i++)
                        {
                          uploadToS3(i);
                        }
                        
                      }}
                    >
                      <View style={styles.save2}>
                        <Text style={{color: "#357feb", flex: 1, textAlign:'center'}}>
                          Upload
                        </Text>
                      </View>
                    </TouchableOpacity>
                    </View>
                </View>
              </View>
            </Modal>
          </View>
                
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#357feb", alignSelf: 'center', margin: 5}}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <View style={styles.save}>
              <Icon name="download" type="Feather" style={{color: "#fff", flex: 1}} />
                <Text style={{color: "#fff", flex: 1, marginTop: 5}}>
                  Save
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{borderRadius: 6, borderWidth: 2, borderColor: "#fff", alignSelf: 'center', margin: 5}}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <View style={styles.save2}>
              <Icon name="upload-cloud" type="Feather" style={{color: "#357feb", flex: 1}} />
                <Text style={{color: "#357feb", flex: 1, marginTop: 5}}>
                  Upload
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          
          <FlatList
            data={explore}
            renderItem={({ item }) => (
                <View>
                  {
                    item.height != 0 ?
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => console.log(uploading[item["uri"]])}>
                    <View
                    key={item.id}
                    style={{ flex: 1,}}>
                    <ImageBackground
                        style={styles.image}
                        imageStyle= {{ borderRadius: 20, opacity: uploading[item["uri"]] ? 0.5 : 1 }}
                        source={{
                        uri: item.uri,
                        }}
                    >
                    {
                      uploading[item["uri"]] ?
                     <Spinner color='blue' style={{ position: 'absolute', alignSelf: 'center', top: height*0.1 }} />
                     :
                     <View />
                    }
                    </ImageBackground>
                    </View>
              </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => navigation.navigate('Camera', {})}>
                    <View
                    key={item.uri}
                    style={{ flex: 1}}>
                    <View
                        style={styles.addImg}
                    >
                    <View style={styles.addIcon}>
                    <View >
                        <Icon type="AntDesign" name="plus"  />
                    </View>
                    </View>
                    </View>
                    </View>
              </TouchableOpacity>
                  }
                  </View>
                
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
        </Content>
      </Container>
    );
=======
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
>>>>>>> d0718764fb67d18acbf4c86cb534f0794299a316
}

export default PostFolder;