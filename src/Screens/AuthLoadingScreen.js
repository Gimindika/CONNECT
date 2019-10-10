import React from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import User from '../User';
import AsyncStorage from '@react-native-community/async-storage';
import geolocation from '@react-native-community/geolocation';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {},

      userEmail: '',
      userDisplayName: '',
      userUid: '',
      userStatus: '',
      userLongitude: 0,
      userLatitude: 0,
    };
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    ///////////////////////////////////////////////////////////
    geolocation.getCurrentPosition(
      position => {
        let location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({location: location});
        User.latitude = location.latitude;
        User.longitude = location.longitude;
        return position;
      },
      error => console.log(error),
    );
    ///////////////////////////////////////////////////////////

    User.email = await AsyncStorage.getItem('userEmail');
    User.displayName = await AsyncStorage.getItem('userDisplayName');
    User.uid = await AsyncStorage.getItem('userUid');
    User.status = 'online';


    // User.email = this.state.userEmail;
    //   User.displayName = this.state.userDisplayName;
    //   User.uid = this.state.userUid;
    //  User.longitude = this.state.userLongitude;
    // User.latitude = this.state.userLatitude;

    this.props.navigation.navigate(User.email ? 'Home' : 'Login');
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
