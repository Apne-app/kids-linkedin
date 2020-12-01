import React, { Component, useState } from 'react';
import { Share, View, Image, BackHandler, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import CompHeader from '../Modules/CompHeader'
import { useFocusEffect } from "@react-navigation/native";
// import koading from '../assets/loading.gif'
const BackButton = ({ navigation }) => {
    <TouchableOpacity
        onPress={() => {
            navigation.goBack();
        }}>
        <Text>&lt; Back</Text>
    </TouchableOpacity>
}

const Browser = ({ navigation, route }) => {

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('Home', { screen: 'Profile' })
                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, []));


    const [loader, setLoader] = useState(true);

    //  let navigationOptions = ({ navigation }) => ({
    //     headerRight: <BackButton navigation={navigation} />
    // })
    const hello=()=>{
        setTimeout(() => {
            setLoader(false);
        }, 7000)
        return(<Image source={require('../assets/loading.gif')} style={{ height: 300, width: 300, alignSelf: 'center', }} />)
    }
const [display,setdisplay] = useState('flex');
    // render() {
        console.log(route.params)
        const  url  = route.params.url
        return (
            <View style={{ flex: 1,backgroundColor:'black' }}>
                {/* <View style={{display:display}}>
                <Animation />
                </View> */}
                <CompHeader screen={route.params.heading} goback={() => navigation.navigate('Profile')} icon={'back'} />
                <WebView 
                    source={{
                        uri: url
                    }}
                    style={{ flex: 1 }}
                    renderLoading={loader? hello : false}
                    startInLoadingState={loader}
                />
            </View>
        )
    // }

}

export default Browser;