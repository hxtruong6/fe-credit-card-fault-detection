// import liraries
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ScrollView
} from 'react-native';
import { PRIMARY_COLOR } from '../../src/util/Color';

// create a component
class Guide extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Text style={styles.text}>
            Bước 1: Đăng Ký
{' '}
            {'\n'}
          </Text>
          <Text style={styles.paragraph1}>
            {`Điền đầy đủ thông tin cá nhân vào form đăng ký ${'\n'}`}
          </Text>
          <Text style={styles.paragraph2}>
            {`*Yêu Cầu : ${'\n'} + Thông tin khớp với thông tin trên CMND  ${'\n'} + SDT`}
          </Text>
        </View>


        <View style={styles.view}>
          <Text style={styles.text}>
            Bước 2: Xác Thực CMND
{' '}
            {'\n'}
          </Text>
          <Text style={styles.paragraph1}>
            {`Quét Camera ${'\n'} `}
          </Text>
          <Text style={styles.paragraph2}>
            {`+ Để CMND cách camera khoảng 25cm ${'\n'}+ Điều kiện ánh sáng tốt ${'\n'}+ Để CMND trong khung định dạng sẵn trên camera ${'\n'}+ CMND không bị mờ, nhòe, mất số hoặc ảnh ${'\n'}`}
          </Text>

          <Text style={styles.paragraph1}>
            {`Tải ảnh lên ${'\n'} `}
          </Text>
          <Text style={styles.paragraph2}>
            {`+ Ảnh rõ chữ, hình ${'\n'}+ Ảnh lấy được toàn bộ CMND , không bị mất góc ${'\n'}+ Ảnh được chụp trong điều kiện ánh sáng tốt `}
          </Text>
        </View>
      </View>

    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  view: {
    justifyContent: 'center',
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
    marginLeft: 25

  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: PRIMARY_COLOR

  },
  paragraph1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR
  },
  paragraph2: {
    fontSize: 14,
  },
});

// make this component available to the app
export default Guide;
