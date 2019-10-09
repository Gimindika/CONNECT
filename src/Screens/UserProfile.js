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
        uid: props.navigation.getParam('uid'),
        email: props.navigation.getParam('email'),
        photoUrl: props.navigation.getParam('photoUrl'),
        // status: props.navigation.getParam('status'),
        longitude: props.navigation.getParam('longitude'),
        latitude: props.navigation.getParam('latitude'),
      },
      textMessage: '',
      messageList: [],
    };
  }

  componentDidMount = async () => {
    User.email = await AsyncStorage.getItem('userEmail');
    User.displayName = await AsyncStorage.getItem('userDisplayName');
    User.uid = await AsyncStorage.getItem('userUid');
    User.status = await AsyncStorage.getItem('userStatus');
    // User.longitude = await AsyncStorage.getItem('longitude');
    // User.latitude = await AsyncStorage.getItem('latitude');
    //handling bug, where sometimes user.email is null/////////////////////////////
    if (!this.state.user.email) {
      this.setState({
        user: {
          ...this.state.user,
          email: User.email,
        },
      });
    }
    console.log(this.state.user.longitude, ' ', User.longitude);
   
  };

  logout = () => {
    console.log(this.state.user, 'logout');

    firebase
      .database()
      .ref('users/' + User.uid)
      .set({
        ...this.state.user,
        status: 'offline',
      });
    AsyncStorage.removeItem('userEmail');
    AsyncStorage.removeItem('userDisplayName');
    AsyncStorage.removeItem('userUid');
    AsyncStorage.removeItem('userStatus');
    AsyncStorage.removeItem('photoUrl');
    AsyncStorage.removeItem('latitude');
    AsyncStorage.removeItem('longitude');
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
            <Text style={{...styles.statusLabel}}>
              {this.state.user.status}
            </Text>
          )}
          <Text style={styles.profileLabel}>
            {'Email : ' + this.state.user.email}
          </Text>

          <View style={styles.conAdd}>
            <Text style={styles.address}> {this.state.address}</Text>
          </View>
          <View
            style={{
              ...styles.profileContainer,
              marginTop: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.state.user.uid == User.uid ? (
              <React.Fragment>
                <TouchableOpacity
                  style={{...styles.logoutButton, backgroundColor: 'orange'}}>
                  <Text style={{...styles.logoutLabel}}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={this.logout}>
                  <Text style={{...styles.logoutLabel}}>Logout</Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : null}
            {this.state.user.uid != User.uid ? (
              <React.Fragment>
                <TouchableOpacity
                  style={{...styles.logoutButton, backgroundColor: 'orange'}}
                  onPress={() => {
                    this.props.navigation.navigate('Chat', {
                      uid: this.state.user.uid,
                      displayName: this.state.user.displayName,
                      email: this.state.user.email,
                      status: this.state.user.status,
                      photoUrl: this.state.user.photoUrl,
                    });
                  }}
                  >
                  <Text style={{...styles.logoutLabel}}>Chat</Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  address: {
    fontSize: 14,
    textAlign: 'center',
  },
  conAdd: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
    marginBottom: '10%',
  },
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
    backgroundColor: 'red',
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '5%',
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
