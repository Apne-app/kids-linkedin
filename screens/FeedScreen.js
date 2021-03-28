/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { SafeAreaView, FlatList, View, BackHandler, Animated, Alert, Text, Dimensions, TouchableOpacity, useWindowDimensions, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea, Tab, Tabs } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
import { useFocusEffect } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BottomSheet from 'reanimated-bottom-sheet';
import { SliderBox } from "react-native-image-slider-box";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Snackbar } from 'react-native-paper';
import analytics from '@segment/analytics-react-native';
import { getUniqueId } from 'react-native-device-info';
import { Chip } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker'
import YoutubePlayer from "react-native-youtube-iframe";
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import FeedView from './FeedView'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import * as Animatable from 'react-native-animatable';
import FeedComponent from '../Modules/FeedComponent';
import PostLoader from '../Modules/PostLoader';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

const TestList = ({scrollY, setTabBarTop}) => {
    return (
        <FlatList
                data={['aaa', 'bbb', 'ccc', 'aaa', 'bbb', 'ccc', 'aaa', 'bbb', 'ccc', 'aaa', 'bbb', 'ccc', 'aaa', 'bbb', 'ccc']}
                // refreshing={refreshing}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={60}
                initialNumToRender={5}
                // onRefresh={() => onRefresh(feed_type)}
                windowSize={10}
                // ListEmptyComponent={() => {
                //     return (
                //         <PostLoader />
                //     )
                // }}
                onScroll={(e) => {
                    scrollY.setValue(e.nativeEvent.contentOffset.y)
                }}
                // onEndReached={() => { onRefresh(feed_type, true); console.log('end reached') }}
                // extraData={refreshing}
                renderItem={(item) => (<Text style={{height: 300}}>asdasdsa</Text>)}
                // keyExtractor={item => randomStr(20, '123456789')}
            /> 
    )
}


