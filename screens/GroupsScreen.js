import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../config/firebase"; // Import your Firebase Firestore instance

const GroupsScreen = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupCode, setGroupCode] = useState("");

  const currentUser = FIREBASE_AUTH.currentUser;
  const currentUserId = currentUser.uid;
  const fetchGroups = async () => {
    try {
      // Fetch all groups from Firestore
      const groupsCollection = collection(FIREBASE_DB, "groups");
      const groupsSnapshot = await getDocs(groupsCollection);
      const groupsData = groupsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        notVisible: true, // Set initially to true for all groups
      }));

      // Filter out groups where the user is a member
      const userGroups = groupsData.map((group) => {
        // Check if the user's ID exists in the `members` array of the group
        const isVisible = group.members.some(
          (member) => member.userId === currentUserId
        );
        // Update the `notVisible` property based on visibility
        group.notVisible = !isVisible;
        return group;
      });

      // Set the filtered groups in the state
      setGroups(userGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  console.log(currentUserId);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(FIREBASE_DB, "groups"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            fetchGroups();
          }
        });
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchGroups();
  }, []);
  console.log(groups);
  const handleGroupPress = async (group) => {
    try {
      // Filter out tasks where the user's ID matches inside the `members` array
      const userTasks = group;
      console.log(group)
      navigation.navigate("Task", {
        groupName: group.name,
        tasks: userTasks, // Pass the filtered tasks to TaskPage
        isManager: true, // Assuming the user is a manager, you can change this based on your logic
        available: [], // Add logic to fetch available tasks for the group
        past: [], // Add logic to fetch past tasks for the group
        groupId: group.id, // Pass the group ID to TaskPage
        members:group.members
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const joinExistingGroup = async () => {
    console.log(groups);
    console.log(groupCode);
    const group = groups.find((group) => group.code === groupCode);
    if (group) {
      // Add the user's ID to the members array of the group
      const groupDocRef = doc(FIREBASE_DB, "groups", group.id);
      await updateDoc(groupDocRef, {
        members: [...group.members, { role: "student", userId: currentUserId,score:0 }], // Replace "userID" with the actual user ID
      });
      setModalVisible(false); // Close the modal
      setGroupCode(""); // Clear the group code input field
    } else {
      // Handle case when group code is not found
      alert("Group code not found. Please enter a valid code.");
    }
  };

  const createNewGroup = () => {
    navigation.navigate("CreateGroup");
  };
  const onClose = () => {
    setModalVisible(!modalVisible);
  };
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => onClose()}
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
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: 300,
              alignItems: "center",
            }}
          >
            <Text style={{ marginBottom: 10 }}>Enter the group code:</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
                width: 200,
              }}
              value={groupCode} // Corrected from `code` to `groupCode`
              onChangeText={setGroupCode} // Corrected from `setCode` to `setGroupCode`
              placeholder="Group code"
            />
            <Button title="Join Group" onPress={joinExistingGroup} />
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Main content */}
      <View style={styles.content}>
        {/* Display list of groups */}
        {console.log(groups)}
        {groups
          .filter((val) => !val.notVisible)
          .map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupContainer}
              onPress={() => handleGroupPress(group)}
            >
              <Text style={styles.groupName}>{group.name}</Text>
              <Text>{group.description}</Text>
              <Text>Code: {group.code}</Text>
            </TouchableOpacity>
          ))}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
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
    borderColor: "#0079BF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#0079BF",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#0079BF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: "column",
    gap: "20px",
    justifyContent: "space-around",
    marginTop: 20,
  },
  groupContainer: {
    borderWidth: 1,
    borderColor: "#0079BF",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: 300,
  },
  groupName: {
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default GroupsScreen;
