/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, BackHandler, Image, TouchableOpacity, FlatList } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Appbar } from 'react-native-paper';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { useFocusEffect } from "@react-navigation/native";
import CompButton from '../Modules/CompButton';
import CompHeader from '../Modules/CompHeader';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image'
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


const TagScreen = ({ route, navigation }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [result, setresult] = React.useState([]);
    const [token, setToken] = React.useState('');
    const status = route.params.status
    const children = route.params.children
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.pop()
                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, []));
    useEffect(() => {

        var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });

        var config = {
            method: 'post',
            url: 'https://api.genio.app/dark-knight/getToken',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                setToken(response.data.token)
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [])
    function titleCase(str) {
       var splitStr = str.toLowerCase().split(' ');
       for (var i = 0; i < splitStr.length; i++) {
           // You do not need to check if i is larger than splitStr length, as your for does that for you
           // Assign it back to the array
           splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
       }
       // Directly return the joined string
       return splitStr.join(' '); 
    }
    const [doing, setdoing] = useState(false)
    const onChangeSearch = query => {
        setdoing(true)
        if (query != '') {
            axios.get('https://api.genio.app/sherlock/keyword/' + query.toLowerCase() + `/0/?token=${token}`)
                .then(async (response) => {
                    setresult([])
                    var keys = Object.keys(response.data)
                    var data = keys.map((key) => response['data'][key])
                    var teachers = data.filter((item) => item.data.type == "Teacher")
                    setresult(teachers)
                    setdoing(false)
                })
                .catch((error) => {
                    console.log(error.config)
                })
        }
        if (query == '') {
            setresult([])
        }
        setSearchQuery(query)
    };
    const renderItem = ({ item }) => {
        return (
            <View key={item.id} style={{ alignSelf: 'center', margin: 1 }}>
                <TouchableWithoutFeedback style={{ width: width * 0.85, height: 100, flexDirection: 'row', borderRadius: 20, alignSelf: 'center' }} onPress={async () => {
                    // console.log(item['data'])
                    navigation.navigate(route.params.screen, { 'data': { image: item['data']['image'], name: item['data']['name'], id: item['data']['unique_id'], type:item['data']['type'], year:item['data']['year'] } })
                    analytics.track('TeacherTagClick', {
                        userID: children ? children["0"]["id"] : null,
                        deviceID: getUniqueId()
                    })
                }}>
                    <FastImage
                        source={{
                            uri: item['data']['image'],
                            priority: FastImage.priority.high,
                        }}
                        style={{ width: 60, height: 60, borderRadius: 306}}
                    />
                    <View style={{ marginLeft: 20, flexDirection: 'column', flex: 5 }}>
                        <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'left', fontWeight: 'bold', fontSize: 16, lineHeight: 36 }}>{titleCase(item['data']['name'])}</Text>
                        {<Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'left', fontWeight: '700', color: "#327feb", fontSize: 14, lineHeight: 24 }}>{(item['data']['category'][0] ? item['data']['category'][0] : "").toUpperCase()}</Text>}
                    </View>
                    <View style={{flex: 2, alignItems: 'center'}}>
                    <View style={{ height: 35, width: 70, backgroundColor: '#327feb', padding: 10, borderRadius: 25, justifyContent: 'center', marginTop: 10 }}>
                        <Text style={{ color: "#fff", alignSelf: 'center' }}>Select</Text>
                    </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>


        );
    };
    return (
        <>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <Appbar.Header noShadow style={{backgroundColor: '#327feb', height: 80}}>
                        {/* <Input
                            style={{ backgroundColor: 'lightgrey', borderRadius: 100, height: 35 }}
                            autoFocus={true}
                            onChangeText={onChangeSearch}

                            value={searchQuery}
                            placeholder='Search' /> */}
                        <Searchbar
                            theme={theme}
                            autoFocus={true}
                            style={{ width: width - 100, marginTop: 10, height: 46, marginLeft:10 }}
                            placeholder="Search for teachers"
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                        />
                        <Text onPress={() => navigation.pop()} style={{ fontFamily: 'NunitoSans-SemiBold', color: '#fff', marginLeft: 20, marginTop: 28, height: 40  }}>Cancel</Text>
                </Appbar.Header>
                {status == '3' ? null : <CompButton message={'Signup/Login to search for teachers'} />}
                {searchQuery != '' && !doing && !(result).length ? <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center' }}>{status == '3' ? 'Oops! No one was found with that name' : null}</Text> : (<View><FlatList
                    data={result}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.gsToken}
                    numColumns={1}
                    style={{ alignSelf: 'center', marginTop: 10 }}
                />
                </View>)}
            </ScrollView>
        </>
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

export default TagScreen;