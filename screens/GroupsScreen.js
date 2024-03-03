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
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIREBASE_DB, "groups"), (snapshot) => {
      const updatedGroups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(updatedGroups);
    });

    return () => unsubscribe();
  }, []);

  const handleGroupPress = (group) => {
    navigation.navigate("Task", {
      groupName: group.name,
      tasks: group, // Pass the whole group object
      isManager: true,
      available: [],
      past: [],
      groupId: group.id,
      members: group.members,
    });
  };

  const joinExistingGroup = async () => {
    const group = groups.find((group) => group.code === groupCode);
    if (group) {
      const groupDocRef = doc(FIREBASE_DB, "groups", group.id);
      await updateDoc(groupDocRef, {
        members: [
          ...group.members,
          { role: "student", userId: currentUserId, score: 0 },
        ],
      });
      setModalVisible(false);
      setGroupCode("");
    } else {
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
        {console.log(groups.notVisible)}
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
