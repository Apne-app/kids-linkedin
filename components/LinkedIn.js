import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import { TextInput, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail } from 'native-base';
import LinkedInModal from 'react-native-linkedin'
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


    const [token, setToken] = React.useState('');
    
    async function getInfo() {
      await 
        axios.get(
          "api.linkedin.com/v2/me?projection=(id,firstName,lastName,email-address,profilePicture(displayImage~:playableStreams))",
          {
            Authorization: "Bearer " + token
          }
        )
        .then(response => {
          // setInfo(response.data);
          // setLoading(false);
          console.log(response);
        })
        .catch(error => console.log(error));
    }

  const linkedRef = React.createRef();
    return (
        <LinkedInModal
            ref={linkedRef}
            clientID="86mwd6nlgj5elt"
            clientSecret="wcQBhM67qpbi6yqY"
            redirectUri="https://www.apne.app/"
            onSuccess={(data) => {
                setToken(data.access_token);
                // getInfo();
                navigation.navigate('Home', {});
            }}
            // permissions={['r_liteprofile']}
            renderButton={() => 
            (
                <Button block style={{backgroundColor: "#fff", marginVertical: 15, height: 60, marginTop: height*0.03, flexDirection: 'row'}} onPress={() => linkedRef.current && linkedRef.current.open()}>
                    <Thumbnail source={require('../assets/linkedin.png')} style={{height: 35, width: 35}} />
                    <Text style={{color: "#000", fontSize: 20}}>  LinkedIn</Text>
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