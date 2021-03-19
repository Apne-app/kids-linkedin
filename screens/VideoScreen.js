/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import {
    React, 
    Component, 
    useEffect,
    StyleSheet, Text, View, Image, Dimensions, FlatList, RefreshControl, PermissionsAndroid, BackHandler, Modal, Platform, ImageBackground, ScrollView, CheckBox,
    AsyncStorage,
    Container, Fab, Content, Header, Tab, Left, Body, Right, Title, Tabs, ScrollableTab, Card, CardItem, Footer, FooterTab, Button, Icon,
    axios,
    analytics, getUniqueId, getManufacturer,
    CameraRoll,
    Chip,
    ImageView,
    useFocusEffect,
    CompHeader,
    ScreenHeader,
    CompButton,
    TouchableOpacity,
    reverse,
    height,
    width
} from '../Modules/CommonImports.js';
import VideoGallery from '../components/VideoGallery'
const VideoScreen = ({ navigation, route }) => {
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

    return (
        <View
            // scrollEnabled={false}
            style={{
                backgroundColor: 'white',
                height: height,
            }}
        >
            <CompHeader goback={() => navigation.pop()} screen={'Videos'} />
            <VideoGallery images={route.params.images} navigation={navigation} />
        </View>
    )
}
export default VideoScreen