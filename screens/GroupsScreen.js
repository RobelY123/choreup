import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

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
  const [userName, setUserName] = useState("John Doe");

  const handleGroupPress = (group) => {
    navigation.navigate("Task", {
      groupName: group.name,
      tasks: [
        { id: 1, title: "Task 1", description: "Description of Task 1", reward: 150, due: "11:59" },
        { id: 2, title: "Task 2", description: "Description of Task 2", reward: 150, due: "11:59" },
        { id: 3, title: "Task 3", description: "Description of Task 3", reward: 150, due: "11:59" },
      ], // You can pass tasks data here if needed
      isManager: true, // Assuming the user is a manager, you can change this based on your logic
    });
  };
  const joinExistingGroup = () => {
    // Logic to join an existing group
  };

  const createNewGroup = () => {
    // Logic to create a new group
  };
  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.content}>
        {/* Display list of groups */}
        {sampleGroups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupContainer}
            onPress={() => handleGroupPress(group)}
          >
            <Text style={styles.groupName}>{group.name}</Text>
            <Text>{group.description}</Text>
            <Text>Members: {group.members.join(", ")}</Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },  buttonsContainer: {
    flexDirection: "column",
    gap: "20px",
    justifyContent: "space-around",
    marginTop: 20,
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
