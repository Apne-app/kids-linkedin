/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, FlatList } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right, Left } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, ReplyIcon } from 'react-native-activity-feed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import FastImage from 'react-native-fast-image'
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
const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
];

const ProfileScreen = ({ navigation, route }) => {
    const renderItem = ({ item }) => (
        <FastImage
            style={{ width: 200, height: 200, borderRadius: 5, margin: 1 }}
            source={{
                uri: 'https://unsplash.it/400/400?image=1',
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
        />
    );

    const Top = () => {
        return (
            <View>
                <Header noShadow style={{ backgroundColor: '#fff', flexDirection: 'row', height: 60, borderBottomWidth: 0, marginBottom: -45 }}>
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={{ fontFamily: 'Poppins-Regular', color: "#000", fontSize: 30, marginTop: 0, marginLeft: -20 }}>Profile</Title>
                    </Body>
                    <Right style={{ marginRight: 30, marginTop: 0 }}>
                        <Icon onPress={() => { navigation.toggleDrawer(); }} name="menu" type="Feather" />
                    </Right>
                </Header>
                <View style={{ marginTop: 60, flexDirection: 'row', flex: 2 }}>
                    <Image
                        style={{ width: 80, height: 80, borderRadius: 5, margin: 5, marginLeft: 30 }}
                        source={{
                            uri: 'https://unsplash.it/400/400?image=1'
                        }}
                    />
                    <View style={{ flexDirection: 'column', marginLeft: 30, marginTop: 10 }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20 }}>Manoj Kumar</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular' }}>Google, India</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular' }}>Proud father of 2</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', width: width - 40, alignSelf: 'center', height: 90, borderRadius: 10, marginTop: 20, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                        <View style={{ flexDirection: 'column', marginLeft: 30, marginLeft: 30, marginRight: 30 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, textAlign: 'center' }}>3</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'center', fontSize: 14, }}>Posts</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, textAlign: 'center' }}>20</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'center', fontSize: 14, }}>Followers</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: 30, marginRight: 30 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, textAlign: 'center' }}>30</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', textAlign: 'center', fontSize: 14, }}>Following</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <SafeAreaProvider>
            <FlatList
                data={DATA}
                horizontal={false}
                ListHeaderComponent={Top}
                style={{ alignSelf: 'center', flex: 1, zIndex: 20 }}
                numColumns={Math.ceil(width / 210)}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </SafeAreaProvider>
    );
};

export default ProfileScreen;