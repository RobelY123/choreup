import React, { useEffect, useState } from "react";
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
  ScrollView,
} from "react-native";
import { login } from "./auth"; // Import the login function

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (route.params?.email) {
      setEmail((prev) => route.params.email);
    }
  }, [route.params?.email]);

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert("Login Successful", "You have successfully logged in!");
      // Navigate to the next screen or perform any other actions after login
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container} padding
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.centerLogo}
          resizeMode="contain"
        />
        <View style={styles.fullContainer}>
          <Text style={styles.miniText}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            style={styles.input}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.fullContainer}>
          <Text style={styles.miniText}>Password</Text>
          <TextInput
            placeholder="Password"
            value={password}
            style={styles.input}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Signup", { email: email });
            }}
            style={styles.signupButton}
          >
            <Text style={styles.signupText}>Want to sign up?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  signupText: {
    // Custom styles for the title of the "Want to sign up?" button
    fontSize: 1,
    color: "#0079BF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 70,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  centerLogo: { width: "80%" },
  fullContainer: {
    width: "100%",
  },
  miniText: {
    marginRight: "auto",
    fontSize: 16,
  },
  loginText: {
    fontSize: 30,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center", // Center button horizontally
  },
  signupButton: {
    marginTop: 10,
  },
  signupText: {
    fontSize: 16,
    color: "#0079BF",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#0079BF",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "white",
    color: "black",
    paddingHorizontal: 10,
    width: "100%",
  },
});

export default LoginScreen;
