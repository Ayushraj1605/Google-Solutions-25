import { Text, View } from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import FormField from '../../components/formField';
import CustomButton from '../../components/customButton';
import { Link, router } from 'expo-router';
import axios from 'axios';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback(
    (key, value) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const navigateToOrgSignUp = useCallback(() => {
    router.replace('/signUpOrg');
  }, []);

  const validateForm = useCallback(() => {
    const { name, email, password, confirmPassword } = form;

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
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
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://cloudrunservice-254131401451.us-central1.run.app/user/signup",
        {
          email: form.email,
          password: form.password,
          username: form.name,
        }
      );

      if (response.status === 200) {
        alert("Sign up successful!");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
        router.replace("/home");
      } else {
        alert("Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please check your network connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm]);

  const formFields = useMemo(
    () => [
      {
        key: 'name',
        title: 'Name',
        placeholder: 'Enter your name',
        value: form.name,
        secureTextEntry: false,
      },
      {
        key: 'email',
        title: 'Email',
        placeholder: 'Enter your email',
        value: form.email,
        keyboardType: 'email-address',
        secureTextEntry: false,
      },
      {
        key: 'password',
        title: 'Password',
        placeholder: 'Enter your password',
        value: form.password,
        secureTextEntry: true,
      },
      {
        key: 'confirmPassword',
        title: 'Confirm Password',
        placeholder: 'Confirm your password',
        value: form.confirmPassword,
        secureTextEntry: true,
      },
    ],
    [form]
  );

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full flex-1 justify-center items-center px-4 py-6">
          <Text className="text-5xl font-semibold mt-10 self-start">Sign Up</Text>

          {formFields.map(({ key, title, placeholder, value, secureTextEntry, keyboardType }) => (
            <FormField
              key={key}
              title={title}
              placeholder={placeholder}
              value={value}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              handleChangeText={(val) => handleInputChange(key, val)}
              otherStyles="mt-3"
            />
          ))}

          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles="mt-7 bg-options"
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center items-center mt-9">
            <Text className="text-secondary">ALREADY HAVE AN ACCOUNT? </Text>
            <Text className="text-success font-semibold">
              <Link href="/signIn">SIGN IN</Link>
            </Text>
          </View>

          <View className="flex-row justify-center items-center mt-6">
            <View className="h-[1px] bg-gray-300 flex-1"></View>
            <Text className="mx-3 text-gray-500">OR</Text>
            <View className="h-[1px] bg-gray-300 flex-1"></View>
          </View>

          <CustomButton
            title="Sign Up as Organization"
            handlePress={navigateToOrgSignUp}
            containerStyles="mt-10 bg-smallText"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
