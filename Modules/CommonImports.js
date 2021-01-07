import React, { Component, useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    FlatList,
    RefreshControl,
    PermissionsAndroid,
    Alert,
    BackHandler,
    TextInput,
    Modal,
    Share,
    KeyboardAvoidingView, Keyboard,
    Platform,
    ImageBackground,
    ScrollView,
    CheckBox
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Fab, Content, Header, Tab, Left, Body, Right, Title, Tabs, ScrollableTab, Card, CardItem, Footer, FooterTab, Button, Icon } from 'native-base';
import axios from 'axios';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import CameraRoll from "@react-native-community/cameraroll";
import { Chip } from 'react-native-paper';
import ImageView from "react-native-image-viewing";
import { useFocusEffect } from "@react-navigation/native";
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { reverse } from 'ramda';
import { WebView } from 'react-native-webview';
import CompHeader from '../Modules/CompHeader'

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

export {
    React, Component, useEffect, useState, useRef,
    Share, StyleSheet, Text, View, Image, Dimensions, FlatList, RefreshControl, PermissionsAndroid, BackHandler, Modal, Platform, ImageBackground, ScrollView, CheckBox,
    KeyboardAvoidingView, Keyboard,
    AsyncStorage,
    Container, Fab, Content, Header, Tab, Left, Body, Right, Title, Tabs, ScrollableTab, Card, CardItem, Footer, FooterTab, Button, Icon,
    axios,
    analytics, getUniqueId, getManufacturer,
    CameraRoll,
    Chip,
    ImageView,
    useFocusEffect,
    ScreenHeader,
    CompButton,
    TouchableOpacity,
    reverse,
    height,
    width,
    WebView,
    CompHeader
}; 
