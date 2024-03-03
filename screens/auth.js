import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../config/firebase"; // Import Firebase authentication and Firestore

// Function to handle user signup
export const signup = async (email, password, username, profilePictureURL) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );

    // Access the newly created user's UID
    const { uid } = userCredential.user;

    // Create user profile document in Firestore
    await setDoc(doc(FIREBASE_DB, "users", uid), {
      username: username,
      profilePictureURL: profilePictureURL,
      email: email,
      // Add other user information as needed
    });

    return userCredential;
  } catch (error) {
    throw error;
  }
};
// Function to handle user login
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    // Handle specific error codes
    if (error.code === "auth/invalid-email") {
      throw new Error(
        "Invalid email format. Please enter a valid email address."
      );
    } else {
      // Handle other errors
      throw error;
    }
  }
};
export const createNewGroup = async (name, desc, code) => {
  try {
    // Create a new group object
    const newGroup = {
      name,
      desc,
      code,
    };

    // Add the new group to Firestore
    const docRef = await addDoc(collection(FIREBASE_DB, "groups"), newGroup);

    console.log("New group added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding group: ", error);
  }
};
export const logout = async () => {
  try {
    await signOut(FIREBASE_AUTH);
  } catch (error) {
    throw error;
  }
};
