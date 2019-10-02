//import react since your  importing your components
import React from 'react';
//Import drawer navigator which will create your Screens
// import { createDrawerNavigator } from 'react-navigation';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//import your components for your navigator
import HomeScreen from './screens/HomeScreen';
import LoadingScreen from './screens/LoadingScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';

import ImageVerifiedScreen from './screens/Verified/ImageVerifiedScreen';
import InfoVerifiedScreen from './screens/Verified/InfoVerifiedScreen';


//Assign your navigator to variable call Navigator
// const Navigator = createDrawerNavigator(
//     //The first argument will have the screen name as the key and component set that that screen as the value.
//     {
//         Home: Home,
//         PlayersList: PlayersList
//     },
//     //Your second object will have options set towards the navigator, such as initialRouteName
//     {
//         initialRouteName: 'Home'
//     }
// )


const MainNavigator = createStackNavigator({
    Home: { screen: HomeScreen },
    InfoVerified: { screen: InfoVerifiedScreen },
    ImageVerified: { screen: ImageVerifiedScreen }
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