// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJgagjYMfhn2hxAHUqBmzMXwg61Uz1rJY",
  authDomain: "choreup-f3c99.firebaseapp.com",
  projectId: "choreup-f3c99",
  storageBucket: "choreup-f3c99.appspot.com",
  messagingSenderId: "1018123461263",
  appId: "1:1018123461263:web:1ad9eebfccb2861c0746fa",
  measurementId: "G-TH2W7H83LP"
};

// Initialize Firebase

export const FIREBASE_APP= initializeApp(firebaseConfig);
export const FIREBASE_AUTH= getAuth(FIREBASE_APP);
export const FIREBASE_DB= getFirestore(FIREBASE_APP);