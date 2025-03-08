import React, { useState, useCallback, useMemo } from 'react';
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

  const handleInputChange = useCallback(
    (key, value) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const validateForm = useCallback(() => {
    const { name, email, password, confirmPassword, gstNumber } = form;

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !gstNumber.trim()
    ) {
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
      await AsyncStorage.setItem('orgSignupData', JSON.stringify(form));
      router.push('/orgadd');
    } catch (error) {
      console.error('Error saving signup data:', error);
      alert('Failed to proceed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm, router]);

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
      {
        key: 'gstNumber',
        title: 'GST Number',
        placeholder: 'Enter your GST number',
        value: form.gstNumber,
        secureTextEntry: false,
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
          <Text className="text-5xl font-semibold mt-10 self-start">
            Sign Up
          </Text>

          {formFields.map(
            ({ key, title, placeholder, value, secureTextEntry, keyboardType }) => (
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
            )
          )}

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
