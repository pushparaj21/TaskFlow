import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
const HomeTabs = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name={"list-ul"}
              color={focused ? "#F5AC23" : "gray"}
              size={30}
            />
          ),
          headerTitle: "List",
        }}
      />
      <Tabs.Screen
        name="doneList"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={"checkmark-done-circle-outline"}
              color={focused ? "#F5AC23" : "gray"}
              size={30}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default HomeTabs;
