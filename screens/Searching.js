/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, Animated, View, ImageBackground, BackHandler, Image, TouchableOpacity, FlatList } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Chip, Button, Thumbnail, List, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { SECRET_KEY, ACCESS_KEY, JWT_USER, JWT_PASS } from '@env'
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { Appbar } from 'react-native-paper';
import { useFocusEffect } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CompButton from '../Modules/CompButton';
import ScreenHeader from '../Modules/ScreenHeader'
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



const Searching = ({ route, navigation }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [resultkid, setresultkid] = React.useState([]);
    const [resultteacher, setresultteacher] = React.useState([]);
    const [token, setToken] = React.useState('');
    const status = route.params.status
    const children = route.params.children
    const [index, setIndex] = React.useState(0);
    const [routes, setRoutes] = React.useState([
        { key: 'first', title: 'Teachers' },
        { key: 'second', title: 'Children' },
    ]);

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
    const [doing, setdoing] = useState(false)
    const onChangeSearch = query => {
        // console.log(query)
        setdoing(true)
        if (query != '') {
            axios.get('https://api.genio.app/sherlock/keyword/' + query.toLowerCase() + `/0/?token=${token}`)
                .then(async (response) => {
                    // setresult([])
                    var keys = Object.keys(response.data)
                    var data = keys.map((key) => response['data'][key])
                    var kids = data.filter((item) => item.data.type == "Kid")
                    var teachers = data.filter((item) => item.data.type == "Teacher")
                    // console.log(teachers)
                    setresultkid(kids)
                    setresultteacher(teachers)
                    setRoutes([
                        { key: 'first', title: 'Teachers ('+teachers.length+')' },
                        { key: 'second', title: 'Children ('+kids.length+')' },
                    ])
                    // console.log(data[0])
                    setdoing(false)
                })
                .catch((error) => {
                    console.log(error.config)
                })
        }
        if (query == '') {
            setresultkid([])
            setresultteacher([])
        }
        setSearchQuery(query)
    };

    
    const renderItem = ({ item }) => {
        return (
            <View key={item.id} style={{ alignSelf: 'center', margin: 1, flexDirection: 'row' }}>
                <TouchableWithoutFeedback style={{ width: width * 0.85, height: 100, flexDirection: 'row', borderRadius: 20, alignSelf: 'center' }} onPress={async () => {
                    children[0]['id']===item.id?navigation.navigate('Profile'):navigation.navigate('IndProf', { 'data': item.data, 'id': item.id });
                    analytics.track('SearchedKidOpened', {
                        userID: children ? children["0"]["id"] : null,
                        deviceID: getUniqueId()
                    })
                }}>
                    <FastImage
                        source={{
                            uri: item['data']['image'],
                            priority: FastImage.priority.high,
                        }}
                        style={{ width: 60, height: 60, borderRadius: 306, }}
                    />
                    <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                        <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'left', fontWeight: 'bold', fontSize: 16, lineHeight: 36, marginTop: 9 }}>{titleCase(item['data']['name'])}</Text>
                        {/* <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'left', fontWeight: '400', color: "rgba(56, 56, 56, 0.6)", fontSize: 14, lineHeight: 24 }}>4 Followers  15 Following  </Text> */}
                    </View>
                    {/*<TouchableOpacity onPressIn={() => {followid(item.id); console.log(follows)}} block dark style={{ backgroundColor: '#91d7ff', height: 25, width: 80, alignSelf: 'center', marginBottom: 30, marginHorizontal: 20, position: 'absolute', bottom: -13, zIndex: 1000 }}>
                            <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 12, marginTop: 2 }}>{follows && follows.includes(String(item['id'])) ? 'Following' : 'Follow'}</Text>
                        </TouchableOpacity>*/}
                </TouchableWithoutFeedback>
            </View>


        );
    };

    const renderScene = ({ route }) => {
        // console.log(route)
        switch (route.key) {
            case 'first':
            return <TeacherSearch style={{flex: 1}} result={resultteacher} renderItem={renderItem} />;
            case 'second':
            return <ChildSearch style={{flex: 1}}  result={resultkid} renderItem={renderItem} />;
            default:
            return null;
        }
    };
    

    const renderTabBar = (props) => {
        return (
            <View>
                <TabBar
                    {...props}
                    activeColor={'#327FEB'}
                    inactiveColor={'black'}
                    pressColor={'lightblue'}
                    indicatorStyle={{ backgroundColor: 'white' }}
                    style={{ backgroundColor: 'white'}}
                    tabStyle={{ width: width / 2 }}
                    scrollEnabled={true}
                    bounces={true}
                    renderLabel={({ route, focused, color }) => (
                        <Text style={{ color, margin: 8, fontFamily: 'NunitoSans-SemiBold' }}>
                            {route.title}
                        </Text>
                    )}
                    indicatorStyle={{ backgroundColor: '#327FEB', height: 5, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
                />
            </View>
        )
    }

    const ChildSearch = ({result, renderItem}) => {
        return (
            <View style={{flex: 1}}>
            {status == '3' ? null : <CompButton message={'Signup/Login to find other kids'} />}
            {searchQuery != '' && !doing && !(result).length ? <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center' }}>{status == '3' ? 'Oops! No one was found with that name' : null}</Text> : (<FlatList
                data={result}
                renderItem={renderItem}
                keyExtractor={(item) => item.gsToken}
                numColumns={1}
                style={{ alignSelf: 'center', marginTop: 10, flex: 1 }}
            />)}
            </View>
        )
    }

    const TeacherSearch = ({result, renderItem}) => {
        return (
            <View style={{flex: 1}}>
            {status == '3' ? null : <CompButton message={'Signup/Login to find other kids'} />}
            {searchQuery != '' && !doing && !(result).length ? <Text style={{ fontFamily: 'NunitoSans-Regular', textAlign: 'center' }}>{status == '3' ? 'Oops! No one was found with that name' : null}</Text> : (<FlatList
                data={result}
                renderItem={renderItem}
                keyExtractor={(item) => item.gsToken}
                numColumns={1}
                style={{ alignSelf: 'center', marginTop: 10, flex: 1 }}
            />)}
            </View>
        )
    }

    return (
        <>
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
                        style={{ width: width - 100, marginTop: 10, height: 40 }}
                        placeholder="Search Genio"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                    <Text onPress={() => navigation.navigate('Search')} style={{ fontFamily: 'NunitoSans-SemiBold', color: '#fff', marginLeft: 20, marginTop: 28, height: 40  }}>Cancel</Text>
            </Appbar.Header>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                scrollEnabled={true}
                renderTabBar={renderTabBar}
                // style={{marginTop: -30}}
            />
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
    //   resizeMode: "contain",
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