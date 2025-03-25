import React from "react";
import { View, Text } from "react-native";
import OrderHistoryScreen from "../../components/userOrders";

const OrderHistory = () => {
  return (
    <View style={{ flex: 1 }}>
        <OrderHistoryScreen/>
    </View>
  );
};

export default OrderHistory;