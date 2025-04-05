import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  RefreshControl
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
  const [allOrders, setAllOrders] = useState([]); // All orders from API
  const [filteredOrders, setFilteredOrders] = useState([]); // Orders filtered by date and pincode
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh
  const [orgId, setOrgId] = useState(null);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pincodes, setPincodes] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [processingAction, setProcessingAction] = useState(false);
  const [tabDataCache, setTabDataCache] = useState({
    pending: [],
    accepted: [],
    completed: [],
    cancelled: []
  });

  // Retrieve organization ID from AsyncStorage
  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('ID');
      if (value !== null) {
        setOrgId(value);
        return value; // Return the value for immediate use
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      setError('Failed to retrieve organization information');
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Initialize component
  useEffect(() => {
    const initializeData = async () => {
      const id = await _retrieveData();
      if (id) {
        fetchOrders(id);
      }
    };

    initializeData();
  }, [refreshKey]);

  // Apply date and pincode filters when dependencies change
  useEffect(() => {
    if (allOrders.length > 0) {
      // First filter by date
      const dateFiltered = filterOrdersByDate(allOrders, selectedDate);

      // Then apply pincode filter to the date-filtered results
      filterOrdersByPincode(dateFiltered, selectedPincode);
    } else {
      // Ensure filteredOrders is set to empty array when no orders
      setFilteredOrders([]);
    }
  }, [allOrders, selectedDate, selectedPincode]);

  // Cache filtered orders by status for each tab
  useEffect(() => {
    if (filteredOrders.length > 0) {
      const statusCounts = getStatusCounts(filteredOrders);
      
      // Only update cache for tabs that have data
      const newCache = { ...tabDataCache };
      
      const pendingOrders = filteredOrders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return ['pending', 'indonation'].includes(status);
      });
      if (pendingOrders.length > 0) {
        newCache.pending = pendingOrders;
      }
      
      const acceptedOrders = filteredOrders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return ['accepted', 'processing', 'accept'].includes(status);
      });
      if (acceptedOrders.length > 0) {
        newCache.accepted = acceptedOrders;
      }
      
      const completedOrders = filteredOrders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return ['completed', 'done'].includes(status);
      });
      if (completedOrders.length > 0) {
        newCache.completed = completedOrders;
      }
      
      const cancelledOrders = filteredOrders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return ['cancelled', 'rejected', 'reject'].includes(status);
      });
      if (cancelledOrders.length > 0) {
        newCache.cancelled = cancelledOrders;
      }
      
      setTabDataCache(newCache);
    }
  }, [filteredOrders]);

  // Use memoized orders based on active tab
  // Replace the problematic useMemo hook with this fixed version
