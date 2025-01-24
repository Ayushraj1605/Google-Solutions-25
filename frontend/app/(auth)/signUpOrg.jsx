import React, { useState, useCallback } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormField from '../../components/formField';
import CustomButton from '../../components/customButton';
import '../../global.css';

const SignUpOrg = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gstNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const { name, email, password, confirmPassword, gstNumber } = form;

    if (!name || !email || !password || !confirmPassword || !gstNumber) {
      alert('All fields are required!');
      return false;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return false;
    }

    return true;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Store partial signup data
      await AsyncStorage.setItem('orgSignupData', JSON.stringify(form));
      
      // Navigate to address entry page
      router.push("/orgadd");
    } catch (error) {
      console.error("Error saving signup data:", error);
      alert("Failed to proceed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm, router]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex-1 justify-center items-center min-h-full px-4 my-3">
          <Text className="text-5xl font-semibold self-start">Sign Up</Text>

          <FormField
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-7"
            placeholder="Enter name here"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-2"
            placeholder="Enter email here"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder="Enter password here"
            otherStyles="mt-2"
            secureTextEntry={true}
          />

          <FormField
            title="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            placeholder="Confirm your password"
            otherStyles="mt-2"
            secureTextEntry={true}
          />

          <FormField
            title="GST Number"
            value={form.gstNumber}
            handleChangeText={(e) => setForm({ ...form, gstNumber: e })}
            placeholder="Enter your GST number here"
            otherStyles="mt-2"
          />

          <CustomButton
            title="NEXT"
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