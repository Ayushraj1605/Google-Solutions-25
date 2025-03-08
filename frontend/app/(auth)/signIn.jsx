import { StyleSheet, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import FormField from '../../components/formField';
import CustomButton from '../../components/customButton';
import { Link, router } from 'expo-router';
import axios from 'axios';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.email.trim() || !form.password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return false;
    }
    return true;
  };

  const handleLogin = async (type = 'user') => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const endpoint =
        type === 'org'
          ? 'https://cloudrunservice-254131401451.us-central1.run.app/org/login'
          : 'https://cloudrunservice-254131401451.us-central1.run.app/user/login';

      const { data, status } = await axios.post(endpoint, form);

      if (status === 200) {
        await AsyncStorage.multiSet([
          ['TOKEN', `${type} ${data.token}`],
          ['ID', data.userId],
        ]);
        console.log('Token and ID saved successfully!');
        Alert.alert('Success', 'Signed in successfully!');
        router.replace(type === 'org' ? '/homeOrg' : '/home');
      } else {
        Alert.alert('Error', data.message || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Something went wrong. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.heading}>Sign In</Text>

          <FormField
            title="E-mail"
            value={form.email}
            handleChangeText={e => handleChange('email', e)}
            otherStyles="mt-7"
            placeholder="Enter email"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={e => handleChange('password', e)}
            placeholder="Enter password"
            otherStyles="mt-3"
            secureTextEntry
          />

          <Text style={styles.forgotPassword}>
            <Link href="/forgotpassword">Forgot Password?</Link>
          </Text>

          <CustomButton
            title="Sign In"
            handlePress={() => handleLogin('user')}
            containerStyles="mt-10 bg-options"
            isLoading={isSubmitting}
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.secondaryText}>Don't have an account? </Text>
            <Text style={styles.linkText}>
              <Link href="/signUp">Sign Up</Link>
            </Text>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <CustomButton
            title="Sign In as Organization"
            handlePress={() => handleLogin('org')}
            containerStyles="mt-10 bg-smallText"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    paddingVertical: 24,
  },
  container: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 40,
    fontWeight: '700',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  forgotPassword: {
    marginTop: 8,
    alignSelf: 'flex-end',
    color: '#4CAF50',
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 28,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 14,
  },
});
