import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";

const sampleGroups = [
  {
    id: 1,
    name: "Group 1",
    description: "Description of Group 1",
    members: ["John", "Jane", "Doe"],
  },
  {
    id: 2,
    name: "Group 2",
    description: "Description of Group 2",
    members: ["Alice", "Bob", "Charlie"],
  },
];

const GroupsScreen = ({ navigation }) => {
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
  const joinExistingGroup = () => {
    // Logic to join an existing group
  };

  const createNewGroup = () => {
    // Logic to create a new group
  };
  return (
    <View style={styles.container}>
      {/* Banner with user account and dropdown */}

      {/* Main content */}
      <View style={styles.content}>
        {/* Display list of groups */}
        {sampleGroups.map((group) => (
          <View key={group.id} style={styles.groupContainer}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text>{group.description}</Text>
            <Text>Members: {group.members.join(", ")}</Text>
          </View>
        ))}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={joinExistingGroup}>
            <Text style={styles.buttonText}>Join Existing Group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={createNewGroup}>
            <Text style={styles.buttonText}>Create New Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "column",
    gap: "20px",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
    borderWidth: 1,
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
  groupContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "80%",
  },
  groupName: {
    fontWeight: "bold",
  },
});

export default GroupsScreen;
