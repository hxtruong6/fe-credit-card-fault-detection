//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
class ImageVerifiedScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>ImageVerifiedScreen</Text>
            </View>
        );
    }
}

ImageVerifiedScreen.navigationOptions = {
    title: '       Xác Nhận CMND'
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

//make this component available to the app
export default ImageVerifiedScreen;
