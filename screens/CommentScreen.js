/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import {
    React, 
    Component,
    useState,
    useEffect,
    useRef,
    SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, FlatList, BackHandler, Alert, Image, Share, Linking, TouchableHighlight, ImageStore,
    Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Toast, Right, Left, Fab, Textarea,
    DefaultTheme, configureFonts, PaperProvider,
    AsyncStorage,
    analytics,
    useFocusEffect,
    axios,
    SafeAreaProvider,
    getUniqueId, getManufacturer,
    height, width,
    StreamApp, FlatFeed, Activity, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList
} from '../Modules/CommonImports.js'; 
import CompHeader from '../Modules/CompHeader';
var halfHeight = height / 2;
const CommentScreen = ({ navigation, route }) => {
    const [children, setchildren] = useState('notyet')
    useEffect(() => {
        const check = async () => {
            var child = await AsyncStorage.getItem('children')
            // console.log(child)
            if (child != null) {
                child = JSON.parse(child)
                setchildren(child)
            }
            else {
                setchildren({})
            }
        }
        check()
    }, [])
    const data = () => {
        return (
            <SafeAreaProvider>
                <CompHeader screen={'Comments'} goback={() => navigation.navigate('Home')} icon={'back'} />
                <StreamApp
                    style={{ marginTop: 20 }}
                    apiKey="9ecz2uw6ezt9"
                    appId="96078"
                    token={children['0']['data']['gsToken']}
                >
                </StreamApp>
                <CommentList infiniteScroll activityId={route.params.actid} />
                <CommentBox
                    onSubmit={(text) =>
                        props.onAddReaction('comment', activity, {
                            data: { text: text },
                        })
                    }
                    noAvatar
                    textInputProps={{ placeholder: 'Add a comment....', height: 45, marginTop: 10, marginLeft: -1, placeholderTextColor: 'grey', }}
                    styles={{ container: { height: 80, elevation: 0, color: 'black' } }}
                />
            </SafeAreaProvider>
        )
    }
    return (
        children === 'notyet' ? <View></View> : data()

    )
}
export default CommentScreen