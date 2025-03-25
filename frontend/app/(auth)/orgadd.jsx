import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Animated, TouchableOpacity, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import FormField from '../../components/formField';
import CustomButton from '../../components/customButton';
import Maps from '../../components/maps';
import { StatusBar } from 'expo-status-bar';

const OrgAdd = () => {
  const [form, setForm] = useState({
    address: '',
    longitude: '',
    latitude: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const mapHeight = useRef(new Animated.Value(0)).current;
  
  // Add loading state for API calls
  const [isLoading, setIsLoading] = useState(false);
  
  // Add validation feedback
  const [errors, setErrors] = useState({});
  
  // Success state for animation
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Animation for map container
  useEffect(() => {
    Animated.timing(mapHeight, {
      toValue: showMap ? (mapExpanded ? 400 : 250) : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showMap, mapExpanded]);

  const handleInputChange = useCallback(
    (key, value) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      // Clear error when field is edited
      if (errors[key]) {
        setErrors(prev => ({ ...prev, [key]: null }));
      }
    },
    [errors]
  );

  const handleLocationSelect = useCallback((location) => {
    if (location) {
      setForm((prev) => ({
        ...prev,
        longitude: location.longitude.toString(),
        latitude: location.latitude.toString(),
      }));
      setLocationConfirmed(false);
      setErrors(prev => ({ ...prev, location: null }));
    } else {
      setForm((prev) => ({
        ...prev,
        longitude: '',
        latitude: '',
      }));
      setLocationConfirmed(false);
    }
  }, []);

  const validateForm = useCallback(() => {
    const { address, longitude, latitude } = form;
    let newErrors = {};
    let isValid = true;

    if (!address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!longitude || !latitude) {
      newErrors.location = 'Please select and confirm location on the map';
      isValid = false;
    } else if (!locationConfirmed) {
      newErrors.location = 'Please confirm your selected location';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [form, locationConfirmed]);

  const confirmLocation = useCallback(() => {
    if (form.longitude && form.latitude) {
      setLocationConfirmed(true);
      setShowMap(false);
    }
  }, [form.longitude, form.latitude]);

  const clearLocation = useCallback(() => {
    handleLocationSelect(null);
  }, [handleLocationSelect]);

  const toggleMapExpansion = useCallback(() => {
    setMapExpanded(!mapExpanded);
  }, [mapExpanded]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsLoading(true);

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
        
        // Show success message with animation
        setIsSuccess(true);
        setTimeout(() => {
          router.replace('/signIn');
        }, 1500);
      } else {
        setErrors({ form: 'Failed to complete signup. Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ form: error.message || 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }, [form, validateForm]);

  const toggleMap = useCallback(() => {
    setShowMap(!showMap);
    if (showMap) {
      setMapExpanded(false);
    }
  }, [showMap]);
  
  // Custom map control button component
  const MapControlButton = ({ onPress, icon, label, color, backgroundColor }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
        flex: 1,
      }}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={{ 
        color: color, 
        fontWeight: '600', 
        fontSize: 13,
        marginLeft: 6
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000' }} 
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        
        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          </View>
        )}
        
        {/* Success Overlay */}
        {isSuccess && (
          <View style={styles.loadingOverlay}>
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark" size={32} color="#fff" />
              </View>
              <Text style={styles.successTitle}>Success!</Text>
              <Text style={styles.successMessage}>Organization registered successfully</Text>
            </View>
          </View>
        )}
        
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
              <View style={styles.titleRow}>
                <TouchableOpacity 
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={20} color="#2E7D32" />
                </TouchableOpacity>
                <Text style={styles.heading}>Location Details</Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  Please provide your organization's location details to complete the registration.
                </Text>
              </View>

              <FormField
                title="Business Address"
                value={form.address}
                handleChangeText={(val) => handleInputChange('address', val)}
                placeholder="Enter your complete business address"
                otherStyles="mt-2"
                multiline
                numberOfLines={3}
                error={errors.address}
              />

              <View style={styles.locationSection}>
                <View style={styles.locationHeader}>
                  <Text style={styles.locationTitle}>
                    {locationConfirmed ? "Location Selected" : "Map Location"}
                  </Text>
                  
                  <TouchableOpacity
                    onPress={toggleMap}
                    style={[
                      styles.locationToggleButton,
                      locationConfirmed ? styles.locationConfirmedButton : styles.locationSelectButton
                    ]}
                  >
                    <MaterialIcons 
                      name={locationConfirmed ? "location-on" : "add-location"} 
                      size={18} 
                      color={locationConfirmed ? "#2E7D32" : "#1976D2"} 
                    />
                    <Text style={[
                      styles.locationToggleText,
                      locationConfirmed ? styles.locationConfirmedText : styles.locationSelectText
                    ]}>
                      {locationConfirmed 
                        ? "Change Location" 
                        : form.longitude && form.latitude 
                          ? "Adjust Location" 
                          : "Select Location"}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {errors.location && (
                  <Text style={styles.errorText}>{errors.location}</Text>
                )}
                
                {locationConfirmed && form.longitude && form.latitude && (
                  <View style={styles.confirmedLocationCard}>
                    <View style={styles.confirmedLocationHeader}>
                      <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                      <Text style={styles.confirmedLocationTitle}>Location confirmed</Text>
                    </View>
                    <View style={styles.coordinatesRow}>
                      <Text style={styles.coordinateText}>Longitude: {parseFloat(form.longitude).toFixed(6)}</Text>
                      <Text style={styles.coordinateText}>Latitude: {parseFloat(form.latitude).toFixed(6)}</Text>
                    </View>
                  </View>
                )}

                <Animated.View style={[{ height: mapHeight }, styles.mapContainer]}>
                  <View style={styles.mapWrapper}>
                    <Maps
                      onLocationSelect={handleLocationSelect}
                      containerStyle={{ height: '100%', width: '100%' }}
                      initialLocation={form.longitude && form.latitude ? {
                        longitude: parseFloat(form.longitude),
                        latitude: parseFloat(form.latitude)
                      } : undefined}
                    />
                  </View>
                  
                  <View style={styles.mapControlsRow}>
                    <MapControlButton
                      onPress={clearLocation}
                      icon={<FontAwesome5 name="trash-alt" size={14} color="#D32F2F" />}
                      label="Clear"
                      color="#D32F2F"
                      backgroundColor="#FFEBEE"
                    />
                    
                    <MapControlButton
                      onPress={toggleMapExpansion}
                      icon={<MaterialIcons name={mapExpanded ? "fullscreen-exit" : "fullscreen"} size={16} color="#0D47A1" />}
                      label={mapExpanded ? "Compact" : "Expand"}
                      color="#0D47A1"
                      backgroundColor="#E3F2FD"
                    />
                    
                    <MapControlButton
                      onPress={confirmLocation}
                      icon={<Ionicons name="checkmark-circle" size={16} color="#2E7D32" />}
                      label="Confirm"
                      color="#2E7D32"
                      backgroundColor="#E8F5E9"
                    />
                  </View>
                </Animated.View>
              </View>
              
              {errors.form && (
                <View style={styles.formErrorCard}>
                  <Text style={styles.formErrorText}>{errors.form}</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Complete Registration"
                  handlePress={handleSubmit}
                  containerStyles="bg-options "
                  isLoading={isSubmitting}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OrgAdd;

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
    backgroundColor: 'rgba(0, 60, 40, 0.85)',
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
  },
  infoCard: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoText: {
    color: '#2E7D32',
    fontSize: 14,
  },
  locationSection: {
    marginTop: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationConfirmedButton: {
    backgroundColor: '#E8F5E9',
  },
  locationSelectButton: {
    backgroundColor: '#E3F2FD',
  },
  locationToggleText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 13,
  },
  locationConfirmedText: {
    color: '#2E7D32',
  },
  locationSelectText: {
    color: '#1976D2',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginBottom: 8,
  },
  confirmedLocationCard: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  confirmedLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmedLocationTitle: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#2E7D32',
  },
  coordinatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinateText: {
    fontSize: 13,
    color: '#555',
  },
  mapContainer: {
    overflow: 'hidden',
    marginTop: 10,
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mapControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  formErrorCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  formErrorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  loadingText: {
    marginTop: 12,
    color: '#555',
    fontSize: 16,
    fontWeight: '500',
  },
  successContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});