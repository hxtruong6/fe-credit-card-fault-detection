import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { auth } from '../config/config';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      currentUser: null,
      errorMessage: '',
      isMenuShow: false
    }

  }

  componentDidMount() {
    const { currentUser } = auth
    this.setState({ currentUser })
  }
  handleLogout = () => {
    auth.signOut()
      .then(() => {
        this.setState({ currentUser: null })
        this.props.navigation.navigate('LoginScreen')
      })
      .catch(error => this.setState({ errorMessage: error.message }));
  }
  handleVerified = () => {
    this.props.navigation.navigate("InfoVerified")
  }


  handleGuide = () => {
    alert("Hướng Dẫn");
  }

  toggleMenuShow = () => {
    this.setState({ isMenuShow: !this.state.isMenuShow })
  }



  render() {
    const { currentUser, isMenuShow } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.user}>
          <View style={{
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={this.toggleMenuShow} >
              <Image
                style={{ width: 65, height: 65 }}
                source={require('../assets/images/drawer.png')}
              />
            </TouchableOpacity>
            {isMenuShow && <View>
              <TouchableOpacity
                onPress={this.toggleMenuShow} >
                <Image
                  style={{ width: 65, height: 65 }}
                  source={require('../assets/images/drawer.png')}
                />
              </TouchableOpacity>
              <Text>Menu</Text>
              <TouchableOpacity>
                <Text>Thông tin</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text>Thi thử</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleLogout}>
                <Text>Đăng xuất</Text>
              </TouchableOpacity>
            </View>}
          </View>

          <View style={{
            flex: 0.8,
            justifyContent: "center",
            alignItems: 'center',
          }}>
            <Text style={styles.textName}>
              Hi {currentUser && currentUser.email}!</Text>
          </View>

        </View>
        <View style={styles.Content}>
          <TouchableOpacity
            style={{
              height: 240,
              width: 240,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderRadius: 120,
              borderColor: '#e93766',
            }}
            onPress={this.handleVerified} >
            <Image
              style={{ width: 150, height: 150 }}
              source={require('../assets/images/verified.png')}
            />
            <Text style={{ fontWeight: 'bold' }}>Chứng Thực</Text>

          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 240,
              width: 240,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderRadius: 120,
              borderColor: '#e93766',
              marginTop: 40

            }}
            onPress={this.handleGuide} >
            <Image
              style={{ width: 140, height: 150 }}
              source={require('../assets/images/guide.png')}
            />
            <Text style={{ fontWeight: 'bold' }}>Hướng Dẫn</Text>
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}
Home.navigationOptions = {
  header: null

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  user: {
    flex: 0.1,
    flexDirection: 'row',
    marginTop: 15
  },
  textName: {
    fontSize: 18,
  },
  Content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80
  }
})