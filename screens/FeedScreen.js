/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ImageBackground, Image, Share, Linking, TouchableHighlight } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Body, Title, Right, Left } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox, CommentItem, updateStyle, ReactionIcon, NewActivitiesNotification, FollowButton, CommentList, ReactionToggleIcon, UserBar, Avatar, LikeList } from 'react-native-activity-feed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReplyIcon from '../images/icons/heart.png';
import ActionSheet from 'react-native-actionsheet'
import ImageView from 'react-native-image-viewing';
import VideoPlayer from 'react-native-video-controls';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
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
const FeedScreen = ({ navigation, route }) => {
    const [actid, setactid] = useState('1');
    const [display, setdisplay] = useState('none');
    const CustomActivity = (props) => {

        const [commentVisible, setCmv] = React.useState('none');
        const refActionSheet = useRef(null);
        const onShare = async () => {

        };
        const nulre = () => {
            return null
        }
        const showActionSheet = () => {
            refActionSheet.current.show()
        }
        const footer = (id) => {
            return (<View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <LikeButton labelFunction={nulre} {...props} /> */}
                    <ReactionToggleIcon
                        // styles={styles}
                        counts={props.activity.reaction_counts}
                        // own_reactions={own_reactions}
                        kind={'like'}
                        // onPress={this._onPress}
                        activeIcon={require('../images/icons/star.png')}
                        inactiveIcon={require('../images/icons/star-outline.png')}
                    />
                    <Icon onPress={() => props.navigation.navigate('SinglePost', { activity: props })} name="comment" type="EvilIcons" style={{ fontSize: 28, marginLeft: 10 }} />
                    <Icon onPress={() => {
                        Linking.openURL('whatsapp://send?text=check').then((data) => {
                            console.log('WhatsApp Opened');
                        }).catch(() => {
                            alert('Make sure Whatsapp installed on your device');
                        });
                    }} name="whatsapp" type="Fontisto" style={{ fontSize: 20, marginLeft: 15, color: '#4FCE5D' }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ReactionIcon
                        labelSingle="like"
                        labelPlural="likes"
                        counts={props.activity.reaction_counts}
                        kind="like"
                        height={0}
                        width={0}
                        onPress={() => props.navigation.navigate('SinglePost', { activity: props })}
                    />
                    <Text style={{ marginRight: -15, marginLeft: 5 }}>•</Text>
                    <ReactionIcon
                        labelSingle="comment"
                        labelPlural="comments"
                        counts={props.activity.reaction_counts}
                        kind="comment"
                        height={0}
                        width={-20}
                        onPress={() => { setactid(id); setdisplay('flex') }}
                    />
                </View>
                {/* <CommentBox
                onSubmit={(text) =>
                    props.onAddReaction('comment', props.activity.id, {
                        data: { 'text': text },
                    })
                }
                noAvatar
                textInputProps={{ placeholder: 'Add a comment....', height: 45, marginTop: 10, marginLeft: -1, placeholderTextColor: 'grey', }}
                styles={{ container: { maxHeight: 45, elevation: 0, color: 'black' } }}
            /> */}
            </View>)
        }
        const footer2 = () => {
            return (<View style={{ padding: 20, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LikeButton labelFunction={nulre} {...props} styles={{ width: 40, height: 40, backgroundColor: 'white' }} />
                    <Icon onPress={() => props.navigation.navigate('SinglePost', { activity: props })} name="comment" type="EvilIcons" style={{ fontSize: 40, marginLeft: 10, color: 'white' }} />
                    <Icon onPress={() => {
                        Linking.openURL('whatsapp://send?text=check').then((data) => {
                            // console.log('WhatsApp Opened');
                        }).catch(() => {
                            alert('Make sure Whatsapp is installed on your device');
                        });
                    }} name="whatsapp" type="Fontisto" style={{ fontSize: 25, marginLeft: 15, color: '#4FCE5D' }} />
                    <Right>
                        <View style={{ flexDirection: 'row', alignItems: 'center', color: 'white' }}>
                            <ReactionIcon
                                labelSingle="like"
                                labelPlural="likes"
                                counts={props.activity.reaction_counts}
                                kind="like"
                                height={0}
                                labelFunction={(text) => { return (<Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{String(text.count) + ' ' + (text.count === 1 ? 'like' : 'likes')}</Text>) }}
                                width={0}
                                onPress={() => props.navigation.navigate('SinglePost', { activity: props })}
                            />
                            <Text style={{ marginRight: -15, marginLeft: 5, color: 'white', fontFamily: 'Poppins-Regular' }}>•</Text>
                            <ReactionIcon
                                labelSingle="comment"
                                labelPlural="comments"
                                counts={props.activity.reaction_counts}
                                kind="comment"
                                height={0}
                                width={-20}
                                labelFunction={(text) => { return (<Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{String(text.count) + ' ' + (text.count === 1 ? 'comment' : 'comments')}</Text>) }}
                                onPress={() => props.navigation.navigate('SinglePost', { activity: props })}
                            />
                        </View>
                    </Right>
                </View>
                {/* <CommentBox
                onSubmit={(text) =>
                    props.onAddReaction('comment', props.activity.id, {
                        data: { 'text': text },
                    })
                }
                noAvatar
                textInputProps={{ placeholder: 'Add a comment....', height: 45, marginTop: 10, marginLeft: -1, placeholderTextColor: 'grey', }}
                styles={{ container: { maxHeight: 45, elevation: 0, color: 'black' } }}
            /> */}
            </View>)
        }
        const [visible, setIsVisible] = React.useState(false);
        return (
            <Activity
                {...props}
                {...console.log(props.activity)}
                Header={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar
                            source={props.activity.actor.data.profileImage}
                            size={45}
                            noShadow
                            styles={{ container: { width: 40, height: 40, borderRadius: 5, margin: 5, marginLeft: 20 } }}
                        />
                        <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular' }}>{props.activity.actor.data.name}</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular' }}>{props.activity.actor.created_at.split('T')[0].replace('-', '/')}</Text>
                        </View>
                        <ActionSheet
                            ref={refActionSheet}
                            options={['Share', 'Report', 'Close']}
                            cancelButtonIndex={2}
                            destructiveButtonIndex={1}
                            onPress={(index) => { /* do something */ }}
                        />
                        <Right><Icon onPress={() => showActionSheet()} name="options" type="SimpleLineIcons" style={{ fontSize: 20, marginRight: 20 }} /></Right>
                    </View>
                }
                Content={
                    <View style={{ padding: 20 }}>
                        <Text style={{ fontFamily: 'Poppins-Regular' }}>{props.activity.object}</Text>
                        {props.activity.image ? <ImageView
                            images={[{ uri: props.activity.image }]}
                            imageIndex={0}
                            visible={visible}
                            doubleTapToZoomEnabled={true}
                            animationType={'none'}
                            onRequestClose={() => setIsVisible(false)}
                            FooterComponent={footer2}
                            HeaderComponent={() => {
                                return (
                                    <View><View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, padding: 10 }}>
                                        <Avatar
                                            source={props.activity.actor.data.profileImage}
                                            size={45}
                                            noShadow
                                            styles={{ container: { width: 40, height: 40, borderRadius: 5, margin: 5, marginLeft: 20 } }}
                                        />
                                        <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                            <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>{props.activity.actor.data.name}</Text>
                                            <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>{props.activity.actor.created_at.split('T')[0].replace('-', '/')}</Text>
                                        </View>
                                        <ActionSheet
                                            ref={refActionSheet}
                                            options={['Share', 'Report', 'Close']}
                                            cancelButtonIndex={2}
                                            destructiveButtonIndex={1}
                                            onPress={(index) => { /* do something */ }}
                                        />
                                        <Right><Icon onPress={() => showActionSheet()} name="options" type="SimpleLineIcons" style={{ fontSize: 20, marginRight: 20, color: 'white' }} /></Right>
                                    </View>
                                        <Text style={{ fontFamily: 'Poppins-Regular', color: 'white', marginLeft: 30, marginTop: 10, marginRight: 30 }}>{props.activity.object}</Text></View>)
                            }}

                        /> : <View></View>}
                        <TouchableOpacity activeOpacity={1} onPress={() => setIsVisible(true)} style={{ alignSelf: 'center' }}>
                            {props.activity.image ? <Image
                                source={{ uri: props.activity.image }}
                                style={{ width: width - 40, height: 340, marginTop: 20 }}
                            /> : <View></View>}
                            {props.activity.video ?
                                <View style={{ width: width - 40, height: 340 }}>
                                    <VideoPlayer
                                        source={{ uri: props.activity.video }}
                                        navigator={navigator}
                                    /></View> : null}
                        </TouchableOpacity>
                    </View>
                }
                Footer={footer(props.activity.id)}
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
    const [children, setchildren] = useState({})
    useEffect(() => {
        const check = async () => {
            var child = await AsyncStorage.getItem('children')
            if (child != null) {
                child = JSON.parse(child)
                setchildren(child)
            }
        }
        check()
    }, [])
    useEffect(() => {
        const check = async () => {
            var pro = await AsyncStorage.getItem('profile')
            if (pro !== null) {
                pro = JSON.parse(pro)
                axios.get('http://104.199.158.211:5000/getchild/' + pro.email + '/')
                    .then(async (response) => {
                        setchildren(response.data)
                        await AsyncStorage.setItem('children', JSON.stringify(response.data))
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            else {
                // console.log('helo')
            }
        }
        setTimeout(() => {
            check()
        }, 3000);
    }, [])
    const there = () => {
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
                        token={children['0']['data']['gsToken']}
                    >
                        <FlatFeed Footer={() => {
                            return (
                                <SwipeUpDown
                                    itemMini={<CommentList infiniteScroll activityId={actid} />} // Pass props component when collapsed
                                    itemFull={<CommentList infiniteScroll activityId={actid} />} // Pass props component when show full
                                    onShowMini={() => console.log('mini')}
                                    onShowFull={() => console.log('full')}
                                    onMoveDown={() => console.log('down')}
                                    onMoveUp={() => console.log('up')}
                                    disablePressToShow={true} // Press item mini to show full
                                    style={{ backgroundColor: 'lightblue', display: display }} // style for swipe
                                />
                            )
                        }} notify navigation={navigation} feedGroup="timeline" Activity={CustomActivity} options={{ withOwnReactions: true }} />
                    </StreamApp>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }
    const notthere = () => {
        return (
            <View style={{ backgroundColor: 'white', height: height, width: width }}>
                <Image source={require('../assets/locked.gif')} style={{ height: 300, width: 300, alignSelf: 'center', marginTop: 60 }} />
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>You haven't added your child's details yet. Please add to use the social network</Text>
                <View style={{ backgroundColor: 'white' }}>
                    <Button onPress={() => navigation.navigate('Child')} block dark style={{ marginTop: 30, backgroundColor: '#91d7ff', borderRadius: 10, height: 50, width: width - 40, alignSelf: 'center', marginHorizontal: 20 }}>
                        <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 16, marginTop: 2 }}>Add child's details</Text>
                    </Button>
                </View>
            </View>
        )
    }
    return (
        Object.keys(children).length > 0 ? there() : notthere()
    );
};

export default FeedScreen;