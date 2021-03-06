import React from 'react';
import {
  StatusBar,
  Image,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';

import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';
import geolocation from '@react-native-community/geolocation';

class Login extends React.Component {
  state = {
    email: '',
    password: '',

    location: {},
    isLoading: false,
  };

  inputHandler = (name, value) => {
    this.setState(() => ({[name]: value}));
  };

  login = () => {
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

    this.setState({isLoading: true});
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)
    ) {
      if (this.state.password.length >= 8) {
        //////////////////////////////////////////////////////////////////////

        let success = firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
            success = true;
            this.setState({isLoading: false});
            ToastAndroid.showWithGravity(
              'Have a Nice Conversation',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            return true;
          })
          .then(success => {
            if (success) {
              const currentUser = firebase.auth().currentUser;
              User.uid = currentUser.uid;
              User.email = currentUser.email;
              if (currentUser.displayName) {
                User.displayName = currentUser.displayName;
              } else {
                User.displayName = currentUser.email;
              }
              User.status = 'online';
              User.latitude = this.state.location.latitude;
              User.longitude = this.state.location.longitude;
              let Obj = User;
             
              
              AsyncStorage.setItem('userEmail', User.email);
              AsyncStorage.setItem('userDisplayName', User.displayName);
              AsyncStorage.setItem('userUid', User.uid);
              AsyncStorage.setItem('userStatus', User.status);
              AsyncStorage.setItem('photoUrl', User.photoUrl);
              // AsyncStorage.setItem('latitude', User.latitude.toString());
              // AsyncStorage.setItem('longitude', User.longitude.toString());
              // AsyncStorage.setItem('User', Obj)
              firebase  
                .database()
                .ref('users/' + User.uid)
                .set(User);

              this.props.navigation.navigate('Home');
            }
          })
          .catch(error => {
            this.setState({errorMessage: 'Wrong email or password'});
            ToastAndroid.showWithGravity(
              this.state.errorMessage,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            this.setState({isLoading: false});
            return false;
          });

        //////////////////////////////////////////////////////////////////////
      } else {
        ToastAndroid.showWithGravity(
          'Invalid Password',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        this.setState({isLoading: false});
      }
    } else {
      ToastAndroid.showWithGravity(
        'Invalid Email',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      this.setState({isLoading: false});
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="orange" barStyle="light-content" />
          <View style={styles.logoContainer}>
            <Image
              style={{width: 50, height: 50}}
              source={require('../images/logo.png')}
            />
            <Text style={styles.logoText}>CONNECT</Text>
          </View>

          <TextInput
            placeholder="email"
            style={styles.input}
            onChangeText={val => this.inputHandler('email', val)}
          />

          <TextInput
            placeholder="password"
            secureTextEntry={true}
            style={styles.input}
            onChangeText={val => this.inputHandler('password', val)}
          />

          <TouchableOpacity style={styles.loginButton} onPress={this.login}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <Text>Don't have an account yet ?</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={styles.toRegisterButton}>Register Here</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFB449',
    width: '90%',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 10,
    width: 100,
    height: 40,
    backgroundColor: '#FFB449',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loginButtonText: {
    fontSize: 15,
    color: '#fff',
    textTransform: 'uppercase',
  },
  toRegisterButton: {
    color: '#FFB449',
  },
});

export default Login;
