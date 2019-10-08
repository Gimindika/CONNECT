import React from 'react';
import {
  StatusBar,
  Image,
  Text,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';

import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';
import { withNavigation } from 'react-navigation';


class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          user: {
            displayName: props.navigation.getParam('displayName'),
            email: props.navigation.getParam('email'),
            photoUrl : props.navigation.getParam('photoUrl'),
            status: props.navigation.getParam('status')
          },
          textMessage: '',
          messageList: [],
        };
      }
    //   'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  render() {
    const {height, width} = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="orange" barStyle="light-content" />
        <View style={{...styles.imageContainer, width: width}}>
          <Image
            style={{...styles.image, width: width * 0.7, height: height / 3}}
            source={{
              uri:this.state.user.photoUrl
            }}
          />
        </View>

        <View>
          <Text>{this.state.user.displayName}</Text>
          <Text>{this.state.user.status}</Text>
          <Text>{this.state.user.email}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    backgroundColor: '#FFB449',
    alignItems: 'center',
  },
  image: {
    borderRadius: 50,
    margin: 20,
    borderColor: '#fff',
    borderWidth: 1,
  },
});

export default withNavigation(UserProfile);
