/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import {
    React,
    Component,
    useState,
    useEffect,
    useRef,
    Text, StyleSheet, Alert, BackHandler, Dimensions, View, ImageBackground, Image, TextInput, KeyboardAvoidingView, Keyboard,
    Container, Fab, Content, Header, Tab, Left, Body, Right, Title, Tabs, ScrollableTab, Card, CardItem, Footer, FooterTab, Button, Icon,
    DefaultTheme, configureFonts,
    SpinnerButton,
    AsyncStorage,
    analytics,
    useFocusEffect,
    axios,
    sha256,
    getUniqueId, getManufacturer,
    SimpleAnimation,
    ScrollView, TouchableOpacity,
    height, width
} from '../Modules/CommonImports.js';
import AuthContext from '../Context/Data';
const ChildScreen = ({ route, navigation }) => {
    const scrollcheck = useRef(null)
    const { Update } = React.useContext(AuthContext);
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
    const screen = ["Please choose who's creating the account", "What's your kid's name?", 'Which year was your kid born?']
    const [Loading, setLoading] = useState(false)
    const [current, setcurrent] = useState(0)
    const [type, settype] = useState('name');
    const [name, setname] = useState('');
    const [year, setyear] = useState(0);
    const [school, setschool] = useState('');
    const [grade, setgrade] = useState('');
    const [active, setactive] = useState(false);
    const [text, settext] = useState();
    const api = async () => {
        if (current == 1) {
            var x = await AsyncStorage.getItem('children');
            analytics.track('Child Name Entered', {
                userID: null,
                deviceID: getUniqueId()
            })
            if (name == '') {
                settext('*Please Enter a valid name')
                setactive(true)
                return
            }
            else {
                setactive(false)
                setcurrent(2)
            }
        }
        else if (current == 2) {
            var x = await AsyncStorage.getItem('children');
            analytics.track('Child Birth Year Entered', {
                userID: null,
                deviceID: getUniqueId()
            })
            if (year == 0) {
                settext('*Please enter a valid year')
                setactive(true)
                return
            }
            else if (year > parseInt(new Date().getFullYear())) {
                settext('*Please enter a valid year')
                setactive(true)
                return
            }
            else if (year < parseInt(new Date().getFullYear()) - 13) {
                navigation.navigate('KidsAge')
                return
            }
            else {
                setactive(false)
                setLoading(true)
                Keyboard.dismiss()
                var pro = await AsyncStorage.getItem('profile');
                pro = JSON.parse(pro);
                console.log(pro, "sad");
                var data = JSON.stringify({ "username": "Shashwat", "password": "GenioKaPassword" });

                var config = {
                    method: 'post',
                    url: 'https://api.genio.app/dark-knight/getToken',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {
                        // console.log(JSON.stringify(response.data.token));
                        axios({
                            method: 'post',
                            url: 'https://api.genio.app/matrix/child/' + `?token=${response.data.token}`,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify({
                                "name": name.toLowerCase(),
                                "year": year,
                                "school": "none",
                                "grade": "none",
                                "email": pro.email,
                                "acctype": "Kid"
                            })
                        })
                            .then(async (response2) => {
                                if (response2.data.split(', ').length == 2) {
                                    await AsyncStorage.setItem('status', '3')
                                    // console.log(response.data)
                                    var response1 = await axios({
                                        method: 'post',
                                        url: 'https://api.genio.app/matrix/getchild/' + `?token=${response.data.token}`,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        data: JSON.stringify({
                                            "email": pro.email,
                                        })
                                    })
                                    await AsyncStorage.setItem('children', JSON.stringify(response1.data))
                                    Update({ children: response1.data, status: '3', profile: pro, notifications: {} })
                                    navigation.navigate('ChildSuccess')
                                }
                            })
                    })
                    .catch(function (error) {
                        console.log(error);
                    });


            }

        }

    }
    const inputtype = () => {
        if (current == 0) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
                    <TouchableOpacity onPress={async () => {
                        var x = await AsyncStorage.getItem('children');
                        analytics.track('I am a Kid', {
                            userID: null,
                            deviceID: getUniqueId()
                        })
                        navigation.navigate('KidUser');
                    }} style={{ borderColor: 'lightgrey', borderWidth: 2, borderRadius: 10, width: 180, marginRight: 10, height: 170 }}>
                        <Image source={require('../images/kids.png')} style={{ width: 130, height: 114, alignSelf: 'center', marginTop: 13 }} />
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, textAlign: 'center', paddingHorizontal: 20 }}>I am a kid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={async () => {
                        var x = await AsyncStorage.getItem('children');
                        analytics.track('I am a parent', {
                            userID: null,
                            deviceID: getUniqueId()
                        })
                        setcurrent(1);
                    }} style={{ borderColor: 'lightgrey', borderWidth: 2, borderRadius: 10, width: 180, height: 170 }}>
                        <Image source={require('../images/parent.png')} style={{ width: 130, height: 130, alignSelf: 'center' }} />
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, textAlign: 'center', paddingHorizontal: 20 }}>I am a parent</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else if (current == 1) {
            return (
                <TextInput value={name} onChangeText={(text) => { setname(text); setactive(false) }} style={{ display: 'flex', width: width - 40, borderRadius: 28.5, backgroundColor: 'white', fontSize: 16, paddingLeft: 20, shadowColor: '', fontFamily: 'NunitoSans-Regular', alignSelf: 'center', height: 55, elevation: 1 }}></TextInput>
            )
        }
        else if (current == 2) {
            return (
                <TextInput keyboardType='numeric' value={year} onChangeText={(text) => { setyear(text); setactive(false) }} style={{ display: 'flex', width: width - 40, borderRadius: 28.5, backgroundColor: 'white', fontSize: 16, paddingLeft: 20, shadowColor: '', fontFamily: 'NunitoSans-Regular', alignSelf: 'center', height: 55, elevation: 1 }}></TextInput>
            )
        }
    }
    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }} ref={scrollcheck}>
                <KeyboardAvoidingView>
                    <View>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, paddingHorizontal: 20 }}>Help us out with a few details </Text>
                        <Text style={{ fontFamily: 'NunitoSans-SemiBold', fontSize: 18, marginTop: 20, marginBottom: 20, padding: 20 }}>{screen[current]}</Text>
                        <View>
                            {inputtype()}
                            <Text style={{ color: "red", fontFamily: 'NunitoSans-Bold', fontSize: 12, marginTop: 4, display: active ? 'flex' : 'none', marginLeft: 20 }}>{text}</Text>
                        </View>
                        <View style={{ alignSelf: 'center', display: current ? 'flex' : 'none', flexDirection: 'row', marginTop: 20 }}>
                            <SpinnerButton
                                buttonStyle={{
                                    borderRadius: 28.5,
                                    width: 130,
                                    alignSelf: 'center',
                                    backgroundColor: '#327FEB',
                                    height: 36,
                                    marginRight: 20
                                }}
                                isLoading={Loading}
                                spinnerType='BarIndicator'
                                onPress={() => {
                                    setcurrent(current - 1);
                                    setactive(false)
                                }}
                                indicatorCount={10}
                            >
                                <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 18, marginTop: 0 }}>Back</Text>
                                {/* <Text style={styles.buttonText}>Next</Text> */}
                            </SpinnerButton>
                            <SpinnerButton
                                buttonStyle={{
                                    borderRadius: 28.5,
                                    width: 130,
                                    alignSelf: 'center',
                                    backgroundColor: '#327FEB',
                                    height: 36
                                }}
                                isLoading={Loading}
                                spinnerType='BarIndicator'
                                onPress={() => {
                                    api()
                                }}
                                indicatorCount={10}
                            >
                                <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 18, marginTop: 0 }}>Next</Text>
                                {/* <Text style={styles.buttonText}>Next</Text> */}
                            </SpinnerButton>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <TouchableOpacity onPress={async () => { await AsyncStorage.setItem('status', '1'), navigation.navigate(route.params ? route.params.screen : 'Home') }} block dark style={{ marginBottom: 20 }}>
                <Text style={{ color: "#000", fontFamily: 'NunitoSans-SemiBold', fontSize: 18, marginTop: 10, alignSelf: 'center', textDecorationLine: 'underline' }}>Continue as guest</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: '#efefef',
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