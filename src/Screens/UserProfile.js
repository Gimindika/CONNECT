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
import {withNavigation} from 'react-navigation';

class UserProfile extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Profile',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {
        displayName: props.navigation.getParam('displayName'),
        email: props.navigation.getParam('email'),
        photoUrl: props.navigation.getParam('photoUrl'),
        status: props.navigation.getParam('status'),
      },
      textMessage: '',
      messageList: [],
    };
  }

  logout = () => {
    firebase
      .database()
      .ref('users/' + User.uid)
      .set({
        ...User,
        status: 'offline',
      });
    AsyncStorage.removeItem('userEmail');
    AsyncStorage.removeItem('userDisplayName');
    AsyncStorage.removeItem('userUid');
    AsyncStorage.removeItem('userStatus');
    AsyncStorage.removeItem('photoUrl');
    // User.uid = null;
    // User.email = null;
    // User.displayName = null;
    // User.status = 'offline';
    // User.photoUrl =
    //   'https://res.cloudinary.com/gimindika/image/upload/v1570517127/user-icon-png-person-user-profile-icon-20_ogs0mj.png';

    this.props.navigation.navigate('Login');
  };

  render() {
    const {height, width} = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="orange" barStyle="light-content" />
        <View style={{...styles.imageContainer, width: width}}>
          <Image
            style={{...styles.image, width: width * 0.7, height: height / 3}}
            source={{
              uri: this.state.user.photoUrl,
            }}
          />
        </View>

        <View style={{...styles.profileContainer, height: height * 0.7}}>
          <Text style={{...styles.profileLabel, alignSelf: 'center'}}>
            {this.state.user.displayName}
          </Text>
          {this.state.user.status == 'online' ? (
              <Text style={{...styles.statusLabel, color: 'green'}}>
                {this.state.user.status}
              </Text>
            ) : (
              <Text style={{...styles.statusLabel}}>{this.state.user.status}</Text>
            )}
          <Text style={styles.profileLabel}>
            {'Email : ' + this.state.user.email}
          </Text>
          <View
            style={{
              ...styles.profileContainer,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
              <Text style={{...styles.logoutLabel}}>Logout</Text>
            </TouchableOpacity>
          </View>
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
    borderWidth: 3,
  },
  profileContainer: {
    // alignItems:"flex-start",
    // justifyContent:"center",

    width: '100%',
  },
  profileLabel: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: '600',
    marginVertical: 5,
  },
  statusLabel: {
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '200',
    marginTop: 0,
  },
  logoutButton: {
    borderRadius: 10,
    backgroundColor: 'orange',
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical:'10%'
  },
  logoutLabel: {
    fontSize: 20,
    // marginLeft:10,
    fontWeight: '600',
    // marginVertical:5
  },
});

export default withNavigation(UserProfile);
