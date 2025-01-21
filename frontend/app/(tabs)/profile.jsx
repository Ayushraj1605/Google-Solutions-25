import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import React from 'react';

const Profile = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" backgroundColor="#609966" />
      
      {/* Green Header */}
      <View style={{ 
        backgroundColor: '#609966',
        height: 120,
        paddingHorizontal: 24,
        paddingTop: 32
      }}>
        <Text style={{ 
          color: 'white',
          fontSize: 24,
          fontWeight: '600'
        }}>
          My Profile
        </Text>
      </View>

      {/* Profile Card */}
      <View style={{
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: -16,
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#E0E0E0'
          }} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Ayush Raj</Text>
            <Text style={{ color: '#666666' }}>theboys.ewaste@gmail.com</Text>
          </View>
          <TouchableOpacity>
            <Text style={{ fontSize: 24, color: '#666666' }}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Options */}
      <View style={{ marginHorizontal: 16, marginTop: 24 }}>
        {/* Order History */}
        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          backgroundColor: 'white',
          borderRadius: 8,
          marginBottom: 12,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }}>
          <Text style={{ flex: 1, fontSize: 16 }}>Order History</Text>
          <Text style={{ fontSize: 24, color: '#666666' }}>›</Text>
        </TouchableOpacity>

        {/* Sign Out */}
        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          backgroundColor: 'white',
          borderRadius: 8,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }}>
          <Text style={{ flex: 1, fontSize: 16 }}>Sign Out</Text>
          <Text style={{ fontSize: 24, color: '#666666' }}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;