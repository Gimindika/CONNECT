import React, {Fragment} from 'react';

import Login from './src/Screens/Login';
import Register from './src/Screens/Register';
import AuthLoadingScreen from './src/Screens/AuthLoadingScreen';
import Home from './src/Screens/Home';
import Chat from './src/Screens/Chat';

import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

// const Router = createSwitchNavigator(
//   {
//     AuthLoadingScreen:{
//       screen:AuthLoadingScreen
//     },
//     Login: {
//       screen: Login,
//     },
//     Register: {
//       screen: Register,
//     },
//     Home: {
//       screen: Home,
//     },
//   },
//   {
//     initialRouteName: 'AuthLoadingScreen',
//     headerMode: 'none',
//   },
// );

// const AppContainer = createAppContainer(Router);
// export default AppContainer;
/////////////////////////////////////////////////////////////////////////

const AppStack = createStackNavigator({Home:Home, Chat:Chat})
const AuthStack = createSwitchNavigator({Login:Login, Register:Register })

const Router = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
)

const AppContainer = createAppContainer(Router);
export default AppContainer;