import React from 'react';
import Camera from '../components/Camera'
import {BackHandler} from 'react-native'
import { useFocusEffect } from "@react-navigation/native";

const CameraScreen = ({navigation, route}) => {

    const [gallery, setGallery] = React.useState(false);

    const galleryHandler = () => {
      setGallery(true)
    }

    useFocusEffect(
        React.useCallback(() => {
        const backAction = () => {
        
        if(gallery)
        {
          setGallery(false);
        }
        else if(route.params)
        {
            navigation.navigate('PostScreen');
        }
        else
        {
            console.log(route.params)
    //     navigation.navigate('Home', {
    //     screen: 'Feed',
    //   })
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
    }, []));

    return <Camera navigation={navigation} galleryState={gallery} action={galleryHandler} route={route} />

}

export default CameraScreen;