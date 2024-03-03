import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import { logout } from "./auth"; // Import the logout function
import { getAuth, updateProfile } from "firebase/auth";
import { FIREBASE_DB } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setEmail(user.email || "");
      fetchUserData(user.uid);
    }
  }, []);

  const fetchUserData = async (email) => {
    try {
      const userDocRef = doc(FIREBASE_DB, "users", email);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setName(userData.username || "");
        console.log(userData + "e");
        setProfilePic(userData.profilePictureURL || null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error
    }
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleSaveChanges = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        await updateProfile(user, {
          displayName: name,
        });

        // Show success message or navigate to another screen
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // After successful logout, navigate to the login screen or any other desired screen
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout Error:", error.message);
      // Handle logout error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profilePicContainer}>
        <Image
          source={
            profilePic && profilePic != "default"
              ? { uri: profilePic }
              : require("../assets/pfp.png")
          }
          style={styles.profilePic}
        />
      </View>
      <Text style={styles.loginText}>Username</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={handleNameChange}
        placeholder="Enter your name"
      />
      <Text style={styles.loginText}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        editable={false} // Disable editing email field
      />
      <Button title="Save Changes" onPress={handleSaveChanges} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profilePicContainer: {
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  loginText: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default ProfileScreen;
