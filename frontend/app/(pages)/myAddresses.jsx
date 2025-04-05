import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Alert,
    Modal,
    TextInput
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

// Memoize the AddressCard component to prevent unnecessary re-renders
const AddressCard = memo(({ item, onSelect, isSelected }) => (
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
                {item.addressLine2 ? <Text style={styles.addressDetail}>{item.addressLine2}</Text> : null}
                <Text style={styles.addressDetail}>{item.city}, {item.state} {item.postalCode}</Text>
                <Text style={styles.addressDetail}>{item.country}</Text>
            </View>
        </View>
    </TouchableOpacity>
));

export default function AddressSelection() {
    // State management
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isDefault, setIsDefault] = useState(false);
    const [userId, setUserId] = useState('');
    
    // Form state (single object to reduce re-renders)
    const [formData, setFormData] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: ''
    });

    // Fetch user ID and addresses - only runs once on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = await AsyncStorage.getItem('ID');
                if (!id) {
                    throw new Error('User ID not found');
                }
                setUserId(id);
                
                // Once we have the user ID, fetch their addresses
                fetchUserAddresses(id);
            } catch (error) {
                console.error('Error retrieving user ID:', error);
                Alert.alert("Error", "Failed to load user data");
                setIsLoadingAddresses(false);
            }
        };
        
        fetchUserData();
    }, []);

    // Fetch user addresses from API
    const fetchUserAddresses = useCallback(async (userId) => {
        setIsLoadingAddresses(true);
        try {
            const API_URL = `https://cloudrunservice-254131401451.us-central1.run.app/user/getAddress?userId=${userId}`;
            
            const response = await axios.get(API_URL);
            console.log('Address response:', response.data);
            
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
                            country: addressParts[4] || 'India',
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
            // Show error to user
            Alert.alert("Error", "Failed to load addresses");
        } finally {
            setIsLoadingAddresses(false);
        }
    }, []);

    // Handle address selection - memoized
    const handleSelectAddress = useCallback((address) => {
        setSelectedAddress(address);
    }, []);
    
    // Form input change handlers - key focus fix here
    const handleInputChange = useCallback((field, value) => {
        setFormData(currentFormData => ({
            ...currentFormData,
            [field]: value
        }));
    }, []);
    
    // Handle adding a new address
    const handleAddNewAddress = useCallback(async () => {
        // Access values from state
        const { addressLine1, addressLine2, city, state, postalCode } = formData;
        
        // Validate address fields
        if (!addressLine1 || !city || !state || !postalCode) {
            Alert.alert('Required Fields', 'Please fill all required address fields');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const API_URL = `https://cloudrunservice-254131401451.us-central1.run.app/user/addAddress?userId=${userId}`;
            
            // Format address to match backend expectations
            const addressToSubmit = {
                Address: `${addressLine1},${addressLine2},${city},${state},United States`,
                pinCode: postalCode,
            };
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            console.log('Submitting address:', addressToSubmit);
            const response = await axios.post(API_URL, addressToSubmit, config);
            
            if (response.status === 201 || response.status === 200) {
                // Reset form state
                setFormData({
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    postalCode: ''
                });
                setIsDefault(false);
                setShowAddressModal(false);
                
                // Refresh the address list to ensure we have the latest data
                fetchUserAddresses(userId);
                
                // Show success message
                Alert.alert("Success", "Address added successfully");
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
    }, [formData, userId, fetchUserAddresses]);

    // Toggle default status
    const toggleDefault = useCallback(() => {
        setIsDefault(prev => !prev);
    }, []);

    // Extract AddressModal to prevent re-renders of the entire component
    const renderAddressModal = () => (
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
                                placeholder="Street address"
                                value={formData.addressLine1}
                                onChangeText={(text) => handleInputChange('addressLine1', text)}
                                blurOnSubmit={false}
                            />
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Address Line 2</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Apt, Suite, Unit, etc. (optional)"
                                value={formData.addressLine2}
                                onChangeText={(text) => handleInputChange('addressLine2', text)}
                                blurOnSubmit={false}
                            />
                        </View>
                        
                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, {flex: 2, marginRight: 8}]}>
                                <Text style={styles.inputLabel}>City*</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="City"
                                    value={formData.city}
                                    onChangeText={(text) => handleInputChange('city', text)}
                                    blurOnSubmit={false}
                                />
                            </View>
                            
                            <View style={[styles.inputGroup, {flex: 1}]}>
                                <Text style={styles.inputLabel}>State*</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="State"
                                    // maxLength={2}
                                    autoCapitalize="characters"
                                    value={formData.state}
                                    onChangeText={(text) => handleInputChange('state', text)}
                                    blurOnSubmit={false}
                                />
                            </View>
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Postal Code*</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Postal Code"
                                keyboardType="number-pad"
                                maxLength={10}
                                value={formData.postalCode}
                                onChangeText={(text) => handleInputChange('postalCode', text)}
                                blurOnSubmit={false}
                            />
                        </View>
                        
                        {/* <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={toggleDefault}
                            >
                                {isDefault && <View style={styles.checkboxInner} />}
                            </TouchableOpacity>
                            <Text style={styles.checkboxLabel}>Set as default address</Text>
                        </View> */}
                    </View>
                    
                    <TouchableOpacity
                        style={[
                            styles.addButton,
                            isLoading ? styles.disabledButton : null
                        ]}
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

    // Rendering the component
    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
            {showAddressModal && renderAddressModal()}

            <View style={styles.container}>
                <Text style={styles.title}>Your Addresses</Text>

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
                <TouchableOpacity
                    style={styles.addAddressButton}
                    onPress={() => setShowAddressModal(true)}
                >
                    <MaterialIcons name="add-location" size={24} color="#609966" />
                    <Text style={styles.addAddressText}>Add New Address</Text>
                </TouchableOpacity>
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
        paddingTop: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginVertical: 24,
        paddingHorizontal: 4,
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
        paddingBottom: 80,
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
        marginBottom: 20,
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
    disabledButton: {
        backgroundColor: '#A5D6A7',
        opacity: 0.7,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});