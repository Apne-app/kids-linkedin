/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, BackHandler, Image, TouchableOpacity, FlatList } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, ReplyIcon, Avatar } from 'react-native-activity-feed';
import axios from 'axios';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { connect } from 'getstream';
import { useFocusEffect } from "@react-navigation/native";
import CompButton from '../Modules/CompButton';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

const fontConfig = {
    default: {
        regular: {
            fontFamily: 'NunitoSans-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'NunitoSans-Regular',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'NunitoSans-Regular',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'NunitoSans-Regular',
            fontWeight: 'normal',
        },
    },
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
};


const Searching = ({ route, navigation }) => {

    const [searchQuery, setSearchQuery] = React.useState('');
    const [result, setresult] = React.useState([]);
    const [follows, setfollows] = React.useState([]);
    const [token, setToken] = React.useState('');
    const [currentid, setcurrentid] = React.useState('');
    useEffect(() => {
        const addfollows = async () => {
            var children = await AsyncStorage.getItem('children')
            console.log(children)
            children = JSON.parse(children)['0']
            const client = connect('9ecz2uw6ezt9', children['data']['gsToken'], '96078');
            var user = client.feed('timeline', children['id'] + 'id');
            var follows = await user.following()
            var data = []
            follows['results'].map(item => {
                data.push(item['target_id'].replace('user:', '').replace('id', ''))
            })
            setfollows(data)
        }
        addfollows()
    }, [])
    useFocusEffect(
    React.useCallback(() => {
        const onBackPress = () => {
            // Alert.alert("Hold on!", "Are you sure you want to Exit?", [
            //     {
            //         text: "Cancel",
            //         onPress: () => null,
            //         style: "cancel"
            //     },
            //     { text: "YES", onPress: () => BackHandler.exitApp() }
            // ]);
            navigation.pop()
            return true;
        };
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, []));
    useEffect(() => {

        var data = JSON.stringify({"username":"Shashwat","password":"GenioKaPassword"});

        var config = {
        method: 'post',
        url: 'http://104.199.146.206:5000/getToken',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios(config)
        .then(function (response) {
        // console.log(JSON.stringify(response.data.token));
        setToken(response.data.token)
        })
        .catch(function (error) {
        console.log(error);
        });

        const addfollows = async () => {
            var children = await AsyncStorage.getItem('children')
            console.log(children)
            children = JSON.parse(children)['0']
            setcurrentid(children['id'])
        }
        addfollows()
    }, [])
    const onChangeSearch = query => {
        if (query != '') {
            axios.get('http://35.221.164.203:5000/keyword/' + query.toLowerCase() + `/0?token=${token}`)
                .then(async (response) => {
                    setresult([])
                    var keys = Object.keys(response.data)
                    var data = keys.map((key) => response['data'][key])
                    setresult(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        setSearchQuery(query)
    };
    const followid = (id) => {
        axios.get('http://104.199.158.211:5000/follow/' + currentid + '/' + id)
            .then(async (response) => {
                if (response.data == 'success') {
                    var place = follows;
                    place.push(String(id));
                    setfollows(place)
                }
            })
    }
    const renderItem = ({ item }) => {
        return (
            <View key={item.id} style={{ alignSelf: 'center', margin: 1 }}>
                <StreamApp
                    apiKey={'9ecz2uw6ezt9'}
                    appId={'96078'}
                    token={item['data']['gsToken']}
                >
                    <TouchableOpacity style={{ width: width * 0.85, height: 100, flexDirection: 'row', borderRadius: 20, alignSelf: 'center' }} onPress={async () => 
                    { 
                        navigation.navigate('IndProf', { 'data': item.data, 'id': item.id });
                        var x = await AsyncStorage.getItem('profile');
                        analytics.track('Searched Kid Opened', {
                            userID: x ? JSON.parse(x)['uuid'] : null,
                            deviceID: getUniqueId() 
                        })
                        }}>
                        <Image
                            source={{ uri: item['data']['image'] }}
                            style={{ width: 60, height: 60, borderRadius: 306, }}
                        />
                        <View style={{  marginLeft: 20, flexDirection: 'column' }}>
                            <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'left', fontWeight: 'bold', fontSize: 16, lineHeight: 36 }}>{item['data']['name'][0].toUpperCase() + item['data']['name'].substring(1)}</Text>
                            <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'left', fontWeight: '400', color: "rgba(56, 56, 56, 0.6)", fontSize: 14, lineHeight: 24 }}>4 Followers  15 Following  3 Posts </Text>
                        </View>
                        {/*<TouchableOpacity onPressIn={() => {followid(item.id); console.log(follows)}} block dark style={{ backgroundColor: '#91d7ff', height: 25, width: 80, alignSelf: 'center', marginBottom: 30, marginHorizontal: 20, position: 'absolute', bottom: -13, zIndex: 1000 }}>
                            <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 12, marginTop: 2 }}>{follows && follows.includes(String(item['id'])) ? 'Following' : 'Follow'}</Text>
                        </TouchableOpacity>*/}
                    </TouchableOpacity>
                </StreamApp>
            </View>


        );
    };
    const [status, setstatus] = useState('3')
    useEffect(()=>{
        const data = () => {
            var st = AsyncStorage.getItem('status')
            setstatus(st)
        }
        data()
    },[])
    return (
        <Container>
            <Header noShadow style={{ flexDirection: 'row', backgroundColor: 'white', height: 110,  }}>
                <Item style={{ width: width * 0.9, borderColor: "#000", height: 45, borderRadius: 10, marginTop:50 }}>
                    <Icon active name={searchQuery == "" ? 'search' : 'x'} type={'Feather'} />
                    <Input
                        autoFocus={true}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        placeholder='Search' />
                </Item>
            </Header>
            {status=='3'?null:<CompButton message={'Signup/Login to find other kids'}  />}
            {searchQuery == '' ? <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center' }}>{status=='3'?'Search for children to follow':null}</Text> :  (<View><FlatList
                data={result}
                renderItem={renderItem}
                keyExtractor={(item) => item.gsToken}
                numColumns={1}
                style={{ alignSelf: 'center', marginTop:10 }}
            />
            </View>)}
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        // alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        fontFamily: 'NunitoSans-Regular'
        // padding: 40,
        // paddingTop: 80
    },
    form: {
        marginTop: 40,
        flex: 1,
        fontFamily: 'NunitoSans-Regular'
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
        fontFamily: 'NunitoSans-Regular'
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
        fontFamily: 'NunitoSans-Regular',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    tinyLogo: {
        alignSelf: 'center',
        marginTop: 40
        // height: 80,
    },

    image: {
        height: width * 0.45,
        width: width * 0.45,
        margin: width * 0.02,
        borderRadius: 30,

    },
})

export default Searching;