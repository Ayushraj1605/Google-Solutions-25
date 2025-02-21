import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

const CameraButton = ({handlePress}) => {
  // const handlePress = () => {
  //   Alert.alert("Plus sign pressed!", "You can call your function here.");
  // };

  return (
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity
        className="w-[300px] h-[20%] border border-blue-500 border-dashed justify-center items-center rounded-2xl"
        onPress={handlePress}
      >
        <View className="flex justify-center items-center">
          <Text className="text-4xl text-blue-500">+</Text>
          <Text className="text text-blue-100 ">Click Photo of your device </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CameraButton;