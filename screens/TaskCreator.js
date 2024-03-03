import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";

const TaskCreatorScreen = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const handleTaskCreation = () => {
    // Logic to handle task creation
    console.log("Task created:", { taskName, taskDescription });
    // You can implement the logic to save the task in your app's state or database here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Chore</Text>
      <TextInput
        style={styles.input}
        value={taskName}
        onChangeText={setTaskName}
        placeholder="Enter chore name"
      />
      <TextInput
        style={styles.input}
        value={taskDescription}
        onChangeText={setTaskDescription}
        placeholder="Enter chore description"
        multiline
      />
      <Button title="Create Chore" onPress={handleTaskCreation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default TaskCreatorScreen;
