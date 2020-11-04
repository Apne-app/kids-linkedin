/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState } from 'react';
import { Text, StyleSheet, Alert, BackHandler, Dimensions, View, ImageBackground, Image, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
import SpinnerButton from 'react-native-spinner-button';
import AsyncStorage from '@react-native-community/async-storage';
import LoginForm from '../components/Login';
import SignUpForm from '../components/SignUp';
import axios from 'axios';
import LinkedIn from '../components/LinkedIn'
import { sha256 } from 'react-native-sha256';
import { SimpleAnimation } from 'react-native-simple-animations';
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from 'react-native-gesture-handler';
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const ChildScreen = ({ route, navigation }) => {
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert("Hold on!", "Are you sure you want to Exit?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);

        }, []));


    const fontConfig = {
        default: {
            regular: {
                fontFamily: 'NunitoSans-Regular',
                fontWeight: 'normal',
            },
            medium: {
                fontFamily: 'NunitoSans-Regular',
                fontWeight: 'normal',
            },
            light: {
                fontFamily: 'NunitoSans-Regular',
                fontWeight: 'normal',
            },
            thin: {
                fontFamily: 'NunitoSans-Regular',
                fontWeight: 'normal',
            },
        },
    };

    const theme = {
        ...DefaultTheme,
        fonts: configureFonts(fontConfig),
    };

    const [activeform, setActiveForm] = React.useState(1);

    const [login, setLogin] = React.useState({
        username: '',
        password: '',
        viewPass: false
    })
    const flow = ['type', 'name', 'year']
    const screen = ["Please choose who's creating the account", "What's his/her name?", 'Which year was he/she born?']
    const [Loading, setLoading] = useState(false)
    const [current, setcurrent] = useState(0)
    const [type, settype] = useState('name');
    const [name, setname] = useState('');
    const [year, setyear] = useState(0);
    const [school, setschool] = useState('');
    const [grade, setgrade] = useState('');
    const api = async () => {
        if (current == flow.length - 1) {
            Keyboard.dismiss
            var pro = await AsyncStorage.getItem('profile');
            pro = JSON.parse(pro);
            console.log(pro, "sad");
            axios.get('http://104.199.158.211:5000/child/' + name.toLowerCase() + '/' + year + '/' + 'none' + '/' + 'none' + '/' + pro.email)
                .then(async (response) => {
                    if (response.data.split(', ').length == 2) {
                        await AsyncStorage.setItem('status', '3')
                        // console.log(response.data)
                        navigation.navigate('ChildSuccess')
                    }
                })
        }
        else {
            setcurrent(current + 1)
            setLoading(false)
        }

    }
    const inputtype = () => {
        if (current == 0) {
            return (
                <View style={{ flexDirection: 'row', justifyContent:'space-evenly',}}>
                    <TouchableOpacity onPress={()=>setcurrent(1)} style={{ borderColor: 'lightgrey', borderWidth: 2, borderRadius: 10,  width: 180, marginRight:10 }}>
                        <Image source={require('../images/kids.png')} style={{ width: 130, height: 114, alignSelf:'center', marginTop:13 }} />
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, textAlign: 'center', paddingHorizontal: 20 }}>I am a kid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>setcurrent(1)} style={{ borderColor: 'lightgrey', borderWidth: 2, borderRadius: 10, width: 180  }}>
                        <Image source={require('../images/parent.png')} style={{ width: 130, height: 130, alignSelf:'center' }} />
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, textAlign: 'center', paddingHorizontal: 20 }}>I am a parent</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else if (current == 1) {
            return (
                <TextInput value={name} onChangeText={(text) => setname(text)} style={{ width: width - 40, borderRadius: 10, height: 70, backgroundColor: '#ededed', fontSize: 20, padding: 10, fontFamily: 'NunitoSans-Regular', borderWidth: 1 }}></TextInput>
            )
        }
        else if (current == 2) {
            return (
                <TextInput keyboardType='numeric' value={year} onChangeText={(text) => setyear(text)} style={{ width: width - 40, borderRadius: 10, height: 70, backgroundColor: '#ededed', fontSize: 20, padding: 10, fontFamily: 'NunitoSans-Regular', borderWidth: 1 }}></TextInput>
            )
        }
    }
    return (
        <Container style={styles.container}>
            <Content>
                <View>
                    <SimpleAnimation delay={500} duration={1000} fade staticType='zoom'>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, textAlign: 'center', paddingHorizontal: 20 }}>Help us out with a few details </Text>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, textAlign: 'center', marginTop: 20, marginBottom: 20, padding: 20 }}>{screen[current]}</Text>
                    </SimpleAnimation>
                    <KeyboardAvoidingView>
                        <View style={{ alignSelf: 'center' }}>
                            {inputtype()}
                        </View>
                        <View style={{ alignSelf: 'center', display:current?'flex':'none' }}>
                            <SpinnerButton
                                buttonStyle={{
                                    borderRadius: 10,
                                    margin: 20,
                                    width: 100,
                                    alignSelf: 'center',
                                    backgroundColor: name != '' && current != 2 ? 'lightblue' : parseInt(year) > 2010 ? 'lightblue' : 'grey'
                                }}
                                isLoading={Loading}
                                spinnerType='BarIndicator'
                                onPress={() => {
                                    setLoading(true); api()
                                }}
                                indicatorCount={10}
                            >
                                <Icon active type="Feather" name='chevron-right' />
                                {/* <Text style={styles.buttonText}>Next</Text> */}
                            </SpinnerButton>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    form: {
        marginTop: 40,
        flex: 1
        // alignSelf: 'center'
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    tinyLogo: {
        alignSelf: 'center',
        width: 100,
        height: 100
    },
    safeArea: {
        backgroundColor: '#F5FCFF',
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        paddingTop: height / 4,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'NunitoSans-SemiBold',
        paddingHorizontal: 20,
    },
    buttonStyle: {
        borderRadius: 10,
        margin: 20,
        width: 100,
        alignSelf: 'center'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
})

export default ChildScreen;