import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';
import {FlatList} from 'react-native-gesture-handler';

export default class Chat extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('displayName', null),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      person: {
        displayName: props.navigation.getParam('displayName'),
        uid: props.navigation.getParam('uid'),
      },
      textMessage: '',
      messageList: [],
    };
  }
  componentDidMount = () => {
    const currentUser = firebase.auth().currentUser;
    User.uid = currentUser.uid;

    firebase
      .database()
      .ref('messages')
      .child(User.uid)
      .child(this.state.person.uid)
      .on('child_added', val => {
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, val.val()],
          };
        });
      });
    console.log(User, 'chat');
  };

  inputHandler = (displayName, value) => {
    this.setState(() => ({[displayName]: value}));
  };

  converTime = time => {
    let record = new Date(time);
    let current = new Date();
    let result = (record.getHours() < 10 ? '0' : '') + record.getHours() + ':';
    result += (record.getMinutes() < 10 ? '0' : '') + record.getMinutes();
    if (current.getDay() !== record.getDay()) {
      result = record.getDay() + ' ' + record.getMonth() + ' ' + result;
    }
    return result;
  };

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(User.uid)
        .child(this.state.person.uid)
        .push().key;

      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.uid,
      };
      updates[
        'messages/' + User.uid + '/' + this.state.person.uid + '/' + msgId
      ] = message;

      updates[
        'messages/' + this.state.person.uid + '/' + User.uid + '/' + msgId
      ] = message;

      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({textMessage: ''});
    }
  };

  renderRow = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '50%',
          alignSelf: item.from === User.uid ? 'flex-end' : 'flex-start',
          backgroundColor: item.from === User.uid ? '#FEFD97' : '#FADA5A',
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <Text style={{color: '#000', padding: 7, fontSize: 16}}>
          {item.message}
        </Text>
        <Text
          style={{
            color: '#aaa',
            padding: 3,
            fontSize: 12,
            alignSelf: 'flex-end',
          }}>
          {this.converTime(item.time)}
        </Text>
      </View>
    );
  };

  render() {
    const {height, width} = Dimensions.get('window');
    return (
      <SafeAreaView>
        <FlatList
          style={{padding: 10, height: height * 0.8}}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            onChangeText={val => this.inputHandler('textMessage', val)}
            value={this.state.textMessage}
          />
          <TouchableOpacity
            onPress={this.sendMessage}
            style={styles.sendButton}>
            <Text>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#FFB449',
    width: '80%',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  sendButton: {
    width: '20%',
    height: 45,
    backgroundColor: '#FFB449',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
