import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router'; // Expo Router for navigation
import FormField from '../../components/formField'; // Import custom FormField component
import CustomButton from '../../components/customButton'; // Import custom CustomButton component
import '../../global.css'; // Tailwind CSS with NativeWind

const SignUpOrg = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gstNumber: '', // Add GST Number to the form state
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const Submit = () => {
    // Basic validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.gstNumber) {
      alert('All fields are required, including GST Number!');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setIsSubmitting(true);

    // Form submission logic here
    console.log('Form submitted:', form);
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex-1 justify-center items-center min-h-full px-4 my-3">
          {/* Heading */}
          <Text className="text-5xl font-semibold self-start">Sign Up</Text>

          {/* Name Field */}
          <FormField
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-7"
            placeholder="Enter name here"
          />

          {/* Email Field */}
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-2"
            placeholder="Enter email here"
            keyboardType="email-address"
          />

          {/* Password Field */}
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder="Enter password here"
            otherStyles="mt-2"
            secureTextEntry={true}
          />

          {/* Confirm Password Field */}
          <FormField
            title="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            placeholder="Confirm your password"
            otherStyles="mt-2"
            secureTextEntry={true}
          />

          {/* GST Number Field */}
          <FormField
            title="GST Number"
            value={form.gstNumber} // Bind to form.gstNumber
            handleChangeText={(e) => setForm({ ...form, gstNumber: e })} // Update form state
            placeholder="Enter your GST number here"
            otherStyles="mt-2"
          />

          {/* Sign Up Button */}
          <CustomButton
            title="Sign Up"
            handlePress={Submit}
            containerStyles="mt-7 bg-options"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpOrg;
