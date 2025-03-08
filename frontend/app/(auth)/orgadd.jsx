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
    latitude: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleInputChange = useCallback(
    (key, value) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleLocationSelect = useCallback((location) => {
    if (location) {
      setForm((prev) => ({
        ...prev,
        longitude: location.longitude.toString(),
        latitude: location.latitude.toString(),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        longitude: '',
        latitude: '',
      }));
    }
  }, []);

  const validateForm = useCallback(() => {
    const { address, longitude, latitude } = form;

    if (!address.trim()) {
      alert('Address is required');
      return false;
    }

    if (!longitude || !latitude) {
      alert('Please select location on the map');
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
        latitude: form.latitude,
      };

      console.log('Complete signup data:', completeSignupData);

      const response = await axios.post(
        'https://cloudrunservice-254131401451.us-central1.run.app/org/signup',
        completeSignupData
      );

      if (response.status === 200) {
        await AsyncStorage.removeItem('orgSignupData');
        alert('Signup completed successfully!');
        router.replace('/homeOrg');
      } else {
        alert('Failed to complete signup. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm, router]);

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full flex-1 px-4 py-6">
          <Text className="text-4xl font-bold mt-6 mb-4 text-gray-800">
            Complete Signup
          </Text>

          <FormField
            title="Address"
            value={form.address}
            handleChangeText={(val) => handleInputChange('address', val)}
            placeholder="Enter your organization address"
            otherStyles="mt-4"
            multiline
            numberOfLines={3}
          />

          <CustomButton
            title={
              form.longitude && form.latitude
                ? 'Change Location'
                : 'Select Location'
            }
            handlePress={() => setShowMap((prev) => !prev)}
            containerStyles="mt-6 bg-blue-600"
          />

          {showMap && (
            <View className="w-full mt-6">
              <Text className="text-lg font-semibold mb-3 text-gray-700">
                Mark your location
              </Text>

              <View className="w-full h-64 rounded-xl overflow-hidden border border-gray-300">
                <Maps
                  onLocationSelect={handleLocationSelect}
                  containerStyle={{ height: '100%', width: '100%' }}
                />
              </View>

              <View className="flex-row justify-between mt-4">
                <CustomButton
                  title="Unmark Location"
                  handlePress={() =>
                    handleLocationSelect(null)
                  }
                  containerStyles="flex-1 bg-red-500 mr-2"
                />
                <CustomButton
                  title="Confirm Location"
                  handlePress={() => alert('Location marked')}
                  containerStyles="flex-1 bg-green-600 ml-2"
                />
              </View>

              {form.longitude && form.latitude ? (
                <View className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <Text className="text-sm text-gray-600">
                    Longitude: {form.longitude}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Latitude: {form.latitude}
                  </Text>
                </View>
              ) : null}
            </View>
          )}

          <CustomButton
            title="Complete Signup"
            handlePress={handleSubmit}
            containerStyles="mt-10 bg-options"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrgAdd;
