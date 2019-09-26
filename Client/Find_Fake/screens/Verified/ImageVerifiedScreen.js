//import liraries
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground

} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Card, Button, Icon } from 'react-native-elements';



// create a component
class ImageVerifiedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCamera: false,
      imageCMND: null,
      selfieImage: '../../assets/images/cmnd_s.jpg',
      path: null,
    }
  }
  handleOpenCamera = () => {
    this.setState({ openCamera: true })

  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 1 };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri)
      this.setState({ path: data.uri, openCamera: false })
    }
  };
  renderCamera() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
      }}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
        </RNCamera>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Icon name='camera' size={35} color='#ffffff' />
          </TouchableOpacity>
        </View>
      </View>

    )
  }
  renderImage() {
    return (
      <View>
        <Image
          source={{ uri: this.state.path }}
          style={styles.preview}
        />
        <Text
          style={styles.cancel}
          onPress={() => this.setState({ path: null })}
        >Cancel
        </Text>
      </View>
    );
  }
  renderMainScreen() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Card title='Tải ảnh CMND mặt trước của bạn'>
            <View>
              <ImageBackground
                style={{ width: 300, height: 400 }}
                source={{ uri: this.state.path }}>
              </ImageBackground>
            </View>
            <Button
              icon={<Icon name='camera' color='#ffffff' />}
              title="Chụp Ảnh"
              onPress={this.handleOpenCamera}
              backgroundColor="#03A9F4" />
          </Card>

          <Card title='Tải ảnh CMND mặt sau của bạn'>
            <View>
              <Image
                style={{
                  marginBottom: 5,
                  width: null
                }}
                resizeMode='contain'
                source={require('../../assets/images/cmnd_s.jpg')}
              />

            </View>
            <Button icon={<Icon name='camera' color='#ffffff' />} title="Chụp Ảnh" backgroundColor="#03A9F4" />
          </Card>

          <Card title='Tải ảnh Selfie của bạn'>
            <View>
              <Image
                style={{
                  marginBottom: 5,
                  width: null
                }}
                resizeMode='contain'
                source={require('../../assets/images/cmnd_s.jpg')}
              />

            </View>
            <Button icon={<Icon name='camera' color='#ffffff' />} title="Chụp Ảnh" backgroundColor="#03A9F4" />
          </Card>

        </ScrollView>
        <View style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 15
        }}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleNext} >
            <Text>Xác Minh</Text>
          </TouchableOpacity>
        </View>

      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.openCamera ? this.renderCamera() : this.renderMainScreen()}
      </View>
    )
  }
}

ImageVerifiedScreen.navigationOptions = {
  title: '       Xác Nhận CMND'
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 30,
    width: '100%',
    backgroundColor: 'pink'
  },
  row: {
    flexDirection: 'row'
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold'
  },
  info: {
    fontSize: 16,
    color: 'grey'
  },
  button: {
    height: 35,
    width: 150,
    margin: 10,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    borderColor: '#e93766',
    justifyContent: 'center'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

//make this component available to the app
export default ImageVerifiedScreen;
