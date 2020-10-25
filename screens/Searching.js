/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, FlatList } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, ReplyIcon, Avatar } from 'react-native-activity-feed';
import axios from 'axios';
import analytics from '@segment/analytics-react-native';
import { connect } from 'getstream';
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


const Searching = ({ route, navigation }) => {

    const [searchQuery, setSearchQuery] = React.useState('');
    const [result, setresult] = React.useState([]);
    const [follows, setfollows] = React.useState([]);
    const [currentid, setcurrentid] = React.useState('');
    useEffect(() => {
        const addfollows = async () => {
            var children = await AsyncStorage.getItem('children')
            console.log(children)
            children = JSON.parse(children)['0']
            const client = connect('dfm952s3p57q', children['data']['gsToken'], '90935');
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
    useEffect(() => {
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
            axios.get('http://35.221.164.203:5000/keyword/' + query.toLowerCase() + '/0')
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
                    apiKey={'dfm952s3p57q'}
                    appId={'90935'}
                    token={item['data']['gsToken']}
                >
                    <TouchableOpacity style={{ width: width*0.85, height: 100, flexDirection: 'row',  borderRadius: 20, alignSelf: 'center' }} onPress={() => {console.log(item.data); analytics.track('Child Search')}}>
                        <Avatar
                            size={60}
                            noShadow
                            styles={{ container: { alignSelf: 'center' } }}
                        />
                        <View style={{marginTop: 20, marginLeft: 20, flexDirection: 'column'}}>
                        <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'left', fontWeight: 'bold', fontSize: 16, lineHeight: 36 }}>{item['data']['name'].toUpperCase()}</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'left', fontWeight: '400', color: "rgba(56, 56, 56, 0.6)", fontSize: 14, lineHeight: 24 }}>4 Followers  15 Following  3 Posts </Text>
                        </View>
                        {/*<TouchableOpacity onPressIn={() => {followid(item.id); console.log(follows)}} block dark style={{ backgroundColor: '#91d7ff', height: 25, width: 80, alignSelf: 'center', marginBottom: 30, marginHorizontal: 20, position: 'absolute', bottom: -13, zIndex: 1000 }}>
                            <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 12, marginTop: 2 }}>{follows && follows.includes(String(item['id'])) ? 'Following' : 'Follow'}</Text>
                        </TouchableOpacity>*/}
                    </TouchableOpacity>
                </StreamApp>
            </View>


        );
    };

    return (
        <Container>
            <Header noShadow style={{ backgroundColor: '#fff', flexDirection: 'row', height: 60, marginTop: 20 }}>
                <Item style={{width: width*0.9, borderColor: "#000", height: 45, borderRadius: 10}}>
                    <Icon active name={ searchQuery == ""?  'search' : 'close'} type={  searchQuery == ""?  "EvilIcons" : "AntDesign"} />
                    <Input 
                        autoFocus={true}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        placeholder='Search' onResponderStart={() => navigation.navigate('Searching')}/>
                </Item>
            </Header>
            {searchQuery == '' ? <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'center' }}>Search for children to follow</Text> : (result.length != 0 ? (<View><FlatList
                data={result}
                renderItem={renderItem}
                keyExtractor={(item) => item.gsToken}
                numColumns={1}
                style={{ alignSelf: 'center' }}
            />
            </View>) : <View style={{ backgroundColor: 'lightgrey', height: 60, width: width - 40, alignSelf: 'center', borderRadius: 10 }}><Text style={{ fontFamily: 'Poppins-Regular', paddingLeft: 20, marginTop: 18 }}>Search for "{searchQuery}"</Text></View>)}
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