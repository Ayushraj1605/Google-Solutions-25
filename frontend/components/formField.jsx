import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants'; // Ensure icons are imported correctly

const FormField = ({ 
  title, 
  value, 
  placeholder, 
  handleChangeText, 
  otherStyles, 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  return (
    <View className={`space-y-2 w-full ${otherStyles}`}>
      {/* Title */}
      <Text className="text-base font-medium py-2">{title}</Text>
      
      {/* Input Container */}
      <View className="border w-full h-16 px-4 rounded-2xl items-center flex-row">
        <TextInput
          className="flex-1 font-semibold"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#D9D9D9"
          onChangeText={handleChangeText}
          secureTextEntry={(title === 'Password' || title === 'Confirm Password') && !showPassword}
          // {...props}
        />
        
        {/* Show/Hide Password Icon */}
        {(title === 'Password' || title === 'Confirm Password') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image 
              source={!showPassword ? icons.eye : icons.eyeHide} 
              className="w-6 h-6"
              resizeMode="contain" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
