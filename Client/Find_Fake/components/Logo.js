//import liraries
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// create a component
class Logo extends Component {
  render() {
    const { container, wrapTextIntro, textIntro, wrapImage, styleLogo, text } = styles
    return (
      <View style={container}>
        <View style={styleLogo}>
          <View style={wrapImage}>
            <Image
              style={{ width: 65, height: 65 }}
              source={require('../assets/images/logo.jpg')}
            />
          </View>

          <View style={wrapTextIntro}>
            <Text style={textIntro}>Bộ Giáo Dục Và Đào Tạo</Text>
          </View>


        </View>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15
        }}>
          <Text style={text}>KÌ THI TRUNG HỌC PHỔ THÔNG QUỐC GIA</Text>
        </View>

      </View>

    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  styleLogo: {
    flexDirection: 'row',
    margin: 15
  },
  textIntro: {
    fontSize: 20,
    alignSelf: 'center'
  },
  wrapTextIntro: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapImage: {
    flex: 0.2,
    marginLeft: 8,
  },
  text: {
    fontSize: 32,
    textAlign: 'center',
    color: '#e93766'
  }
});

//make this component available to the app
export default Logo;
