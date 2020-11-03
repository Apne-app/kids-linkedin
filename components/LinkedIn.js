/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
import LinkedInModal from 'react-native-linkedin';
import AsyncStorage from '@react-native-community/async-storage';
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
 
const LinkedIn = ({navigation}) => {

    let a, b;
    let i = 0;
    // const [token, setToken] = React.useState('');

    const [linkedinInfo, setLinkedInfo] = React.useState({
      fname:'',
      lname: '',
      email: '',
    })
    
    async function getInfo(token) {
      // console.log(token);
      // await 
      await axios.get("https://api.linkedin.com/v2/me/?projection=(id,firstName,lastName,email-address,profilePicture(displayImage~:playableStreams))", { headers: { 'Authorization': "Bearer " + token } })
      .then(response => {
        // console.log(response.data);
          a = response.data.firstName.localized.en_US;
          b = response.data.lastName.localized.en_US;
      })
      .then(async () => {
        await axios.get(
          "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))", { headers: { 'Authorization': "Bearer " + token } })
        .then(response => {
          // setInfo(response.data);
          // setLoading(false);
          console.log(response.data.elements[0]['handle~'].emailAddress);
            c =  response.data.elements[0]['handle~'].emailAddress,
            axios.get('http://104.199.146.206:5000/authLinkedin/' + c + '/' + b + '/' + a)
              .then(async (response) => {
                console.log(response.data)
                
                  try {
                  await AsyncStorage.setItem('profile', JSON.stringify(response.data));
                  navigation.navigate('Child');
                } catch (e) {
                  // saving error
                }
            })
            .catch(err => console.log(err))
        })
        .catch(error => console.log(error));
      })
      .then(() => console.log(linkedinInfo))
      .catch(err => {
        console.log(err)
        if(!i)
        {
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
            clientID="86mwd6nlgj5elt"
            clientSecret="wcQBhM67qpbi6yqY"
            redirectUri="https://www.apne.app/"
            onSuccess={(data) => {
                // setToken(data.access_token);
                getInfo(data.access_token);
            }}
            // permissions={['r_liteprofile']}
            renderButton={() => 
            (
                <Button block  iconLeft style={{ marginTop: 82, flex: 1, borderColor: '#327FEB', backgroundColor: '#327FEB', borderWidth: 1, borderRadius: 28.5, height: 60, marginHorizontal:20 }} onPress={() => linkedRef.current && linkedRef.current.open()} >
                  <Text style={{ color: "white", fontFamily: 'NunitoSans-Bold', fontSize: 16,}}>Login with</Text>
                  <Icon type="FontAwesome" name="linkedin" style={{ color: 'white', marginRight: 20 }} />
                </Button>
            )
            }
            onError ={(err) => console.log(err)}
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