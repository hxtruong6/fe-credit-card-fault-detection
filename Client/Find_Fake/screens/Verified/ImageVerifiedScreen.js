/* eslint-disable */
// import liraries
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,

} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Card, Button, Icon } from 'react-native-elements';

import { UploadImage } from '../../src/api/CardDetection'

async function UploadFunction(name, image) {
  const photo = {
    uri: image,
    filename: `${name.toLowerCase()}`
  };
  await UploadImage(photo);
}
// create a component
class ImageVerifiedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCamera: false,
      pathCMND: null,
      pathSelfie: null,
      cameraType: RNCamera.Constants.Type.back,
    };
  }

  handleOpenCamera = () => {
    this.setState({ openCamera: true });
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 1 };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      if (this.state.pathCMND == null) {
        this.setState({ pathCMND: data.uri, openCamera: false });
      } else {
        this.setState({ pathSelfie: data.uri, openCamera: false });
      }
    }
  };

  handleChangeCamera = () => {
    const cameraType = this.state.cameraType == RNCamera.Constants.Type.front ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front;
    this.setState({ cameraType });
  }

  handleNext = async () => {
    const { pathCMND, pathSelfie } = this.state;
    const { navigation } = this.props;
    if (!pathCMND) {
      alert('Chưa có ảnh CMND. Hãy chụp ảnh CMND!');
      return
    }

    const name = navigation.getParam('name');
    UploadFunction(name + '_font', pathCMND)
    //TODO: upload end
    UploadFunction(name + '_selfie', pathSelfie)


    navigation.navigate('Verify');
  }

  renderCamera() {
    const { cameraType } = this.state;
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
      }}
      >
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={cameraType}
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 }}>
          <View />
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}
            style={{ marginLeft: 40 }}
          >
            <Icon name="camera" size={45} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleChangeCamera}>
            <Icon name="sync" size={45} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

    );
  }

  renderImage() {
    return (
      <View>
        <Image
          source={{ uri: this.state.pathCMND }}
          style={styles.preview}
        />
        <Text
          style={styles.cancel}
          onPress={() => this.setState({ pathCMND: null })}
        >
          Cancel
        </Text>
      </View>
    );
  }

  renderMainScreen() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Card title="Tải ảnh CMND mặt trước của bạn">
            <View>
              <ImageBackground
                style={{
                  width: 350,
                  height: 300,
                  marginBottom: 10,
                }}
                source={{ uri: this.state.pathCMND }}
              />
            </View>
            <Button
              icon={<Icon name="camera" color="#ffffff" />}
              title="Chụp Ảnh"
              onPress={this.handleOpenCamera}
              backgroundColor="#03A9F4"
            />
          </Card>

          <Card title="Tải ảnh CMND mặt sau của bạn">
            <View>
              <Image
                style={{
                  marginBottom: 5,
                  width: null,
                }}
                resizeMode="contain"
                source={require('../../assets/images/cmnd_s.jpg')}
              />

            </View>
            <Button
              icon={<Icon name="camera" color="#ffffff" />}
              title="Chụp Ảnh"
              onPress={this.handleOpenCamera}
              backgroundColor="#03A9F4"
            />
          </Card>

          <Card title="Tải ảnh Selfie của bạn">
            <View>
              <ImageBackground
                style={{
                  width: 350,
                  height: 300,
                  marginBottom: 10,
                }}
                source={{ uri: this.state.pathSelfie }}
              />
            </View>
            <Button
              icon={<Icon name="camera" color="#ffffff" />}
              title="Chụp Ảnh"
              onPress={this.handleOpenCamera}
              backgroundColor="#03A9F4"
            />
          </Card>

        </ScrollView>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 15,
        }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleNext}
          >
            <Text>Tải ảnh lên</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.openCamera ? this.renderCamera() : this.renderMainScreen()}
      </View>
    );
  }
}

ImageVerifiedScreen.navigationOptions = {
  title: '       Xác Nhận CMND',
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 30,
    width: '100%',
    backgroundColor: 'pink',
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    color: 'grey',
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

// make this component available to the app
export default ImageVerifiedScreen;
