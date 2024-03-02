import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button, KeyboardAvoidingView } from "react-native";

const TasksScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("John Doe"); // Sample user name, replace with actual user data
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    // Logic to logout the user
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const navigateToSettings = () => {
    navigation.navigate("Settings");
    toggleDropdown(); // Close dropdown after navigation
  };

  const navigateToGroups = () => {
    navigation.navigate("Groups");
    toggleDropdown(); // Close dropdown after navigation
  };

  return (
    <View style={styles.container}>
      {/* Banner with user account and dropdown */}
      {/* Main content */}
      <View style={styles.content}>
        <Text>Tasks Screen</Text>
        <Button title="View Groups" onPress={navigateToGroups} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
    backgroundColor: "transparent",
    borderColor: "#ccc",
    borderWidth: "1px",
    width: "100%",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 3,
    padding: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TasksScreen;
