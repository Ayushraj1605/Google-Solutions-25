import { StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import FormField from '../../components/formField';
import CustomButton from '../../components/customButton';
import { Link, router } from 'expo-router';
import axios from 'axios';


const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to validate form fields
  const validateForm = () => {
    if (!form.email.trim() || !form.password.trim()) {
      alert('Error', 'Please enter both email and password.');
      return false;
    }
    return true;
  };

  // Function to handle form submission
  const Submit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // console.log()
    try {
      const response = await axios.post(
        'https://cloudrunservice-254131401451.us-central1.run.app/user/login', // Replace with your actual API endpoint
        {
            "email": form.email,
            "password": form.password
        });
      // const response = {
      //   data: {
      //     email: "ayushrajaayatha@gmail.com",
      //     password: "passwordhaiye",
      //     token:"maiaayahutokendene",
      //   },
        
      //   status: 200
      // };
      
      // Now you can access the status like this:
      console.log(response.status); // Outputs: 200
      console.log(response.data.userId);
      
      // Handle successful response
      if (response.status === 200) {
        alert('Success', 'Signed in successfully!');
        // Save token to AsyncStorage
        const _storeData = async () => {
          try {
            await AsyncStorage.setItem('TOKEN', "user "+response.data.token); // Save token with key 'TASK'
            await AsyncStorage.setItem('ID',response.data.userId);
            console.log('Token saved successfully!');
          } catch (error) {
            console.error('Error saving data to AsyncStorage:', error);
          }
        };
      
        await _storeData(); // Invoke the function to save the token
        router.replace('/home'); // Navigate to the home screen
      } else {
        alert('Error', response.data.message || 'Invalid credentials.');
      }
    } catch (error) {
      // Handle errors
      console.error('Error signing in:', error);
      alert(
        'Error',
        error.response?.data?.message || 'Something went wrong. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm]);

  // Function to handle form submission
  const SubmitOrg = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // console.log()
    try {
      console.log(form.email, form.password);
      const response = await axios.post(
        'https://cloudrunservice-254131401451.us-central1.run.app/org/login', // Replace with your actual API endpoint
        {
            "email": form.email,
            "password": form.password
        });
      // const response = {
      //   data: {
      //     email: "ayushrajaayatha@gmail.com",
      //     password: "passwordhaiye",
      //     token:"maiaayahutokendene",
      //   },
      //   status: 200
      // };
      
      // Now you can access the status like this:
      console.log(response.status); // Outputs: 200
      
      // Handle successful response
      if (response.status === 200) {
        alert('Success', 'Signed in successfully!');
        // Save token to AsyncStorage
        const _storeData = async () => {
          try {
            await AsyncStorage.setItem('TOKEN', "org "+response.data.token); // Save token with key 'TASK'
            await AsyncStorage.setItem('ID',response.data.userId);
            console.log('Token saved successfully!');
          } catch (error) {
            console.error('Error saving data to AsyncStorage:', error);
          }
        };
      
        await _storeData(); // Invoke the function to save the token
        router.replace('/homeOrg'); // Navigate to the home screen
      } else {
        alert('Error', response.data.message || 'Invalid credentials.');
      }
    } catch (error) {
      // Handle errors
      console.error('Error signing in:', error);
      alert(
        'Error',
        error.response?.data?.message || 'Something went wrong. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm]);



  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex-1 justify-center items-center min-h-full px-4 my-6">
          {/* Page Heading */}
          <Text className="text-5xl font-bold mt-10 self-start">Sign In</Text>

          {/* Email Input Field */}
          <FormField
            title="E-mail"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            placeholder="Enter email here"
            keyboardType="email-address"
          />

          {/* Password Input Field */}
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder="Enter password here"
            otherStyles="mt-3"
            secureTextEntry={true}
          />

          {/* Forgot Password Link */}
          <Text className="text-right mt-2 text-success self-end">
            <Link href='/forgotpassword'> Forgot Password? </Link>
          </Text>

          {/* Sign In Button */}
          <CustomButton
            title="Sign In"
            handlePress={Submit}
            containerStyles="mt-10 bg-options"
            isLoading={isSubmitting}
          />

          {/* Sign Up Prompt */}
          <View className="flex-row justify-center items-center mt-9">
            <Text className="text-secondary">DON'T HAVE AN ACCOUNT? </Text>
            <Text className="text-success font-semibold">
              <Link href="/signUp">SIGN UP</Link>
            </Text>
          </View>

          {/* Divider */}
          <View className="flex-row justify-center items-center mt-6">
            <View className="h-[1px] bg-gray-300 flex-1"></View>
            <Text className="mx-3 text-gray-500">OR</Text>
            <View className="h-[1px] bg-gray-300 flex-1"></View>
          </View>

          {/* Organization Sign In Button */}
          <CustomButton
            title="Sign In as Organization"
            handlePress={SubmitOrg}
            containerStyles="mt-10 bg-smallText"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;