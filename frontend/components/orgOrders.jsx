// components/orgOrders/index.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderCard from './orderCard';
import FilterTabs from './filterTabs';
import DateFilter from './dateFilter';
import PincodeFilter from './pincodeFilter';
import ActionButtons from './actionButtons';
import ErrorState from './errorState';
import EmptyState from './emptyState';

const { width } = Dimensions.get('window');

const OrderHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState(null);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({});
  const [pincodes, setPincodes] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [processingAction, setProcessingAction] = useState(false);
  
  // Retrieve organization ID from AsyncStorage
  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('ORG_ID');
      if (value !== null) {
        setOrgId(value);
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      setError('Failed to retrieve organization information');
    } finally {
      setLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    _retrieveData();
  }, []);

  // Fetch orders when orgId changes
  useEffect(() => {
    if (orgId) {
      fetchOrders();
    }
  }, [orgId, refreshKey, selectedDate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Format date for API call
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Fetch orders for the organization
      const ordersResponse = await axios.get(
        `https://cloudrunservice-254131401451.us-central1.run.app/org/getOrders?orgId=${orgId}&date=${formattedDate}&cache=${refreshKey}`
      );
      
      if (!ordersResponse.data?.orders || !Array.isArray(ordersResponse.data.orders)) {
        console.warn('No orders returned from API or invalid format');
        setOrders([]);
        setFilteredOrders([]);
        setLoading(false);
        return;
      }
      
      // Process orders
      const processedOrders = ordersResponse.data.orders.map(order => ({
        ...order,
        id: order.orderId || order.id,
        deviceName: order.deviceName || order.modelNumber || 'Unknown Device',
        description: order.description || order.deviceType || 'Electronic device',
        status: order.status || 'pending',
        date: new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString(),
        pincode: order.pincode || order.address?.pincode || '000000',
        userAddress: order.address || { address: 'Unknown', city: 'Unknown', pincode: '000000' }
      }));
      
      setOrders(processedOrders);
      
      // Extract unique pincodes
      const uniquePincodes = [...new Set(processedOrders.map(order => order.pincode))];
      setPincodes(uniquePincodes);
      
      // Apply default filters
      filterOrdersByPincode(processedOrders, 'all');
      
      // Fetch calendar marked dates
      fetchCalendarData();
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again later.');
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCalendarData = async () => {
    try {
      // Fetch calendar data to mark dates
      const calendarResponse = await axios.get(
        `https://cloudrunservice-254131401451.us-central1.run.app/org/getCalendarData?orgId=${orgId}`
      );
      
      if (calendarResponse.data?.dates) {
        setMarkedDates(calendarResponse.data.dates);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };
  
  const filterOrdersByPincode = (ordersList, pincode) => {
    if (pincode === 'all') {
      setFilteredOrders(ordersList);
      setSelectedPincode('all');
    } else {
      const filtered = ordersList.filter(order => order.pincode === pincode);
      setFilteredOrders(filtered);
      setSelectedPincode(pincode);
    }
  };
  
  const getFilteredOrdersByStatus = () => {
    if (activeTab === 'all') {
      return filteredOrders;
    } else {
      return filteredOrders.filter(order => order.status.toLowerCase() === activeTab);
    }
  };
  
  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };
  
  const handleSelectAll = () => {
    const displayedOrders = getFilteredOrdersByStatus();
    if (selectedOrders.length === displayedOrders.length) {
      // Deselect all
      setSelectedOrders([]);
    } else {
      // Select all
      setSelectedOrders(displayedOrders.map(order => order.id));
    }
  };
  
  const handleBulkAction = async (action) => {
    if (selectedOrders.length === 0) return;
    
    setProcessingAction(true);
    try {
      // Call API to perform action (accept/reject)
      await axios.post(
        `https://cloudrunservice-254131401451.us-central1.run.app/org/updateOrders`,
        {
          orgId: orgId,
          orderIds: selectedOrders,
          action: action
        }
      );
      
      // Reset selected orders and refresh
      setSelectedOrders([]);
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      setError(`Failed to ${action} orders. Please try again.`);
    } finally {
      setProcessingAction(false);
    }
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  
  const handleRetry = () => {
    setError(null);
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Organization Orders</Text>
      </View>
      
      <DateFilter 
        selectedDate={selectedDate}
        markedDates={markedDates}
        onDateSelect={handleDateSelect}
      />
      
      <FilterTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2ecc71" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : error ? (
        <ErrorState error={error} onRetry={handleRetry} />
      ) : (
        <>
          <PincodeFilter 
            pincodes={pincodes}
            selectedPincode={selectedPincode}
            onSelectPincode={(pincode) => filterOrdersByPincode(orders, pincode)}
          />
          
          {selectedOrders.length > 0 && (
            <ActionButtons 
              selectedCount={selectedOrders.length}
              onAccept={() => handleBulkAction('accept')}
              onReject={() => handleBulkAction('reject')}
              processing={processingAction}
            />
          )}
          
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.ordersContainer}>
              {getFilteredOrdersByStatus().length > 0 ? (
                <>
                  <TouchableOpacity 
                    style={styles.selectAllContainer}
                    onPress={handleSelectAll}
                  >
                    <MaterialCommunityIcons 
                      name={selectedOrders.length === getFilteredOrdersByStatus().length ? "checkbox-marked" : "checkbox-blank-outline"} 
                      size={20} 
                      color="#2ecc71" 
                    />
                    <Text style={styles.selectAllText}>
                      {selectedOrders.length === getFilteredOrdersByStatus().length 
                        ? "Deselect All" 
                        : "Select All Orders"}
                    </Text>
                  </TouchableOpacity>
                  
                  {getFilteredOrdersByStatus().map(order => (
                    <OrderCard 
                      key={order.id}
                      order={order}
                      isSelected={selectedOrders.includes(order.id)}
                      onSelect={() => handleSelectOrder(order.id)}
                    />
                  ))}
                </>
              ) : (
                <EmptyState 
                  activeTab={activeTab}
                  onRefresh={() => setRefreshKey(prevKey => prevKey + 1)}
                />
              )}
            </View>
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: 42,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  ordersContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 16,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 30,
  }
});

export default OrderHistoryScreen;