// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "@/type";

const TASKS_KEY = "tasks";

export const getTasks = async (): Promise<Task[]> => {
  try {
    const storedTasks = await AsyncStorage.getItem(TASKS_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

export const addTask = async (task: Task): Promise<void> => {
  const tasks = await getTasks();
  tasks.push(task);
  await saveTasks(tasks);
};

export const updateTask = async (updatedTask: Task): Promise<void> => {
  let tasks = await getTasks();
  tasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  await saveTasks(tasks);
};

export const deleteTask = async (id: string): Promise<void> => {
  let tasks = await getTasks();
  tasks = tasks.filter((task) => task.id !== id);
  await saveTasks(tasks);
};
