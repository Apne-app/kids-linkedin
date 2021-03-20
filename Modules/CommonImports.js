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
    SafeAreaView,
    Linking,
    TouchableHighlight, ImageStore,
    Modal,
    Share,
    KeyboardAvoidingView, Keyboard,
    Platform,
    ImageBackground,
    ScrollView,
    CheckBox
} from 'react-native';
import { sha256 } from 'react-native-sha256';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Fab, Content, Header, Tab, Left, Body, Right, Title, Tabs, ScrollableTab, Card, CardItem, Footer, FooterTab, Button, Icon, Form, Item, Input, Label, H1, H2, H3, Segment, Thumbnail, Toast, Textarea } from 'native-base';
import axios from 'axios';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import CameraRoll from "@react-native-community/cameraroll";
import { Chip } from 'react-native-paper';
import ImageView from "react-native-image-viewing";
import { useFocusEffect } from "@react-navigation/native";
import ScreenHeader from '../Modules/ScreenHeader'
import CompButton from '../Modules/CompButton'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { reverse } from 'ramda';
import { WebView } from 'react-native-webview';
import { CropView } from 'react-native-image-crop-tools';
import ImagePicker from 'react-native-image-picker';
import BottomSheet from 'reanimated-bottom-sheet';
import ViewShot from "react-native-view-shot";
import Draggable from 'react-native-draggable';
import SpinnerButton from 'react-native-spinner-button';
import CompHeader from '../Modules/CompHeader'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SimpleAnimation } from 'react-native-simple-animations';

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

export {
    React, Component, useEffect, useState, useRef,
    Share, StyleSheet, Text, View, Image, Dimensions, FlatList, RefreshControl, PermissionsAndroid, BackHandler, Modal, Platform, ImageBackground, ScrollView, CheckBox,
    KeyboardAvoidingView, Keyboard, Alert, TextInput,
    Linking,
    TouchableHighlight, ImageStore,
    AsyncStorage,
    Container, Fab, Content, Header, Tab, Left, Body, Right, Title, Tabs, ScrollableTab, Card, CardItem, Footer, FooterTab, Button, Icon, Toast, Textarea,
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
    Searchbar,
    width,
    WebView,
    CompHeader,
    configureFonts, DefaultTheme, PaperProvider,
    SpinnerButton,
    sha256,
    ImagePicker, CropView, BottomSheet, ViewShot, Draggable,
    SimpleAnimation,
    SafeAreaProvider,
}; 
