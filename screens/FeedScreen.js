/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, ReplyIcon } from 'react-native-activity-feed';
import { TouchableOpacity } from 'react-native-gesture-handler';

var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;

updateStyle('activity', {
    container:
    {
        marginVertical: height * 0.01,
        borderRadius: width * 0.05,
        backgroundColor: "#fff",
        fontFamily: 'Poppins-Regular'
    },
    text: {
        fontFamily: 'Poppins-Regular'
    },
    header: {
        fontFamily: 'Poppins-Regular'
    }
});
updateStyle('flatFeed', {
    container:
    {
        backgroundColor: "#f9f9f9",
        paddingRight: width * 0.04,
        paddingLeft: width * 0.04
    }
});


updateStyle('uploadImage', {
    image:
    {
        width: 10,
        height: 10
    }
});

const CustomActivity = (props) => {

    const [commentVisible, setCmv] = React.useState('none');

    return (
        <Activity
            {...props}
            Footer={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LikeButton {...props} />
                    <Icon name="comment" type="EvilIcons" />
                </View>
            }
        />
    );
};

var width = Dimensions.get('screen').width;
const fontConfig = {
    default: {
        regular: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
    },
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
};
const FeedScreen = ({ navigation, route }) => {
    return (
        <SafeAreaProvider>
            <Header noShadow style={{ backgroundColor: '#fff', flexDirection: 'row', height: 60, borderBottomWidth: 0, marginBottom: -45 }}>
                <Body style={{ alignItems: 'center' }}>
                    <Title style={{ fontFamily: 'Poppins-Regular', color: "#000", fontSize: 30, marginTop: 0, marginLeft: -20 }}>Home</Title>
                </Body>
                <Right style={{ marginRight: 30, marginTop: 0 }}>
                    <Icon onPress={() => { navigation.toggleDrawer(); }} name="menu" type="Feather" />
                </Right>
            </Header>
            <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
                <StreamApp
                    apiKey="r55k622fc59y"
                    appId="89658"
                    token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNn0.yJ81iGpil0YwkrQKpu9CejA-ca2CGoxeonPkM0vpPdc"
                >
                    <FlatFeed feedGroup="timeline" userId="36" Activity={CustomActivity} options={{ withOwnReactions: true }} />
                </StreamApp>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default FeedScreen;