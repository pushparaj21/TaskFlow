// app/index.tsx
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
import { useFocusEffect } from "expo-router";
import uuid from "react-native-uuid";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TaskListScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
      setTasks(parsedTasks.filter((task) => !task.isCompleted));
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const markAsDone = async (id: string) => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      let parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
      parsedTasks = parsedTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: true } : task
      );
      await AsyncStorage.setItem("tasks", JSON.stringify(parsedTasks));
      loadTasks();
    } catch (error) {
      console.error("Error marking task as done:", error);
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
              loadTasks();
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
        <TouchableOpacity
          onPress={() => router.push(`/edit/${item.id}`)}
          style={styles.iconButton}
        >
          <Ionicons name="pencil" size={20} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => markAsDone(item.id)}
          style={styles.iconButton}
        >
          <Ionicons name="checkmark-done" size={20} color="green" />
        </TouchableOpacity>
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
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks available. Add some!</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.completedButton}
        onPress={() => router.push("/doneList")}
      >
        <Ionicons name="checkmark-done-circle" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default TaskListScreen;

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
  },
  iconsContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: "#2196F3",
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  completedButton: {
    backgroundColor: "green",
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 100,
    right: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
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
