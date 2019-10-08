import React, {Component} from 'react';
import {AppState, Text} from 'react-native';
import firebase from 'firebase';
import User from './User';
import AsyncStorage from '@react-native-community/async-storage'


export default class AppStateExample extends Component {
  state = {
    appState: AppState.currentState,
  };

  componentDidMount = async () => {
    User.email = await AsyncStorage.getItem('userEmail');
    User.displayName = await AsyncStorage.getItem('userDisplayName');
    User.uid = await AsyncStorage.getItem('userUid');
    User.status = await AsyncStorage.getItem('userStatus');
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    User.uid = await AsyncStorage.getItem('userUid');
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if(User.uid){
        
        firebase
          .database()
          .ref('users/' + User.uid)
          .set({
            ...User,
            status:'online'
          });
          User.status = 'online'
      }

      console.log('App has come to the foreground!');
    } else if (
      (this.state.appState.match('active') && nextAppState === 'inactive') ||
      'background'
    ) {
      console.log(User.uid);
      
      if(User.uid){
        
        firebase
          .database()
          .ref('users/' + User.uid)
          .set({
            ...User,
            status:'offline'
          });
          User.status ='offline'
      }

      console.log('App has come to the background!');
    }

    this.setState({appState: nextAppState});
  };

  render() {
    // return <Text style={{backgroundColor:'orange', height:1, margin:0, padding:0}}></Text>;
    return null
  }
}
