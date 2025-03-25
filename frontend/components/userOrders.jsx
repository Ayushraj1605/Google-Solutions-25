import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const OrderHistoryScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Hard-coded order data
  const orders = [
    {
      id: 'ORD-2023-001',
      deviceName: 'iPhone 11 Pro',
      deviceId: 'APP-IP11-2853',
      status: 'processing',
      date: '12 Mar 2025',
      organization: 'GreenTech Recyclers',
      estimatedPickup: '26 Mar 2025',
    //   image: require('../assets/phone.png'), // You'll need to add these image assets to your project
      description: 'Minor screen damage, battery at 82% health',
      points: 120
    },
    {
      id: 'ORD-2023-002',
      deviceName: 'Dell XPS 15',
      deviceId: 'CMP-DEL-4291',
      status: 'completed',
      date: '28 Feb 2025',
      organization: 'Eco-Sankalp Solutions',
      completedDate: '10 Mar 2025',
    //   image: require('../assets/laptop.png'),
      description: 'Fully functional, upgrading to newer model',
      points: 250,
      carbonSaved: '18.5 kg'
    },
    {
      id: 'ORD-2023-003',
      deviceName: 'Samsung Smart TV',
      deviceId: 'TV-SAM-7731',
      status: 'completed',
      date: '15 Jan 2025',
      organization: 'GreenTech Recyclers',
      completedDate: '22 Jan 2025',
    //   image: require('../assets/tv.png'),
      description: '55-inch LED, display issues',
      points: 320,
      carbonSaved: '24.8 kg'
    },
    {
      id: 'ORD-2023-004',
      deviceName: 'iPad Air 2',
      deviceId: 'TAB-IP-1455',
      status: 'cancelled',
      date: '03 Mar 2025',
      cancelledDate: '05 Mar 2025',
      cancelReason: 'Decided to repair and donate instead',
    //   image: require('../assets/tablet.png'),
      description: 'Minor scratches, battery issues'
    },
    {
      id: 'ORD-2023-005',
      deviceName: 'Bose Headphones',
      deviceId: 'AUD-BOS-2241',
      status: 'processing',
      date: '18 Mar 2025',
      organization: 'Eco-Sankalp Solutions',
      estimatedPickup: '30 Mar 2025',
    //   image: require('../assets/headphones.png'),
      description: 'Left ear not working, wear on headband',
      points: 80
    },
    {
      id: 'ORD-2023-006',
      deviceName: 'HP Inkjet Printer',
      deviceId: 'PRN-HP-8824',
      status: 'completed',
      date: '05 Feb 2025',
      organization: 'GreenTech Recyclers',
      completedDate: '12 Feb 2025',
    //   image: require('../assets/printer.png'),
      description: 'Functional but replacing with laser printer',
      points: 150,
      carbonSaved: '12.2 kg'
    },
    {
      id: 'ORD-2023-007',
      deviceName: 'Logitech Wireless Mouse',
      deviceId: 'PER-LOG-1123',
      status: 'cancelled',
      date: '22 Feb 2025',
      cancelledDate: '24 Feb 2025',
      cancelReason: 'Found local repair service',
    //   image: require('../assets/mouse.png'),
      description: 'Tracking issues, button sticking'
    }
  ];
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'processing':
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
    switch(status) {
      case 'processing':
        return 'clock-outline';
      case 'completed':
        return 'check-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };
  
  const getFilteredOrders = () => {
    if (activeTab === 'all') {
      return orders;
    } else {
      return orders.filter(order => order.status === activeTab);
    }
  };
  
  const renderOrderCard = (order) => {
    return (
      <TouchableOpacity 
        key={order.id} 
        style={styles.orderCard}
        onPress={() => {/* Navigate to order details */}}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>{order.id}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <MaterialCommunityIcons name={getStatusIcon(order.status)} size={14} color="#fff" />
            <Text style={styles.statusText}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderContent}>
          <View style={styles.deviceImageContainer}>
            {/* Using a placeholder for demo purposes - replace with actual images */}
            <View style={styles.deviceImagePlaceholder}>
              <MaterialCommunityIcons 
                name={
                  order.deviceName.toLowerCase().includes('iphone') || 
                  order.deviceName.toLowerCase().includes('smartphone') ? 'cellphone' :
                  order.deviceName.toLowerCase().includes('laptop') ? 'laptop' :
                  order.deviceName.toLowerCase().includes('tv') ? 'television' :
                  order.deviceName.toLowerCase().includes('ipad') || 
                  order.deviceName.toLowerCase().includes('tablet') ? 'tablet' :
                  order.deviceName.toLowerCase().includes('headphone') ? 'headphones' :
                  order.deviceName.toLowerCase().includes('printer') ? 'printer' :
                  order.deviceName.toLowerCase().includes('mouse') ? 'mouse' :
                  'devices'
                } 
                size={36} 
                color="#7f8c8d" 
              />
            </View>
          </View>
          
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{order.deviceName}</Text>
            <Text style={styles.deviceId}>ID: {order.deviceId}</Text>
            <Text style={styles.deviceDescription} numberOfLines={2}>
              {order.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderFooter}>
          {order.status === 'processing' && (
            <View style={styles.footerInfo}>
              <MaterialCommunityIcons name="truck-delivery-outline" size={16} color="#7f8c8d" />
              <Text style={styles.footerText}>Pickup: {order.estimatedPickup}</Text>
            </View>
          )}
          
          {order.status === 'completed' && (
            <View style={styles.footerInfo}>
              <MaterialCommunityIcons name="leaf" size={16} color="#2ecc71" />
              <Text style={styles.footerText}>Carbon Saved: {order.carbonSaved}</Text>
            </View>
          )}
          
          {order.status === 'cancelled' && (
            <View style={styles.footerInfo}>
              <MaterialCommunityIcons name="information-outline" size={16} color="#e74c3c" />
              <Text style={styles.footerText} numberOfLines={1}>{order.cancelReason}</Text>
            </View>
          )}
          
          <View style={styles.footerInfo}>
            <MaterialCommunityIcons 
              name={order.status === 'completed' ? 'office-building' : 'office-building-outline'} 
              size={16} 
              color="#7f8c8d" 
            />
            <Text style={styles.footerText}>
              {order.organization || 'Not assigned'}
            </Text>
          </View>
        </View>
        
        {order.status === 'completed' && (
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>+{order.points} pts</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Recycling Orders</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'processing' && styles.activeTab]}
          onPress={() => setActiveTab('processing')}
        >
          <Text style={[styles.tabText, activeTab === 'processing' && styles.activeTabText]}>Processing</Text>
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
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.ordersContainer}>
          {getFilteredOrders().map(renderOrderCard)}
          {getFilteredOrders().length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="archive-outline" size={64} color="#bdc3c7" />
              <Text style={styles.emptyStateTitle}>No orders found</Text>
              <Text style={styles.emptyStateText}>
                You don't have any {activeTab !== 'all' ? activeTab : ''} recycling orders yet.
              </Text>
            </View>
          )}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  },
  bottomSpacer: {
    height: 30,
  }
});

export default OrderHistoryScreen;