/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { View, Image, Text, ScrollView, TouchableOpacity, Share } from 'react-native'
import CompHeader from '../Modules/CompHeader'
import Clipboard from '@react-native-clipboard/clipboard';
import { Container, Header, Content, Form, Item, Input, Label, H1, H2, H3, Icon, Button, Segment, Thumbnail, Footer, Body, Title, Right, Textarea } from 'native-base'
import { width } from '../Modules/CommonImports';
import axios from 'axios'
import { Snackbar } from 'react-native-paper';
import { JWT_USER, JWT_PASS } from '@env'
import dynamicLinks from '@react-native-firebase/dynamic-links';
const ReferralScreen = ({ navigation, route }) => {
    const children = route.params.children
    const [copied, setcopied] = useState(false)
    const [noref, setnoref] = useState('')
    const [link, setlink] = useState('Loading...')
    useEffect(() => {
        var user_id = children[0]['id']
        //https://genio.app/referral/ABC123
        var data = JSON.stringify({ "username": JWT_USER, "password": JWT_PASS });

        var config = {
            method: 'post',
            url: 'https://api.genio.app/dark-knight/getToken',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        var token = ''
        axios(config)
            .then(function (response) {
                const url = 'https://api.genio.app/get-out/createreferral';
                let data = '';
                data = JSON.stringify({
                    "user_id": user_id,
                })
                token = response.data.token
                axios({
                    method: 'post',
                    url: url + `?token=${token}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                }).then(async (response) => {
                    if (response.data.new) {
                        setnoref(0)
                        const SENDER_UID = response.data.token;
                        const link = `https://genio.app?referral=${SENDER_UID}`;
                        const dynamicLinkDomain = 'https://link.genio.app';
                        const generatedLink = await dynamicLinks().buildShortLink({
                            link: link,
                            domainUriPrefix: dynamicLinkDomain,
                            android: {
                                packageName: 'com.genioclub.app',
                            }

                        });
                        const url = 'https://api.genio.app/get-out/referrallink';
                        let data = '';
                        data = JSON.stringify({
                            "user_id": user_id,
                            "link": generatedLink,
                        })
                        setlink(generatedLink)
                        axios({
                            method: 'post',
                            url: url + `?token=${token}`,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: data
                        }).then(async (response) => { })
                            .catch(async (response) => { })
                    }
                    else {
                        setnoref(response.data.n_ref)
                        setlink(response.data.url)
                    }


                }).catch((error) => {
                    console.log(error)
                })

            }).catch((error) => {
                console.log(error)

            })
    }, [])
    const copyClip = () => {
        Clipboard.setString(link);
        setcopied(true)
        setTimeout(() => {
            setcopied(false)
        }, 5000);
    }
    const onShare = async () => {
        var message = "Download Genio using my referral today! Here's the link: "+link
        try {
            const result = await Share.share({
                message:
                    message,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <CompHeader screen={'Referral'} goback={() => navigation.pop()} icon={'back'} />
            <View style={{ backgroundColor: '#327FEB', height: 250, width: 250, borderRadius: 10, marginTop: 20, alignSelf: 'center' }}>
                <Image source={require('../assets/referral.gif')} style={{ width: 200, height: 200, marginTop: 25, marginLeft: 25 }} />
            </View>
            <Text style={{ fontFamily: 'NunitoSans-Bold', textAlign: 'center', marginTop: '50%', fontSize: 25 }}>
                Number of referrals: {noref}
            </Text>
            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20, borderWidth: 1, borderColor: 'grey', borderRadius: 10, height: 50, width: width - 40 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => copyClip()} >
                        <Text style={{ fontFamily: 'NunitoSans-Bold', textAlign: 'center', fontSize: 20, color: '#327FEB', marginHorizontal: 10, marginTop: 5 }}>
                            {link}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={{ width: 1, height: 47, backgroundColor: 'black' }} />
                <TouchableOpacity style={{ marginHorizontal: 10, marginTop: 10 }} onPress={() => onShare()} >
                    <Icon name="share-2" type="Feather" style={{ fontSize: 20 }} />
                </TouchableOpacity>
            </View>
            <Snackbar visible={copied} >
                <Text style={{ fontFamily: "NunitoSans-Bold" }}>Referral Link copied to clipboard :)</Text>
            </Snackbar>
        </View>
    )
}
export default ReferralScreen
