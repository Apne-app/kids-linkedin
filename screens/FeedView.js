/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { SafeAreaView, FlatList, View, Text, Dimensions, Animated, useWindowDimensions, RefreshControl, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FeedComponent from '../Modules/FeedComponent'
import PostLoader from '../Modules/PostLoader'
import CompButton from '../Modules/CompButton'
import { useScrollToTop } from '@react-navigation/native';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const FeedView = ({ data, navigation, children, onRefresh, refreshing, feed_type, status, scrollY, profile, teacherprofile = false, addclass = false, more }) => {
    const scroll = useRef(new Animated.Value(0)).current;
    // function randomStr(len, arr) {
    //     var ans = '';
    //     for (var i = len; i > 0; i--) {
    //         ans +=
    //             arr[Math.floor(Math.random() * arr.length)];
    //     }
    //     return ans;
    // }
    const ref = React.useRef(null);
    const Header = () => {
        return (
            <TouchableOpacity onPress={() => status != '3' ? navigation.navigate('Login', { screen: 'Feed', type: 'feed_banner' }) : navigation.navigate('ReferralScreen')}>
                <CompButton message={status != '3' ? 'Signup/Login to explore what other kids are learning' : 'Invite users to join the Genio community!'} />
            </TouchableOpacity>
        )
    }
    useScrollToTop(ref);

    const ViewTypes = {
        IMAGE_OR_VIDEO: 0,
        TAG: 1,
        MENTION: 2,
        NO_MEDIA: 3,
        INSPIRE: 4,
        QUIZ: 5,
        CLASS_NO_IMAGE: 6,
        YOUTUBE: 7,
        CLASS_IMAGE: 8,
        HEADER: 9,
    };
    const _layoutProvider = new LayoutProvider(
        index => {
            if (data[index]['type'] == 'header') {
                return ViewTypes.HEADER;
            }
            if (data[index]['data']['images'] ? data[index]['data']['images'].length > 4 : 0 || data[index]['data']['videos'] ? data[index]['data']['videos'].length > 4 : 0 || data[index]['data']['videos'] ? data[index]['data']['link'].length > 4 : 0 || data[index]['data']['youtube'] ? data[index]['data']['youtube'].length > 4 : 0) {
                if (data[index]['data']['category'] === 'class' && data[index]['data']['images'].length < 4) {
                    return ViewTypes.CLASS_NO_IMAGE;
                }
                else if (data[index]['data']['category'] === 'class') {
                    return ViewTypes.CLASS_IMAGE;
                }
                else if (data[index]['data']['category'] === 'inspire') {
                    return ViewTypes.INSPIRE;
                }
                else if (data[index]['data']['youtube'] != '') {
                    return ViewTypes.YOUTUBE;
                }
                else if (data[index]['data']['category'] === 'quiz') {
                    return ViewTypes.QUIZ;
                }
                else if (data[index]['data']['tags']) {
                    return ViewTypes.TAG;
                }
                else if (data[index]['data']['mention_id']) {
                    return ViewTypes.MENTION;
                }
                else {
                    return ViewTypes.IMAGE_OR_VIDEO;
                }
            }
            else {
                return ViewTypes.NO_MEDIA;
            }
        },
        (type, dim) => {
            switch (type) {
                case ViewTypes.IMAGE_OR_VIDEO:
                    dim.width = width;
                    dim.height = 560;
                    break;
                case ViewTypes.CLASS_IMAGE:
                    dim.width = width;
                    dim.height = 630;
                    break;
                case ViewTypes.YOUTUBE:
                    dim.width = width;
                    dim.height = 450;
                    break;
                case ViewTypes.HEADER:
                    dim.width = width;
                    dim.height = 50;
                    break;
                case ViewTypes.INSPIRE:
                    dim.width = width;
                    dim.height = 600;
                    break;
                case ViewTypes.QUIZ:
                    dim.width = width;
                    dim.height = 570;
                    break;
                case ViewTypes.MENTION:
                    dim.width = width;
                    dim.height = 560;
                    break;
                case ViewTypes.NO_MEDIA:
                    dim.width = width;
                    dim.height = 290;
                    break;
                case ViewTypes.TAG:
                    dim.width = width;
                    dim.height = 560;
                    break;
                case ViewTypes.CLASS:
                    dim.width = width;
                    dim.height = 620;
                    break;
                default:
                    dim.width = width;
                    dim.height = 560;
                    break;
            }
        }
    );
    const _rowRenderer = (type, data) => {
        //You can return any view here, CellContainer has no special significance
        if (data['type'] != 'header') {
            return (
                <FeedComponent key={data['data']['post_id']} status={status} children={children} item={{ item: data }} navigation={navigation} />
            )
        }
        else {
            return (
                <Header />
            )
        }
    }


    let dataProvider = new DataProvider((r1, r2) => {
        return r1.data.post_id !== r2.data.post_id;
    }).cloneWithRows(data)
    return (
        data.length ? <React.Fragment>
            {status === '3' || feed_type != 'following' ?
                // <FlatList
                //     data={data.map((item) => item)}
                //     refreshing={refreshing}
                //     removeClippedSubviews={true}
                //     maxToRenderPerBatch={5}
                //     updateCellsBatchingPeriod={60}
                //     initialNumToRender={5}
                //     onRefresh={() => onRefresh(feed_type)}
                //     windowSize={10}
                //     ListEmptyComponent={() => {
                //         return (
                //             <PostLoader />
                //         )
                //     }}
                //     onScroll={(e) => {
                //         scrollY.setValue(e.nativeEvent.contentOffset.y)
                //     }}
                //     onEndReached={() => { onRefresh(feed_type, true); console.log('end reached') }}
                //     extraData={refreshing}
                //     renderItem={(item) => (<FeedComponent status={status} children={children} item={item} navigation={navigation} />)}
                //     keyExtractor={item => item['data']['post_id']+randomStr(20, '123456789')}
                // /> 
                <RecyclerListView
                    scrollViewProps={{
                        refreshControl: (
                            <RefreshControl
                                style={{ zIndex: 1000, marginTop: 400 }}
                                refreshing={refreshing}
                                onRefresh={() => onRefresh(feed_type, false)}
                            />
                        )
                    }}
                    ref={ref}
                    onEndReached={() => { onRefresh(feed_type, true); /*console.log('end reached')*/ }}
                    layoutProvider={_layoutProvider}
                    renderFooter={() => more ? <><Text style={{ fontFamily: 'NunitoSans-Bold', textAlign: 'center', marginBottom: 40, display: more[feed_type] ? 'flex' : 'none' }}>That's it for now, come back later for more!</Text><View style={{ height: teacherprofile ? 500 : profile ? 270 : 140 }}></View></> : <View style={{ height: teacherprofile ? 500 : profile ? 270 : 140 }}></View>}
                    dataProvider={dataProvider}
                    style={{ paddingTop: teacherprofile && !addclass ? 420 : profile && !addclass ? 300 : addclass ? 10 : 140, flex: 1 }}
                    rowRenderer={_rowRenderer}
                    onScroll={(e) => {
                        scrollY ? scrollY.setValue(e.nativeEvent.contentOffset.y) : null
                    }}
                />
                : <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Login', { screen: 'Feed', type: 'feed_banner' })}><CompButton message={'Signup/Login to explore what other kids are learning'} /></TouchableOpacity>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Feed', type: 'feed_banner' })}>
                        <View style={{ backgroundColor: '#327FEB', height: 300, width: 300, borderRadius: 10, alignSelf: 'center', marginTop: 60, flexDirection: 'column' }}>
                            <FastImage source={require('../assets/feed.gif')} style={{ height: 200, width: 200, alignSelf: 'center', marginTop: 45 }} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { screen: 'Feed' })}>
                        <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'black', fontFamily: 'NunitoSans-Bold', paddingHorizontal: 50, marginTop: 40, fontSize: 17 }}>Explore what other kids are learning and working on</Text>
                    </TouchableWithoutFeedback>
                </View>}
        </React.Fragment> : <ScrollView ><View style={{ backgroundColor: '#327FEB', height: 250, width: 250, borderRadius: 10, alignSelf: 'center', flexDirection: 'column', marginBottom: 80, marginTop: profile ? 420 : 100, }}>
            <FastImage source={require('../assets/noposts.gif')} style={{ height: 200, width: 200, alignSelf: 'center', marginTop: 45 }} />
            <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'black', fontFamily: 'NunitoSans-Bold', paddingHorizontal: 50, marginTop: 40, fontSize: 17 }}>No {feed_type} yet!</Text>
        </View></ScrollView>
    )
}
export default FeedView