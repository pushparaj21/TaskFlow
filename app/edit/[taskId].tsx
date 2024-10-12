import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "@/type";
import { useRouter } from "expo-router";

const EditTaskScreen = () => {
  const { taskId } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  useEffect(() => {
    const loadTask = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("tasks");
        const parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
        const taskToEdit = parsedTasks.find((task) => task.id === taskId);

        if (taskToEdit) {
          setTitle(taskToEdit.title);
          setDescription(taskToEdit.description);
        }
      } catch (error) {
        console.error("Error loading task:", error);
      }
    };

    loadTask();
  }, [taskId]);

  const updateTask = async () => {
    if (!title) {
      Alert.alert("Please enter a task title.");
      return;
    }

    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
      const updatedTasks = parsedTasks.map((task) =>
        task.id === taskId ? { ...task, title, description } : task
      );

      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      router.push("/");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Update Task" onPress={updateTask} />
    </View>
  );
};

export default EditTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
