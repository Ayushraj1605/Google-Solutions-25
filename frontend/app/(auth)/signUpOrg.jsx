import React, { useState, useCallback, useMemo } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router'; // Expo Router for navigation
import FormField from '../../components/formField'; // Import custom FormField component
import CustomButton from '../../components/customButton'; // Import custom CustomButton component
import '../../global.css'; // Tailwind CSS with NativeWind
import axios from 'axios';

const SignUpOrg = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gstNumber: '', // Add GST Number to the form state
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const { name, email, password, confirmPassword, gstNumber } = form;

    if (!name || !email || !password || !confirmPassword || !gstNumber) {
      alert('All fields are required!');
      return false;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return false;
    }

    return true;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return; // Ensure form validation is passed

    setIsSubmitting(true); // Start the loading state
    try {
      // API call with axios
      const response = await axios.post(
        "https://cloudrunservice-254131401451.us-central1.run.app/org/signup",
        {
          "email": form.email,
          "password": form.password,
          "name": form.name,
          "GST":form.gstNumber
        }
      );

      console.log("Response from API:", response.data);

      if (response.status === 200) {
        alert("Sign up successful!");
        setForm({ name: "", email: "", password: "", confirmPassword: "", gstNumber:""});
        // Redirect to the next page
        router.replace("/home");
      }
      else {
        alert("Failed to sign up. Please try again.");
      }
    }
    catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please check your network connection and try again.");
    }
    finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm]);

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
            handlePress={handleSubmit}
            containerStyles="mt-7 bg-options"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpOrg;
