import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import GroupsScreen from "./screens/GroupsScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import StorePage from "./screens/StorePage";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import ProfileScreen from "./screens/ProfileScreen";
import TaskCreatorScreen from "./screens/TaskCreator";
import TaskPage from "./screens/TaskPage";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Authentication
import { FIREBASE_AUTH, FIREBASE_DB } from "./config/firebase";
import CreateGroupScreen from "./screens/CreateGroupScreen";
import { doc, getDoc } from "firebase/firestore";
import HomeScreen2 from "./screens/HomeScreen2";
import { MaterialIcons } from "@expo/vector-icons";
const Stack = createStackNavigator();

const CustomHeader = ({ navigation, route, user, pfp }) => {
  const { name } = route;
  const nav = useNavigation();

  const goToHome = () => {
    if (user) {
      navigation.navigate("Groups"); // Navigate to Groups if user is logged in
    } else {
      navigation.navigate("Home"); // Navigate to Home if user is not logged in
    }
  };

  const goToSettings = () => {
    nav.navigate("Profile");
  };

  return (
    <View style={styles.header}>
      {navigation.canGoBack() && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      {user ? (
        <TouchableOpacity onPress={goToSettings}>
          <Image
            source={
              pfp && pfp != "default"
                ? { uri: pfp }
                : require("./assets/pfp.png")
            }
            style={styles.profilePicture}
          />
        </TouchableOpacity>
      ) : (
        <Text></Text>
      )}
      <Text style={styles.screenName}>{name}</Text>
    </View>
  );
};

const App = () => {
  const [user, setUser] = useState(NaN);
  const [profilePic, setProfilePic] = useState("default");
  // Other code remains unchanged
  console.log(user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      // Call setUser function to update the user state
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const checkUserAccess = (route) => {
    // If user is logged in and tries to access "Login" or "Signup", redirect to "Groups"
    if (user && (route.name === "Login" || route.name === "Signup")) {
      return "Groups";
    }
    // If user is not logged in and tries to access "Groups", redirect to "Login"
    else if (!user && route.name === "Groups") {
      return "Login";
    }
    return route.name;
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation, route }) => ({
          header: () => (
            <CustomHeader
              pfp={profilePic}
              navigation={navigation}
              route={route}
              user={user}
            />
          ),
        })}
      >
        <Stack.Screen
          name="Task"
          component={TaskPage}
          options={({ route }) => ({
            title: checkUserAccess(route),
          })}
        />
        <Stack.Screen
          name="TaskCreator"
          component={TaskCreatorScreen}
          options={({ route }) => ({
            title: checkUserAccess(route),
          })}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        {user ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen2}
            initialParams={{ user: user }}
          />
        ) : (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            initialParams={{ user: user }}
          />
        )}
        <Stack.Screen
          name="Store"
          component={StorePage}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen
          name="Groups"
          component={GroupsScreen}
          options={({ route }) => ({
            title: checkUserAccess(route),
          })}
        />
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
        {user ? null : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }} // Hide the header for these screens
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }} // Hide the header for these screens
            />
          </>
        )}
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
    backgroundColor: "#0079BF", // Header background color
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
