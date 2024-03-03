import { AppRegistry } from "react-native";
import App from "./App"; // Import your main component
import { name as appName } from "./app.json";
import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJgagjYMfhn2hxAHUqBmzMXwg61Uz1rJY",
  authDomain: "choreup-f3c99.firebaseapp.com",
  projectId: "choreup-f3c99",
  storageBucket: "choreup-f3c99.appspot.com",
  messagingSenderId: "1018123461263",
  appId: "1:1018123461263:web:1ad9eebfccb2861c0746fa",
  measurementId: "G-TH2W7H83LP",
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
AppRegistry.registerComponent(appName, () => App);
