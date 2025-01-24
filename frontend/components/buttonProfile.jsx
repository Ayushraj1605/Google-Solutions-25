import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react';
import '../global.css';

const ButtonProfile = ({ title, handlePress }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow">
      <Text className="flex-1 text-lg">{title}</Text>
      <Text className="text-2xl text-gray-400">›</Text>
    </TouchableOpacity>
  )
}

export default ButtonProfile;
