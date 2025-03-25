import { StyleSheet, Text, View, Alert, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import FormField from '../../components/formField';
import CustomButton from '../../components/customButton';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const SignUpOrg = () => {
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

  const navigateToUserSignUp = useCallback(() => {
    router.replace('/signUp');
  }, []);

  const validateForm = useCallback(() => {
    const { name, email, password, confirmPassword, gstNumber } = form;

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !gstNumber.trim()
    ) {
      Alert.alert('Validation Error', 'All fields are required!');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match!');
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
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm, router]);

  const formFields = useMemo(
    () => [
      {
        key: 'name',
        title: 'Organization Name',
        placeholder: 'Enter organization name',
        value: form.name,
        secureTextEntry: false,
      },
      {
        key: 'email',
        title: 'Email',
        placeholder: 'Enter organization email',
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
        placeholder: 'Enter organization GST number',
        value: form.gstNumber,
        secureTextEntry: false,
      },
    ],
    [form]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>ES</Text>
              </View>
              <Text style={styles.appName}>Eco-Sankalp</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.heading}>Organization Account</Text>
              <Text style={styles.subheading}>Join as a sustainability partner</Text>

              {formFields.map(({ key, title, placeholder, value, secureTextEntry, keyboardType }) => (
                <FormField
                  key={key}
                  title={title}
                  placeholder={placeholder}
                  value={value}
                  secureTextEntry={secureTextEntry}
                  keyboardType={keyboardType}
                  handleChangeText={(val) => handleInputChange(key, val)}
                  otherStyles="mt-2"
                />
              ))}
              <View style={{ alignItems: 'center' }}>
                <CustomButton
                  title="Continue"
                  handlePress={handleSubmit}
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
                  title="Sign Up as Individual"
                  handlePress={navigateToUserSignUp}
                  containerStyles="mt-3 bg-smallText"
                />
              </View>

              <View style={styles.signInContainer}>
                <Text style={styles.secondaryText}>Already have an account? </Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>
                    <Link href="/signIn">Sign In</Link>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUpOrg;

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
  scrollView: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 10,
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
    marginHorizontal: 20,
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
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  signInContainer: {
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