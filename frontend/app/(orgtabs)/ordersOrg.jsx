import { View, Text } from 'react-native'
import React from 'react'
import '../../global.css'
import OrderHistoryScreen from '../../components/orgOrders'

const OrgOrders = () => {
  return (
    <View style={{ flex: 1 }}>
      <OrderHistoryScreen />
    </View>
  )
}

export default OrgOrders;