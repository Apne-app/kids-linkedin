/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react'
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Spinner, Segment, Thumbnail } from 'native-base';
import LinkedInModal from '../screens/react-native-linkedin';
import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@segment/analytics-react-native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import axios from 'axios';

var height = Dimensions.get('screen').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const LinkedIn = ({ navigation, authtoken, loaderHandler }) => {

  let a, b, c;
  let i = 0;
  let tk = "";
  // const [token, setToken] = React.useState('');

  const [linkedinInfo, setLinkedInfo] = React.useState({
    fname: '',
    lname: '',
    email: '',
  })

  async function getInfo(token) {

    loaderHandler();
    tk = token;
    await axios.get("https://api.linkedin.com/v2/me/?projection=(id,firstName,lastName,email-address,profilePicture(displayImage~:playableStreams))", { headers: { 'Authorization': "Bearer " + token } })
      .then(response => {
        // console.log(response.data);
        a = response.data.firstName.localized.en_US;
        b = response.data.lastName.localized.en_US;
      })
      .then(async () => {
        // console.log(tk);
        await axios.get(
          "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))", { headers: { 'Authorization': "Bearer " + tk } })
          .then(response => {
            // setInfo(response.data);
            // setLoading(false);
            // console.log(response.data);
            c = response.data.elements[0]['handle~'].emailAddress;
            var data = JSON.stringify({ "email": c, "pfname": a, "plname": b });
            // console.log(a, b, c)
            axios({
              method: 'post',
              url: 'https://api.genio.app/get-out/authLinkedin/' + `?token=${authtoken}`,
              headers: {
                'Content-Type': 'application/json'
              },
              data: data
            })
              .then(async (response) => {
                // console.log(response.data, "aaaa")

                try {
                  await AsyncStorage.setItem('profile', JSON.stringify(response.data));
                  axios({
                    method: 'post',
                    url: 'https://api.genio.app/matrix/getchild/' + `?token=${authtoken}`,
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    data: data
                  })
                    .then(async (response) => {
                      await AsyncStorage.setItem('children', JSON.stringify(response.data))
                      if (Object.keys(response.data).length) {
                        await AsyncStorage.setItem('status', '3')
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Home' }],
                        });
                      }
                      else {
                        await AsyncStorage.setItem('status', '2')
                        navigation.navigate('Child')
                      }
                      // console.log(response.data, "abcd")
                    })
                  // navigation.navigate('Child');
                } catch (e) {
                  // saving error
                }
              })
              .catch(err => console.log(err, "aa"))
          })
          .catch(error => console.log(error, "bb"));
      })
      .then(() => console.log(linkedinInfo))
      .catch(err => {
        console.log(err, "cc")
        if (!i) {
          i++;
          // setInterval(() => {
          //   getInfo();
          // }, 2000);
        }
      })

    // console.log(linkedinInfo);

  }

  const linkedRef = React.createRef();
  return (
    <LinkedInModal
      ref={linkedRef}
      clientID="86eyqhqu84z2db"
      clientSecret="DaHDCXhoYqJwp6sN"
      redirectUri="https://genio.app/"
      onSuccess={async (data) => {
        // setToken(data.access_token);
        // var x = await AsyncStorage.getItem('children');
        analytics.track('Login Via Linkedin', {
          userID: null,
          deviceID: getUniqueId()
        })
        getInfo(data.access_token);
      }}
      // permissions={['r_liteprofile']}
      renderButton={() =>
      (
        <Button block iconLeft style={{ marginTop: 82, flex: 1, borderColor: '#327FEB', backgroundColor: '#327FEB', borderWidth: 1, borderRadius: 28.5, height: 50, marginHorizontal: 20, borderBottomColor: '#2477ed', borderBottomWidth: 2 }} onPress={() => linkedRef.current && linkedRef.current.open()} >
          <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 18, }}>Sign In with</Text>
          <Image source={require('../images/Ln-Logo.png')} style={{ width: 100, height: 100, resizeMode: 'contain', marginLeft: 10 }} />
        </Button>
      )
      }
      onError={(err) => console.log(err)}
    >
    </LinkedInModal>
  );

}
export default LinkedIn;

// const LinkedInButton = ({ ...props }) => {
//   const modalRef = React.useRef();

//   return (
//     <LinkedInModal
//       ref={modalRef}
//       clientID="86mwd6nlgj5elt"
//       clientSecret="wcQBhM67qpbi6yqY"
//       redirectUri="https://www.apne.app/"
//       onSuccess={props.onSuccess}
//       renderButton={() => (
        // <Button {...props} block style={{backgroundColor: "#fff", marginVertical: 15, height: 60, marginTop: height*0.03, flexDirection: 'row'}} onPress={() => modalRef.current && modalRef.current.open()}>
        //     <Thumbnail source={require('../assets/linkedin.jpg')} style={{height: 35, width: 35}} />
        //     <Text style={{color: "#000", fontSize: 20}}>  LinkedIn</Text>
        //   </Button>
//       )}
//     />
//   );
// };

// export default LinkedInButton;