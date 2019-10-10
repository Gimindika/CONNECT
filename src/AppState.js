import React, {Component} from 'react';
import {AppState} from 'react-native';
import firebase from 'firebase';
import User from './User';
import AsyncStorage from '@react-native-community/async-storage';
import geolocation from '@react-native-community/geolocation';


export default class AppStateExample extends Component {
  state = {
    appState: AppState.currentState,
    location: {},

  };

  componentDidMount = async () => {
    User.uid = await AsyncStorage.getItem('userUid');
    User.email = await AsyncStorage.getItem('userEmail');
    User.displayName = await AsyncStorage.getItem('userDisplayName');

    geolocation.getCurrentPosition(
      position => {
        let location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({location: location});
      },
      error => console.log(error),
    );

    User.latitude = this.state.location.latitude;
    User.longitude = this.state.location.longitude;

    AppState.addEventListener('change', this._handleAppStateChange);

   
  };

  componentWillUnmount = async () => {
    AppState.removeEventListener('change', this._handleAppStateChange);
  };

  _handleAppStateChange = async nextAppState => {
    User.uid = await AsyncStorage.getItem('userUid');
    User.email = await AsyncStorage.getItem('userEmail');
    User.displayName = await AsyncStorage.getItem('userDisplayName');

    geolocation.getCurrentPosition(
      position => {
        let location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({location: location});
      },
      error => console.log(error),
    );

    User.latitude = this.state.location.latitude;
    User.longitude = this.state.location.longitude;

    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (User.uid) {
     
        firebase
          .database()
          .ref('users/' + User.uid)
          .set({
            ...User,
            status: 'online',
          });
        User.status = 'online';
      }
    } else if (
      (this.state.appState.match('active') && nextAppState === 'inactive') ||
      'background'
    ) {
      if (User.uid) {
      
        firebase
          .database()
          .ref('users/' + User.uid)
          .set({
            ...User,
            status: 'offline',
          });
        User.status = 'offline';
      }
    }

    this.setState({appState: nextAppState});
  };

  render() {
    return null;
  }
}
