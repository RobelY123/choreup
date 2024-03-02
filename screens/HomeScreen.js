import { useNavigation } from "@react-navigation/native";
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

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
  const navigate = new useNavigation();
  const handleNextPress = () => {
    if (isValidEmail) {
      navigation.navigate("Tasks");
    } else {
      // Handle invalid email input
    }
  };

  // Function to validate email format
  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.loginText}>Login or Sign Up</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          placeholderTextColor="gray"
          onChangeText={handleEmailChange}
        />
        <Animated.View style={[styles.nextButton, { opacity: fadeAnim }]}>
          {isValidEmail && (
            <Button title="→" onPress={handleNextPress} color="#007bff" />
          )}
        </Animated.View>
      </View>
      <View style={styles.middleContent}>
        {/* Additional content in the middle of the page */}
        <Text style={styles.middleText}>Additional Content Here</Text>
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
    width: 150, // Adjust size as needed
  },
  loginText: {
    marginRight: "auto",
    fontSize: 14,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
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
