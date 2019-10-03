/* eslint-disable */

// import liraries
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { withApollo } from 'react-apollo';
import { CREATE_CARD } from '../../src/graphql/Mutation';

const TYPE = {
  KHTN: 'KHTN',
  KHXH: 'KHXH',
  TTD: 'TTD',
};

// create a component
class InfoVerifiedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: {
        KHTN: true,
        KHXH: false,
        TTD: false,
      },
      idNumber: '',
      name: '',
      dob: '',
      address: '',
      phoneNumber: '',
    };
  }


  handleNext = () => {
    console.log('Next card image');
    const { navigation, client } = this.props;
    const {
      name, idNumber, dob, address
    } = this.state;

    client.mutate({
      mutation: CREATE_CARD,
      variables: {
        idNumber, name, dob, address
      }
    }).then((result) => { console.log(result); })
      .catch((error) => { console.log(error); });

    // TODO: Check before next
    // if (this.state.name !== '' && this.state.dob !== '' 
    // && this.state.address !== '' && this.state.phoneNumber !== '') {
    navigation.navigate('ImageVerified', { name, idNumber });
    // } else {
    //   this.setState({ errorMessage: 'Chưa điền đủ thông tin' });
    // }
  }

  handleCheckType = (type) => {
    // TODO: check type uncheck other
    this.setState({ checked: { [type]: true } });
  }

  render() {
    const { checked } = this.state;
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.formInfoStyle}>

          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <View style={{ flex: 0.35, justifyContent: 'center', marginLeft: 25 }}>
              <Text style={{ color: '#e93766' }}>* Họ Và Tên</Text>
            </View>
            <View style={{ flex: 0.65 }}>
              <TextInput
                textAlign="center"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
              />
            </View>
          </View>


          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <View style={{ flex: 0.35, justifyContent: 'center', marginLeft: 25 }}>
              <Text style={{ color: '#e93766' }}>* Ngày Sinh</Text>
            </View>
            <View style={{ flex: 0.65 }}>
              <TextInput
                textAlign="center"
                autoCapitalize="none"
                keyboardType="number-pad"
                style={styles.textInput}
                onChangeText={(dob) => this.setState({ dob })}
                value={this.state.dob}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <View style={{ flex: 0.35, justifyContent: 'center', marginLeft: 25 }}>
              <Text style={{ color: '#e93766' }}>* Địa Chỉ</Text>
            </View>
            <View style={{ flex: 0.65 }}>
              <TextInput
                textAlign="center"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={(address) => this.setState({ address })}
                value={this.state.address}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <View style={{ flex: 0.35, justifyContent: 'center', marginLeft: 25 }}>
              <Text style={{ color: '#e93766' }}>* Số ĐT</Text>
            </View>
            <View style={{ flex: 0.65 }}>
              <TextInput
                textAlign="center"
                autoCapitalize="none"
                keyboardType="number-pad"
                style={styles.textInput}
                onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                value={this.state.phoneNumber}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <View style={{ flex: 0.35, justifyContent: 'center', marginLeft: 25 }}>
              <Text style={{ color: '#e93766' }}>* Số CMND</Text>
            </View>
            <View style={{ flex: 0.65 }}>
              <TextInput
                textAlign="center"
                autoCapitalize="none"
                keyboardType="number-pad"
                style={styles.textInput}
                onChangeText={(idNumber) => this.setState({ idNumber })}
                value={this.state.idNumber}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <View style={{ flex: 0.3, justifyContent: 'center', marginLeft: 25 }}>
              <Text style={{ color: '#e93766' }}>* Tổ Hợp Dự Thi: </Text>
            </View>

            <View style={{ flex: 0.7 }}>
              <CheckBox
                title="KHTN"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={checked.KHTN}
                onPress={() => this.handleCheckType(TYPE.KHTN)}
              />

              <CheckBox
                title="KHXH"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={checked.KHXH}
                onPress={() => this.handleCheckType(TYPE.KHXH)}
              />
              <CheckBox
                title="Thi Tự Do"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={checked.TTD}
                onPress={() => this.handleCheckType(TYPE.TTD)}
              />
            </View>
          </View>

        </View>


        <View style={styles.nextButtonStyle}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleNext}
          >
            <Text>Tiếp Theo</Text>
          </TouchableOpacity>
          {this.state.errorMessage
            && (
              <Text style={{ color: 'red', textAlign: 'center' }}>
                {this.state.errorMessage}
              </Text>
            )}
        </View>

      </ScrollView>
    );
  }
}

InfoVerifiedScreen.navigationOptions = {
  title: '       Xác Nhận Thông Tin',
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    padding: 5,
    width: 200,
    height: 35,
    fontSize: 16,
    borderColor: 'lightblue',
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 20,
  },
  formInfoStyle: {
    flex: 0.8,
    margin: 10,
    justifyContent: 'space-between',
  },
  nextButtonStyle: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,

  },
  button: {
    height: 35,
    width: 150,
    margin: 10,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    borderColor: '#e93766',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
});

// make this component available to the app
export default withApollo(InfoVerifiedScreen);
