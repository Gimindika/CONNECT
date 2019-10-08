import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class ImgPicker extends Component {
  state = {
    imgSource: '',
  };
  /**
   * Select image method
   */

  pickImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        alert('You cancelled image picker 😟');
      } else if (response.error) {
        alert('And error occured: ', response.error);
      } else {
        const source = {uri: response.uri};
        this.setState({
          imgSource: source,
        });
      }
    });
  };

  requestPermission = async () => {
    // alert('asd')

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Location Permission',
          message: 'You must to accept this to make it work.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('READ_EXTERNAL_STORAGE permission accepted.');
        this.pickImage();
      } else {
        console.log('READ_EXTERNAL_STORAGE permission denied');
      }
    } catch (err) {
      console.warn(err);
    }

    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   {
    //     title: 'Cool Photo App Camera Permission',
    //     message:
    //       'Cool Photo App needs access to your camera ' +
    //       'so you can take awesome pictures.',
    //     buttonNeutral: 'Ask Me Later',
    //     buttonNegative: 'Cancel',
    //     buttonPositive: 'OK',
    //   },
    // );
    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   this.pickImage();
    //   console.log('You can use the camera');
    // } else {
    //   console.log('Camera permission denied');
    // }

    // const granted = await PermissionsAndroid.check(
    //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    // );

    // if (granted) {
    //   console.log('You can use the READ_EXTERNAL_STORAGE');
    //   this.pickImage();
    // } else {
    //   console.log('READ_EXTERNAL_STORAGE permission denied');
    // }
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
