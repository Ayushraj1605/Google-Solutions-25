import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity
} from 'react-native';

const FilterTabs = ({ activeTab, setActiveTab, counts = {} }) => {
  const tabs = [
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];
  // ...rest of the component

  return (
    <View style={styles.tabsContainer}>
      {tabs.map(tab => (
        <TouchableOpacity 
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
            {tab.label}
            {counts[tab.id] !== undefined && ` (${counts[tab.id]})`}
          </Text>
        </TouchableOpacity>
      ))}
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