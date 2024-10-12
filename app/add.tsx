import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "@/type";
import uuid from "react-native-uuid";
import { useRouter } from "expo-router";

const AddTaskScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const saveTask = async () => {
    if (title.trim() === "") {
      Alert.alert("Validation", "Task title cannot be empty.");
      return;
    }

    const newTask: Task = {
      id: uuid.v4().toString(),
      title,
      description,
      isCompleted: false,
    };

    try {
      const existingTasks = await AsyncStorage.getItem("tasks");
      const tasks: Task[] = existingTasks ? JSON.parse(existingTasks) : [];
      tasks.push(newTask);
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      router.back();
    } catch (error) {
      console.error("Error saving task:", error);
      Alert.alert("Error", "There was an error saving the task.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <TextInput
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textArea]}
        multiline
      />
      <Button title="Add Task" onPress={saveTask} />
    </KeyboardAvoidingView>
  );
};

export default AddTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
  },
});
