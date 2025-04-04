// components/orgOrders/PincodeFilter.js
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

const PincodeFilter = ({ pincodes, selectedPincode, onSelectPincode }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter by Pincode:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pincodeScrollContainer}
      >
        <TouchableOpacity
          style={[
            styles.pincodeItem,
            selectedPincode === 'all' && styles.selectedPincodeItem
          ]}
          onPress={() => onSelectPincode('all')}
        >
          <Text 
            style={[
              styles.pincodeText,
              selectedPincode === 'all' && styles.selectedPincodeText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {pincodes.map((pincode) => (
          <TouchableOpacity
            key={pincode}
            style={[
              styles.pincodeItem,
              selectedPincode === pincode && styles.selectedPincodeItem
            ]}
            onPress={() => onSelectPincode(pincode)}
          >
            <Text 
              style={[
                styles.pincodeText,
                selectedPincode === pincode && styles.selectedPincodeText
              ]}
            >
              {pincode}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  pincodeScrollContainer: {
    paddingRight: 16,
  },
  pincodeItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f6fa',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedPincodeItem: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  pincodeText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  selectedPincodeText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default PincodeFilter;