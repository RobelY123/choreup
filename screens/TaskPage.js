import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { FIREBASE_DB } from "../config/firebase";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
const NewTaskModal = ({ visible, onClose, id }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [time, setTime] = useState(new Date());
  const generateCode = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };
  const handleCreateTask = async () => {
    try {
      const newTask = {
        name: taskName,
        description,
        reward: parseInt(reward),
        time: new Date(time).toISOString(),
        id: generateCode(8),
      };

      // Add the new task to the tasks/chores array of the group
      const groupDocRef = doc(FIREBASE_DB, "groups", id.id);
      await updateDoc(groupDocRef, {
        chores: [...id.chores, newTask],
      });

      // Reset input fields
      setTaskName("");
      setDescription("");
      setReward("");
      setTime(new Date());

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    console.log(selectedDate);
    if (selectedDate) {
      setTime(new Date(selectedDate));
    }
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        activeOpacity={1}
        onPressOut={() => onClose()} // Close the modal when tapping outside of it
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Task Name:</Text>
            <TextInput
              style={styles.input}
              value={taskName}
              onChangeText={setTaskName}
            />
            <Text style={styles.modalText}>Description:</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
            <Text style={styles.modalText}>Reward:</Text>
            <TextInput
              style={styles.input}
              value={reward}
              onChangeText={setReward}
              keyboardType="numeric"
            />
            <Text style={styles.modalText}>Time:</Text>
            <DateTimePicker
              value={time}
              minimumDate={new Date()}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
            <Button title="Create Task" onPress={handleCreateTask} />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
const TaskPage = ({ route }) => {
  // State variables
  const [isNewTaskModalVisible, setIsNewTaskModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const { groupName, isManager, members } = route.params;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollection = collection(FIREBASE_DB, "groups");
        const tasksQuery = query(tasksCollection, where("name", "==", groupName));
        const tasksSnapshot = await getDocs(tasksQuery);
        const groupData = tasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (groupData.length > 0) {
          setTasks(groupData[0].chores || []); // Assuming chores is the array you're interested in
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(); // Fetch tasks initially
  }, [groupName]); // Fetch tasks when groupName changes

  // Function to check if a task is active or past
  const isTaskActive = (task) => {
    const taskTime =
      typeof task.time === "object"
        ? task.time.seconds * 1000 + task.time.nanoseconds / 1000000
        : new Date(task.time).getTime();
    return taskTime > Date.now(); // Check if task time is in the future
  };

  // Split tasks into active and past categories
  const activeTasks = tasks.filter((task) => isTaskActive(task));
  const pastTasks = tasks.filter((task) => !isTaskActive(task));

  // Function to handle creating a new task
  const handleCreateNewTask = () => {
    setIsNewTaskModalVisible(true);
  };
console.log(activeTasks)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{groupName} Chores</Text>

      <Text style={styles.subhead}>Active Chores</Text>
      {activeTasks.length > 0 ? (
        <FlatList
          style={styles.flatList}
          data={activeTasks}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
                <Text style={styles.taskName}>{item.name}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
                <Text style={styles.taskReward}>Rewards: ★{item.reward}</Text>
                <Text style={styles.taskDue}>
                  Complete by: {console.log(item.time)}
                  {console.log(
                    typeof item.time == "object"
                      ? item.time.seconds * 1000 +
                          item.time.nanoseconds / 1000000
                      : item.time
                  )}
                  {format(
                    new Date(
                      typeof item.time == "object"
                      ? item.time.seconds * 1000 +
                          item.time.nanoseconds / 1000000
                      : item.time
                    ),
                    "MMMM dd, yyyy hh:mm a"
                  )}
                </Text>
              </View>
          )}
          keyExtractor={(item) => item.id?.toString()}
        />
      ) : (
        <Text>No Active Tasks</Text>
      )}

      <Text style={styles.subhead}>Past Chores</Text>
      {pastTasks.length > 0 ? (
        <FlatList
          style={styles.flatList}
          data={pastTasks}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>{/* Render past tasks here */}</View>
          )}
          keyExtractor={(item) => item.id?.toString()}
        />
      ) : (
        <Text>No Past Tasks</Text>
      )}

      {isManager && (
        <Button title="Create New Chore" onPress={() => setIsNewTaskModalVisible(true)} />
      )}

      <NewTaskModal
        id={tasks}
        visible={isNewTaskModalVisible}
        onClose={() => setIsNewTaskModalVisible(false)}
      />

      <View style={{ marginBottom: 20 }}></View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderColor: "#0079BF",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#0079BF",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "white",
    color: "black",
    paddingHorizontal: 10,
    width: "100%",
    minWidth: "100%",
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
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
});

export default TaskPage;