const ordersToDisplay = useMemo(() => {
  // Use cached data if available, otherwise filter again
  if (tabDataCache[activeTab] && tabDataCache[activeTab].length > 0) {
    return tabDataCache[activeTab];
  }
  
  // Fallback to filtering if cache is empty
  // Directly filter orders here instead of calling the function
  if (!filteredOrders || !Array.isArray(filteredOrders)) {
    return [];
  }
  
  return filteredOrders.filter(order => {
    const status = (order.status || '').toLowerCase();
    
    switch (activeTab) {
      case 'pending':
        return ['pending', 'indonation'].includes(status);
      case 'accepted':
        return ['accepted', 'processing', 'accept'].includes(status);
      case 'completed':
        return ['completed', 'done'].includes(status);
      case 'cancelled':
        return ['cancelled', 'rejected', 'reject'].includes(status);
      default:
        return false;
    }
  });
}, [activeTab, tabDataCache, filteredOrders]);

  const fetchOrderDetails = async (order) => {
    if (!order || !order.orderId) {
      console.warn('Invalid order object received:', order);
      return null;
    }
  
    try {
      let addressResponse, deviceResponse;
  
      // Only fetch address if userId exists
      if (order.userId) {
        addressResponse = await axios.get(
          `https://cloudrunservice-254131401451.us-central1.run.app/user/getAddress?userId=${order.userId}`
        );
      }
  
      // Only fetch device if deviceId exists
      if (order.deviceId) {
        deviceResponse = await axios.get(
          `https://cloudrunservice-254131401451.us-central1.run.app/org/getDevice?deviceId=${order.deviceId}`
        );
      }
  
      // Extract the relevant information with proper null checks
      const address = addressResponse?.data?.address || { address: 'Unknown', city: 'Unknown', pincode: '000000' };
      const device = deviceResponse?.data?.device || { modelNumber: 'Unknown Device', deviceType: 'Electronic device' };
  
      // Handle case when createdAt might be missing or in different format
      let orderDate;
      if (order.createdAt?.seconds) {
        orderDate = new Date(order.createdAt.seconds * 1000);
      } else if (order.createdAt) {
        // Handle if it's already a timestamp or ISO string
        orderDate = new Date(order.createdAt);
      } else {
        orderDate = new Date();
      }
  
      // Get status from device when available, fall back to order status when not
      const currentStatus = device.status || order.status || 'pending';
  
      return {
        ...order,
        id: order.orderId,
        deviceName: device.modelNumber || 'Unknown Device',
        description: device.deviceType || 'Electronic device',
        status: currentStatus, // Use the status from device info
        orderDate: orderDate,
        date: orderDate.toLocaleDateString(),
        pincode: address.pincode || '000000',
        userAddress: address
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      // Return order with default values in case of error
      const fallbackDate = new Date();
      return {
        ...order,
        id: order.orderId,
        deviceName: 'Unknown Device',
        description: 'Electronic device',
        status: order.status || 'pending',
        orderDate: fallbackDate,
        date: fallbackDate.toLocaleDateString(),
        pincode: '000000',
        userAddress: { address: 'Unknown', city: 'Unknown', pincode: '000000' }
      };
    }
  };

  const fetchOrders = async (id) => {
    const organizationId = id || orgId;
    if (!organizationId) {
      console.error('No organization ID available');
      setError('Organization ID not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get orders for the organization
      const ordersResponse = await axios.get(
        `https://cloudrunservice-254131401451.us-central1.run.app/org/getOrgOrders?organizationId=${organizationId}`
      );

      if (!ordersResponse.data?.orders || !Array.isArray(ordersResponse.data.orders)) {
        console.warn('No orders returned from API or invalid format');
        setAllOrders([]);
        setFilteredOrders([]);
        setLoading(false);
        return;
      }

      // Fetch detailed information for each order
      const orderPromises = ordersResponse.data.orders
        .filter(order => order && order.orderId) // Filter out invalid orders
        .map(order => fetchOrderDetails(order));

      const processedOrdersWithNulls = await Promise.all(orderPromises);
      const processedOrders = processedOrdersWithNulls.filter(order => order !== null);

      setAllOrders(processedOrders);

      // Extract unique pincodes with null check
      const uniquePincodes = [...new Set(processedOrders.map(order => order.pincode).filter(Boolean))];
      setPincodes(uniquePincodes);

      // Initial filtering will be handled by the useEffect

    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again later.');
      setAllOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter orders by date with safety checks
  const filterOrdersByDate = (orders, date) => {
    if (!orders || !Array.isArray(orders) || !date) {
      return [];
    }

    // Format the selected date to YYYY-MM-DD for comparison
    const formattedDate = date.toISOString().split('T')[0];

    return orders.filter(order => {
      // Make sure orderDate exists and is a valid date
      if (!order.orderDate || !(order.orderDate instanceof Date)) {
        return false;
      }

      // Format the order date to YYYY-MM-DD for comparison
      const orderDateFormatted = order.orderDate.toISOString().split('T')[0];
      return orderDateFormatted === formattedDate;
    });
  };

  // Filter orders by pincode with safety checks
  const filterOrdersByPincode = (orders, pincode) => {
    if (!orders || !Array.isArray(orders)) {
      setFilteredOrders([]);
      return;
    }

    let result;

    if (!pincode || pincode === 'all') {
      result = orders;
    } else {
      result = orders.filter(order => order.pincode === pincode);
    }

    setFilteredOrders(result);
  };

  // Get orders filtered by status with safety checks
  const getFilteredOrdersByStatus = () => {
    if (!filteredOrders || !Array.isArray(filteredOrders)) {
      return [];
    }
    
    return filteredOrders.filter(order => {
      const status = (order.status || '').toLowerCase();
      
      switch (activeTab) {
        case 'pending':
          return ['pending', 'indonation'].includes(status);
        case 'accepted':
          return ['accepted', 'processing', 'accept'].includes(status);
        case 'completed':
          return ['completed', 'done'].includes(status);
        case 'cancelled':
          return ['cancelled', 'rejected', 'reject'].includes(status);
        default:
          return false;
      }
    });
  };

  // Add this function to calculate counts
  const getStatusCounts = (orders) => {
    if (!orders || !Array.isArray(orders)) {
      return {
        pending: 0,
        accepted: 0,
        completed: 0,
        cancelled: 0
      };
    }

    const counts = {
      pending: 0,
      accepted: 0,
      completed: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      const status = (order.status || '').toLowerCase();
      if (['pending', 'indonation'].includes(status)) counts.pending++;
      else if (['accepted', 'processing', 'accept'].includes(status)) counts.accepted++;
      else if (['completed', 'done'].includes(status)) counts.completed++;
      else if (['cancelled', 'rejected', 'reject'].includes(status)) counts.cancelled++;
    });

    return counts;
  };

  const handleSelectOrder = (orderId) => {
    if (!orderId) return;

    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleSelectAll = () => {
    if (!ordersToDisplay.length) return;

    if (selectedOrders.length === ordersToDisplay.length) {
      // Deselect all
      setSelectedOrders([]);
    } else {
      // Select all
      setSelectedOrders(ordersToDisplay.map(order => order.id).filter(Boolean));
    }
  };

  const handleBulkAction = async (action) => {
    if (!selectedOrders.length || !orgId) return;
  
    setProcessingAction(true);
    try {
      const selectedOrdersData = filteredOrders.filter(order =>
        selectedOrders.includes(order.id) && order.deviceId
      );
  
      const updatePromises = selectedOrdersData.map(order =>
        axios.put(
          `https://cloudrunservice-254131401451.us-central1.run.app/user/updateDevice?deviceId=${order.deviceId}`,
          {
            status: action === 'accept' ? 'accepted' : action === 'reject' ? 'cancelled' : action
          }
        )
      );
  
      await Promise.all(updatePromises);
      
      // Update local state
      setAllOrders(prevOrders => 
        prevOrders.map(order => {
          if (selectedOrders.includes(order.id)) {
            return { 
              ...order, 
              status: action === 'accept' ? 'accepted' : action === 'reject' ? 'cancelled' : action 
            };
          }
          return order;
        })
      );
  
      setSelectedOrders([]);
      // Reset cache for affected tabs
      setTabDataCache(prevCache => ({
        ...prevCache,
        [activeTab]: [] // Clear the cache for current tab to trigger re-filtering
      }));
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      setError(`Failed to ${action} orders. Please try again.`);
    } finally {
      setProcessingAction(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
    // Clear tab cache when date changes
    setTabDataCache({
      pending: [],
      accepted: [],
      completed: [],
      cancelled: []
    });
    // Filtering is now handled by the useEffect
  };

  // Handle pincode selection
  const handlePincodeSelect = (pincode) => {
    if (!pincode) return;
    setSelectedPincode(pincode);
    // Clear tab cache when pincode changes
    setTabDataCache({
      pending: [],
      accepted: [],
      completed: [],
      cancelled: []
    });
    // Filtering is now handled by the useEffect
  };

  const handleRetry = () => {
    setError(null);
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    // Clear the cache for the current tab
    setTabDataCache(prevCache => ({
      ...prevCache,
      [activeTab]: []
    }));
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Change tab without refreshing data
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedOrders([]); // Clear selections when changing tabs
    // We don't refresh data here, just change the active tab
  };

  const hasOrders = ordersToDisplay && ordersToDisplay.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <DateFilter
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        markedDates={{}} // Add this line to provide an empty object as default
      />

      <FilterTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange} // Use our new handler that doesn't auto-refresh
        counts={getStatusCounts(filteredOrders)}
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
            onSelectPincode={handlePincodeSelect}
          />

          {selectedOrders.length > 0 && (
            <ActionButtons
              selectedCount={selectedOrders.length}
              onAccept={() => handleBulkAction('accept')}
              onReject={() => handleBulkAction('reject')}
              processing={processingAction}
            />
          )}

          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2ecc71']}
                tintColor="#2ecc71"
              />
            }
          >
            <View style={styles.ordersContainer}>
              {hasOrders ? (
                <>
                  <TouchableOpacity
                    style={styles.selectAllContainer}
                    onPress={handleSelectAll}
                  >
                    <MaterialCommunityIcons
                      name={selectedOrders.length === ordersToDisplay.length ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={20}
                      color="#2ecc71"
                    />
                    <Text style={styles.selectAllText}>
                      {selectedOrders.length === ordersToDisplay.length
                        ? "Deselect All"
                        : "Select All Orders"}
                    </Text>
                  </TouchableOpacity>

                  {ordersToDisplay.map(order => (
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
                  onRefresh={onRefresh}
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
    // paddingTop: 42,
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