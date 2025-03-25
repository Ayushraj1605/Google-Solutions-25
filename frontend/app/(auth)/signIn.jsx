import { StyleSheet, Text, View, Alert, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/formField';
import CustomButton from '../../components/customButton';
import { Link, router } from 'expo-router';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

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
      console.log(type);
      const endpoint =
        type === 'org'
          ? 'https://cloudrunservice-254131401451.us-central1.run.app/org/login'
          : 'https://cloudrunservice-254131401451.us-central1.run.app/user/login';
      const { data, status } = await axios.post(endpoint, form);
      
      if (status === 200) {
        await AsyncStorage.multiSet([
          ['TOKEN', `${type} ${data.token}`],
          ['ID', data.userId],
          ['EMAIL', data.email],
          ['USERNAME', data.username],
        ]);
        console.log('Token and ID saved successfully!');
        console.log('Data:', data);
        Alert.alert('Success', 'Signed in successfully!');
        router.replace(type === 'org' ? '/homeOrg' : '/home');
      }
      else {
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
      <StatusBar style="dark" />
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>ES</Text>
              </View>
              <Text style={styles.appName}>Eco-Sankalp</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.heading}>Welcome Back</Text>

              <FormField
                title="Email"
                value={form.email}
                handleChangeText={e => handleChange('email', e)}
                otherStyles="mt-3"
                placeholder="Enter your email"
                keyboardType="email-address"
              />

              <FormField
                title="Password"
                value={form.password}
                handleChangeText={e => handleChange('password', e)}
                placeholder="Enter your password"
                otherStyles="mt-2"
                secureTextEntry
              />

              <TouchableOpacity>
                <Text style={styles.forgotPassword}>
                  <Link href="/forgotpassword">Forgot Password?</Link>
                </Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <CustomButton
                  title="Sign In"
                  handlePress={() => handleLogin('user')}
                  containerStyles="mt-5 bg-options"
                  isLoading={isSubmitting}
                />
              </View>


              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>
              <View style={{ alignItems: 'center' }}>
                <CustomButton
                  title="Sign In as Organization"
                  handlePress={() => handleLogin('org')}
                  containerStyles="mt-3 bg-smallText"
                  isLoading={isSubmitting}
                />
              </View>

              <View style={styles.signUpContainer}>
                <Text style={styles.secondaryText}>New to Eco-Sankalp? </Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>
                    <Link href="/signUp">Create Account</Link>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 60, 40, 0.85)', // Dark green overlay with transparency
  },
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginTop: 8,
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 10,
  },
  forgotPassword: {
    marginTop: 6,
    alignSelf: 'flex-end',
    color: '#4CAF50',
    fontWeight: '500',
    fontSize: 13,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryText: {
    color: '#666',
    fontSize: 13,
  },
  linkText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 13,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 13,
  },
});