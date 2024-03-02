import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import * as ImagePicker from "react-native-image-picker";

const ProfileScreen = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [profilePic, setProfilePic] = useState(require("../assets/pfp.png"));

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleSaveChanges = () => {
    // Logic to save changes to the user's profile
  };

  const openImagePicker = () => {
    const options = {
      title: "Select Profile Picture",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.uri };
        setProfilePic(source);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profilePicContainer}>
        <Image source={profilePic} style={styles.profilePic} />
        <Button title="Change Picture" onPress={openImagePicker} />
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
        onChangeText={handleEmailChange}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Save Changes" onPress={handleSaveChanges} />
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
