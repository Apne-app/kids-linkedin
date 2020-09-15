/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, Share, Linking } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList } from 'react-native-activity-feed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReplyIcon from '../images/icons/reply.png';
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
    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'React Native | A framework for building native apps using React',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <Activity
            {...props}
            Footer={
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <LikeButton {...props} />
                        <ReactionIcon
                            icon={ReplyIcon}
                            labelSingle="comment"
                            labelPlural="comments"
                            counts={props.activity.reaction_counts}
                            kind="comment"
                            onPress={() => props.navigation.navigate('SinglePost', { activity: props })}
                        />
                        <Icon onPress={() => onShare()} name="share-google" type="EvilIcons" style={{ fontSize: 28, marginLeft: 15 }} />
                        <Icon onPress={() => {
                            Linking.openURL('whatsapp://send?text=check').then((data) => {
                                console.log('WhatsApp Opened');
                            }).catch(() => {
                                alert('Make sure Whatsapp installed on your device');
                            });
                        }} name="whatsapp" type="Fontisto" style={{ fontSize: 20, marginLeft: 15 }} />
                    </View>
                    <CommentBox
                        onSubmit={(text) =>
                            props.onAddReaction('comment', props.activity.id, {
                                data: { 'text': text },
                            })
                        }
                        noAvatar
                        textInputProps={{ placeholder: 'Add a comment....', height: 45, marginTop: 10, marginLeft: -1, placeholderTextColor: 'grey', }}
                        styles={{ container: { maxHeight: 45, elevation: 0, color: 'black' } }}
                    />
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
const notifi = () => {
    return (<NewActivitiesNotification labelSingular={'Post'} labelPlural={'Posts'} />)
}
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
                    apiKey="dfm952s3p57q"
                    appId="90935"
                    //47 is this one
                    token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDdpZCJ9.f3hGhw0QrYAeqF8TDTNY5E0JqMF0zI6CyUmMumpWdfI"
                //49, eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDlpZCJ9.A89Wjxxk_7hVBFyoSREkPhLCHsYY6Vq66MrBuOTm_mQ
                >
                    <FlatFeed notify navigation={navigation} feedGroup="timeline" Activity={CustomActivity} options={{ withOwnReactions: true }} />
                </StreamApp>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default FeedScreen;