import React from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { useRouter } from "expo-router";

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomButton;

export function AddButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={stylesAddButton.floatingButton}
      onPress={() => router.push("/add")}
    >
      <AntDesign name="plus" size={30} color={"#FFFFFF"} />
    </TouchableOpacity>
  );
}

const stylesAddButton = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: "#9395D3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
