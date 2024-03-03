import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";

const TaskPage = ({ route }) => {
  const { groupName, tasks, isManager } = route.params;

  const handleCreateNewTask = () => {
    // Logic to navigate to the task creator screen for managers
    // You can implement this navigation logic based on your navigation setup
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{groupName} Chores</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskName}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      {isManager && <Button title="Create New Chore" onPress={handleCreateNewTask} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  taskItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  taskName: {
    fontWeight: "bold",
  },
});

export default TaskPage;