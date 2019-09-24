import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import Logo from '../components/Logo';
import { auth } from '../config/config'


export default class Loading extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      auth.onAuthStateChanged(user => {
        this.props.navigation.navigate(user ? 'MainNavigator' : 'SignUpScreen')
      })
    }, 2000)
  }
  render() {
    const { container } = styles
    return (
      <View style={container}>
        <Logo />
        <View >
          <ActivityIndicator
            color='#e93766'
            size="large" />
          <Text style={{
            color: '#e93766',
            fontSize: 20
          }}>Loading...</Text>
        </View>
        <View>
          <Image
            style={{
              width: 150,
              height: 150,
              marginBottom: 20
            }}
            source={require('../assets/images/ava_books.png')}
          />

        </View>
      </View>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
})