import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//import your components for your navigator
import HomeScreen from './screens/HomeScreen';
import LoadingScreen from './screens/LoadingScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';

import ImageVerifiedScreen from './screens/Verified/ImageVerifiedScreen';
import InfoVerifiedScreen from './screens/Verified/InfoVerifiedScreen';
import VerifyScreen from './screens/Verified/Verify';
import Guide from './screens/GuideLine/Guide';
import Playquiz from './screens/Exam/Playquiz';


const MainNavigator = createStackNavigator({
    Home: { screen: HomeScreen },
    Guide: { screen: Guide },
    InfoVerified: { screen: InfoVerifiedScreen },
    ImageVerified: { screen: ImageVerifiedScreen },
    Verify: { screen: VerifyScreen },
    Playquiz: {screen: Playquiz }
});

const Navigator = createAppContainer(createSwitchNavigator(
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


//Export the Navigator as a default export 
export default (Navigator)