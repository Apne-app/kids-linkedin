/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, Button, Linking } from 'react-native'
const UpdateScreen = () => {
    return (
        <TouchableOpacity onPress={() => Linking.openURL("market://details?id=com.genioclub.app")} style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <View style={{ height: 250, width: 250, backgroundColor: '#327FEB', borderRadius: 10, alignSelf: 'center', alignItems: 'center', marginBottom: 40, marginTop: -50 }}>
                <Image source={{ uri: 'https://d5c8j8afeo6fv.cloudfront.net/upload.gif' }} style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 20 }} />
            </View>
            <Text style={{ fontFamily: 'NunitoSans-SemiBold', textAlign: 'center', fontSize: 16 }}>Genio app has been updated for a faster and better experience, please update your app now to enjoy Genio again :)</Text>
            <TouchableOpacity
                style={{ backgroundColor: '#327FEB', height: 60, marginTop: 20, justifyContent:'center', width:200, alignSelf:'center', borderRadius:28.5 }}
                onPress={() => Linking.openURL("market://details?id=com.genioclub.app")}
            >
                <Text style={{ fontFamily: 'NunitoSans-Bold', color: 'white', textAlign:'center' }}>Click to update now</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
export default UpdateScreen 