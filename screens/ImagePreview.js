
import React, {useState, useRef} from 'react';
import {Button, StatusBar, StyleSheet, View, Image, ImageBackground, Dimensions, Text} from 'react-native';
import {CropView} from 'react-native-image-crop-tools';
import ImagePicker from 'react-native-image-picker';


var height = Dimensions.get('screen').height;
var width = Dimensions.get('screen').width;


const App: () => React$Node = () => {
  const [uri, setUri] = useState();
  const [croppedi, setcroppedi] = React.useState('');
  const cropViewRef = useRef();

  if(croppedi == '')
  {

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Button
          title={'Pick Image'}
          onPress={() => {
            ImagePicker.launchImageLibrary({noData: true}, response => {
              setUri(response.uri);
            });
          }}
        />
        {uri !== undefined && <CropView
          sourceUrl={uri}
          style={styles.cropView}
          ref={cropViewRef}
          onImageCrop={(res) => setcroppedi(res.uri)}
          // keepAspectRatio
          // aspectRatio={{width: 16, height: 9}}
        />}
        <Button
          title={'Get Cropped View'}
          onPress={async () => {
            cropViewRef.current.saveImage(true, 90);
            cropViewRef.rotateImage(false)
            // await console.log();
          }}
        />
      </View>
    </>
  );
  }
  else
  {
    return (

    <View style={styles.container}>
      <Image
          style={styles.image}
          // imageStyle= {{ transform: [{ rotate: '-90deg'}]}}
          source={{
          uri: croppedi,
          }}
      />
      <Button title={'Go Back'} onPress={() => setcroppedi('')} />
    </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cropView: {
    flex: 1,
    backgroundColor: 'red'
  },

  image: {
    height: width,
    width: width,
    // margin: width*0.02,
    // elevation: 3
    // borderRadius: 30,
    
  },
});

export default App;