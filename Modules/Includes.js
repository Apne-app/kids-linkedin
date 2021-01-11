/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import { View } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-community/async-storage';
const Includes = () => {
    useEffect(() => {
        dynamicLinks()
            .getInitialLink()
            .then(async (link) => {
                console.log(link)
                var pro = await AsyncStorage.getItem('profile')
                pro = JSON.parse(pro)
                console.log(pro, link, link.url.includes(pro.uuid))
                if (link.url.includes(pro.uuid)) {
                    naviagtion.navigate('Verified')
                }
                else {
                    naviagtion.navigate('Unverified')
                }
            })
            .catch(() => {
                console.log('do nothing')
            }
            )
    }, []);
    return (
        <View>
        </View>
    )
}
export default Includes