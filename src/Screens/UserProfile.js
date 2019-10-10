import React from 'react';
import {
  StatusBar,
  Image,
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from 'react-native';

import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';
import {withNavigation} from 'react-navigation';

import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class UserProfile extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Profile',
      headerStyle: {
        backgroundColor: '#FFB449',
      },
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

        longitude: parseFloat(props.navigation.getParam('longitude')),
        latitude: parseFloat(props.navigation.getParam('latitude')),
      },
      textMessage: '',
      messageList: [],

      editMode: false,
    };
  }

  componentDidMount = async () => {
    User.email = await AsyncStorage.getItem('userEmail');
    User.displayName = await AsyncStorage.getItem('userDisplayName');
    User.uid = await AsyncStorage.getItem('userUid');
    User.status = await AsyncStorage.getItem('userStatus');

    // AUser = await AsyncStorage.getItem('User');
    // console.log('Auser', AUser);

    //handling bug, where sometimes user.email is null/////////////////////////////
    if (!this.state.user.email) {
      this.setState({
        user: {
          ...this.state.user,
          email: User.email,
        },
      });
    }
  };

  pickImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('You cancelled image picker');
      } else if (response.error) {
        alert('And error occured: ', response.error);
      } else {
        const source = {uri: response.uri};
        this.setState({
          imgSource: source,
          user: {
            ...this.state.user,
            photoUrl: response.uri,
          },
        });
        this.handleUploadPhoto();
      }
    });
  };
  /////////////////////////////////////////////////////////////////////////////
  createFormData = (photo, body) => {
    const data = new FormData();

    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  handleUploadPhoto = () => {
    fetch('http://192.168.100.82:5000/api/user/photo', {
      method: 'POST',
      body: this.createFormData(this.state.user.photoUrl, {userId: '123'}),
    })
      .then(response => response.json())
      .then(response => {
        console.log('upload succes', response);
        alert('Upload success!');
        this.setState({photo: null});
      })
      .catch(error => {
        console.log('upload error', error);
        alert('Upload failed!');
      });
  };

  /////////////////////////////////////////////////////////////////////////////////
  inputHandler = value => {
    this.setState({user: {...this.state.user, displayName: value}});
  };

  editHandler = () => {
    let user = firebase.auth().currentUser;
    const data = this.state.user.displayName;

    user
      .updateProfile({
        displayName: data,
      })
      .then(function() {
        User.displayName = data;
        AsyncStorage.setItem('userDisplayName', User.displayName);

        ToastAndroid.showWithGravity(
          'Update Success',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      })
      .catch(function(error) {
        let errorMessage = 'Update Failed ' + error;
        ToastAndroid.showWithGravity(
          errorMessage,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      });
  };

  logout = () => {
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

    this.props.navigation.navigate('Login');
  };

  render() {
    const {height, width} = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="orange" barStyle="light-content" />
        <View style={{...styles.imageContainer, width: width}}>
          <TouchableOpacity onPress={this.pickImage}>
            <Image
              style={{
                ...styles.image,
                width: width * 0.7,
                height: height / 3,
              }}
              source={{
                uri: this.state.user.photoUrl,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{...styles.profileContainer, height: height * 0.7}}>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            {!this.state.editMode ? (
              <React.Fragment>
                <Text style={{...styles.profileLabel, alignSelf: 'center'}}>
                  {this.state.user.displayName}
                </Text>
                {this.state.user.uid == User.uid ? (
                  <TouchableOpacity
                    onPress={() => this.setState({editMode: true})}
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                      style={{
                        ...styles.profileLabel,
                        fontSize: 15,
                        color: 'orange',
                      }}>
                      (edit)
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <TextInput
                  onChangeText={val => this.inputHandler(val)}
                  style={{...styles.profileLabel, alignSelf: 'center'}}
                  value={this.state.user.displayName}
                />
                {this.state.user.uid == User.uid ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.editHandler();
                      this.setState({editMode: false});
                    }}
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                      style={{
                        ...styles.profileLabel,
                        fontSize: 15,
                        color: 'orange',
                      }}>
                      (ok)
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </React.Fragment>
            )}
          </View>
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
                {/* <TouchableOpacity
                  style={{...styles.logoutButton, backgroundColor: 'orange'}}>
                  <Text style={{...styles.logoutLabel}}>Edit</Text>
                </TouchableOpacity> */}

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
                  }}>
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
    backgroundColor: '#FD6966',
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
