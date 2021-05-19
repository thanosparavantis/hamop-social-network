import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import * as timeago from "timeago.js";
import el from "timeago.js/lib/lang/el";

const firebaseConfig = {
  apiKey: "AIzaSyARQyjjXEbXk3WnNKr-4jWbhbZ_X7zHiSU",
  authDomain: "auth.hamop-website.gr",
  projectId: "socialapp-dfa8a",
  storageBucket: "socialapp-dfa8a.appspot.com",
  messagingSenderId: "929203818625",
  appId: "1:929203818625:web:bbc98763de0d268c943d80"
};

firebase.initializeApp(firebaseConfig);

timeago.register("el", el);

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);
