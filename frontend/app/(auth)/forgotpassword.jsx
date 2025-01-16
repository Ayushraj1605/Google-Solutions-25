import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import FormField from '../../components/formField';
import CustomButton from '../../components/customButton';
import '../../global.css';
import { Link } from 'expo-router';

const ForgotPassword = () => {
  const [email, setEmail] = useState(''); // State for the email input
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage button loading

  const handleSubmit = () => {
    // Validate the email
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    // Simulate API call for forgot password
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Success', `A password reset link has been sent to ${email}.`);
      setEmail(''); // Clear the input field after submission
    }, 2000);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full justify-center min-h-full px-4 my-6">
          {/* Page Heading */}
          <Text className="text-smallText font-bold mt-10">Please enter your email. You will receive a link to create a new password via email.</Text>

          {/* Email Input Field */}
          <FormField
            title="E-mail"
            value={email}
            handleChangeText={(text) => setEmail(text)}
            otherStyles="mt-7"
            placeholder="Enter your email here"
            keyboardType="email-address"
          />

          {/* Submit Button */}
          <CustomButton
            title="Send Reset Link"
            handlePress={handleSubmit}
            containerStyles="mt-10 bg-options"
            isLoading={isSubmitting}
          />

          {/* Back to Sign In */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-secondary">Remembered your password? </Text>
            <Text className="text-success font-semibold">
              <Link href="/signIn">Sign In</Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
