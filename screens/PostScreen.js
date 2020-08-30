/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as React from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider, Searchbar, List, Button, Menu, Divider, Provider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Thumbnail, ListItem, Separator, Left, Body, Right, Title } from 'native-base';
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
const PostScreen = () => {
    const [text, setText] = React.useState('');
    return (
        <View>
            <Header style={{ backgroundColor: '#91d7ff', borderColor: '#91d7ff', borderWidth: 0.7, flexDirection: 'row' }}>
                <Left />
                <Left />
                <Body style={{ alignItems: 'center' }}>
                    <Title style={{ fontFamily: 'Poppins-Regular', color: "#000" }}>Start Post</Title>
                </Body>
                <Right />
            </Header>
            <Header style={{ backgroundColor: 'white', borderColor: '#91d7ff', borderWidth: 0.7, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image source={require('../assets/link.png')} style={{ width: 35, height: 35, borderRadius: 0, marginTop: 12, marginRight: 10, left: -width / 2.5 }} />
                </TouchableOpacity>
            </Header>
            <View style={{ alignItems: 'center' }}>
                <TextInput
                    theme={theme}
                    placeholder={'What do you want to share with the world today?'}
                    value={text}
                    style={{ width: width - 20, textAlign: 'center', marginTop: 20, backgroundColor: 'white' }}
                    onChangeText={text => setText(text)}
                    multiline={true}
                    numberOfLines={11}
                />
            </View>
            <View style={{ flexDirection: 'column', padding: 20, backgroundColor: 'white', marginTop: 10, width: width - 20, alignSelf:'center' }}>
            <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 18 }}>Attach:</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Icon type="Feather" name="image" style={{ color: 'black', marginRight: 20 }} />
                    <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 18 }}>Image</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop:10 }}>
                    <Icon type="Feather" name="video" style={{ color: 'black', marginRight: 20 }} />
                    <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 18 }}>Video</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop:10 }}>
                    <Icon type="Feather" name="award" style={{ color: 'black', marginRight: 20 }} />
                    <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 18 }}>Achievement</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop:10 }}>
                    <Icon type="Feather" name="briefcase" style={{ color: 'black', marginRight: 20 }} />
                    <Text style={{ color: "black", fontFamily: 'Poppins-SemiBold', fontSize: 18 }}>Service</Text>
                </View>
            </View>
        </View>
    );
};

export default PostScreen;