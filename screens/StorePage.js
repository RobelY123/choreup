import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { FIREBASE_DB } from "../config/firebase";

const StorePage = ({ route }) => {
  const { groupName, isManager, groupId, member } = route.params;

  const [storeItems, setStoreItems] = useState([]);
  const fetchStoreItems = async () => {
    try {
      console.log(groupId);
      console.log("groupId");
      const q = query(
        collection(FIREBASE_DB, "groups"),
        where("name", "==", groupName)
      );
      const querySnapshot = await getDocs(q);
      const groupData = querySnapshot.docs.map((doc) => doc.data());
      // Assuming the store items are stored under the 'storeItems' field in the group document
      const items = groupData.map((group) => group.storeItems || []);
      console.log(groupData);
      setStoreItems(items.flat());
    } catch (error) {
      console.error("Error fetching store items:", error);
    }
  };

  useEffect(() => {
    fetchStoreItems();
  }, [groupId]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isManageModalVisible, setIsManageModalVisible] = useState(false);
  const [manageCategoryName, setManageCategoryName] = useState("");
  const [manageItemName, setManageItemName] = useState("");
  const [manageItemPrice, setManageItemPrice] = useState("");
  const [manageItemDescription, setManageItemDescription] = useState("");
  const saveChanges = async () => {
    setSelectedItem(null)
    try {
      // Find the group document by name
      const groupQuerySnapshot = await getDocs(
        query(collection(FIREBASE_DB, "groups"), where("name", "==", groupName))
      );
      if (!groupQuerySnapshot.empty) {
        // Get the first document (assuming there's only one group with the same name)
        const groupDoc = groupQuerySnapshot.docs[0].ref; // Get reference to the document
        console.log(groupDoc);
        console.log("Before update:", storeItems);
        // Update store items in Firestore
        await updateDoc(groupDoc, {
          storeItems: storeItems,
        });

        console.log("After update:", storeItems);
        // Refresh the data after saving changes
        fetchStoreItems();
      } else {
        console.error("Group not found");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCategoryChange = () => {
    setIsManageModalVisible(true);
  };

  const handleAddCategory = async () => {
    try {
      const categoryId = groupId; // Assuming you have the selected group ID
      const newItem = {
        name: manageCategoryName,
        items: [], // Initialize items array for the new category
      };
      // Add new category as an item within the selected group
      const groupDocRef = doc(collection(FIREBASE_DB, "groups"), categoryId);
      await updateDoc(groupDocRef, {
        items: firebase.firestore.FieldValue.arrayUnion(newItem),
      });
      // Clear input field after adding category
      setManageCategoryName("");
      // Fetch updated categories
      // fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
  const handleAddItem = async () => {
    try {
      const categoryId = selectedCategory; // Assuming you have the selected category ID
      const newItem = {
        name: manageItemName,
        price: manageItemPrice,
        description: manageItemDescription,
      };
      // Add new item to Firestore
      await updateDoc(doc(collection(FIREBASE_DB, "groups", categoryId)), {
        items: firebase.firestore.FieldValue.arrayUnion(newItem),
      });
      // Clear input fields after adding item
      setManageItemName("");
      setManageItemPrice("");
      setManageItemDescription("");
      // Fetch updated categories
      // fetchCategories();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, "groups"));
      const updatedCategories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleBuyItem = () => {
    if (member.score >= selectedItem.price) {
      Alert.alert(
        "Confirmation",
        `Do you want to buy ${selectedItem.name} for ${selectedItem.price} points?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Buy", onPress: () => handleBuyConfirmation() },
        ]
      );
    } else {
      Alert.alert(
        "Insufficient Balance",
        "You do not have enough points to buy this item."
      );
    }
  };
  // useEffect(() => {
  //   // Fetch categories from Firestore when the modal is opened
  //   const fetchCategories = async () => {
  //     const querySnapshot = await getDocs(
  //       collection(FIREBASE_DB, "categories")
  //     );
  //     const fetchedCategories = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setCategories(fetchedCategories);
  //   };
  //   if (isManageModalVisible) {
  //     fetchCategories();
  //   }
  // }, [isManageModalVisible]);
  const handleBuyConfirmation = () => {
    // Deduct the price from the user's score and update the database
    // const updatedScore = member.score - selectedItem.price;
    // Update score in the database
    setSelectedItem(null);
  };
  useEffect(() => {
    if (
      selectedCategory !== undefined &&
      selectedItem !== undefined &&
      selectedItem !== null
    ) {
      updateStoreItems(selectedCategory, selectedItem.id);
    }
  }, [manageItemName, manageItemPrice, manageItemDescription]);

  // Function to update storeItems in Firestore
  const updateStoreItems = (category, id) => {
    try {
      // Find the category index in storeItems
      const categoryIndex = storeItems.findIndex(
        (item, index) => index === category
      );
      if (categoryIndex === -1) {
        throw new Error(`Category '${category}' not found in storeItems`);
      }

      // Find the item index in the items array of the category
      const itemIndex = storeItems[categoryIndex].items.findIndex(
        (item, index) => item.id === id
      );
      if (itemIndex === -1) {
        throw new Error(
          `Item with id '${id}' not found in category '${category}'`
        );
      }

      // Construct the updated item
      const updatedItem = {
        ...storeItems[categoryIndex].items[itemIndex],
        name: manageItemName,
        price: parseInt(manageItemPrice),
        description: manageItemDescription,
      };

      // Create a copy of the storeItems array and update the item
      const updatedStoreItems = [...storeItems];
      updatedStoreItems[categoryIndex].items[itemIndex] = updatedItem;

      // Update the storeItems state with the updated array
      setStoreItems(updatedStoreItems);

      console.log("Updated storeItems:", updatedStoreItems);
    } catch (error) {
      console.error("Error updating storeItems:", error);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setManageItemName(selectedItem.name);
      setManageItemPrice(selectedItem.price.toString());
      setManageItemDescription(selectedItem.description);
    }
  }, [selectedItem]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{groupName} Store</Text>
      <Text>Group Name: {groupName}</Text>
      <Text>Is Manager: {isManager ? "Yes" : "No"}</Text>
      {isManager && (
        <TouchableOpacity onPress={handleCategoryChange}>
          <Text style={styles.manageCategories}>Manage Categories</Text>
        </TouchableOpacity>
      )}
      <ScrollView>
        {storeItems.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            <ScrollView horizontal style={{ display: "flex", gap: 20 }}>
              {category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.rewardItem, { marginRight: 20 }]}
                  onPress={() => {
                    console.log(item.price);
                    setManageItemName(item.name);
                    setManageItemPrice(item.price);
                    setSelectedItem(item);
                    setSelectedCategory(parseInt(index));
                  }}
                >
                  <Text>{item.name}</Text>
                  <Text>Price: {item.price} points</Text>
                  <Text>Description: {item.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
      <Modal
        onRequestClose={() => setIsManageModalVisible(false)}
        visible={isManageModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manage Categories and Items</Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={manageCategoryName}
              onChangeText={setManageCategoryName}
            />
            <Button title="Add Category" onPress={handleAddCategory} />
            <Text style={styles.subtitle}>Add Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={manageItemName}
              onChangeText={setManageItemName}
            />
<TextInput
  style={styles.input}
  placeholder="Item Price"
  value={manageItemPrice.toString()} // Convert to string
  onChangeText={setManageItemPrice}
  keyboardType="numeric"
/>
            <TextInput
              style={styles.input}
              placeholder="Item Description"
              value={manageItemDescription}
              onChangeText={setManageItemDescription}
            />
            <Button title="Add Item" onPress={handleAddItem} />
            <Button
              title="Close"
              onPress={() => setIsManageModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      <Modal
        onRequestClose={() => setSelectedItem(null)}
        visible={selectedItem !== null}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
            {isManager ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Item Name"
                  value={manageItemName}
                  onChangeText={setManageItemName}
                  editable={isManager}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Item Price"
                  value={manageItemPrice}
                  onChangeText={setManageItemPrice}
                  keyboardType="numeric"
                  editable={isManager}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Item Description"
                  value={manageItemDescription}
                  editable={isManager}
                  onChangeText={setManageItemDescription}
                />
                {isManager ? (
                  <Button title="Save Changes" onPress={saveChanges} />
                ) : (
                  <Button title="Buy" onPress={handleBuyItem} />
                )}
              </>
            ) : (
              <Button title="Buy" onPress={handleBuyItem} />
            )}
            <Button title="Close" onPress={() => setSelectedItem(null)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  manageCategories: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "blue",
  },
  categoryContainer: {
    marginRight: 20,
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rewardItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: 200,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default StorePage;
