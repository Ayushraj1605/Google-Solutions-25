import React, { useState, useCallback } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FormField from '../../components/formField';
import CustomButton from '../../components/customButton';
import Maps from '../../components/maps';
import '../../global.css';

const OrgAdd = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    address: '',
    longitude: '',
    latitude: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleLocationSelect = useCallback((location) => {
    if (location) {
      setForm(prevForm => ({
        ...prevForm,
        longitude: location.longitude.toString(),
        latitude: location.latitude.toString()
      }));
    } else {
      setForm(prevForm => ({
        ...prevForm,
        longitude: '',
        latitude: ''
      }));
    }
  }, []);

  const validateForm = useCallback(() => {
    const { address, longitude, latitude } = form;

    if (!address) {
      alert('Address is required');
      return false;
    }

    if (!longitude || !latitude) {
      alert('Please select location on map');
      return false;
    }

    return true;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const signupDataString = await AsyncStorage.getItem('orgSignupData');
      if (!signupDataString) {
        throw new Error('No signup data found');
      }

      const signupData = JSON.parse(signupDataString);

      const completeSignupData = {
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
        GST: signupData.gstNumber,
        Address: form.address,
        longitude: form.longitude,
        latitude: form.latitude
      };
      console.log("Complete signup data:", completeSignupData);
      const response = await axios.post(
        "https://cloudrunservice-254131401451.us-central1.run.app/org/signup",
        completeSignupData
      );

      if (response.status === 200) {
        await AsyncStorage.removeItem('orgSignupData');
        alert("Signup completed successfully!");
        router.replace("/homeOrg");
      } else {
        alert("Failed to complete signup. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm, router]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex-1 justify-center items-center min-h-full px-4 my-3">
          <Text className="text-5xl font-semibold self-start">Complete Signup</Text>

          <FormField
            title="Address"
            value={form.address}
            handleChangeText={(e) => setForm({ ...form, address: e })}
            otherStyles="mt-7"
            placeholder="Enter your organization address"
            multiline={true}
            numberOfLines={3}
          />

          <CustomButton
            title={form.longitude && form.latitude 
              ? "Change Location" 
              : "Select Location"}
            handlePress={() => setShowMap(!showMap)}
            containerStyles="mt-4 bg-blue-500"
          />

          {showMap && (
            <View className="w-full h-64 mt-4">
              <Maps 
                onLocationSelect={handleLocationSelect}
                containerStyle={{ height: 250, width: '100%' }}
              />
            </View>
          )}

          <CustomButton
            title="Complete Signup"
            handlePress={handleSubmit}
            containerStyles="mt-7 bg-options"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrgAdd;