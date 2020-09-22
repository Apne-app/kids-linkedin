import React, { Component } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { RNS3 } from 'react-native-aws3';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, Modal, FlatList } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Spinner, Thumbnail,  List, ListItem,  Separator, Left, Body, Right, Title} from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SECRET_KEY, ACCESS_KEY } from '@env'

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

const fontConfig = {
    default: {
        regular: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
    },
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
};

function randomStr(len, arr) { 
    var ans = ''; 
    for (var i = len; i > 0; i--) { 
        ans +=  
          arr[Math.floor(Math.random() * arr.length)]; 
    } 
    return ans; 
} 

const userid = "shashwatid"
  


const PostFolder = ({ route, navigation }) => {

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
                    <Item floatingLabel>
                      <Label>Tag</Label>
                      <Input />
                    </Item>
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
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
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
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  addIcon: {
    // right: width*0.15,
    bottom: "35%",
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1
    // backgroundColor:'rgba(0,0,0,0.5)'
  },
  tinyLogo: {
    alignSelf: 'center',
    marginTop: 40
    // height: 80,
  },

  image: {
    height: width*0.65,
    width: width*0.45,
    margin: width*0.02,
    elevation: 3
    // borderRadius: 30,
    
  },
  addImg: {
    height: width*0.65,
    width: width*0.45,
    margin: width*0.02,
    borderWidth: 2,
    borderRadius: 15,
    borderStyle: 'dashed',
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
    width: width*0.31
  },
  save2: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 15,
    // margin: 5,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#357feb",
    width: width*0.31
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
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
  modalText: {
    marginVertical: 15,
    fontSize: 20,
    textAlign: "center"
  }
})

export default PostFolder;