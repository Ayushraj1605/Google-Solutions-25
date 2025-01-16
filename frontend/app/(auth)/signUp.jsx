import { Text, View } from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import FormField from '../../components/formField';
import CustomButton from '../../components/customButton';
import { Link, router } from 'expo-router';
import axios from 'axios';

const SignUp = () => {
  // State
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleInputChange = useCallback(
    (key, value) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [setForm]
  );

  const OnClickHandler = useCallback(() => {
    router.replace('/signUpOrg');
  }, []);

  const validateForm = useCallback(() => {
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
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
        "https://cloudrunservice-254131401451.us-central1.run.app/user/signup",
        {
          "email": form.email,
          "password": form.password,
          "username": form.name
        }
      );

      console.log("Response from API:", response.data);

      if (response.status === 200) {
        alert("Sign up successful!");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
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

  // Memoized fields for better performance
  const formFields = useMemo(
    () => [
      {
        title: 'Name',
        value: form.name,
        placeholder: 'Enter name here',
        secureTextEntry: false,
        key: 'name',
      },
      {
        title: 'Email',
        value: form.email,
        placeholder: 'Enter email here',
        keyboardType: 'email-address',
        secureTextEntry: false,
        key: 'email',
      },
      {
        title: 'Password',
        value: form.password,
        placeholder: 'Enter password here',
        secureTextEntry: true,
        key: 'password',
      },
      {
        title: 'Confirm Password',
        value: form.confirmPassword,
        placeholder: 'Confirm your password',
        secureTextEntry: true,
        key: 'confirmPassword',
      },
    ],
    [form]
  );

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex-1 justify-center items-center min-h-full px-4 my-6">
          {/* Heading */}
          <Text className="text-5xl font-semibold mt-10 self-start">Sign Up</Text>

          {/* Form Fields */}
          {formFields.map((field) => (
            <FormField
              key={field.key}
              title={field.title}
              value={field.value}
              handleChangeText={(value) => handleInputChange(field.key, value)}
              placeholder={field.placeholder}
              otherStyles="mt-2"
              secureTextEntry={field.secureTextEntry}
              keyboardType={field.keyboardType}
            />
          ))}

          {/* Sign Up Button */}
          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles="mt-7 bg-options"
            isLoading={isSubmitting}
          />

          {/* Already Have an Account */}
          <View className="flex-row justify-center items-center mt-9">
            <Text className="text-secondary">ALREADY HAVE AN ACCOUNT? </Text>
            <Text className="text-success font-semibold">
              <Link href="/signIn">SIGN IN</Link>
            </Text>
          </View>

          {/* Divider */}
          <View className="flex-row justify-center items-center mt-6">
            <View className="h-[1px] bg-gray-300 flex-1"></View>
            <Text className="mx-3 text-gray-500">OR</Text>
            <View className="h-[1px] bg-gray-300 flex-1"></View>
          </View>

          {/* Sign Up as Organization */}
          <CustomButton
            title="Sign Up as Organization"
            handlePress={OnClickHandler}
            containerStyles="mt-10 bg-smallText"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
