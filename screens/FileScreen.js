/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import {
    React, 
    Component, 
    useEffect,
    StyleSheet, Text, View, Image, Dimensions, FlatList, RefreshControl, PermissionsAndroid, BackHandler, Modal, Platform, ImageBackground, ScrollView, CheckBox,
    AsyncStorage,
    Container, Fab, Content, Header, Tab, Left, Body, Right, Title, Tabs, ScrollableTab, Card, CardItem, Footer, FooterTab, Button, Icon,
    axios,
    analytics, getUniqueId, getManufacturer,
    CameraRoll,
    Chip,
    ImageView,
    useFocusEffect,
    ScreenHeader,
    CompButton,
    TouchableOpacity,
    reverse,
    height,
    width
} from '../Modules/CommonImports.js';
var RNFS = require('react-native-fs');


var dir_path = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath;

const FileScreen = (props) => {


    const [files, setFiles] = React.useState([]);
    const [pdfs, setPDFS] = React.useState([]);
    const [selecting, setSelecting] = React.useState(false);
    const [selected, setSelected] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [seltopic, setSelTopic] = React.useState('');
    const [synced, setSynced] = React.useState(false);
    const [stringImages, setStringImages] = React.useState("");
    const [tagsPresent, setTagsPresent] = React.useState(false)
    const [tags, setTags] = React.useState(['All', 'Homework', 'Certificate', 'Award', 'Other']);
    const [tag, setTag] = React.useState('All');
    const status = props.route.params.status

    const [refreshing, setRefreshing] = React.useState(false);



    useFocusEffect(
        React.useCallback(() => {
            // uploadToS3();
            const onBackPress = () => {
                props.navigation.navigate('Home', { screen: 'Feed' })
                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, []));

    useEffect(() => {
        const check = async () => {
            var x = props.route.params.children;
            if (x) {
                if (Object.keys(x).length == 0) {
                    await AsyncStorage.removeItem('children');
                    x = null
                }
                analytics.screen('Collections Screen', {
                    userID: x ? x["0"]["data"]["gsToken"] : null,
                    deviceID: getUniqueId()
                })
            }
            else {
                analytics.screen('Collections Screen', {
                    userID: null,
                    deviceID: getUniqueId()
                })
            }
            // setstatus(st)
        }
        check()
    }, [])



    const cancelSelection = () => {

        var arr = files;
        // console.log(arr[0].files[0].node.checked);

        for (var i = 0; i < arr.length; i++) {
            // arr[i].files.node.checked = false;
            for (var j = 0; j < arr[i].files.length; j++) {
                // console.log("asd");
                if (arr[i].files[j].node.checked) {

                    // console.log(arr[i].files[j].node.checked);
                    arr[i].files[j].node.checked = false;
                }
            }
        }
        arr = reverse(arr)
        setFiles([...arr]);

        setSelecting(false);

    }

    const showAll = async () => {
        var fls = [];
        var s = "";
        var x = props.route.params.children
        // console.log(x)
        try{
            x = x["0"]["data"]["gsToken"];
        }
        catch(err){
            
        }

        if(status == 3)
        {

            try {
                
            // console.log(data)
            var config = {
                method: 'get',
                url: `https://w9od15z398.execute-api.ap-south-1.amazonaws.com/default/getCollections?token=${x}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    var arry = [];
                    var ar1 = [...fls]
                    // console.log(response.data)
                    // var s = stringImages;
                    for (var i = 0; i < response.data["0"].length;) {
                        var m = response.data["0"][i].split(x + '/')[1].split('/')[0];
                        s = s + m+'-'+response.data.length + ', ';
                        // console.log(stringImages.includes(m), m, stringImages, s.includes(m), response.data["0"][i]);
                        // if(s.includes(m+response.data.length))
                        // {
                        //     // console.log(m, 'asdas');
                        //     i++;
                        //     continue;
                        // }
                        // s += m + ', ';
                        var n = JSON.parse(m);
                        var tme = new Date(n);
                        tme = tme.toString();
                        setSynced(true);
                        // console.log(tme)
                        var ar = [];
                        while (i < response.data["0"].length && response.data["0"][i].split(x + '/')[1].split('/')[0] == m) {
                            ar.push({ 'name': response.data["0"][i].split(x + '/')[1].split('/')[1], 'path': response.data["0"][i], 'time': tme })
                            i++;
                        }
                        if (/*!s.includes(m)*/1) {
                            arry.push({ 'cloud': 1, 'images': ar, 'timestamp': tme });
                        }
                    }
                    // console.log(s, "adasaa");
                    var amp = [...arry, ...fls]
                    // console.log(amp[0]);
                    amp.sort(function (a, b) {
                        var keyA = a.timestamp,
                            keyB = b.timestamp;
                        // Compare the 2 dates
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    });
                    // setStringImages(s);
                    amp = reverse(amp)
                    // setFiles([...amp])
                    return amp
                    
                })
                .then(async (amp) => {
                    try {

                        var result = await RNFS.readDir(`${dir_path}/Images`);
                        for (var i = 0; i < result.length; i++) {
                            var res = await RNFS.readDir(result[i]['path']);
                            if(s.includes(res[0]['name'].split('_')[1].split('-')[0]+'-'+res.length))
                            {
                                console.log('asdas');
                                i++;
                                continue;
                            }
                            fls.push({ 'images': res, 'cloud': 0, "timestamp": result[i]['name'] });
                            // console.log(res.length);
                            
                        }
                        setStringImages(s);
                        fls.sort();
                        // console.log(fls[0]['images']);
                        fls = reverse(fls)
                        setFiles([...amp]);
                        setSynced(true)
                    }
                    catch (err) {
                        console.log(err);
                        setSynced(true)
                    }
                })
                .catch(function (error) {
                    console.log(error, "asdas");
                    setSynced(true);
                });
            }
            catch (error) {
                setSynced(true);
            }
        }
        else
        {
            setSynced(true);
        }



        
        // setTimeout(() => {
            
        // }, 1000);
        
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
                        'message': 'Access Storage for the pictures',
                        'buttonPositive': 'Ok'
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
        setSynced(false);

        const func = async () => {

            setTag('All')

            let albums = await AsyncStorage.getItem("albums");
            // console.log(albums);
            albums = JSON.parse(albums);

            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        'title': 'Access Storage',
                        'message': 'Access Storage for the pictures',
                        'buttonPositive': 'Ok'
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



    const viewImages = async (i, tm, tg) => {

        var x = props.route.params.children;
        analytics.track('A collection Selected to view', {
            userID: x ? x["0"]["data"]["gsToken"] : null,
            deviceID: getUniqueId()
        })
        var arr = [...files];
        arr = arr[i]['images'];
        var arr2 = [];
        tm = JSON.parse(tm);
        // console.log(tm);
        for (var j = 0; j < arr.length; j++) {

            arr2.push(({ uri: arr[j]['path'], height: 200 }));
        }
        props.navigation.navigate('PostScreen', { "selected": [...arr2], 'edit': 1, 'newTime': tm, 'tag': tg })
    }

    const convertDate = (tm) => {
        var d = new Date(JSON.parse(tm));
        console.log(tm)

        return d.toLocaleString();
        //  return d;
    }


    const showTags = async (tag) => {

        // var arr = await AsyncStorage.getItem('albums');
        // arr = JSON.parse(arr);
        var z = [];

        if (tag == 'Other') tag = 'Other';

        if (tag == 'All') {
            showAll();
            return;
        }

        for (var i = 0; i < files.length; i++) {
            // console.log(files[i]['images'][0]['name'].split('_')[0]);
            if (files[i]['images'][0]['name'].split('_')[0] == tag) {
                // { 'time': m.split('_')[1].split('-')[0], 'images': tmp, tag: m.split('_')[0].split('Images/')[1] }
                z.push(files[i]);
            }
        }
        z = reverse(z)
        setFiles([...z]);


    }

    const createDate = (x) => {
        x = x.replace(/-/g, ":");
        var a = Date.parse(x);
        var b = new Date();
        // console.log(a)
        var da = x.split('GMT')[0].split(' ')
        da = da[0] + ', ' + da[1] + ' ' + da[2] + ' ' + da[3]
        return b - a < 86400000 ? ['Today'] : b - a < 2 * 86400000 ? ['Yesterday'] : da;
    }



    return (
        <Container>
            <ScreenHeader screen={'Collections'} />
            {status === '3' ? null : <TouchableOpacity onPress={() => props.navigation.navigate('Login', { screen: 'Files', type: 'collections_banner' })}><CompButton message={'Signup/Login to backup your collections'} /></TouchableOpacity>}
            <ImageView
                images={selected}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => { setSelected([]); cancelSelection(); setVisible(false); setSelTopic(''); setSelecting(false) }}
                HeaderComponent={() => {
                    return <Text style={{ color: "#fff", fontSize: 26, margin: 20 }}>{seltopic}</Text>
                }}
                FooterComponent={() => {
                    return (
                        <View>
                            <TouchableOpacity style={{ marginBottom: height * 0.06, marginLeft: width * 0.83, width: 60, zIndex: 1000000, backgroundColor: "#327FEB", borderRadius: 30, height: 60, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                                setSelected([]); cancelSelection(); setVisible(false); setSelTopic(''); setSelecting(false)
                                props.navigation.navigate('PostScreen', { "selected": selected })
                            }}><Icon type="FontAwesome" name='send' style={{ color: "#fff", fontSize: 35, marginRight: 4 }} /></TouchableOpacity>
                        </View>
                    )
                }}
            />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {files.length != 0 || tagsPresent ? <View style={{ flexDirection: 'row' }} >
                    <FlatList
                        data={tags}
                        scrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            marginHorizontal: 20,
                            marginTop: 20
                        }}
                        // style={{marginTop: 5}}
                        renderItem={({ item, i }) => (
                            <Chip key={i} style={{ backgroundColor: tag == item ? '#327FEB' : '#fff', margin: 4, paddingLeft: 10, paddingRight: 10, borderWidth: tag != item ? 1 : 0, borderColor: "#327FEB" }} textStyle={{ color: tag == item ? "#fff" : "#327FEB" }} onPress={async () => {
                                var x = props.route.params.children;
                                if (x) {
                                    if (Object.keys(x).length == 0) {
                                        await AsyncStorage.removeItem('children');
                                        x = null
                                    }
                                    analytics.track('Collection Chip Pressed', {
                                        userID: x ? x["0"]["data"]["gsToken"] : null,
                                        deviceID: getUniqueId()
                                    })

                                }
                                else {
                                    analytics.track('Collection Chip Pressed', {
                                        userID: null,
                                        deviceID: getUniqueId()
                                    })
                                }
                                tag == item ? setTag('') : setTag(item); tag == item ? showAll() : showTags(item); setTagsPresent(true);
                            }} >{item}</Chip>
                        )}
                        //Setting the number of column
                        // numColumns={3}
                        horizontal={true}
                    />
                </View> : <View />}

                {
                    !synced ?
                        <View>
                            <Image source={require('../assets/sync.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
                            <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Syncing</Text>
                        </View>
                        :
                        files.length != 0 ?
                            files.map((item, i) => {
                                return (
                                    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                                        <Card style={{ borderRadius: 20 }} >
                                            <TouchableOpacity
                                                style={{ borderRadius: 20 }}
                                                onPress={() => {
                                                    // console.log(item['images'][0]['name'])
                                                    // console.log(item['images'][0]['time'] ? item['images'][0]['time'] : item['images'][0]['path'].split('Images/')[1].split('/')[0]);
                                                    viewImages(i, item['images'][0]['name'].split('_')[1].split('-')[0], item['images'][0]['name'].split('_')[0]);
                                                }}>
                                                <CardItem style={{ marginVertical: 5, flexDirection: 'column', borderRadius: 20 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontFamily: 'NunitoSans-Bold', alignSelf: 'flex-start', marginHorizontal: 4, marginBottom: 10, flex: 8 }}>{item["cloud"] ? createDate(item['images'][0]['time']) : createDate(item['images'][0]['path'].split('Images/')[1].split('/')[0])}</Text>
                                                        {item['cloud'] ? <Icon type="Feather" name="cloud" style={{ flex: 1, alignSelf: 'flex-end', color: "#327feb", fontSize: 20, marginHorizontal: 4, marginBottom: 10 }} /> : null}
                                                    </View>
                                                    <Body style={{ flexDirection: 'row' }}>
                                                        {
                                                            // console.log(item)
                                                            item['images'].map((it, ind) => {
                                                                if (ind < 2 || item['images'].length == 3) {
                                                                    return <Image style={{ height: width * 0.24, width: width * 0.24, marginHorizontal: width * 0.01, borderRadius: 20 }} source={{ uri: item['cloud'] ? it['path'] : it['path'].includes('file:') ? it['path'] : "file://" + it['path'] }} />;
                                                                }
                                                            })
                                                        }
                                                        {item['images'].length - 2 > 0 && item['images'].length > 3 ? <View
                                                            style={{ height: width * 0.24, width: width * 0.24, marginHorizontal: width * 0.01, borderColor: "#327FEB", borderWidth: 3, borderStyle: "dashed", borderRadius: 20, justifyContent: 'center' }} >
                                                            <View style={{ backgroundColor: "#fff", width: width * 0.15, alignItems: 'center', alignSelf: 'center', borderRadius: width * 0.15, height: width * 0.15, justifyContent: 'center' }}>
                                                                <Text style={{ color: "#000", fontFamily: 'NunitoSans-Regular', }}>+ {item['images'].length - 2} more</Text>
                                                                <Text style={{ color: "#000" }}>More</Text>
                                                            </View>
                                                        </View> : null}
                                                    </Body>
                                                    {item['images'][item['images'].length - 1]['name'].split('_')[0] !== 'Genio' ? <Chip key={i} style={{ backgroundColor: '#327FEB', margin: 4, marginTop: 16, paddingLeft: 5, paddingRight: 5, borderWidth: 0, borderColor: "#327FEB", alignSelf: 'flex-start' }} textStyle={{ color: "#fff" }}>{item['images'][item['images'].length - 1]['name'].split('_')[0]}</Chip> : null}

                                                </CardItem>
                                            </TouchableOpacity>
                                        </Card>
                                    </View>
                                )
                            })
                            :
                            <View style={{ backgroundColor: 'white', height: height, width: width }}>
                                <Image source={require('../assets/empty.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
                                <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Nothing to view here.</Text>
                                <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Scan and add to get started!</Text>

                            </View>}
                <View style={{ height: height * 0.07 }} />
            </ScrollView>
            {
                selecting ?
                    <Fab
                        active={selecting}
                        direction="up"
                        containerStyle={{ right: 8 }}
                        style={{ backgroundColor: '#327FEB', bottom: height * 0.08 }}
                        position="bottomRight"
                    // onPress={() => setVisible(true)}
                    >
                        <Icon type="FontAwesome" name='send' style={{ color: "#fff", fontSize: 27, marginRight: 5 }} />
                    </Fab> :
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