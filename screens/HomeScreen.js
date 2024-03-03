import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(validateEmail(text));
    if (text !== "") {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNextPress = async () => {
    try {
      navigation.navigate("Login", { email: email });
    } catch (error) {
      console.error("Error signing in:", error.message);
      // Handle sign-in error
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Image
        source={require("../assets/ChoreUpLogo.png")}
        style={styles.centerLogo}
        resizeMode="contain"
      />
      <Text style={styles.loginText}>Login or Sign Up</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          autoCompleteType="email"
          keyboardType="email-address"
          placeholderTextColor="gray"
          onChangeText={handleEmailChange}
        />
        <Animated.View style={[styles.nextButton, { opacity: fadeAnim }]}>
          {isValidEmail && (
            <Button title="→" onPress={handleNextPress} color="#007bff" />
          )}
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 70,
  },
  logo: {
    width: 350, // Adjust size as needed
    marginTop: -150,
    marginBottom: 100,
  },
  centerLogo: {
    width: 250,
    height: 250,
    marginHorizontal: 50,
  },
  loginText: {
    marginRight: "auto",
    fontSize: 20,
    marginBottom: 5,
    bottom: -70,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    bottom: -70,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#0079BF",
    borderRadius: 5,
    backgroundColor: "white",
    color: "black",
    paddingHorizontal: 10,
  },
  nextButton: {
    marginLeft: 10,
  },
  middleContent: {
    flex: 1,
    justifyContent: "center",
  },
  middleText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