const FeedScreen = ({ navigation, route }) => {

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert("Hold on!", "Are you sure you want to Exit?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);

        }, []));

    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 19);
    const translateY = diffClamp.interpolate({
        inputRange : [0, 10],
        outputRange : [0, -10]
    })
    const [routes, setroutes] = React.useState([]);
    const [posted, setposted] = React.useState(false);
    const [index, setIndex] = useState(0);
    const [postid, setpostid] = useState('')
    const [data, setdata] = useState({})
    var status = route.params.status
    var children = route.params.children
    const [newnoti, setnewnoti] = useState(false);
    const refActionSheet = useRef(null);
    const [refreshing, setrefreshing] = useState({})
    const [min_time, setmin_time] = useState({})
    const showActionSheet = () => {
        refActionSheet.current.show()
    }
    useEffect(() => {
        const data = async () => {
            var newpost = await AsyncStorage.getItem('newpost')
            var postid = await AsyncStorage.getItem('postid')
            if (newpost) {
                setposted(true);
                setpostid(postid);
                AsyncStorage.multiRemove(['newpost', 'postid'])
                setTimeout(() => {
                    setposted(false);
                }, 10000);
            }
        }
        data()
    }, [])
    var d = new Date();
    var currentyear = parseInt(d.getFullYear());
    useEffect(() => {
        var fetchdata = async () => {
            var headers = JSON.parse(await AsyncStorage.getItem('loginheaders'));
            var route = status === '3' ? headers['feed_headers_login'] : headers['feed_headers_non_login']
            var refresh = status === '3' ? headers['feed_login'] : headers['feed_non_login']
            console.log(refresh)
            var refreshi = {}
            refresh.map((item => {
                refreshi[item] = false
            }))
            setrefreshing(refreshi)
            status === '3' ? route[2]['title'] = route[2]['title'].replace('deafult', String(currentyear - parseInt(children[0]['data']['year']))) : null
            var timestamp = await AsyncStorage.getItem('timestamp')
            timestamp = timestamp ? parseInt(timestamp) : 0;
            var mintimestamp = Math.round(new Date().getTime() / 1000)
            var user_id = status == '3' ? children[0]['id'] : '123qwe'
            var year = status === '3' ? parseInt(children[0]['data']['year']) : null
            await refresh.map((item) => {
                if (status == '3' || item != 'following') {
                    axios.post('http://mr_robot.api.genio.app/feed', {
                        'user_id': user_id,
                        'feed_type': item,
                        'year': year,
                        'timestamp': timestamp,
                        'min_timestamp': Math.round(new Date().getTime() / 1000),
                        'randomize': false,
                    }, {
                        headers: {
                            'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                            'Content-Type': 'application/json'
                        }
                    }).then(async (response) => {
                        var place = data
                        place[item] = response.data.data
                        setdata(place)
                        var min_following = mintimestamp
                        response.data.data.map((item) => {
                            if (min_following > item['data']['timestamp']) {
                                min_following = item['data']['timestamp']
                            }
                        })
                        place = min_time
                        place[item] = min_following
                        setmin_time(place)
                    }).catch((response) => {
                        console.log(Object.keys(response))
                    })
                }
            })
            AsyncStorage.setItem('timestamp', String(Math.round(new Date().getTime() / 1000)))
            setroutes(route)
        }
        fetchdata()
    }, [])
    const onRefresh = async (feed_type, load_more) => {
        await setrefreshing({ ...refreshing, [feed_type]: true });
        var user_id = status == '3' ? children[0]['id'] : '123qwe'
        var year1 = status === '3' ? parseInt(children[0]['data']['year']) : null
        var timestamp = await AsyncStorage.getItem('timestamp')
        timestamp = timestamp ? parseInt(timestamp) : 0;
        console.log(min_time[feed_type])
        axios.post('http://mr_robot.api.genio.app/feed', {
            'user_id': user_id,
            'feed_type': feed_type,
            'year': year1,
            'timestamp': timestamp,
            'min_timestamp': min_time[feed_type],
            'randomize': true,
        }, {
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            var place = data
            load_more ? place[feed_type] = place[feed_type].concat(response.data.data) : place[feed_type] = response.data.data
            setdata(place)
            setrefreshing({ ...refreshing, [feed_type]: false });
        }).catch((err) => {
            console.log(err)
            setrefreshing({ ...refreshing, [feed_type]: false });
        })
    }
    const renderScene = ({ route }) => {
        if (data[route.key]) {
            return <TestList scrollY={scrollY} status={status} navigation={navigation} children={children} data={data[route.key]} onRefresh={onRefresh} refreshing={refreshing[route.key]} feed_type={route.key} />
        }
        else {
            return <PostLoader />
        }
    }
    const renderTabBar = (props) => {
        return (
            <Animated.View
                style={{
                    transform: [
                        {translateY: translateY}
                    ],
                    zIndex: 5,
                    position: 'absolute'
                }}
            >
            <TabBar
                {...props}
                activeColor={'#327FEB'}
                inactiveColor={'black'}
                pressColor={'lightblue'}
                indicatorStyle={{ backgroundColor: 'white' }}
                style={{ backgroundColor: 'white' }}
                tabStyle={{ width: width / 3.6 }}
                scrollEnabled={true}
                bounces={true}
                renderLabel={({ route, focused, color }) => (
                    <Text style={{ color, margin: 8, fontFamily: 'NunitoSans-SemiBold' }}>
                        {route.title}
                    </Text>
                )}
                indicatorStyle={{ backgroundColor: '#327FEB', height: 5, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
            />
            </Animated.View>
        )
    }
    return (
        <>
            <Animated.View
                style={{
                    transform: [
                        {translateY: translateY}
                    ],
                    zIndex: 5
                }}
            >
            <ScreenHeader new={newnoti} screen={'Genio'} icon={'bell'} navigation={navigation} fun={() => { navigation.navigate('Notifications'); setnewnoti(false) }} />
            </Animated.View>
            <TabView
            style={{top: tabBarTop, left: 0, right: 0}}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            scrollEnabled={true}
            renderTabBar={renderTabBar}
            />
            <Snackbar
                visible={posted}
                onDismiss={() => console.log('hello')}
                action={{
                    label: 'View Post',
                    onPress: () => {
                        // Do something
                        setposted(false)
                        navigation.navigate('SharedPost', { 'id': postid })
                    },
                }}>
                <Text style={{ fontFamily: "NunitoSans-Bold" }}>Posted Successfully!</Text>
            </Snackbar>
        </>

    )
}
const styles = StyleSheet.create({
    mediaPlayer: {
        height: 340,
        width: width,
        backgroundColor: "black",
    },
});
export default FeedScreen