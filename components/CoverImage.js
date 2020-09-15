import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CoverImage = ({ source, size }) => {
    return (
        <View style={[styles.profileCover, { height: size ? size : 200 }]}>
            <Image
                style={[styles.profileCoverImage, { height: size ? size : 200 }]}
                source={{ uri: source }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    profileCover: {
        height: 200,
        position: 'absolute',
        width: 100 + '%',
    },
    profileCoverGradient: {
        height: 200,
        width: 100 + '%',
        position: 'absolute',
    },
    profileCoverImage: {
        height: 200,
        width: 100 + '%',
        position: 'absolute',
    },
});

export default CoverImage;
