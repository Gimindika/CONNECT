import React from 'react';
import {
  ToastAndroid,
  StatusBar,
  Image,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firebase from 'firebase';
import User from '../User';

class Register extends React.Component {
  state = {
    email: '',
    verifyEmail: '',
    password: '',
    verifyPassword: '',

    isLoading: false,
  };

  inputHandler = (name, value) => {
    this.setState(() => ({[name]: value}));
  };

  register = () => {
    this.setState({isLoading: true});
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)
    ) {
      if (this.state.email == this.state.verifyEmail) {
        if (this.state.password.length >= 8) {
          if (this.state.password == this.state.verifyPassword) {
            ////////////////////////////////////////////////////////////////
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                this.state.email,
                this.state.password,
              )
              .then(() => {
                this.setState({isLoading: false});

                firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
                currentUser = firebase.auth().currentUser;
                User.uid = currentUser.uid
                User.email = currentUser.email
                User.name = currentUser.name
               
                ToastAndroid.showWithGravity(
                  'Register success, welcome to CONNECT.',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              
                
                firebase
                  .database()
                  .ref('users/' + User.uid)
                  .set({name: this.state.email}).then(
                    console.log('success', 'users/' + User.uid)
                    
                  ).catch(error => console.log(error)
                  )
                
                  this.props.navigation.navigate('Home');
              })
              .catch(error => this.setState({errorMessage: error.message}));

            ////////////////////////////////////////////////////////////////
          } else {
            ToastAndroid.showWithGravity(
              'Password does not match',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            this.setState({isLoading: false});
          }
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
          'Email does not match',
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
            placeholder="re-enter email"
            style={styles.input}
            onChangeText={val => this.inputHandler('verifyEmail', val)}
          />

          <TextInput
            placeholder="password"
            secureTextEntry={true}
            style={styles.input}
            onChangeText={val => this.inputHandler('password', val)}
          />

          <TextInput
            placeholder="re-enter password"
            secureTextEntry={true}
            style={styles.input}
            onChangeText={val => this.inputHandler('verifyPassword', val)}
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={this.register}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <Text>Already have an account ?</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.toLoginButton}>Login Here</Text>
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
  registerButton: {
    marginTop: 20,
    marginBottom: 10,
    width: 100,
    height: 40,
    backgroundColor: '#FFB449',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  registerButtonText: {
    fontSize: 15,
    color: '#fff',
    textTransform: 'uppercase',
  },
  toLoginButton: {
    color: '#FFB449',
  },
});

export default Register;
