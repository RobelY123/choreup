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
        id:generateCode(8)
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
  const [isNewTaskModalVisible, setIsNewTaskModalVisible] = useState(false);
  const { groupName, isManager, tasks: taskss } = route.params;
  const handleCreateNewTask = () => {
    setIsNewTaskModalVisible(true);
  };
  const [tasks, setTasks] = useState(taskss);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollection = collection(FIREBASE_DB, "groups");
        const tasksQuery = query(
          tasksCollection,
          where("name", "==", groupName)
        );
        const tasksSnapshot = await getDocs(tasksQuery);
        const groupData = tasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (groupData.length > 0) {
          console.log(groupData);
          setTasks(groupData[0] || []);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [isNewTaskModalVisible]);
  console.log(tasks);
  console.log("tasks");
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{groupName} Chores</Text>
      <Text style={styles.subhead}>Active Chores</Text>
      <ScrollView horizontal={true}>
        {tasks.chores.length === 0 ? (
          <Text>No Available Tasks</Text>
        ) : (
          <FlatList
            style={styles.flatList}
            data={tasks.chores}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text style={styles.taskName}>{item.title}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
                <Text style={styles.taskReward}>Rewards: ★{item.reward}</Text>
                <Text style={styles.taskDue}>
                  Complete by:{" "}
                  {console.log(item)}
                  {format(
                    new Date(
                      item.time.seconds * 1000 + item.time.nanoseconds / 1000000
                    ),
                    "MMMM dd, yyyy hh:mm a"
                  )}
                </Text>
              </View>
            )}
            keyExtractor={(item) => {
              item?.id?.toString();
            }}
          />
        )}
      </ScrollView>
      {isManager ? (
        <Button title="Create New Chore" onPress={handleCreateNewTask} />
      ) : null}
      <NewTaskModal
        id={tasks}
        visible={isNewTaskModalVisible}
        onClose={() => setIsNewTaskModalVisible(false)}
      />
      <Text> </Text>
      <Text> </Text>
      <Text> </Text>
    </ScrollView>
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
