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
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../config/firebase";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
const NewTaskModal = ({ visible, onClose, fetchTasks, groupId }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [time, setTime] = useState(new Date());
  const navigation = useNavigation();
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
    const newTask = {
      name: taskName,
      description,
      reward: parseInt(reward),
      time: new Date(time).toISOString(),
      id: generateCode(8),
    };

    try {
      // Fetch current tasks array from Firestore
      const groupDocRef = doc(FIREBASE_DB, "groups", groupId);
      const groupDocSnap = await getDoc(groupDocRef);
      const groupData = groupDocSnap.data();

      // Update tasks array with the new task
      const updatedTasks = [...(groupData.chores || []), newTask];

      // Update the Firestore document with the updated tasks array
      await updateDoc(groupDocRef, {
        chores: updatedTasks,
      });

      // Reset input fields
      setTaskName("");
      setDescription("");
      setReward("");
      setTime(new Date());

      // Close the modal
      onClose();

      // Fetch updated tasks
      fetchTasks();
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
  const { groupName, isManager, members, groupId } = route.params;

  const fetchTasks = async () => {
    try {
      const tasksCollection = collection(FIREBASE_DB, "groups");
      const tasksQuery = query(tasksCollection, where("name", "==", groupName));
      const tasksSnapshot = await getDocs(tasksQuery);
      const groupData = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(groupData);
      if (groupData.length > 0) {
        setTasks(groupData[0].chores || []); // Assuming chores is the array you're interested in
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const navigation = useNavigation();
  useEffect(() => {
    fetchTasks(); // Fetch tasks initially
  }, [groupName]); // Fetch tasks when groupName changes
  const currentUser = FIREBASE_AUTH.currentUser;
  const currentUserId = currentUser.uid;
  // Function to check if a task is active or past
  const isTaskActive = (task) => {
    const taskTime =
      typeof task.time === "object"
        ? task.time.seconds * 1000 + task.time.nanoseconds / 1000000
        : new Date(task.time).getTime();
    return taskTime > Date.now(); // Check if task time is in the future
  };

  const handleStorePress = () => {
    navigation.navigate("Store", {
      groupName: groupName,
      isManager: isManager,
      member: members.find((val) => val.userId === currentUserId),
      groupId,
    });
  };

  // Split tasks into active and past categories
  const activeTasks = tasks.filter((task) => isTaskActive(task));
  const pastTasks = tasks.filter((task) => !isTaskActive(task));

  // Function to handle creating a new task
  const handleCreateNewTask = () => {
    setIsNewTaskModalVisible(true);
  };
  console.log();
  return (
    <View style={styles.container}>
      <View style={styles.flex}>
        <Text style={styles.title}>{groupName} Chores</Text>
        <Button
          style={styles.storeBtn}
          title="Store"
          onPress={handleStorePress}
        />
      </View>
      {isManager ? (
        ""
      ) : (
        <Text style={{ marginBottom: 10 }}>
          Your Rewards: ★
          {members.find((val) => val.userId === currentUserId)?.score}
        </Text>
      )}
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
                    ? item.time.seconds * 1000 + item.time.nanoseconds / 1000000
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
          keyExtractor={(item) => parseInt(Math.random() * 1000000)}
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
        <Button
          title="Create New Chore"
          onPress={() => setIsNewTaskModalVisible(true)}
        />
      )}

      <NewTaskModal
        groupId={groupId}
        fetchTasks={fetchTasks}
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
  storeBtn: {
    flex: 1,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
