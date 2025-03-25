import { View, Text } from 'react-native' 
import React from 'react' 
import '../../global.css' 
import OrgAnalyticsScreen from '../../components/orgAnalytics'  

const Home = () => {   
  return (
    <View style={{ flex: 1 }}>
      <OrgAnalyticsScreen />
    </View>
  )
}  

export default Home