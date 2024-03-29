import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../config/firebase"; // Import Firebase Firestore instance

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState("");
  const createNewGroup = async () => {
    try {
      const auth = FIREBASE_AUTH;
      const currentUser = auth.currentUser;
      const currentUserId = currentUser.uid;

      const newGroup = {
        name: groupName,
        description: description,
        code: code,
        chores: [], // No chores initially
        members: [
          {
            userId: currentUserId,
            role: "manager", // Set the role for the current user
          },
        ],
        // Sample store items
        storeItems: [
          {
            category: "Electronics",
            items: [
              { id: 1, name: "Smartphone", price: 500, description: "High-end smartphone" },
              { id: 2, name: "Laptop", price: 1000, description: "Powerful laptop for productivity" },
              { id: 3, name: "Tablet", price: 300, description: "Portable tablet for entertainment" },
            ],
          },
          {
            category: "Books",
            items: [
              { id: 4, name: "Fiction Novel", price: 20, description: "Best-selling fiction novel" },
              { id: 5, name: "Programming Guide", price: 50, description: "Comprehensive programming guide" },
              { id: 6, name: "Self-Help Book", price: 30, description: "Book for personal development" },
            ],
          },
          {
            category: "Cash",
            items: [
              { id: 7, name: "10$", price: 20, description: "" },
              { id: 8, name: "50$", price: 100, description: "" },
              { id: 9, name: "100$$", price: 200, description: "" },
            ],
          }
        ],
      };

      // Add the new group to Firestore
      const docRef = await addDoc(collection(FIREBASE_DB, "groups"), newGroup);

      console.log("New group added with ID: ", docRef.id);

      // Navigate back to GroupsScreen after creating the group
      navigation.navigate("Groups");
    } catch (error) {
      console.error("Error adding group: ", error);
    }
  };
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
  const [code, setCode] = useState("");

  useEffect(() => {
    // Generate a code when the component mounts
    setCode(generateCode(4));
  }, []);

  // Function to regenerate the code
  const regenerateCode = () => {
    setCode(generateCode(4));
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Group</Text>
      <Text style={styles.codeLabel}>Group Name:</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholderTextColor="#ccc"
        placeholder="Group Name"
      />
      <Text style={styles.codeLabel}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="#ccc"
        placeholder="Description"
      />
      <Text style={styles.codeLabel}>Group Code:</Text>
      <View style={{ ...styles.flex, gap: "30px", display: "flex" }}>
        <TextInput
          style={{ ...styles.input, flex: 1 }}
          value={code}
          editable={false} // Prevents editing of the code
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity
          style={{ ...styles.button, height: 40, flex: 1 }}
          onPress={regenerateCode}
        >
          <Text style={{ ...styles.buttonText, fontSize: 12.7 }}>
            Regenerate Code
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={createNewGroup}>
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { display: "flex", width: "100%", flexDirection: "row" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  regenerateButton: {
    backgroundColor: "#0079BF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  regenerateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  button: {
    backgroundColor: "#0079BF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  codeLabel: {
    marginRight: "auto",
    marginBottom: 5,
  },
});

export default CreateGroupScreen;
