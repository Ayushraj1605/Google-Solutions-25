// components/orgOrders/FilterTabs.js
import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity
} from 'react-native';

const FilterTabs = ({ activeTab, setActiveTab }) => {
  return (
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
        <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'accepted' && styles.activeTab]}
        onPress={() => setActiveTab('accepted')}
      >
        <Text style={[styles.tabText, activeTab === 'accepted' && styles.activeTabText]}>Accepted</Text>
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
  );
};

const styles = StyleSheet.create({
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
    fontSize: 13,
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#2ecc71',
    fontWeight: '600',
  },
});

export default FilterTabs;