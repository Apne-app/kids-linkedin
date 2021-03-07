/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import {
    React,
    Component,
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
import FastImage from 'react-native-fast-image'


// import FastImage from 'react-native-fast-image';

const VideoGallery = (props) => {

    const [gallery, setGallery] = React.useState([]);
    const [galleryInventory, setGalleryInventory] = React.useState([]);
    const [offset, setOffset] = React.useState(0);

    const [selected, setSelected] = React.useState('');


    // console.log(route.params);

    const loadMore = () => {
        let arr = []
        for (var i = offset; i < offset + 100; i++) {
            arr.push(galleryInventory[i]);
        }
        setGallery([...gallery, ...arr]);
        setOffset(offset + 50);
    }

    React.useEffect(() => {

        const func = async () => {

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
                    console.log("You can use read from the storage 1");

                    CameraRoll.getPhotos({
                        first: 1000,
                        assetType: 'Videos',
                    })
                        .then(r => {
                            setGalleryInventory([...r.edges]);
                            let arr = []
                            for (var i = offset; i < offset + 100; i++) {
                                arr.push(r.edges[i]);
                            }
                            setGallery([...gallery, ...arr]);
                            setSelected(r.edges[0].node.image.uri);
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
            <FlatList
                data={gallery}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly' }}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => {
                                setSelected(item.node.image.uri)
                                props.navigation.navigate('VideoPreview', { 'video': item.node.image.uri });
                                // console.log(props.navigation);  
                            }}>
                            {/*console.log(item.node.image.uri)*/}
                            <FastImage
                                style={styles.image}
                                source={{
                                    uri: item.node.image.uri,
                                    priority: FastImage.priority.high
                                }}
                            />
                            <Icon type={'Feather'} name={'play-circle'} style={{ position: 'absolute', justifyContent: 'center', marginTop: 5, marginLeft: 5, color: '#327FEB' }} />
                        </TouchableOpacity>
                    </View>
                )}
                //Setting the number of column
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                // onEndReached={() => loadMore()}
                // onEndReachedThreshold={20}
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
        height: 200,
        width: width / 2,
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

export default VideoGallery;