import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StorePage = ({ route }) => {
  const { groupName, isManager, groupId, members } = route.params;

  return (
    <View style={styles.container}>
      <Text>Store Page</Text>
      <Text>Group Name: {groupName}</Text>
      <Text>Is Manager: {isManager ? "Yes" : "No"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StorePage;