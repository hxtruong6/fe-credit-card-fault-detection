import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import styles from '../components/styleInput';
import { auth } from '../config/config';

export default class signUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null
    }
  }

  handleSignUp = () => {
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('MainNavigator'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#e93766', fontSize: 40 }}>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red', textAlign: 'center' }}>
            {this.state.errorMessage}
          </Text>}
        <View style={styles.wrapTextInput}>
          <TextInput
            textAlign="center"
            placeholder="Email"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            textAlign="center"
            placeholder="Password"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={this.handleSignUp} >
          <Text>SIGN UP</Text>
        </TouchableOpacity>
        <View>
          <Text> Already have an account?
          <Text
              onPress={() => this.props.navigation.navigate('LoginScreen')}
              style={{ color: '#e93766', fontSize: 18 }}
            > Login </Text>
          </Text>
        </View>
      </View>
    )
  }
}