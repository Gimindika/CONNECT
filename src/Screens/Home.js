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
    this.state = {users: []};
  }
  static navigationOptions = ({navigation}) => {
    return {
      title: 'User List',
      headerRight: (
        
        <TouchableOpacity
        onPress={() =>
          navigation.navigate('UserProfile', {
            uid: User.uid,
            displayName: User.displayName,
            email: User.email,
            status: User.status,
            photoUrl: User.photoUrl,
            latitude:User.latitude,
            longitude:User.longitude
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
    // User.email = await AsyncStorage.getItem('userEmail');
    // User.displayName = await AsyncStorage.getItem('userDisplayName');
    // User.uid = await AsyncStorage.getItem('userUid');
    // User.status = await AsyncStorage.getItem('userStatus');
    // User.longitude = await AsyncStorage.getItem('longitude');
    // User.latitude = await AsyncStorage.getItem('latitude');
    // User = props.navigation.getParam('User')
    

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
        console.log('/////////////////////////////////////////////////////////////////////////')
        console.log(person.uid,' homek ', User.uid, ' asda ', person );
        
      }
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
                latitude:item.latitude,
                longitude:item.longitude
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
        <View style={{height: height * 0.80}}>
          <StatusBar backgroundColor="orange" barStyle="light-content" />

          <FlatList
            data={this.state.users}
            renderItem={this.renderRow}
            keyExtractor={item => item.uid}
          />
        </View>
       
        <TouchableOpacity
          style={{
            backgroundColor: 'orange',
            width: width,
            height: height * 0.09,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => this.props.navigation.navigate('Maps', {users:this.state.users})}
          >
          <Text style={{fontSize: 20}}>Maps</Text>
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
