/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FlatList, View, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import { width } from '../Modules/CommonImports'
import CompHeader from '../Modules/CompHeader'
const LikesList = ({ navigation, route }) => {
    const [likes, setlikes] = useState([])
    useEffect(() => {
        axios.post('http://mr_robot.api.genio.app/getlikes', {
            post_id: route.params.post_id
        }, {
            headers: {
                'Authorization': 'Basic OWNkMmM2OGYtZWVhZi00OGE1LWFmYzEtOTk5OWJjZmZjOTExOjc0MzdkZGVlLWVmMWItNDVjMS05MGNkLTg5NDMzMzUwMDZiMg==',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            setlikes(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    const RenderItem = (item) => {
        item = item['item']['data']
        return (
            <>
                <View key={item['likes_id']} style={{ flexDirection: 'row', margin: 10 }}>
                    <FastImage style={{ width: 40, height: 40, borderRadius: 1000 }} source={{ uri: item['likes_user_image'] }} />
                    <Text style={{ color: 'black', fontFamily: 'NunitoSans-SemiBold', fontSize: 14, margin: 10, paddingRight: 40 }}>{item['likes_user_name'][0].toUpperCase() + item['likes_user_name'].substring(1)}</Text>
                </View>
                <View style={{ width: width - 80, alignSelf: 'center', height: 0.5, backgroundColor: 'lightgrey', marginVertical: 5 }} />
            </>
        )
    }
    return (
        <FlatList style={{ backgroundColor: 'white' }} ListEmptyComponent={() => { return (<FastImage source={require('../assets/loading.gif')} style={{ width: 100, height: 100, margin: 20 }} />) }} renderItem={({ item }) => { return (<RenderItem item={item} />) }} data={likes} ListHeaderComponent={<CompHeader style={{ position: 'absolute' }} screen={'Likes List'} icon={'back'} goback={() => navigation.pop()} />} />
    )
}
export default LikesList