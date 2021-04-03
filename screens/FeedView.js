/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { SafeAreaView, FlatList, View, Text, Dimensions, Animated, TouchableOpacity, useWindowDimensions, RefreshControl, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import FeedComponent from '../Modules/FeedComponent'
import PostLoader from '../Modules/PostLoader'
import CompButton from '../Modules/CompButton'
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const FeedView = ({ data, navigation, children, onRefresh, refreshing, feed_type, status, scrollY, profile }) => {
    const scroll = useRef(new Animated.Value(0)).current;
    // function randomStr(len, arr) {
    //     var ans = '';
    //     for (var i = len; i > 0; i--) {
    //         ans +=
    //             arr[Math.floor(Math.random() * arr.length)];
    //     }
    //     return ans;
    // }

    const ViewTypes = {
        FULL: 0,
        HALF_LEFT: 1,
        HALF_RIGHT: 2
    };
    const _layoutProvider = new LayoutProvider(
        index => {
            return ViewTypes.FULL;
        },
        (type, dim) => {
            switch (type) {
                case ViewTypes.FULL:
                    dim.width = width;
                    dim.height = 550;
                    break;
                default:
                    dim.width = 0;
                    dim.height = 0;
            }
        }
    );
    const _rowRenderer = (type, data) => {
        //You can return any view here, CellContainer has no special significance
        switch (type) {
            case ViewTypes.FULL:
                return (
                    <FeedComponent key={data['data']['post_id']} status={status} children={children} item={{ item: data }} navigation={navigation} />
                );
            default:
                return null;
        }
    }


    let dataProvider = new DataProvider((r1, r2) => {
        return r1.data.post_id != r2.data.post_id;
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
                    onEndReached={() => { onRefresh(feed_type, true); console.log('end reached') }}
                    layoutProvider={_layoutProvider}
                    dataProvider={dataProvider}
                    style={{ paddingTop: profile ? 70 : 140 }}
                    rowRenderer={_rowRenderer}
                    onScroll={(e) => {
                        scrollY?scrollY.setValue(e.nativeEvent.contentOffset.y):null
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
        </React.Fragment> : <ScrollView onScroll={(e) => {
            scrollY?scrollY.setValue(e.nativeEvent.contentOffset.y):null
        }}><View style={{ backgroundColor: '#327FEB', height: 250, width: 250, borderRadius: 10, alignSelf: 'center', marginTop: scrollY ? height / 10 : 100, flexDirection: 'column',  marginBottom: 800 }}>
            <FastImage source={require('../assets/noposts.gif')} style={{ height: 200, width: 200, alignSelf: 'center', marginTop: 45 }} />
            <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'black', fontFamily: 'NunitoSans-Bold', paddingHorizontal: 50, marginTop: 40, fontSize: 17 }}>No {feed_type} yet!</Text>
        </View></ScrollView>
    )
}
export default FeedView