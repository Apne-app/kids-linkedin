import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
  PermissionsAndroid,
  Modal,
  Platform,
  ImageBackground,
  ScrollView,
  CheckBox
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container,Fab, Content, Header, Tab, Left, Body, Right, Title, Tabs, ScrollableTab, Card, CardItem, Footer, FooterTab, Button, Icon } from 'native-base';
import CameraRoll from "@react-native-community/cameraroll";
import { Chip } from 'react-native-paper';
import ImageView from "react-native-image-viewing";
import { RNS3 } from 'react-native-aws3';
var RNFS = require('react-native-fs');

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

var dir_path = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath;

const FileScreen = (props) => {
    

    const [files, setFiles] = React.useState([]);
    const [pdfs, setPDFS] = React.useState([]);
    const [selecting, setSelecting] = React.useState(false);
    const [selected, setSelected] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [seltopic, setSelTopic] = React.useState('');
    const [tagsPresent, setTagsPresent] = React.useState(false)
    const [tags, setTags] = React.useState(['All', 'Homework', 'Certificate', 'Award', 'Other']);
    const [tag, setTag] = React.useState('');

    const [refreshing, setRefreshing] = React.useState(false);


  const uploadToS3 = (i, email) => {

    // console.log(randomStr(20, '12345abcdepq75xyz')+'.'+explore[i].uri[explore[i].uri.length-3]+explore[i].uri[explore[i].uri.length-2]+explore[i].uri[explore[i].uri.length-1])
    var name = randomStr(20, '12345abcdepq75xyz') + '.' + selected[i].uri[selected[i].uri.length - 3] + selected[i].uri[selected[i].uri.length - 2] + selected[i].uri[selected[i].uri.length - 1]
    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: selected[i].uri,
      name: name,
      type: "image/png",
    }

    const options = {
      keyPrefix: email + "/",
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

      var obj = { ...uploading };
      var a = 0;
      if (!a) {
        a++;
        obj[selected[i].uri] = false;
      }

      console.log(obj, i);

      setUploading({
        ...obj
      })

      if (i == selected.length - 2) alert("Uploaded");

    })
      .catch(err => {
        console.log(err);
      })
      ;
    return name;
  }


    const cancelSelection = () => {

        var arr = files;
        // console.log(arr[0].files[0].node.checked);

        for(var i = 0; i < arr.length; i++)
        {
            // arr[i].files.node.checked = false;
            for(var j = 0; j < arr[i].files.length; j++)
            {
                // console.log("asd");
                if(arr[i].files[j].node.checked)
                {

                console.log(arr[i].files[j].node.checked);
                arr[i].files[j].node.checked = false;
                }
            }
        }

        setFiles([...arr]);

        setSelecting(false);

    }

    const showAll = async () => {

        let albums = await AsyncStorage.getItem("albums");
            // console.log(albums);
            albums = JSON.parse(albums);
            // console.log(albums);


        RNFS.readDir(`${dir_path}/Images`)
            .then((result) => {
                console.log('GOT RESULT', result.length);

                var fls = [];

                result.map((item, i) => {
                    fls.push(item.path)
                })

                fls.sort();
                var arr = [];
                
                for(var i = 0; i < fls.length; )
                {
                    // console.log(fls)
                    var m = fls[i];
                    // i++;
                    var tmp = [];
                    while( i < fls.length && fls[i].split('_')[1].split('-')[0] == m.split('_')[1].split('-')[0])
                    {
                        tmp.push(fls[i]);
                        i++;
                    }
                    arr.push({ 'time': m.split('_')[1].split('-')[0], 'images': tmp, tag: m.split('_')[0].split('Images/')[1] });
                }
                // console.log(arr);
                setFiles([ ...arr ])
                console.log(arr)

            })
            .catch((err) => {
                console.log(err.message, err.code);
        });
        

        // CameraRoll.getAlbums({
        //             // first: 100,
        //             assetType: 'All',
        //             })
        //             .then(async r => {
        //                 // console.log(r);

        //                 var arr = [];
        //                 var fls = [];
        //                 if(albums)
        //                 {

        //                 for(var i = 0; i < r.length; i++)
        //                 {
        //                     for(var j = 0; j < albums.length; j++)
        //                     {
        //                         if(albums[j]['albumName'] == r[i].title)
        //                         {
        //                         // console.log(albums[j], r[i].title)
        //                         var y = albums[j]['albumName'];
        //                         var z = albums[j]['tagName'];
        //                             await CameraRoll.getPhotos({
        //                                 first: r[i].count,
        //                                 assetType: 'All',
        //                                 groupName: albums[j]['albumName']
        //                             })
        //                             .then(r => {
        //                                 // console.log(r.edges[0].node.group_name, "asd");
        //                                 for(var k = 0; k < r.edges.length; k++)
        //                                 {
        //                                     r.edges[k].node['checked'] = false;
        //                                 }
        //                                 arr.push( {'name': y, 'files': r.edges, 'tag': z} );
        //                                 fls.push({...r.edges, 'tag': z});
        //                                 // setFiles([ ...files, { 'name': y, 'files': r.edges} ])
                                        
        //                             })
        //                         }
        //                     }
        //                 }
        //                 }

        //                 // fls.sort(function(x, y){
        //                 //     return x.node.timestamp - y.node.timestamp;
        //                 // })

        //                 console.log('aasasa',fls);
        //                 var filesss = [];

        //                 // for(var m = 0; m < fls.length; )
        //                 // {
        //                 //     var mb = fls[m].node.timestamp;
        //                 //     var tempArr = [], tag = 
        //                 //     while(fls[m].node.timestamp == mb)
        //                 //     {

        //                 //     }
        //                 // }


        //                 console.log(arr);
        //                 let tempImg = await AsyncStorage.getItem('tempImg');
        //                 tempImg = JSON.parse(tempImg);
        //                 // console.log(tempImg);
        //                 var array = arr;
        //                 if(tempImg)
        //                 {

        //                 // for(var i = 0; i < tempImg.files.length; i++)
        //                 // {
        //                 //     console.log(tempImg.files[i]);
        //                 //     array.push()
        //                 // }
                        
        //                 array.push(tempImg);
        //                 // setFiles([ ...files, ...array ]);
        //                 }
        //                 setFiles([ ...array ]);
        //             })
        //             .catch((err) => {
        //                 //Error Loading 
        //                 console.log(err);
        //         });

                
                

    }


    React.useEffect(() => {


        const func = async () => {

            let albums = await AsyncStorage.getItem("albums");
            // console.log(albums);
            albums = JSON.parse(albums);

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

                    await showAll();

                } else {
                console.log("Storage permission denied")
                }
            } catch (err) {
                console.warn(err)
            }
        }
        func();
    }, [])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        const func = async () => {

            let albums = await AsyncStorage.getItem("albums");
            // console.log(albums);
            albums = JSON.parse(albums);

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

                    await showAll();
                    setRefreshing(false);

                } else {
                console.log("Storage permission denied")
                setRefreshing(false);
                }
            } catch (err) {
                console.warn(err)
                setRefreshing(false);
            }
        }
        func();

        
    }, []);



    const viewImages = (time) => {

        var arr = [...files];
        var arr2 = [];
        for(var i = 0; i < arr.length; i++)
        {

            if(time === arr[i].time)
            {
                for(var j = 0; j < arr[i].images.length; j++)
                {
                    arr2.push({ uri: arr[i].images[j], height: 200 });
                }
                break;
            }
        }
        console.log(arr2)
        props.navigation.navigate('PostScreen', { "selected": [ ...arr2] })
        // setSelected([ ...arr2]);
        // setSelTopic(topic);
        // setVisible(true);
    }

    const showTags = async (tag) => {

        // var arr = await AsyncStorage.getItem('albums');
        // arr = JSON.parse(arr);
        var z = [];

        if(tag == 'Other') tag = 'Other';

        if(tag == 'All') 
        {
            showAll();
            return;
        }

        for(var i = 0; i < files.length; i++)
        {
            if(files[i]['tag'] == tag)
            {
                // { 'time': m.split('_')[1].split('-')[0], 'images': tmp, tag: m.split('_')[0].split('Images/')[1] }
                z.push(files[i]);
            }
        }

        setFiles([ ...z ]);


    }

  

    return (
        <Container >
            <ImageView
                images={selected}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => {setSelected([]); cancelSelection(); setVisible(false);setSelTopic(''); setSelecting(false)}}
                HeaderComponent = {() => {
                    return <Text style={{color: "#fff", fontSize: 26, margin: 20}}>{seltopic}</Text>
                }}
                FooterComponent = {() => {
                    return (
                        <View>
                            <TouchableOpacity style={{ marginBottom: height*0.06, marginLeft: width*0.83, width: 60,zIndex: 1000000, backgroundColor: "#357feb", borderRadius: 30, height: 60, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                                setSelected([]); cancelSelection(); setVisible(false);setSelTopic(''); setSelecting(false)
                                props.navigation.navigate('PostScreen', { "selected": selected })
                            }}><Icon type="FontAwesome" name='send' style={{color: "#fff", fontSize: 35, marginRight: 4 }} /></TouchableOpacity>
                        </View>
                    )
                }}
            />
            <ScrollView
                refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
            >
            <Header  style={{ backgroundColor: '#fff', flexDirection: 'row',  height: 73, paddingTop: 25, paddingBottom: 20, elevation: 2 }}>
                {
                    !selecting ?
                    <Body style={{ alignItems: 'center' }}>
                    <Title style={{ fontFamily: 'NunitoSans-Regular', color: "#000", fontSize: 28, marginTop: 0 }}>Collections</Title> 
                </Body> :
                <Left>
                    <TouchableOpacity style={{marginLeft: 15}} onPress={() =>cancelSelection()} ><Icon style={{ fontSize: 40}} name="x" type="Feather" /></TouchableOpacity>
                </Left>
                }
                <Right style={{ marginRight: 30,}}>
                    <Icon style={{fontSize: 28}} onPress={() => { navigation.toggleDrawer(); }} name="bell" type="Feather" />
                </Right>
            </Header>
            
            

            { files.length != 0  || tagsPresent ? <View style={{ flexDirection: 'row' }} >
                <FlatList
                data={tags}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    marginHorizontal: width*0.05
                }}
                // style={{marginTop: 5}}
                renderItem={({ item, i }) => (
                    <Chip key={i} style={{ backgroundColor: tag == item ? '#357feb' : '#fff', margin: 4, paddingLeft: 10, paddingRight: 10, borderWidth: tag != item ? 1 : 0, borderColor: "#357feb" }} textStyle={{ color: tag == item ? "#fff" : "#357feb" }} onPress={() => {tag == item ? setTag(''): setTag(item); tag == item ? showAll() : showTags(item); setTagsPresent(true); }} >{item}</Chip>
                )}
                //Setting the number of column
                // numColumns={3}
                horizontal={true}
                />
            </View>: <View />}
                    
                   { files.length != 0 ?  
                   files.map((item, i) => {
                    return (
                    <View style={{paddingHorizontal: width*0.05, marginTop: 30}}>
                    <TouchableOpacity
                    style={{borderRadius: 20}}
                        onPress={() => {
                            viewImages(item["time"]);
                           //  console.log(selected);
                           //  
                        }}>
                        <Card style={{borderRadius: 20}} >
                            <CardItem style={{marginVertical: 5, flexDirection: 'column', borderRadius: 20}}>
                            <Text style={{fontFamily: 'NunitoSans-Regular', alignSelf: 'flex-start', marginHorizontal: 4, marginBottom: 10}}>{Date(item["time"].split("GMT")[0])}</Text>
                            <Body style={{flexDirection: 'row'}}>
                            {
                                item["images"].map((it, ind) => {
                                    console.log(it);
                                    if(ind < 2 || item["images"].length == 3 )
                                    {
                                    return <Image style={{height: width*0.24, width: width*0.24, marginHorizontal: width*0.01, borderRadius: 20}} source={{uri: "file://"+it}} />;
                                    }
                                })
                            }
                            { item["images"].length-2 > 0 && item["images"].length > 3 ? <View
                             style={{height: width*0.24, width: width*0.24, marginHorizontal: width*0.01, borderColor: "#357feb", borderWidth: 3,borderStyle:"dashed",borderRadius: 20, justifyContent: 'center'}} >
                                <View style={{backgroundColor: "#fff", width: width*0.15, alignItems: 'center', alignSelf: 'center', borderRadius: width*0.15, height: width*0.15, justifyContent: 'center'}}>
                                    <Text style={{color: "#000", fontFamily: 'NunitoSans-Regular',}}>+ {item["images"].length-2} more</Text>
                                    <Text style={{color: "#000"}}>More</Text>
                                </View>
                            </View> : null}
                            </Body>
                            { item.tag !== 'Genio' ? <Chip key={i} style={{ backgroundColor: '#357feb' , margin: 4, marginTop: 16, paddingLeft: 5, paddingRight: 5, borderWidth: 0, borderColor: "#357feb", alignSelf: 'flex-start' }} textStyle={{ color: "#fff" }}>{item.tag == 'Genio' ? 'None': item.tag }</Chip> : null}
                            
                            </CardItem>
                        </Card>
                    </TouchableOpacity>
                    </View> 
                    )
                   })
                   :
                    <View style={{ backgroundColor: 'white', height: height, width: width }}>
                        <Image source={require('../assets/empty.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
                        <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Nothing to view here.</Text>
                        <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Scan and add to get started!</Text>
                        
                    </View>}
                    <View style={{height: height*0.07}} />
                </ScrollView>
            {
                selecting ?
                <Fab
                active={selecting}
                direction="up"
                containerStyle={{ right: 8 }}
                style={{ backgroundColor: '#357feb', bottom: height*0.08}}
                position="bottomRight"
                onPress={() => setVisible(true)}
                >
                <Icon type="FontAwesome" name='send' style={{color: "#fff", fontSize: 27, marginRight: 5 }} />
            </Fab>:
            <View />
            }
        </Container>

    )

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
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  tinyLogo: {
    alignSelf: 'center',
    marginTop: 40
    // height: 80,
  },

  image: {
    height: width * 0.40,
    width: width * 0.40,
    margin: width * 0.02,
    borderRadius: 15,
    // opacity: 0.6
  },
})


export default FileScreen;