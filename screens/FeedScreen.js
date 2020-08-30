/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button } from 'native-base';
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { StreamApp, FlatFeed, Activity, LikeButton, CommentBox } from 'react-native-activity-feed';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CustomActivity = (props) => {
  return (
    <Activity
      {...props}
      Footer={
        <View>
        <LikeButton {...props} />
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
const FeedScreen = ({navigation, route}) => {
    return (
        <SafeAreaProvider>
            <Header style={{ backgroundColor: '#91d7ff', borderColor: '#91d7ff', borderWidth: 0.7, flexDirection: 'row' }}>
                <TouchableOpacity onPress={()=>navigation.openDrawer()}>
                <Image source={require('../assets/link.png')} style={{ width: 35, height: 35, borderRadius: 0, marginTop: 12, marginRight:10 }} />
                </TouchableOpacity>
                {/* <Searchbar
                    placeholder="Search"
                    // onChangeText={onChangeSearch}
                    // value={searchQuery}
                    style={{width:width-40}}
                /> */}
                <Searchbar
                    theme={theme}
                    placeholder={'Search'}
                    style={{ color: '#91d7ff', backgroundColor: 'white', height:30, width:width-100, marginTop:14 }}
                // onChangeText={text => setText(text)}
                />
                <Icon type="Feather" name="message-square" style={{ width: 35, height: 35, borderRadius: 0, marginTop: 14, marginLeft:10 }} />
            </Header>
            <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
                <StreamApp
                    apiKey="r55k622fc59y"
                    appId="89658"
                    token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidXNlci1vbmUifQ.hEnluC7g7xO1lsg833pSj1uCPzHrfkR6VujaqaTr2fo"
                >
                    <FlatFeed Activity={CustomActivity} options={{withOwnReactions: true}} />
                </StreamApp>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default FeedScreen;