/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { SafeAreaView, FlatList, View, BackHandler, Alert, Text, Dimensions, TouchableOpacity, useWindowDimensions, RefreshControl, ScrollView, StyleSheet } from 'react-native';
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

    const [following, setfollowing] = useState([])
    const [routes, setroutes] = React.useState([]);
    const [posted, setposted] = React.useState(false);
    const [quiz, setquiz] = useState([])
    const [inspire, setinspire] = useState([])
    const [year, setyear] = useState([])
    const [trending, settrending] = useState([])
    const [index, setIndex] = useState(0);
    const [postid, setpostid] = useState('')
    var status = route.params.status
    var children = route.params.children
    const [newnoti, setnewnoti] = useState(false);
    const refActionSheet = useRef(null);
    const [refreshing, setrefreshing] = useState({ 'following': false, 'inspire': false, 'year': false, 'quiz': false, 'trending': false })
    var mintimestamp = Math.round(new Date().getTime() / 1000)
    const [min_time, setmin_time] = useState({ 'following': mintimestamp, 'inspire': mintimestamp, 'year': mintimestamp, 'quiz': mintimestamp, 'trending': mintimestamp })
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
        var data = async () => {
            var headers = JSON.parse(await AsyncStorage.getItem('loginheaders'));
            var route = status === '3' ? headers['feed_headers_login'] : headers['feed_headers_non_login']
            status === '3' ? route[2]['title'] = route[2]['title'].replace('deafult', String(currentyear - parseInt(children[0]['data']['year']))) : null
            setroutes(route)
        }
        data()
    }, [])
    useEffect(() => {
        const data = async () => {
            var timestamp = await AsyncStorage.getItem('timestamp')
            timestamp = timestamp ? parseInt(timestamp) : 0;
            var user_id = status == '3' ? children[0]['id'] : '123qwe'
            var year = status === '3' ? parseInt(children[0]['data']['year']) : null
            status == '3' ? axios.post('http://mr_robot.api.genio.app/feed', {
                'user_id': user_id,
                'feed_type': 'following',
                'year': year,
                'timestamp': timestamp,
                'min_timestamp': Math.round(new Date().getTime() / 1000),
                'randomize': true,
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setfollowing(response.data.data)
                var min_following = min_time['following']
                response.data.data.map((item) => {
                    if (min_following > item['data']['timestamp']) {
                        min_following = item['data']['timestamp']
                    }
                })
                setmin_time({ ...min_time, 'following': min_following })
            }).catch((response) => {
                console.log(Object.keys(response))
            }) : null
            axios.post('http://mr_robot.api.genio.app/feed', {
                'user_id': user_id,
                'feed_type': 'following',
                'year': year,
                'timestamp': timestamp,
                'min_timestamp': Math.round(new Date().getTime() / 1000),
                'randomize': false,
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                settrending(response.data.data)
                var min_trending = min_time['trending']
                response.data.data.map((item) => {
                    if (min_trending > item['data']['timestamp']) {
                        min_trending = item['data']['timestamp']
                    }
                })
                setmin_time({ ...min_time, 'trending': min_trending })
            }).catch((response) => {
                console.log(response)
            })
            axios.post('http://mr_robot.api.genio.app/feed', {
                'user_id': user_id,
                'feed_type': 'quiz',
                'year': year,
                'timestamp': timestamp,
                'min_timestamp': Math.round(new Date().getTime() / 1000),
                'randomize': false,
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setquiz(response.data.data)
                var min_quiz = min_time['quiz']
                response.data.data.map((item) => {
                    if (min_quiz > item['data']['timestamp']) {
                        min_quiz = item['data']['timestamp']
                    }
                })
                setmin_time({ ...min_time, 'quiz': min_quiz })
            }).catch((response) => {
                console.log(response)
            })
            axios.post('http://mr_robot.api.genio.app/feed', {
                'user_id': user_id,
                'feed_type': 'inspire',
                'year': year,
                'timestamp': 0,
                'min_timestamp': Math.round(new Date().getTime() / 1000),
                'randomize': false,
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setinspire(response.data.data)
                var min_inspire = min_time['inspire']
                response.data.data.map((item) => {
                    if (min_inspire > item['data']['timestamp']) {
                        min_inspire = item['data']['timestamp']
                    }
                })
                setmin_time({ ...min_time, 'inspire': min_inspire })
            }).catch((response) => {
                console.log(response)
            })
            status === '3' ? axios.post('http://mr_robot.api.genio.app/feed', {
                'user_id': user_id,
                'feed_type': 'year',
                'year': year,
                'timestamp': timestamp,
                'min_timestamp': Math.round(new Date().getTime() / 1000),
                'randomize': true,
            }, {
                headers: {
                    'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setyear(response.data.data)
                var min_year = min_time['year']
                response.data.data.map((item) => {
                    if (min_year > item['data']['timestamp']) {
                        min_year = item['data']['timestamp']
                    }
                })
                setmin_time({ ...min_time, 'year': min_year })
            }).catch((response) => {
                console.log(response)
            }) : null
            AsyncStorage.setItem('timestamp', String(Math.round(new Date().getTime() / 1000)))
        }
        data()
    }, [])
    const onRefresh = async (feed_type, load_more) => {
        await setrefreshing({ ...refreshing, [feed_type]: true });
        // console.log(refreshing)
        var user_id = status == '3' ? children[0]['id'] : '123qwe'
        var year1 = status === '3' ? parseInt(children[0]['data']['year']) : null
        var timestamp = await AsyncStorage.getItem('timestamp')
        timestamp = timestamp ? parseInt(timestamp) : 0;
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
            switch (feed_type) {
                case 'trending':
                    load_more ? settrending([...trending, ...response.data.data]) : await settrending(response.data.data)
                    setrefreshing({ ...refreshing, [feed_type]: false });
                    break;
                case 'following':
                    load_more ? setfollowing([...following, ...response.data.data]) : await setfollowing(response.data.data)
                    setrefreshing({ ...refreshing, [feed_type]: false });
                    break;
                case 'quiz':
                    load_more ? setquiz([...quiz, ...response.data.data]) : await setquiz(response.data.data)
                    setrefreshing({ ...refreshing, [feed_type]: false });
                    break;

                case 'inspire':
                    load_more ? setinspire([...inspire, ...response.data.data]) : await setinspire(response.data.data)
                    setrefreshing({ ...refreshing, [feed_type]: false });
                    break;

                case 'year':
                    load_more ? setyear([...year, ...response.data.data]) : await setyear(response.data.data)
                    setrefreshing({ ...refreshing, [feed_type]: false });
                    break;
                default:
                    break;
            }
        }).catch((err) => {
            console.log(err)
            setrefreshing({ ...refreshing, [feed_type]: false });
        })
    }
    // const renderScene = SceneMap({
    //     follow: <FeedView navigation={navigation} children={children} data={trending} onRefresh={onRefresh} refreshing={refreshing['following']} />,
    //     trending: <FeedView navigation={navigation} children={children} data={trending} onRefresh={onRefresh} refreshing={refreshing['trending']} />,
    //     years: <FeedView navigation={navigation} children={children} data={trending} onRefresh={onRefresh} refreshing={refreshing['years']} />,
    //     quiz: <FeedView navigation={navigation} children={children} data={trending} onRefresh={onRefresh} refreshing={refreshing['quiz']} />,
    //     inspire: <FeedView navigation={navigation} children={children} data={trending} onRefresh={onRefresh} refreshing={refreshing['inspire']} />,
    // });
    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'follow':
                return <FeedView status={status} navigation={navigation} children={children} data={following} onRefresh={onRefresh} refreshing={refreshing['following']} feed_type={'following'} />;
            case 'trending':
                return <FeedView status={status} navigation={navigation} children={children} data={trending} onRefresh={onRefresh} refreshing={refreshing['trending']} feed_type={'trending'} />;
            case 'years':
                return <FeedView status={status} navigation={navigation} children={children} data={year} onRefresh={onRefresh} refreshing={refreshing['year']} feed_type={'year'} />;
            case 'quiz':
                return <FeedView status={status} navigation={navigation} children={children} data={quiz} onRefresh={onRefresh} refreshing={refreshing['quiz']} feed_type={'quiz'} />;
            case 'inspire':
                return <FeedView status={status} navigation={navigation} children={children} data={inspire} onRefresh={onRefresh} refreshing={refreshing['inspire']} feed_type={'inspire'} />;

        }
    };
    const renderTabBar = (props) => {
        return (
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
        )
    }
    return (
        <>
            <ScreenHeader new={newnoti} screen={'Genio'} icon={'bell'} navigation={navigation} fun={() => { navigation.navigate('Notifications'); setnewnoti(false) }} />
            {/* <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                scrollEnabled={true}
                renderTabBar={renderTabBar}
            /> */}
            {/* <FeedView status={status} navigation={navigation} children={children} data={following} onRefresh={onRefresh} refreshing={refreshing['following']} feed_type={'following'} /> */}
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