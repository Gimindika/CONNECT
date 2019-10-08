import React from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  StatusBar,
  View,
  Button,
  Image,
} from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {withNavigation} from 'react-navigation';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {users: []};
  }
  static navigationOptions = ({navigation}) => {
    return {
      title: 'User List',
      headerRight: (
        // <Button
        //   title="Profile"
        //   color="orange"
        //   onPress={() =>
        //     navigation.navigate('UserProfile', {
        //       uid: User.uid,
        //       displayName: User.displayName,
        //       email: User.email,
        //       status: User.status,
        //       photoUrl: User.photoUrl,
        //     })
        //   }
        // />

        <TouchableOpacity
            onPress={() =>
              navigation.navigate('UserProfile', {
                uid: User.uid,
                displayName: User.displayName,
                email: User.email,
                status: User.status,
                photoUrl: User.photoUrl,
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

  componentDidMount = async () => {
    User.email = await AsyncStorage.getItem('userEmail');
    User.displayName = await AsyncStorage.getItem('userDisplayName');
    User.uid = await AsyncStorage.getItem('userUid');
    User.status = await AsyncStorage.getItem('userStatus');

    let dbRef = firebase.database().ref('users');
    await dbRef.on('child_added', async val => {
      let person = val.val();
      person.uid = val.key;
      console.log(val.val(), 'home');
      console.log(User.displayName);

      if (person.uid == User.uid) {
        person.displayName = User.displayName;
        console.log(User.displayName, 'same');

        // User.displayName = person.displayName;
      } else {
        console.log(person, 'not');
        await this.setState({
          users: [...this.state.users, person],
        });
        console.log(this.state.users, 'state');
      }
    });
  };

  renderRow = ({item}) => {
    return (
      <React.Fragment>
        <View style={{...styles.userList,flexDirection: 'row', marginHorizontal: 10}}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('UserProfile', {
                uid: item.uid,
                displayName: item.displayName,
                email: item.email,
                status: item.status,
                photoUrl: item.photoUrl,
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
    return (
      <SafeAreaView>
        <StatusBar backgroundColor="orange" barStyle="light-content" />

        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={item => item.uid}
        />
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
