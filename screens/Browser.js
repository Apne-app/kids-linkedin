/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import {
    React, 
    Component,
    useState,
    Share, View, Image, BackHandler, TouchableOpacity, Text,
    AsyncStorage,
    Container, Fab, Content, Header, Tab, Left, Body, Right, Title, Tabs, ScrollableTab, Card, CardItem, Footer, FooterTab, Button, Icon,
    useFocusEffect,
    ScreenHeader,
    CompButton,
    WebView,
    CompHeader
} from '../Modules/CommonImports.js';
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
                navigation.pop()
                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, []));


    const [loader, setLoader] = useState(true);
    const hello = () => {
        // setTimeout(() => {
        //     setLoader(false);
        // }, 7000)
        return (<Image source={require('../assets/loading.gif')} style={{ height: 300, width: 300, alignSelf: 'center', }} />)
    }
    const [display, setdisplay] = useState('flex');
    // render() {
    function getHostName(url) {
        var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
            return match[2];
        }
        else {
            return null;
        }
    }
    const url = route.params.url
    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            {/* <View style={{display:display}}>
                <Animation />
                </View> */}
            <CompHeader screen={getHostName(route.params.url)} goback={() => navigation.pop()} icon={'back'} />
            <View>

            </View>
            <WebView
                bounces={false}
                scrollEnabled={false} 
                source={{
                    uri: url
                }}
                style={{ flex: 1 }}
                renderLoading={loader ? hello : false}
                startInLoadingState={loader}
            />
        </View>
    )
    // }

}

export default Browser;