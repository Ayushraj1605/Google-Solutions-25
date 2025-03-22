import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

function DeviceInfoScreen() {
  const { deviceType} = useLocalSearchParams();
  
  return (
    <View>
      <Text>Device Type: {deviceType}</Text>
    </View>
  );
}       

export default DeviceInfoScreen;