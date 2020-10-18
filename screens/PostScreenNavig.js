import React, { Component }  from 'react';
import { Text, StyleSheet, Dimensions, View, ImageBackground, Image, TouchableOpacity, FlatList, PixelRatio } from 'react-native'


class PostScreenNavig extends Component {

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("focus", () =>
        setTimeout(() => {
            
            this.props.navigation.navigate("PostScreen")
        }, 10)
    );
  }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
      </View>
    );
  }
}

export default PostScreenNavig;