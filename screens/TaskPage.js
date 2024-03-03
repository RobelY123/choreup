import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, ScrollView } from "react-native";

const TaskPage = ({ route }) => {
  const { groupName, tasks, isManager, available, past } = route.params;

  const handleCreateNewTask = () => {
    // Logic to navigate to the task creator screen for managers
    // You can implement this navigation logic based on your navigation setup
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{groupName} Chores</Text>
      <Text style={styles.subhead}>Active Chores</Text>
      <ScrollView horizontal={true}>
        {tasks.length==0?<Text>No Available Tasks</Text>:<FlatList
          style={styles.flatList}
          data={tasks}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskName}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskReward}>Rewards: ★{item.reward}</Text>
              <Text style={styles.taskDue}>Complete by: {item.due}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />}
      </ScrollView>
      <Text style={styles.subhead}>Claimable chores</Text>
      <ScrollView horizontal={true}>
        <FlatList
          style={styles.flatList}
          data={available}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskName}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskReward}>Rewards: ★{item.reward}</Text>
              <Text style={styles.taskDue}>Complete by: {item.due}</Text>
            </View>
          )}
        />
      </ScrollView>
      <Text style={styles.subhead}>Past chores</Text>
      <ScrollView horizontal={true}>
        <FlatList
          style={styles.flatList}
          data={past}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskName}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskReward}>Rewards: ★{item.reward}</Text>
              <Text style={styles.taskDue}>Complete by: {item.due}</Text>
            </View>
          )}
        />
      </ScrollView>
      {isManager && <Button title="Create New Chore" onPress={handleCreateNewTask} />}
      <Text>   </Text>
      <Text>   </Text>
      <Text>   </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderColor: "#0079BF",
  },
  flatList: {
    maxHeight: 270,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  taskDescription: {
    fontSize: 18,
  },
  subhead: {
    fontSize: 28,
    paddingVertical: 5,
  },
  taskItem: {
    borderWidth: 1,
    borderColor: "#0079BF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 350,
  },
  taskName: {
    fontWeight: "bold",
    fontSize: 24,
  },
});

export default TaskPage;