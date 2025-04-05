import React, { useState, useEffect, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const OrderHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Retrieve user ID from AsyncStorage
  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('ID');
      if (value !== null) {
        setUserId(value);
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      setError('Failed to retrieve user information');
    } finally {
      setLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    _retrieveData();
  }, []);

  // Function to fetch orders and devices
  const fetchOrdersAndDevices = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // First fetch orders
      const ordersResponse = await axios.get(
        `https://cloudrunservice-254131401451.us-central1.run.app/user/getOrders?userId=${userId}`
      );
      
      console.log('Orders response:', ordersResponse.data);
      
      if (!ordersResponse.data?.orders || !ordersResponse.data.orders.length) {
        console.warn('No orders returned from API');
        setOrders([]);
        return;
      }
      
      // Now fetch devices to get more details
      const devicesResponse = await axios.get(
        `https://cloudrunservice-254131401451.us-central1.run.app/user/getDevices?userId=${userId}&cache=${refreshKey}`
      );
      
      console.log('Devices response:', devicesResponse.data);
      
      // Create a map of deviceId to its device details
      const deviceDetailsMap = {};
      if (devicesResponse.data?.devices && Array.isArray(devicesResponse.data.devices)) {
        devicesResponse.data.devices.forEach(device => {
          deviceDetailsMap[device.deviceId || device.deviceID || device.id] = device;
        });
      }
      
      // Merge order data with device details
      const completeOrders = ordersResponse.data.orders.map(order => {
        const deviceId = order.deviceId;
        const deviceDetails = deviceDetailsMap[deviceId] || {};
        
        return {
          ...order,
          ...deviceDetails,
          id: order.orderId || order.id || deviceId, // Ensure we have an id for the key prop
          deviceId: deviceId,
          deviceName: deviceDetails.deviceName || deviceDetails.modelNumber || 'Unknown Device',
          description: deviceDetails.description || deviceDetails.deviceType || 'Electronic device',
          status: order.status || 'pending',
          date: new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString(),
          organization: deviceDetails.organization || 'GreenTech Recycling'
        };
      });
      
      console.log('Complete merged orders:', completeOrders);
      setOrders(completeOrders);
    } catch (error) {
      console.error('Error fetching orders and devices:', error);
      setError('Failed to load orders. Please try again later.');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch orders when userId changes
  useEffect(() => {
    if (userId) {
      fetchOrdersAndDevices();
    }
  }, [userId, refreshKey]);
  
  // Use useMemo to cache filtered orders based on activeTab
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') {
      return orders;
    } else {
      return orders.filter(order => order.status.toLowerCase() === activeTab);
    }
  }, [orders, activeTab]);
  
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return '#3498db'; // Blue
      case 'completed':
        return '#2ecc71'; // Green
      case 'cancelled':
        return '#e74c3c'; // Red
      default:
        return '#95a5a6'; // Gray
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return 'clock-outline';
      case 'completed':
        return 'check-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };
  
  const navigateToOrderDetails = (orderId) => {
    router.push(`/order-details?id=${orderId}`);
  };

  // Pull to refresh handler
  const onRefresh = () => {
    if (userId) {
      fetchOrdersAndDevices(true);
    }
  };

  const renderOrderCard = (order) => {
    // Handle both capitalized and lowercase status
    const status = order.status.toLowerCase();
    
    return (
      <TouchableOpacity 
        key={order.id} 
        style={styles.orderCard}
        onPress={() => navigateToOrderDetails(order.id)}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order: {order.orderId || order.id}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <MaterialCommunityIcons name={getStatusIcon(status)} size={14} color="#fff" />
            <Text style={styles.statusText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderContent}>
          <View style={styles.deviceImageContainer}>
            {order.imageUrl ? (
              <Image 
                source={{ uri: order.imageUrl }} 
                style={styles.deviceImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.deviceImagePlaceholder}>
                <MaterialCommunityIcons 
                  name={
                    (order.deviceName || '').toLowerCase().includes('iphone') || 
                    (order.deviceName || '').toLowerCase().includes('smartphone') ? 'cellphone' :
                    (order.deviceName || '').toLowerCase().includes('laptop') ? 'laptop' :
                    (order.deviceName || '').toLowerCase().includes('tv') ? 'television' :
                    (order.deviceName || '').toLowerCase().includes('ipad') || 
                    (order.deviceName || '').toLowerCase().includes('tablet') ? 'tablet' :
                    (order.deviceName || '').toLowerCase().includes('headphone') ? 'headphones' :
                    (order.deviceName || '').toLowerCase().includes('printer') ? 'printer' :
                    (order.deviceName || '').toLowerCase().includes('mouse') ? 'mouse' :
                    'devices'
                  } 
                  size={36} 
                  color="#7f8c8d" 
                />
              </View>
            )}
          </View>
          
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{order.deviceName}</Text>
            <Text style={styles.deviceId}>Device ID: {order.deviceId}</Text>
            <Text style={styles.deviceDescription} numberOfLines={2}>
              {order.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderFooter}>
          {status === 'pending' && (
            <View style={styles.footerInfo}>
              <MaterialCommunityIcons name="truck-delivery-outline" size={16} color="#7f8c8d" />
              <Text style={styles.footerText}>Pickup: {order.estimatedPickup || 'Pending'}</Text>
            </View>
          )}
          
          {status === 'completed' && (
            <View style={styles.footerInfo}>
              <MaterialCommunityIcons name="leaf" size={16} color="#2ecc71" />
              <Text style={styles.footerText}>Carbon Saved: {order.carbonSaved || 'N/A'}</Text>
            </View>
          )}
          
          {status === 'cancelled' && (
            <View style={styles.footerInfo}>
              <MaterialCommunityIcons name="information-outline" size={16} color="#e74c3c" />
              <Text style={styles.footerText} numberOfLines={1}>{order.cancelReason || 'No reason provided'}</Text>
            </View>
          )}
          
          <View style={styles.footerInfo}>
            <MaterialCommunityIcons 
              name={status === 'completed' ? 'office-building' : 'office-building-outline'} 
              size={16} 
              color="#7f8c8d" 
            />
            <Text style={styles.footerText}>
              {order.organization || `Org ID: ${order.organizationId}` || 'Not assigned'}
            </Text>
          </View>
        </View>
        
        {status === 'completed' && order.points > 0 && (
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>+{order.points} pts</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Retry function for error state
  const handleRetry = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Recycling Orders</Text>
      </View> */}
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Processing</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>Cancelled</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2ecc71" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
            {filteredOrders.length > 0 ? (
              filteredOrders.map(renderOrderCard)
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="archive-outline" size={64} color="#bdc3c7" />
                <Text style={styles.emptyStateTitle}>No orders found</Text>
                <Text style={styles.emptyStateText}>
                  You don't have any {activeTab !== 'all' ? activeTab : ''} recycling orders yet.
                </Text>
                <TouchableOpacity 
                  style={styles.startRecyclingButton}
                  onPress={() => router.push('/')}
                >
                  <Text style={styles.startRecyclingButtonText}>Start Recycling</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2ecc71',
  },
  tabText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#2ecc71',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  ordersContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flexDirection: 'column',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  orderDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderContent: {
    flexDirection: 'row',
    padding: 12,
  },
  deviceImageContainer: {
    marginRight: 12,
  },
  deviceImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  deviceImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  deviceId: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 2,
  },
  deviceDescription: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  pointsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#f39c12',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  startRecyclingButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  startRecyclingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 30,
  }
});

export default OrderHistoryScreen;