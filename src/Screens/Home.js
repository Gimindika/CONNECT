import React from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  StatusBar,
} from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class Home extends React.Component {
  static navigationOptions = {
    title: 'User List',
  };

  state = { users: []};

  componentDidMount() {
    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      person.uid = val.key;
      
      if (person.uid == User.uid) {
        
        person.name = User.name;
     
      } else {
        this.setState(prevState => {
          return {
            users: [...prevState.users, person],
          };
        });
      }
    });
  }

  logout = () => {
    AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        key={item.uid}
        style={styles.userList}
        onPress={() =>
          this.props.navigation.navigate('Chat', {
            uid: item.uid,
            name: item.name,
            email: item.email,
          })
        }>
        <Text style={styles.userListName}>{item.name}</Text>
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

  userListName: {
    fontSize: 20,
  },
});
