import React from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  StatusBar,
  View,
  Image,
  Dimensions,
} from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {withNavigation} from 'react-navigation';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {users: [], recent: [], recentUid: [], isRecent: false};
  }
  static navigationOptions = ({navigation}) => {
    return {
      title: User.displayName,
      headerRight: (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('UserProfile', {
              uid: User.uid,
              displayName: User.displayName,
              email: User.email,
              status: User.status,
              photoUrl: User.photoUrl,
              latitude: User.latitude,
              longitude: User.longitude,
            })
          }>
          <Image
            style={styles.userPhoto}
            source={{
              uri: User.photoUrl,
            }}
          />
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount = () => {
    // User.longitude = await AsyncStorage.getItem('longitude');

    this.getAllUsers();
    this.getRecentUid();
  };

  getAllUsers = async () => {
    let dbRef = firebase.database().ref('users');

    await dbRef.on('child_added', async val => {
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
    });
  };

  getRecentUid = async () => {
    let dbRef = firebase
      .database()
      .ref('messages')
      .child(User.uid);

    await dbRef.on('child_added', async val => {
      let person = val.val();
      person.uid = val.key;

      if (person.uid == User.uid) {
        // person.displayName = User.displayName;
      } else {
        let tmp = this.state.recentUid;
        tmp.push(person.uid);
        await this.setState({
          recentUid: tmp,
        });
      }
    });

    this.state.recentUid.map(uid => {
      this.state.users.map(async user => {
        if (user.uid == uid) {
          let tmp = this.state.recent;
          tmp.push(user);

          await this.setState({
            recent: tmp,
          });
        }
      });
    });
  };

  renderRow = ({item}) => {
    return (
      <React.Fragment>
        <View
          style={{
            ...styles.userList,
            flexDirection: 'row',
            marginHorizontal: 10,
          }}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('UserProfile', {
                uid: item.uid,
                displayName: item.displayName,
                email: item.email,
                status: item.status,
                photoUrl: item.photoUrl,
                latitude: item.latitude,
                longitude: item.longitude,
              })
            }>
            <Image
              style={styles.userPhoto}
              source={{
                uri: item.photoUrl,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            key={item.uid}
            onPress={() => {
              this.props.navigation.navigate('Chat', {
                uid: item.uid,
                displayName: item.displayName,
                email: item.email,
                status: item.status,
                photoUrl: item.photoUrl,
              });
            }}>
            <View>
              <Text style={styles.userListDisplayName}>{item.displayName}</Text>
              {item.status == 'online' ? (
                <Text style={{...styles.statusLabel, color: 'green'}}>
                  {item.status}
                </Text>
              ) : (
                <Text style={{...styles.statusLabel}}>{item.status}</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  };

  render() {
    const {height, width} = Dimensions.get('window');
    return (
      <SafeAreaView>
        <View style={{height: height * 0.8}}>
          <StatusBar backgroundColor="orange" barStyle="light-content" />

          {!this.state.isRecent ? (
            <FlatList
              data={this.state.users}
              renderItem={this.renderRow}
              keyExtractor={item => item.uid}
            />
          ) : (
            <FlatList
              data={this.state.recent}
              renderItem={this.renderRow}
              keyExtractor={item => item.uid}
            />
          )}
        </View>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ADD8E6',
              width: width / 2 - 20,
              height: height * 0.09,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              marginHorizontal: 10,
            }}
            onPress={() =>
              this.props.navigation.navigate('Maps', {users: this.state.users})
            }>
            <Text style={{fontSize: 20}}>Maps</Text>
          </TouchableOpacity>

          {!this.state.isRecent ? (
            <TouchableOpacity
              style={{
                backgroundColor: 'orange',
                width: width / 2 - 20,
                height: height * 0.09,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                marginHorizontal: 10,
              }}
              onPress={() => {
               
                this.setState({isRecent: true});
              }}>
              <Text style={{fontSize: 20}}>History</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: 'orange',
                width: width / 2 - 20,
                height: height * 0.09,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                marginHorizontal: 10,
              }}
              onPress={() => this.setState({isRecent: false})}>
              <Text style={{fontSize: 20}}>Home</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  userList: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFB449',
  },

  userListDisplayName: {
    fontSize: 20,
  },

  statusLabel: {
    fontSize: 15,
    color: '#ddd',
  },

  userPhoto: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'orange',
  },
});

export default withNavigation(Home);
