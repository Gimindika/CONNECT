import React from 'react';
import {Modal, TouchableHighlight, Alert} from 'react-native';
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
  Button,
} from 'react-native';

import firebase from 'firebase';
import MapView from 'react-native-maps';

import ImagePicker from 'react-native-image-picker';
import Axios from 'axios';

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class Maps extends React.Component {
  state = {
    modalVisible: false,

    imgSource: '',
    imageUri: '',
  };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  createFormData = photo => {
    const data = new FormData();

    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });
    console.log('as');

    return data;
  };

  uploadImage = async () => {
    const url = 'http://192.168.6.184:5000';
    console.log(this.state.imgSource);

    // console.log(this.state.imgSource);
    // console.log( this.createFormData(this.state.imgSource));
    await Axios.post(`http://192.168.6.184:5000/api/user/photo`, {image:this.state.imgSource})
      .then(result => console.log(result))
      .catch(error => console.log(error))

    console.log('done');
    
    ///////////////////////////////////////////////////////////
    // await fetch(`http://192.168.6.184:5000/api/user/photo`, {
    //   method: 'POST',
    //   body: this.state.imgSource,
    // })
    //   .then(response => response.json())
    //   .then(response => {
    //     console.log('upload succes', response);
    //     alert('Upload success!');
    //     this.setState({imgSource: null});
    //   })
    //   .catch(error => {
    //     console.log('upload error', error);
    //     alert('Upload failed!');
    //   });
    // console.log('asd');

    /////////////////////////////////
  };

  pickImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('You cancelled image picker');
      } else if (response.error) {
        alert('And error occured: ', response.error);
      } else {
        const source = response;
        this.setState({
          imgSource: source,
          imageUri: response.uri,
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
    const {height, width} = Dimensions.get('window');
    return (
      <View>
        <StatusBar backgroundColor="orange" barStyle="light-content" />

        <View style={{marginTop: 22}}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={{marginTop: 22}}>
              <View>
                <Button title="Edit Photo" onPress={this.pickImage} />
                <TextInput placeholder="Display Name" />

                <MapView
                  style={{width: '100%', height: '80%'}}
                  initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                />

                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text>Hide Modal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          <TouchableHighlight
            onPress={() => {
              this.setModalVisible(true);
            }}>
            <Text>Show Modal</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
