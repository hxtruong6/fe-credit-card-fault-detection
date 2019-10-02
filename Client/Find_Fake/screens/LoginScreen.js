/* eslint-disable */

import React from 'react';
import {
  StyleSheet, Text, TextInput, View, Button, TouchableOpacity
} from 'react-native';
import styles from '../components/styleInput';
import { auth } from '../config/config';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
    };
  }

  handleLogin = () => {
    auth.signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('MainNavigator'))
      .catch((error) => this.setState({ errorMessage: error.message }));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#e93766', fontSize: 40 }}>Login</Text>
        {this.state.errorMessage
          && <Text style={{ color: 'red', textAlign: 'center' }}>
            {this.state.errorMessage}
          </Text>}
        <View style={styles.wrapTextInput}>
          <TextInput
            style={styles.textInput}
            textAlign="center"
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            textAlign="center"
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
          />

        </View>

        <TouchableOpacity
          style={styles.button}

          onPress={this.handleLogin}>
          <Text>LOG IN</Text>
        </TouchableOpacity>
        <View>
          <Text>
            Don't have an account?
<Text
              onPress={() => this.props.navigation.navigate('SignUpScreen')}
              style={{
                color: '#e93766',
                fontSize: 18
              }}
            > Sign Up </Text>

          </Text>
        </View>
      </View>
    );
  }
}
