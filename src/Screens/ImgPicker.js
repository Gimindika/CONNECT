import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid/v4'; // Import UUID to generate UUID
import RNFetchBlob from 'rn-fetch-blob';

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


export default class ImgPicker extends Component {
  state = {
    imgSource: '',
    uploading: false,
    progress: 0,
    images: []
  };
  /**
   * Select image method
   */

////////////////////////////////////////////////////////////////////////////////////////////////////
uploadImage = () => {
  const ext = this.state.imageUri.split('.').pop(); // Extract image extension
  const filename = `${uuid()}.${ext}`; // Generate unique name
  this.setState({ uploading: true });
  firebase
    .storage()
    .ref(`tutorials/images/${filename}`)
    .putFile(this.state.imageUri)
    .on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        let state = {};
        state = {
          ...state,
          progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
        };
        if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
          const allImages = this.state.images;
          allImages.push(snapshot.downloadURL);
          state = {
            ...state,
            uploading: false,
            imgSource: '',
            imageUri: '',
            progress: 0,
            images: allImages
          };
          AsyncStorage.setItem('images', JSON.stringify(allImages));
        }
        this.setState(state);
      },
      error => {
        unsubscribe();
        alert('Sorry, Try again.');
      }
    );
};
///////////////////////////////////////////////////////////////////////////////////////////
  


pickImage = () => {
  ImagePicker.showImagePicker(options, response => {
    if (response.didCancel) {
      console.log('You cancelled image picker');
    } else if (response.error) {
      alert('And error occured: ', response.error);
    } else {
      const source = { uri: response.uri };
      this.setState({
        imgSource: source,
        imageUri: response.uri
      });
      this.uploadImage();
    }
  });
};

  requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(PermissionsAndroid.RESULTS.GRANTED);

        this.pickImage();
      } else {
        alert('READ_EXTERNAL_STORAGE permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>React Native Firebase Image Upload </Text>
        <Text style={styles.instructions}>
          Hello 👋, Let us upload an Image
        </Text>
        {/** Select Image button */}
        <TouchableOpacity style={styles.btn} onPress={this.requestPermission}>
          <View>
            <Text style={styles.btnTxt}>Pick image</Text>
          </View>
        </TouchableOpacity>
        {/** Display selected image */}
        {this.state.imgSource ? (
          <Image source={this.state.imgSource} style={styles.image} />
        ) : (
          <Text>Select an Image!</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  btn: {
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgb(68, 99, 147)',
  },
  btnTxt: {
    color: '#fff',
  },
  image: {
    marginTop: 20,
    minWidth: 200,
    height: 200,
  },
});
