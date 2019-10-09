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
import User from '../User';

import MapView, {Marker} from 'react-native-maps';
import geolocation from '@react-native-community/geolocation';

import AsyncStorage from '@react-native-community/async-storage';


export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {},
      users: [],
    };
  }

  static navigationOptions = () => {
    return {
      title: 'User Locations',
    };
  };

  componentDidMount = async () => {
    await geolocation.getCurrentPosition(
      position => {
        let location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5,
        };
        this.setState({location: location});
      },
      error => console.log(error),
    );

    // this.setState({users: this.props.navigation.getParam('users')});

    let dbRef = firebase.database().ref('users');
    // await dbRef.on('child_added', async val => {
    await dbRef.on('child_added', async val => {

      let person = val.val();
      person.uid = val.key;
      
      if (person.uid == User.uid) {
        person.displayName = User.displayName;
        
        // User.displayName = person.displayName;
      } else {
        let tmp = this.state.users;
        tmp.push(person)
        await this.setState({
          users: tmp,
        });
      }
    });

    // User.longitude = await AsyncStorage.getItem('longitude');
    // User.latitude = await AsyncStorage.getItem('latitude');
    
  };


  render() {
    if (this.state.users.length == 0) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          {/* {setTimeout(this.render),5000} */}
        </View>
      );
    } else {
      const {height, width} = Dimensions.get('window');
      return (
        <View>
          <StatusBar backgroundColor="orange" barStyle="light-content" />
          <MapView
            style={{width: '100%', height: '100%'}}
            initialRegion={{
              latitude: this.state.location.latitude || 0,
              longitude: this.state.location.longitude || 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          />
          <Marker
              coordinate={{
                latitude: User.latitude || 0,
                longitude: User.longitude || 0,
              }}>
                     {console.log(User.latitude, 'mapstateuser')}

              <View style={styles.mapCoor}>
                <Image
                  source={{
                    uri: User.photoUrl,
                  }}
                  style={styles.image}
                />
              </View>
              <Text style={styles.name}>{User.displayName}</Text>
            </Marker>
          {/* {console.log(this.state.users.length,'map')} */}
          {this.state.users.map((item, index) => {
             return (
                // this.renderMarker(item,index)
                <Marker
                  key={index}
                  coordinate={{
                    latitude: item.latitude || 0,
                    longitude: item.longitude || 0,
                  }}>
                     {console.log(item.latitude, 'mapstate')}
                  <View style={styles.mapCoor}>
                    <Image source={{uri: item.image}} style={styles.image} />
                  </View>
                  <Text style={styles.name}>{item.name}</Text>
                </Marker>
              
            );
          })}
          {/* </MapView> */}
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
  con: {
    flex: 1,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapCoor: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 50,
  },
  name: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: '2%',
  },
});
