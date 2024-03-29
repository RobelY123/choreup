import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { signup } from "./auth"; // Import the signup function

const SignupScreen = ({ navigation, route }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(route.params?.email||"");
  const [password, setPassword] = useState("");
  const handleSignup = async () => {
    try {
      // Call the signup function with username, email, and password
      await signup(email, password, username, "default");
      Alert.alert("Signup Successful", "You have successfully signed up!");
      // Navigate to the next screen or perform any other actions after signup
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          autoCapitalize="none"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignup} />
      </View>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          Already have an account?{" "}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signupLink}>Login</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 100,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  signupContainer: {
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default SignupScreen;
