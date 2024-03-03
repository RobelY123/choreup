import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Authentication
import { FIREBASE_AUTH, FIREBASE_DB } from "./config/firebase";
import CreateGroupScreen from "./screens/CreateGroupScreen";
import { doc, getDoc } from "firebase/firestore";

const Stack = createStackNavigator();

const CustomHeader = ({ navigation, route, user, pfp }) => {
  const { name } = route;
  const nav = useNavigation();

  const goToHome = () => {
    if (user) {
      nav.navigate("Groups"); // Navigate to Groups if user is logged in
    } else {
      nav.navigate("Home"); // Navigate to Home if user is not logged in
    }
  };

  const goToSettings = () => {
    nav.navigate("Profile");
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={goToHome}>
        <Text style={styles.homeButton}>Home</Text>
      </TouchableOpacity>
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
       ""
      )}
      <Text style={styles.screenName}>{name}</Text>
    </View>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState("default");
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      fetchUserData(user.uid);
    }
  }, [user]);

  const fetchUserData = async (email) => {
    try {
      const userDocRef = doc(FIREBASE_DB, "users", email);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setProfilePic(userData.profilePictureURL || null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error
    }
  };
  // Define the setUser function
  const handleSetUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      // Call setUser function to update the user state
      handleSetUser(user);
    });

    return unsubscribe;
  }, []);

  const checkUserAccess = (route) => {
    if (!user && route.name === "Groups") {
      return "Login";
    }
    return route.name;
  };

  console.log(user);
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen
          name="Groups"
          component={GroupsScreen}
          options={({ route }) => ({
            title: checkUserAccess(route),
          })}
        />
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
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
