/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { SafeAreaView, FlatList, View, Text, Dimensions, TouchableOpacity, useWindowDimensions } from 'react-native';
import VideoPlayer from 'expo-video-player';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import LikeButton from '../components/LikeButton';
import { Viewport } from '@skele/components'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import AsyncStorage from '@react-native-community/async-storage';
import { Thumbnail } from 'react-native-thumbnail-video';
import { connect } from 'getstream';
import * as rssParser from 'react-native-rss-parser';
import { useFocusEffect } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BottomSheet from 'reanimated-bottom-sheet';
import { SliderBox } from "react-native-image-slider-box";
import { Snackbar } from 'react-native-paper';
import analytics from '@segment/analytics-react-native';
import { getUniqueId } from 'react-native-device-info';
import { Chip } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker'
import YoutubePlayer from "react-native-youtube-iframe";
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import * as Animatable from 'react-native-animatable';
import FeedComponent from '../Modules/FeedComponent';
import { Video } from 'expo-av';
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import PostLoader from '../Modules/PostLoader';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

const FeedScreen = ({ navigation, route }) => {
    const [data, setdata] = useState([])
    const [feedstate, setFeedState] = useState(0);
    var status = route.params.status
    var children = route.params.children
    const [newnoti, setnewnoti] = useState(false);
    const refActionSheet = useRef(null);
    var videoRef = React.createRef();
    const showActionSheet = () => {
        refActionSheet.current.show()
    }
    var d = new Date();
    var year = parseInt(d.getFullYear());
    useEffect(() => {
        axios.post('https://4561d0a210d4.ngrok.io/feed', {
            'user_id': children[0]['id']
        }).then((response) => {
            setdata(response.data.data)
        }).catch((response) => {
            console.log(response)
        })
    }, [])
    const FeedView = () => {
        return (
            <FlatList
                data={data}
                ListEmptyComponent={() => {
                    return (
                        <PostLoader />
                    )
                }
                }
                renderItem={(item) => { return (<FeedComponent children={children} item={item} navigation={navigation} />) }}
                keyExtractor={item => item['data'][1]}
            />
        )
    }
    const Test = () => {
        return (<View />)
    }
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes, setroutes] = React.useState([
        { key: 'follow', title: 'Following' },
        { key: 'trending', title: 'Trending' },
        { key: 'years', title: String(year - parseInt(route.params.children[0]['data']['year'])) + ' year olds' },
        { key: 'quiz', title: 'Quiz' },
        { key: 'inspire', title: 'Inspire' }
    ]);

    const renderScene = SceneMap({
        follow: FeedView,
        trending: Test,
        years: Test,
        quiz: Test,
        inspire: Test,
    });
    const renderTabBar = (props) => {
        return (
            <TabBar
                {...props}
                activeColor={'#327FEB'}
                inactiveColor={'black'}
                pressColor={'lightblue'}
                indicatorStyle={{ backgroundColor: 'white' }}
                style={{ backgroundColor: 'white' }}
                tabStyle={{ width: width / 3 }}
                labelStyle={{ fontFamily: 'NunitoSans-Bold' }}
                scrollEnabled={true}
                indicatorStyle={{ backgroundColor: '#327FEB', height: 5, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
            />
        )
    }
    return (
        <>
            <ScreenHeader new={newnoti} screen={'Genio'} icon={'bell'} navigation={navigation} fun={() => { navigation.navigate('Notifications'); setnewnoti(false) }} />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                scrollEnabled={true}
                renderTabBar={renderTabBar}
            />
        </>
    )
}
export default FeedScreen