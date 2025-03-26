import { View } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants'; // Ensure icons are imported correctly
import { TextInput } from 'react-native-paper';

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
    <View className={`space-y-2 w-full black-900 ${otherStyles}`}>
      <TextInput
        mode="outlined" // Outlined input style
        
        label={title} // Use dynamic label
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#D9D9D9"
        textColor='#000000'
        onChangeText={handleChangeText}
        secureTextEntry={
          (title === 'Password' || title === 'Confirm Password') && !showPassword
        } // Toggle secure entry for passwords
        right={
          (title === 'Password' || title === 'Confirm Password') && (
            <TextInput.Icon
              icon={!showPassword ? icons.eye : icons.eyeHide} // Toggle between eye and eyeHide icons
              onPress={() => setShowPassword(!showPassword)} // Toggle visibility
            />
          )
        } // Icon inside the input box
        style={{
          fontSize: 16,
          fontWeight: '600',
          width: '100%',
          height: 56, // Input height
          backgroundColor: '#F9F9F9', // Input background color
        }}
      />
    </View>
  );
};

export default FormField;