/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { SafeAreaView, FlatList, View, Text, Dimensions, TouchableOpacity, useWindowDimensions, RefreshControl, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import FeedComponent from '../Modules/FeedComponent'
import PostLoader from '../Modules/PostLoader'
import CompButton from '../Modules/CompButton'

const FeedView = ({ data, navigation, children, onRefresh, refreshing, feed_type, status }) => {
    return (
        <React.Fragment>
            {status === '3' || feed_type != 'following' ? <FlatList
                data={data.map((item) => item)}
                refreshing={refreshing}
                onRefresh={() => onRefresh(feed_type)}
                ListEmptyComponent={() => {
                    return (
                        <PostLoader />
                    )
                }}
                onEndReached={() => { onRefresh(feed_type, true); console.log('end reached') }}
                extraData={refreshing}
                renderItem={(item) => (<FeedComponent status={status} children={children} item={item} navigation={navigation} />)}
                keyExtractor={item => item['data']['post_id'] + String(Math.random())}
            /> : <View>
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
        </React.Fragment>
    )
}
export default FeedView