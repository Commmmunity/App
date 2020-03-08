import * as firebase from "firebase/app";
import "firebase/functions";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MSG_SENDER,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
};

var firebaseApp = firebase.initializeApp(config);
var functions = null;

if (process.env.VUE_APP_ENV === "development") {
  functions = firebaseApp.functions();
  functions.useFunctionsEmulator("http://localhost:5000");
} else functions = firebaseApp.functions("europe-west");

export default firebaseApp;
export { functions, firebaseApp, firebase };
