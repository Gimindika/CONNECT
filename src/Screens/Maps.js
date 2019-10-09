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

import MapView, { Marker} from 'react-native-maps';
import geolocation from '@react-native-community/geolocation';

import AsyncStorage from '@react-native-community/async-storage';

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {},
      users: [],
    
    };

    this.getUsers();
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

    // let dbRef = firebase.database().ref('users');
    // // await dbRef.on('child_added', async val => {
    // const temp = await dbRef.on('child_added', async val => { 
    //   let person = val.val();
    //   person.uid = val.key;
      
    //   if (person.uid == User.uid) {
    //     person.displayName = User.displayName;
        
    //     // User.displayName = person.displayName;
    //   } else {
    //     let tmp = this.state.users;
    //     tmp.push(person);
    //     await this.setState({
    //       users: tmp,
    //     });
    //     {console.log( this.state.users.length,'marker aaa')}
    //   }
    //   return this.state.users
    // });
    // {console.log( this.state.users.length,'marker atas')}
   
    
    // User.longitude = await AsyncStorage.getItem('longitude');
    // User.latitude = await AsyncStorage.getItem('latitude');
    
  };

  getUsers = async () => {
    let dbRef = firebase.database().ref('users');
    // await dbRef.on('child_added', async val => {
    const temp = await dbRef.on('child_added', async val => { 
      let person = val.val();
      person.uid = val.key;
      
      if (person.uid == User.uid) {
        person.displayName = User.displayName;
        
        // User.displayName = person.displayName;
      } else {
        let tmp = this.state.users;
        tmp.push(person);
        await this.setState({
          users: tmp,
        });
        // {console.log( this.state.users.length,'marker aaa')}
      }
      return this.state.users
    });

    // {console.log( this.state.users,'marker atas')}
  }
  
  
  render() {
    

    {console.log( this.state.users.length,'marker atas')}
    if (this.state.users.length == 0) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          {/* {setTimeout(this.render),5000} */}
        </View>
      );
    } else {
      // const {height, width} = Dimensions.get('window');

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
           
            
            {this.state.users.map(item => {
           
              return (
                <Marker
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
                    {/* {console.log(item.latitude, 'mapstate')} */}
                    {/* {console.log( item.displayName,'marker show')} */}
                    {/* {console.log( this.state.users.length,'marker show')} */}


                  <Image
                    source={{uri: item.photoUrl}}
                    
                    style={styles.image}
                  />
                  </View>
                  <Text style={{textAlign: 'center'}}>{item.displayName}</Text>
                </Marker>
              )
            })
            }
           
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
