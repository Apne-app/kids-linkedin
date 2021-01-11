/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import {
    React, 
    Component,
    useState,
    useEffect,
    useRef,
    Text, StyleSheet, Alert, BackHandler, Dimensions, View, ImageBackground, Image, TextInput, KeyboardAvoidingView, Keyboard,
    Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer,
    DefaultTheme, configureFonts, PaperProvider,
    SpinnerButton,
    AsyncStorage,
    analytics,
    useFocusEffect,
    axios,
    sha256,
    getUniqueId, getManufacturer,
    SimpleAnimation,
    ScrollView, TouchableOpacity,
    height, width,
} from '../Modules/CommonImports.js';
const ChildSuccess = ({ navigation }) => {

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

    setTimeout(() => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home'}],
        });
    }, 2000);
    return (
        <View style={{ backgroundColor: 'white', height: height, width: width }}>
            <Image source={require('../assets/verified.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
            <Text style={{ fontFamily: 'NunitoSans-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Succesfully added your child!</Text>
            <View style={{ backgroundColor: 'white' }}>
                <Button block dark style={{ marginTop: 30, backgroundColor: 'lightblue', borderRadius: 10, height: 50, width: width - 40, alignSelf: 'center', marginHorizontal: 20 }}>
                    <Text style={{ color: "black", fontFamily: 'NunitoSans-SemiBold', fontSize: 16, marginTop: 2 }}>Taking you to Home....</Text>
                </Button>
            </View>
        </View>
    );

}
export default ChildSuccess;