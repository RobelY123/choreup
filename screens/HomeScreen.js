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

const HomeScreen = (props) => {
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.middleContent}>
        <Text style={styles.middleText}>Welcome to ChoreUp!</Text>
        <Text style={styles.middleText}>
          Enter your email to get started or to login.
        </Text>
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
  },
  logo: {
    width: 250,
    marginBottom: 20,
  },
  centerLogo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  middleContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  middleText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    marginRight: 10,
  },
  nextButton: {},
});

export default HomeScreen;
