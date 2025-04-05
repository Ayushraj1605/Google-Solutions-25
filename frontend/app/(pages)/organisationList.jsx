import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Platform,
    StatusBar,
    Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrganisationList() {
    // Get URL parameters using useLocalSearchParams hook
    const params = useLocalSearchParams();
    
    // Create a state to store all form data (from previous screens + organization selection)
    const [formData, setFormData] = useState({});
    
    // State management
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [addressDetails, setAddressDetails] = useState("");

    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
    });

    // Extract params when component mounts
    useEffect(() => {
        // Log received params for debugging
        console.log("Received params:", params);
        setDeviceId(params.deviceId);
        setAddressDetails(params.addressDetails || "");
        
        // Initialize form data with the received parameters
        setFormData({
            deviceId: params.deviceId,
            modelNumber: params.modelNumber,
            imei: params.imei,
            purchaseYear: params.purchaseYear,
            description: params.description,
            addressId: params.addressId,
            address: params.addressDetails,
            pinCode:params.pincode,
            status: "Pending",
        // Note: invoice file cannot be passed via URL params
        });
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userId = await AsyncStorage.getItem('ID');
            const userName = await AsyncStorage.getItem('USERNAME');
            const userEmail = await AsyncStorage.getItem('EMAIL');
    
            setUserData({
              id: userId || '',
              name: userName || '',
              email: userEmail || '',
            });
          } catch (error) {
            console.error('Error retrieving user data:', error);
            Alert.alert("Error", "Failed to load user data");
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchUserData();
      }, []);

    // Dummy organizations list - in a real app, this would be fetched from an API
    const organizations = [
        {
            id: "3wPDNwrPP8mvB3rnHSPv",
            name: 'EcoRecycle',
            description: 'Specializing in eco-friendly electronics recycling and refurbishment',
            memberCount: 57,
            category: 'Recycling'
        },
        {
            id: 2,
            name: 'TechDonations',
            description: 'We refurbish and donate electronics to schools and nonprofits',
            memberCount: 124,
            category: 'Education'
        },
        {
            id: 3,
            name: 'GreenTech Solutions',
            description: 'Focused on sustainable disposal and parts recovery',
            memberCount: 36,
            category: 'Sustainability'
        },
    ];

    // Handle organization selection
    const handleSelectOrg = (org) => {
        setSelectedOrg(org);
        setFormData(prev => ({
            ...prev,
            organizationId: org.id,
            organizationName: org.name
        }));
    };

    // Handle submission to backend API
    const handleSubmit = async () => {
        if (!selectedOrg) {
            Alert.alert('Selection Required', 'Please select an organization');
            return;
        }

        setIsLoading(true);
        
        try {
            // Prepare data for first API (device update)
            const dataToSubmit = {
                ...formData,
                submittedAt: new Date().toISOString()
            };
            console.log("Data to submit:", dataToSubmit);
            // API endpoint for device update
            const API_URL = `https://cloudrunservice-254131401451.us-central1.run.app/user/updateDevice?deviceId=${deviceId}`;
            
            // Prepare data for orders API (includes deviceId, organizationId, and addressId)
            const orderData = {
                deviceId: deviceId,
                organizationId: selectedOrg.id.toString(),
                addressId: formData.addressId
            };
            
            const API_URL_ORDERS = `https://cloudrunservice-254131401451.us-central1.run.app/user/order?userId=${userData.id}`;
            
            // Set proper headers
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            // Make the API requests
            const response = await axios.put(API_URL, dataToSubmit, config);
            const orderResponse = await axios.post(API_URL_ORDERS, orderData, config);
            
            // console.log("Device update response:", response.data);
            // console.log("Order response:", orderResponse.data);
            
            if (response.status === 200 || response.status === 201) {
                // Show success message
                Alert.alert(
                    'Success',
                    'Your device has been successfully submitted for recycling',
                    [
                        { 
                            text: 'OK', 
                            onPress: () => router.push('/devices') 
                        }
                    ]
                );
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error('API submission error:', error);
            let errorMessage = 'There was a problem submitting your device. Please try again.';
            
            // More specific error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("Error response data:", error.response.data);
                console.log("Error response status:", error.response.status);
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
                // The request was made but no response was received
                console.log("Error request:", error.request);
                errorMessage = 'No response received from server. Please check your connection.';
            }
            
            // Show error message
            Alert.alert(
                'Submission Failed',
                errorMessage,
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Custom card component
    const OrganizationCard = ({ item, onSelect, isSelected }) => (
        <TouchableOpacity
            style={[styles.customCard, isSelected && styles.selectedCard]}
            onPress={() => onSelect(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <View style={styles.selectionArea}>
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                    </View>
                </View>

                <View style={styles.infoArea}>
                    <Text style={styles.orgName}>{item.name}</Text>
                    <Text style={styles.description}>{item.description}</Text>

                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Category</Text>
                            <Text style={styles.metaValue}>{item.category}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Members</Text>
                            <Text style={styles.metaValue}>{item.memberCount}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

            <View style={styles.container}>
                <Text style={styles.title}>Select Organization</Text>
                
                {/* Display summary of the device details */}
                {formData.deviceId && (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Device Details</Text>
                        <Text style={styles.summaryItem}>Model: {formData.modelNumber}</Text>
                        {formData.imei && <Text style={styles.summaryItem}>IMEI: {formData.imei}</Text>}
                        {formData.purchaseYear && <Text style={styles.summaryItem}>Purchase Year: {formData.purchaseYear}</Text>}
                    </View>
                )}

                {/* Display address details if available */}
                {addressDetails && (
                    <View style={styles.addressContainer}>
                        <Text style={styles.summaryTitle}>Pickup Address</Text>
                        <Text style={styles.addressText}>{addressDetails}</Text>
                    </View>
                )}

                <FlatList
                    data={organizations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <OrganizationCard
                            item={item}
                            onSelect={handleSelectOrg}
                            isSelected={selectedOrg?.id === item.id}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />

                {/* Fixed submit button container */}
                <View style={styles.submitContainer}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !selectedOrg && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!selectedOrg || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.submitText}>Submit Device</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginVertical: 24,
        paddingHorizontal: 4,
    },
    summaryContainer: {
        backgroundColor: '#EEFBEF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: '#609966',
    },
    addressContainer: {
        backgroundColor: '#F0F8FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: '#4682B4',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    summaryItem: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    listContainer: {
        paddingBottom: 100, // Space for the fixed button
    },
    customCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#609966',
        shadowColor: '#609966',
        shadowOpacity: 0.2,
        elevation: 4,
    },
    cardContent: {
        flexDirection: 'row',
    },
    selectionArea: {
        paddingRight: 16,
        justifyContent: 'center',
    },
    radioOuter: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#CCCCCC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: '#609966',
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#609966',
    },
    infoArea: {
        flex: 1,
    },
    orgName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: '#666666',
        marginBottom: 12,
        lineHeight: 22,
    },
    metaContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    metaItem: {
        marginRight: 24,
    },
    metaLabel: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#609966',
    },
    submitContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    submitButton: {
        backgroundColor: '#609966',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    submitText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    }
});