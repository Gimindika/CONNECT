import React from 'react';

import {
  StatusBar,
  Image,
  Text,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import firebase from 'firebase';
import User from '../User';

import MapView, {Marker} from 'react-native-maps';
import geolocation from '@react-native-community/geolocation';

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
    this.getUsers();

    geolocation.getCurrentPosition(
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
  };

  getUsers = async () => {
    let dbRef = firebase.database().ref('users');

    const temp = await dbRef.on('child_added', async val => {
      let person = val.val();
      person.uid = val.key;

      if (person.uid == User.uid) {
        person.displayName = User.displayName;
      } else {
        let tmp = this.state.users;
        tmp.push(person);
        await this.setState({
          users: tmp,
        });
      }
      return this.state.users;
    });
  };

  render() {
    if (this.state.users.length == 0) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
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
            followUserLocation={true}
            zoomControlEnabled={true}
            showsCompass={true}
            minZoomLevel={0} // default => 0
            maxZoomLevel={20}
            loadingEnabled={true}
            loadingIndicatorColor="#666666"
            loadingBackgroundColor="#eeeeee"
            moveOnMarkerPress={false}
            showsUserLocation={true}
            showsCompass={true}
            showsPointsOfInterest={false}
            provider="google">
            {this.state.users.map((item,index) => {
              return (
                <Marker
                  key={index}
                  draggable
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('UserProfile', {
                      displayName: item.displayName,
                      photoUrl: item.photoUrl,
                      email: item.email,
                      uid: item.uid,
                      status: item.status,
                      latitude: item.latitude,
                      longitude: item.longitude,
                    });
                  }}>
                  <View style={styles.mapCoor}>
                    <Image source={{uri: item.photoUrl}} style={styles.image} />
                  </View>
                  <Text style={{textAlign: 'center'}}>{item.displayName}</Text>
                </Marker>
              );
            })}
          </MapView>
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
