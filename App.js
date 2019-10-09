import React from 'react';

import Router from './Router';
import AppState from './src/AppState';
import firebase from 'firebase';
import firebasekey from './firebasekey';

import Maps from './src/Screens/Maps';

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

  return (
// {/* <Maps/>  */}
  <React.Fragment>
    <Router />
    <AppState/>
  </React.Fragment>  
  );
};

export default App;
