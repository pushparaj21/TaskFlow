// app/completed/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Task } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

const CompletedTasksScreen: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      loadCompletedTasks();
    }, [])
  );

  const loadCompletedTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
      setCompletedTasks(parsedTasks.filter((task) => task.isCompleted));
    } catch (error) {
      console.error("Error loading completed tasks:", error);
    }
  };

  const deleteTask = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const storedTasks = await AsyncStorage.getItem("tasks");
              let parsedTasks: Task[] = storedTasks
                ? JSON.parse(storedTasks)
                : [];
              parsedTasks = parsedTasks.filter((task) => task.id !== id);
              await AsyncStorage.setItem("tasks", JSON.stringify(parsedTasks));
              loadCompletedTasks();
            } catch (error) {
              console.error("Error deleting task:", error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <View style={styles.iconsContainer}>
        {/* Optionally, you can add an 'Undo' option */}
        <TouchableOpacity
          onPress={() => deleteTask(item.id)}
          style={styles.iconButton}
        >
          <Ionicons name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {completedTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No completed tasks.</Text>
        </View>
      ) : (
        <FlatList
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default CompletedTasksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskTitle: {
    fontSize: 16,
    flex: 1,
    textDecorationLine: "line-through",
    color: "#777",
  },
  iconsContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
  },
});
