import React from 'react';
import {ActivityIndicator, StatusBar,StyleSheet, View} from 'react-native';
import User from '../User';
import AsyncStorage from '@react-native-community/async-storage';
import geolocation from '@react-native-community/geolocation';


export default class AuthLoadingScreen extends React.Component {
  state = {
  
    location: {},

  };

  componentDidMount() {
    // geolocation.getCurrentPosition(
    //   position => {
    //     let location = {
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     };
    //     this.setState({location: location});
    //   },
    //   error => console.log(error),
    // );

    // User.latitude = this.state.location.latitude;
    // User.longitude = this.state.location.longitude;
    this._bootstrapAsync();

   
  }

  _bootstrapAsync = async () => {
    User.email = await AsyncStorage.getItem('userEmail');
    User.displayName = await AsyncStorage.getItem('userDisplayName');
    User.uid = await AsyncStorage.getItem('userUid');
    User.status = 'online';

    

    User.longitude = await AsyncStorage.getItem('longitude');
    User.latitude = await AsyncStorage.getItem('latitude');
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
  }
});