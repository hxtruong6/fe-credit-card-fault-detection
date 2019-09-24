import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

//import Screen 
import HomeScreen from './screens/HomeScreen';
import LoadingScreen from './screens/LoadingScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';

import ImageVerifiedScreen from './screens/Verified/ImageVerifiedScreen';
import InfoVerifiedScreen from './screens/Verified/InfoVerifiedScreen';


const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  InfoVerified: {screen: InfoVerifiedScreen},
  ImageVerified: {screen: ImageVerifiedScreen}
});

const App = createAppContainer(createSwitchNavigator(
  {
    LoadingScreen,
    SignUpScreen,
    LoginScreen,
    MainNavigator
  },
  {
    initialRouteName: 'LoadingScreen'
  }
));


export default App