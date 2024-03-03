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
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen2 = (props) => {
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
        console.log('e')
      navigation.navigate("Groups");
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
        <TouchableOpacity onPress={handleNextPress} style={styles.button}>
          <Text style={styles.buttonText}>Go To My Groups</Text>
        </TouchableOpacity>
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
    middleContent: {
      justifyContent: "center",
      alignItems: "center",
    },
    middleText: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 20,
    },
    button: {
      backgroundColor: "#0079BF",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
export default HomeScreen2;
