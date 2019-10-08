import React from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  StatusBar,
  View,
  Button,
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
        <Button
          title="Profile"
          color="orange"
          onPress={() =>
            navigation.navigate('UserProfile', {
              uid: User.uid,
              displayName: User.displayName,
              email: User.email,
              status: User.status,
              photoUrl:User.photoUrl
            })
          }
        />
      ),
    };
  };

  componentDidMount() {
    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      person.uid = val.key;
      console.log(User, 'home');

      if (person.uid == User.uid) {
        person.displayName = User.displayName;
        // User.displayName = person.displayName;
      } else {
        this.setState(prevState => {
          return {
            users: [...prevState.users, person],
          };
        });
      }

      // if(person.uid != User.id){
      //   this.setState(prevState => {
      //     return {
      //       users: [...prevState.users, person],
      //     };
      //   });
      // }else{
      //   User.displayName = person.displayName;
      // }
    });
  }

  logout = () => {
    firebase
      .database()
      .ref('users/' + User.uid)
      .set({
        ...User,
        status: 'offline',
      });
    AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        key={item.uid}
        style={styles.userList}
        onPress={() => {
          this.props.navigation.navigate('Chat', {
            uid: item.uid,
            displayName: item.displayName,
            email: item.email,
            status: item.status,
            photoUrl: item.photoUrl
          });
        }}>
        <Text style={styles.userListDisplayName}>
          {item.displayName + '\n' + item.status}
        </Text>
      </TouchableOpacity>
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
        <TouchableOpacity onPress={this.logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
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
});

export default withNavigation(Home);
