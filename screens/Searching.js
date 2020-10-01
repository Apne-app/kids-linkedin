/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, FlatList } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, ReplyIcon, Avatar } from 'react-native-activity-feed';
import axios from 'axios';
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
    const [result, setresult] = React.useState([{}]);
    const onChangeSearch = query => {
        setSearchQuery(query)
        if (query != '') {
            axios.get('http://35.221.164.203:5000/keyword/' + query + '/0')
                .then(async (response) => {
                    var keys = Object.keys(response.data)
                    var data = keys.map((key) => response['data'][key])
                    setresult(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    };
    const renderItem = ({ item }) => {

        return (
            <View>
                <StreamApp
                    apiKey={'dfm952s3p57q'}
                    appId={'90935'}
                    token={item['data']['gsToken']}
                >
                    <View style={{ backgroundColor: 'lightgrey', height: 60, width: width - 40, alignSelf: 'center', borderRadius: 10, flexDirection: 'row', margin:2 }}>
                        <Avatar
                            size={40}
                            noShadow
                            styles={{ container: { width: 30, height: 3, borderRadius: 5, marginLeft: 10,  marginTop: 10 } }}
                        />
                        <Text style={{ fontFamily: 'Poppins-Regular', paddingLeft: 20, marginTop: 18 }}>{item['data']['name']}</Text>
                    </View>
                </StreamApp>
            </View>
        );
    };

    return (
        <Container>
            <Header noShadow style={{ backgroundColor: '#fff', flexDirection: 'row', height: 60, marginTop: 20 }}>
                <Searchbar
                    // autoCapitalize={'none'}
                    autoFocus={true}
                    style={{ width: width - 40, height: 50, borderRadius: 10 }}
                    theme={theme}
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
            </Header>
            {!searchQuery ? <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'center' }}>Search for children to follow</Text> : (Object.keys(result[0]).length ? <FlatList
                data={result}
                renderItem={renderItem}
                keyExtractor={(item) => item.gsToken}
            /> : <View style={{ backgroundColor: 'lightgrey', height: 60, width: width - 40, alignSelf: 'center', borderRadius: 10 }}><Text style={{ fontFamily: 'Poppins-Regular', paddingLeft: 20, marginTop: 18 }}>Search for "{searchQuery}"</Text></View>)}
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