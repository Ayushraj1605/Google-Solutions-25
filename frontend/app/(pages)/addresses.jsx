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
    Alert,
    Modal,
    TextInput
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Add this component at the top of your file, before AddressSelection
const Header = ({ onBack }) => (
    <View style={styles.header}>
        <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={{ width: 24 }} /> {/* For balance */}
    </View>
);

export default function AddressSelection() {
    // Get URL parameters from recycle form
    const params = useLocalSearchParams();
    
    // Create a state to store all form data (from previous screen + address selection)
    const [formData, setFormData] = useState({});
    
    // State management
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
        isDefault: false
    });
    
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
    });

    // Extract params when component mounts
    useEffect(() => {
        // Log received params for debugging
        console.log("Received params from recycle form:", params);
        
        // Initialize form data with the received parameters
        setFormData({
            deviceId: params.deviceId,
            modelNumber: params.modelNumber,
            imei: params.imei,
            purchaseYear: params.purchaseYear,
            description: params.description,
            status: "Pending",
            // Note: invoice file cannot be passed via URL params
        });
    }, []);

    // Fetch user data and addresses
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
                
                // Once we have the user ID, fetch their addresses
                if (userId) {
                    fetchUserAddresses(userId);
                }
            } catch (error) {
                console.error('Error retrieving user data:', error);
                Alert.alert("Error", "Failed to load user data");
                setIsLoadingAddresses(false);
            }
        };
        
        fetchUserData();
    }, []);

    // Fetch user addresses from API
    const fetchUserAddresses = async (userId) => {
        setIsLoadingAddresses(true);
        try {
            const API_URL = `https://cloudrunservice-254131401451.us-central1.run.app/user/getAddress?userId=${userId}`;
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            const response = await axios.get(API_URL, config);
            
            if (response.status === 200) {
                // Handle the response based on the actual backend response format
                if (response.data && response.data.addresses && Array.isArray(response.data.addresses) && response.data.addresses.length > 0) {
                    // Transform the backend format to match the frontend format
                    const formattedAddresses = response.data.addresses.map(addr => {
                        // Safely handle the address string - handle case when Address might be undefined
                        const addressParts = addr.Address ? addr.Address.split(',') : ['', '', '', '', ''];
                        
                        return {
                            id: addr.addressId || Math.random().toString(36).substr(2, 9), // Generate random ID if not provided
                            addressLine1: addressParts[0] || '',
                            addressLine2: addressParts[1] || '',
                            city: addressParts[2] || '',
                            state: addressParts[3] || '',
                            country: addressParts[4] || 'United States',
                            postalCode: addr.pinCode || '',
                            isDefault: false // Backend doesn't seem to track this yet
                        };
                    });
                    
                    setAddresses(formattedAddresses);
                    
                    // Select the first address as default
                    if (formattedAddresses.length > 0) {
                        setSelectedAddress(formattedAddresses[0]);
                    }
                } else {
                    // If no addresses, show empty state
                    setAddresses([]);
                }
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            // Show generic addresses if API fails for demo purposes
            setAddresses([
                {
                    id: 1,
                    addressLine1: '123 Main Street',
                    addressLine2: 'Apt 4B',
                    city: 'San Francisco',
                    state: 'CA',
                    postalCode: '94107',
                    country: 'United States',
                    isDefault: true
                },
                {
                    id: 2,
                    addressLine1: '456 Market Avenue',
                    city: 'San Francisco',
                    state: 'CA',
                    postalCode: '94103',
                    country: 'United States',
                    isDefault: false
                }
            ]);
            
            // Select the default address
            const defaultAddress = addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress);
            }
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    // Handle address selection
    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        setFormData(prev => ({
            ...prev,
            addressId: address.id,
            addressDetails: `${address.addressLine1}, ${address.city}, ${address.state}`,
            pincode:`${address.postalCode}`
        }));
    };

    // Handle adding a new address
    const handleAddNewAddress = async () => {
        // Validate address fields
        if (!newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
            Alert.alert('Required Fields', 'Please fill all required address fields');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const API_URL = `https://cloudrunservice-254131401451.us-central1.run.app/user/address?userId=${userData.id}`;
            
            const addressToSubmit = {
                ...newAddress,
                userId: userData.id
            };
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            const response = await axios.post(API_URL, addressToSubmit, config);
            
            if (response.status === 201 || response.status === 200) {
                // Add the new address to the list with the ID from the response
                const newAddressWithId = {
                    ...newAddress,
                    id: response.data.id || Date.now() // Fallback to timestamp if no ID in response
                };
                
                setAddresses([...addresses, newAddressWithId]);
                
                // Select the newly added address
                setSelectedAddress(newAddressWithId);
                setFormData(prev => ({
                    ...prev,
                    addressId: newAddressWithId.id,
                    addressDetails: `${newAddressWithId.addressLine1}, ${newAddressWithId.city}, ${newAddressWithId.state}`,
                    pincode: `${newAddressWithId.postalCode}`
                }));
                
                // Reset the new address form and close modal
                setNewAddress({
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'United States',
                    isDefault: false
                });
                setShowAddressModal(false);
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding address:', error);
            Alert.alert(
                'Error',
                'Failed to add address. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle continuing to organization selection
    const handleContinue = () => {
        if (!selectedAddress) {
            Alert.alert('Selection Required', 'Please select a shipping address');
            return;
        }
        
        // Navigate to organization selection screen with all form data
        router.push({
            pathname: '/organisationList',
            params: {
                ...formData,
                addressId: selectedAddress.id,
                addressDetails: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state}` ,
                pincode:`${selectedAddress.postalCode}`
            }
        });
    };

    // Custom address card component
    const AddressCard = ({ item, onSelect, isSelected }) => (
        <TouchableOpacity
            style={[styles.addressCard, isSelected && styles.selectedCard]}
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
                    <View style={styles.addressHeader}>
                        <Text style={styles.addressName}>
                            {item.addressLine1}
                            {item.isDefault && <Text style={styles.defaultBadge}> (Default)</Text>}
                        </Text>
                    </View>
                    {item.addressLine2 && <Text style={styles.addressDetail}>{item.addressLine2}</Text>}
                    <Text style={styles.addressDetail}>{item.city}, {item.state} {item.postalCode}</Text>
                    <Text style={styles.addressDetail}>{item.country}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    // New Address Modal
    const AddressModal = () => (
        <Modal
            visible={showAddressModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowAddressModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Address</Text>
                        <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                            <MaterialIcons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Address Line 1*</Text>
                            <TextInput
                                style={styles.textInput}
                                value={newAddress.addressLine1}
                                onChangeText={(text) => setNewAddress({...newAddress, addressLine1: text})}
                                placeholder="Street address"
                            />
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Address Line 2</Text>
                            <TextInput
                                style={styles.textInput}
                                value={newAddress.addressLine2}
                                onChangeText={(text) => setNewAddress({...newAddress, addressLine2: text})}
                                placeholder="Apt, Suite, Unit, etc. (optional)"
                            />
                        </View>
                        
                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, {flex: 2, marginRight: 8}]}>
                                <Text style={styles.inputLabel}>City*</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={newAddress.city}
                                    onChangeText={(text) => setNewAddress({...newAddress, city: text})}
                                    placeholder="City"
                                />
                            </View>
                            
                            <View style={[styles.inputGroup, {flex: 1}]}>
                                <Text style={styles.inputLabel}>State*</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={newAddress.state}
                                    onChangeText={(text) => setNewAddress({...newAddress, state: text})}
                                    placeholder="State"
                                    maxLength={2}
                                />
                            </View>
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Postal Code*</Text>
                            <TextInput
                                style={styles.textInput}
                                value={newAddress.postalCode}
                                onChangeText={(text) => setNewAddress({...newAddress, postalCode: text})}
                                placeholder="Postal Code"
                                keyboardType="number-pad"
                            />
                        </View>
                        
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => setNewAddress({...newAddress, isDefault: !newAddress.isDefault})}
                            >
                                {newAddress.isDefault && <View style={styles.checkboxInner} />}
                            </TouchableOpacity>
                            <Text style={styles.checkboxLabel}>Set as default address</Text>
                        </View>
                    </View>
                    
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddNewAddress}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.addButtonText}>Add Address</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
            <AddressModal />

            <View style={styles.container}>
                <Text style={styles.title}>Your Addresses</Text>
                
                {/* Display summary of the device details */}
                {formData.deviceId && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Device Details</Text>
                    <Text style={styles.summaryItem}>Model: {formData.modelNumber}</Text>
                    {formData.imei && <Text style={styles.summaryItem}>IMEI: {formData.imei}</Text>}
                </View>
            )}

                {isLoadingAddresses ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#609966" />
                        <Text style={styles.loadingText}>Loading addresses...</Text>
                    </View>
                ) : addresses.length > 0 ? (
                    <FlatList
                        data={addresses}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <AddressCard
                                item={item}
                                onSelect={handleSelectAddress}
                                isSelected={selectedAddress?.id === item.id}
                            />
                        )}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="location-off" size={64} color="#CCCCCC" />
                        <Text style={styles.emptyText}>No addresses found</Text>
                        <Text style={styles.emptySubtext}>Add an address to continue</Text>
                    </View>
                )}

                {/* Add new address button */}
                {/* <TouchableOpacity
                    style={styles.addAddressButton}
                    onPress={() => setShowAddressModal(true)}
                >
                    <MaterialIcons name="add-location" size={24} color="#609966" />
                    <Text style={styles.addAddressText}>Add New Address</Text>
                </TouchableOpacity> */}

                {/* Fixed continue button container */}
                <View style={styles.submitContainer}>
                    <TouchableOpacity
                        style={[styles.submitButton, !selectedAddress && styles.submitButtonDisabled]}
                        onPress={handleContinue}
                        disabled={!selectedAddress || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.submitText}>Continue</Text>
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
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F5F5F5',
        paddingTop: 16, // Add some padding since we removed the title
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    listContainer: {
        paddingBottom: 140, // Space for the fixed buttons
    },
    addressCard: {
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
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    defaultBadge: {
        fontSize: 14,
        fontWeight: '400',
        color: '#609966',
    },
    addressDetail: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 80,
        borderWidth: 1,
        borderColor: '#609966',
        borderStyle: 'dashed',
    },
    addAddressText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#609966',
        marginLeft: 8,
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
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    formContainer: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 16,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    checkbox: {
        height: 20,
        width: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#609966',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        height: 12,
        width: 12,
        borderRadius: 2,
        backgroundColor: '#609966',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#555',
    },
    addButton: {
        backgroundColor: '#609966',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
