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
import { Container,Fab, Content, Header, Tab, Left, Body, Right, Title, Tabs, ScrollableTab,  Footer, FooterTab, Button, Icon } from 'native-base';
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
    const [tags, setTags] = React.useState(['Homework', 'Certificate', 'Award', 'Other', 'Other']);
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
        

        CameraRoll.getAlbums({
                    // first: 100,
                    assetType: 'All',
                    })
                    .then(async r => {
                        // console.log(r);

                        var arr = [];
                        if(albums)
                        {

                        for(var i = 0; i < r.length; i++)
                        {
                            for(var j = 0; j < albums.length; j++)
                            {
                                if(albums[j]['albumName'] == r[i].title)
                                {
                                // console.log(albums[j], r[i].title)
                                var y = albums[j]['albumName'];
                                var z = albums[j]['tagName'];
                                    await CameraRoll.getPhotos({
                                        first: r[i].count,
                                        assetType: 'All',
                                        groupName: albums[j]['albumName']
                                    })
                                    .then(r => {
                                        // console.log(r.edges[0].node.group_name, "asd");
                                        for(var k = 0; k < r.edges.length; k++)
                                        {
                                            r.edges[k].node['checked'] = false;
                                        }
                                        arr.push( {'name': y, 'files': r.edges, 'tag': z} );
                                        // setFiles([ ...files, { 'name': y, 'files': r.edges} ])
                                        
                                    })
                                }
                            }
                        }
                        }

                        console.log(arr);
                        let tempImg = await AsyncStorage.getItem('tempImg');
                        tempImg = JSON.parse(tempImg);
                        // console.log(tempImg);
                        var array = arr;
                        if(tempImg)
                        {

                        // for(var i = 0; i < tempImg.files.length; i++)
                        // {
                        //     console.log(tempImg.files[i]);
                        //     array.push()
                        // }
                        array.push(tempImg);
                        // setFiles([ ...files, ...array ]);
                        }
                        setFiles([ ...array ]);
                    })
                    .catch((err) => {
                        //Error Loading 
                        console.log(err);
                });

                
                

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



    const viewImages = (topic) => {

        var arr = files;
        var arr2 = [];
        for(var i = 0; i < arr.length; i++)
        {
            if(topic === arr[i].name)
            {
                for(var j = 0; j < arr[i].files.length; j++)
                {
                    arr2.push({ uri: arr[i].files[j].node.image.uri });
                }
                break;
            }
        }
        setSelected([ ...arr2]);
        setSelTopic(topic);
        setVisible(true);
    }

    const showTags = async (selectedTag) => {

        var arr = await AsyncStorage.getItem('albums');
        arr = JSON.parse(arr);
        var z = [];

        if(selectedTag == 'Other') selectedTag = 'Other';

        for(var i = 0; i < files.length; i++)
        {
            if(files[i]['tag'] == selectedTag)
            {
                z.push( {'name': files[i]['name'], 'files': files[i]['files'], 'tag': selectedTag} );
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
            <Header noShadow style={{ backgroundColor: '#fff', flexDirection: 'row', height: 60, borderBottomWidth: 0, marginTop: 20 }}>
                {
                    !selecting ?
                    <Body style={{ alignItems: 'center' }}>
                    <Title style={{ fontFamily: 'Poppins-Regular', color: "#000", fontSize: 30, marginTop: 0, marginLeft: -20 }}>Your Files</Title> 
                </Body> :
                <Left>
                    <TouchableOpacity style={{marginLeft: 15}} onPress={() =>cancelSelection()} ><Icon style={{ fontSize: 40}} name="cross" type="Entypo" /></TouchableOpacity>
                </Left>
                }
                <Right style={{ marginRight: 30, marginTop: 0 }}>
                    <Icon onPress={() => { navigation.toggleDrawer(); }} name="bell" type="Feather" />
                </Right>
            </Header>
            
            

            { files.length != 0? <View style={{ flexDirection: 'row' }} >
                <FlatList
                data={tags}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                // style={{marginTop: 5}}
                renderItem={({ item, i }) => (
                    <Chip key={i} style={{ backgroundColor: tag == item ? 'green' : '#357feb', margin: 4, paddingLeft: 10, paddingRight: 10 }} textStyle={{ color: "#fff" }} onPress={() => {tag == item ? setTag(''): setTag(item); tag == item ? showAll() : showTags(item); }} >{item}</Chip>
                )}
                //Setting the number of column
                // numColumns={3}
                horizontal={true}
                />
            </View>: <View />}
                    {
                       pdfs.length == 0 && files.length == 0 ?
                    <View style={{ backgroundColor: 'white', height: height, width: width }}>
                        <Image source={require('../assets/empty.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Nothing to view here.</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Scan and add to get started!</Text>
                        
                    </View>
                :
                    files.map((it, i) => {
                    return (

                    <View key={i}>
                        <Text style={{ fontFamily: 'Poppins-Regular', color: "#00000", fontSize: 20, marginTop: 10, marginLeft: 20 }}>{it.name}-{it.tag}</Text>
                        <FlatList
                        data={it.files}
                        scrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            // flexGrow: 1,
                        }}
                        // style={{marginTop: 5}}
                        renderItem={({ item, i }) => (
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 1 }} onPress={() => viewImages(it.name)} onLongPress={() => setSelecting(true) } >
                                <View
                                key={item.node.timestamp}
                                style={{ flex: 1}}>
                                <ImageBackground
                                    style={{ height: width*0.40, width: width*0.40,margin: width*0.02, borderRadius: 15, alignItems: 'center', justifyContent: 'center',borderWidth: selecting? width*0.05 : 0, borderColor: "#000" }}
                                    imageStyle={{ borderRadius: selecting ? 0 : 15, height: selecting ? width*0.3 : "auto", width: selecting ? width*0.3 : "auto",   }}
                                    source={{
                                    uri: item.node.image.uri,
                                    }}
                                >
                                {   selecting ?
                                    <CheckBox
                                    value={item.node.checked}
                                    tintColors={{ true: 'green', false: 'red' }}
                                    onValueChange={() => {
                                        item.node.checked = !item.node.checked;
                                        setSelected([...selected, { uri: item.node.image.uri }]);
                                        setFiles([ ...files ])
                                    }}
                                    style={{opacity: 1, alignSelf: 'flex-end', color: "#fff", position: 'absolute', top: -6}}
                                />:
                                    <View/>
                                }
                                </ImageBackground>
                                </View>
                            </TouchableOpacity>
                        )}
                        //Setting the number of column
                        // numColumns={3}
                        horizontal={true}
                        keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    )
                    })
                    }
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
                <Icon type="Ionicons" name='send' style={{color: "#fff", fontSize: 35 }} />
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