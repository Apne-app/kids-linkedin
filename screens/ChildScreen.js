/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React, { Component, useState } from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
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
var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;
const ChildScreen = ({ route, navigation }) => {
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

    const [activeform, setActiveForm] = React.useState(1);

    const [login, setLogin] = React.useState({
        username: '',
        password: '',
        viewPass: false
    })
    const flow = ['name', 'year']
    const screen = ["What's his/her name?", 'Which year was he/she born?']
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
            axios.get('http://104.199.158.211:5000/child/' + name + '/' + year + '/' + 'none' + '/' + 'none' + '/' + pro.email)
                .then((response) => {
                    if (response.data.split(', ').length == 2) {
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
                <TextInput value={name} onChangeText={(text) => setname(text)} style={{ width: width - 40, borderRadius: 10, height: 70, backgroundColor: '#ededed', fontSize: 20, padding: 10, fontFamily: 'Poppins-Regular', borderWidth: 1 }}></TextInput>
            )
        }
        else if (current == 1) {
            return (
                <TextInput keyboardType='numeric' value={year} onChangeText={(text) => setyear(text)} style={{ width: width - 40, borderRadius: 10, height: 70, backgroundColor: '#ededed', fontSize: 20, padding: 10, fontFamily: 'Poppins-Regular', borderWidth: 1 }}></TextInput>
            )
        }
    }
    return (
        <Container style={styles.container}>
            <Content>
                <View>
                    <SimpleAnimation delay={500} duration={1000} fade staticType='zoom'>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, textAlign: 'center', paddingHorizontal: 20 }}>Help us out with a few details of your child</Text>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, textAlign: 'center', marginTop: 20, marginBottom: 20, padding: 20 }}>{screen[current]}</Text>
                    </SimpleAnimation>
                    <KeyboardAvoidingView>
                        <View style={{ alignSelf: 'center' }}>
                            {inputtype()}
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <SpinnerButton
                                buttonStyle={{
                                    borderRadius: 10,
                                    margin: 20,
                                    width: 100,
                                    alignSelf: 'center',
                                    backgroundColor:name!='' && current!=1?'lightblue':parseInt(year)>2000?'lightblue':'grey'
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
        fontFamily: 'Poppins-SemiBold',
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