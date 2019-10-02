/* eslint-disable */
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-client-preset';

import Navigator from './Navigator';

import config from './config'

//Define your client for your APolloProvider connecting to your graphql server.
const client = new ApolloClient({
  //Assign to your cache property a instance of a InMemoryCache
  cache: new InMemoryCache(),
  //Assign your link with a new instance of a HttpLink linking to your graphql server.
  link: new HttpLink({
    // uri: Platform.select({
    //   // ios: 'http://localhost:4000/graphql',
    //   android: 'http://127.0.0.1:5000/graphql'
    // })
    uri: `${config.SERVER_URL}/graphql`
  })
})


class App extends React.Component {
  render() {
    //Wrap your App with apolloProvider with your defined client.
    return (
      <ApolloProvider client={client}>
        <Navigator />
      </ApolloProvider>
    );
  }
}

export default App