import React from 'react';

import Router from './Router';
import Login from './src/Screens/Login';
import firebase from 'firebase';
import firebasekey from './firebasekey';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: firebasekey.apiKey.toString(),
  authDomain: firebasekey.authDomain.toString(),
  databaseURL: firebasekey.databaseURL.toString(),
  projectId: firebasekey.projectId.toString(),
  storageBucket: firebasekey.storageBucket.toString(),
  messagingSenderId: firebasekey.messagingSenderId.toString(),
  appId: firebasekey.appId.toString(),
  measurementId: firebasekey.measurementId.toString()
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const App = () => {

  return <Router />;
};

export default App;
