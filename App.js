import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import GroupsScreen from "./screens/GroupsScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import ProfileScreen from "./screens/ProfileScreen";
import TaskCreatorScreen from "./screens/TaskCreator";
import TaskPage from "./screens/TaskPage";

import { initializeApp } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyAJgagjYMfhn2hxAHUqBmzMXwg61Uz1rJY",
  authDomain: "choreup-f3c99.firebaseapp.com",
  projectId: "choreup-f3c99",
  storageBucket: "choreup-f3c99.appspot.com",
  messagingSenderId: "1018123461263",
  appId: "1:1018123461263:web:1ad9eebfccb2861c0746fa",
  measurementId: "G-TH2W7H83LP"
};
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

// Initialize Authentication
const auth = getAuth(firebaseApp);

const Stack = createStackNavigator();

const CustomHeader = ({ navigation, route }) => {
  // Get the name of the current screen
  const { name } = route;

  // Handle navigation to the settings screen
  const goToSettings = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.header}>
      {/* Profile Picture */}
      <TouchableOpacity onPress={goToSettings}>
        <Image
          source={require("./assets/pfp.png")} // Replace with your profile picture source
          style={styles.profilePicture}
        />
      </TouchableOpacity>

      {/* Screen Name */}
      <Text style={styles.screenName}>{name}</Text>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} route={route} />
          ),
        }}
      >
        <Stack.Screen name="Task" component={TaskPage} />
        <Stack.Screen name="TaskCreator" component={TaskCreatorScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Groups" component={GroupsScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#6200EE", // Header background color
  },
  profilePicture: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  screenName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;
