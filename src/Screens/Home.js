import React from 'react';
import {StyleSheet, Platform, Image, Text, View} from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Home extends React.Component {


  state = {currentUser: null};

  componentDidMount() {
    this.setState({currentUser: User});
  }

  logout = () => {
    AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  render() {
    const {currentUser} = this.state;
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 20}}>
          {' '}
          Hi
          <Text style={{color: '#e93766', fontSize: 20}}>
            {currentUser && currentUser.email}!
          </Text>
        </Text>
      <TouchableOpacity onPress={this.logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      </View>

    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
