
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, RefreshControl, Dimensions, Linking, BackHandler, Alert, View, ImageBackground, Image, FlatList, PixelRatio } from 'react-native'
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const PostLoader = () => {
    return (<ContentLoader
        speed={4}
        style={{ alignSelf: 'center', marginTop: 140 }}
        width={width - 20}
        height={height}
        backgroundColor="lightgrey"
        foregroundColor="#bababa"
    >
        <Rect x="70" y="14" rx="3" ry="3" width="88" height="6" />
        <Rect x="70" y="34" rx="3" ry="3" width="52" height="6" />
        <Circle cx="35" cy="31" r="25" />
        <Rect x="11" y="65" rx="0" ry="0" width={width - 40} height="340" />
        <Rect x="70" y="424" rx="3" ry="3" width="88" height="6" />
        <Rect x="70" y="444" rx="3" ry="3" width="52" height="6" />
        <Circle cx="35" cy="441" r="25" />
        <Rect x="11" y="475" rx="0" ry="0" width={width - 40} height="340" />
    </ContentLoader>)
}
export default PostLoader