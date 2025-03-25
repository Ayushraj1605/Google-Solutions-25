import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const OrgAnalyticsScreen = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Hard-coded data for organization analytics
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [240, 310, 390, 450, 520, 610],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Active Users']
  };
  
  const deviceCollectionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [350, 420, 510, 580, 650, 720],
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Devices Collected']
  };
  
  const deviceTypeData = [
    {
      name: 'Smartphones',
      population: 42,
      color: '#FF6384',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Laptops',
      population: 23,
      color: '#36A2EB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Tablets',
      population: 14,
      color: '#FFCE56',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Desktops',
      population: 12,
      color: '#4BC0C0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Others',
      population: 9,
      color: '#9966FF',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ];
  
  const carbonReductionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [15, 22, 30, 35, 42, 50],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Carbon Reduction (tonnes)']
  };
  
  const userLocationData = {
    labels: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai'],
    datasets: [
      {
        data: [28, 22, 18, 15, 12],
        color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Users by City (%)']
  };
  
  const orgImpactData = {
    totalDevicesCollected: 15789,
    totalUsers: 3254,
    carbonReduction: 1250,
    recyclingPartners: 42
  };
  
  const certificateData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [250, 310, 390, 450, 510, 580],
        color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Certificates Issued']
  };
  
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    }
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <View style={styles.statsContainer}>
              <View style={styles.wideStatCard}>
                <View style={styles.statHeader}>
                  <MaterialCommunityIcons name="chart-line" size={24} color="#2ecc71" />
                  <Text style={styles.statHeaderText}>Organization Impact</Text>
                </View>
                <View style={styles.appStatsContainer}>
                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="devices" size={28} color="#3498db" />
                    <Text style={styles.statValue}>{orgImpactData.totalDevicesCollected.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Devices Collected</Text>
                  </View>
                  
                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="account-group" size={28} color="#9b59b6" />
                    <Text style={styles.statValue}>{orgImpactData.totalUsers.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Total Users</Text>
                  </View>
                  
                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="molecule-co2" size={28} color="#2ecc71" />
                    <Text style={styles.statValue}>{orgImpactData.carbonReduction.toLocaleString()} t</Text>
                    <Text style={styles.statLabel}>CO₂ Reduced</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>User Growth</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={userGrowthData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
            
            <Text style={styles.sectionTitle}>Device Collection Trend</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={deviceCollectionData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
            
            <Text style={styles.sectionTitle}>Carbon Reduction Impact</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={carbonReductionData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        );
        
      case 'users':
        return (
          <View style={styles.tabContent}>
            <View style={styles.statsContainer}>
              <View style={styles.wideStatCard}>
                <View style={styles.statHeader}>
                  <MaterialCommunityIcons name="account-group" size={24} color="#9b59b6" />
                  <Text style={styles.statHeaderText}>User Statistics</Text>
                </View>
                <View style={styles.wideStatContent}>
                  <Text style={styles.statItem}>Total Users: {orgImpactData.totalUsers.toLocaleString()}</Text>
                  <Text style={styles.statItem}>Active Monthly Users: 1,820</Text>
                  <Text style={styles.statItem}>Average Devices per User: 4.8</Text>
                  <Text style={styles.statItem}>User Retention Rate: 78%</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>User Geographic Distribution</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={userLocationData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                verticalLabelRotation={0}
              />
            </View>
            
            <Text style={styles.sectionTitle}>User Growth Trend</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={userGrowthData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
            
            <Text style={styles.sectionTitle}>Certificate Distribution</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={certificateData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        );
        
      case 'devices':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Device Types Collected</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={deviceTypeData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
              />
            </View>
            
            <Text style={styles.sectionTitle}>Device Collection Trend</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={deviceCollectionData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.wideStatCard}>
                <View style={styles.statHeader}>
                  <MaterialCommunityIcons name="devices" size={24} color="#3498db" />
                  <Text style={styles.statHeaderText}>Device Metrics</Text>
                </View>
                <View style={styles.wideStatContent}>
                  <Text style={styles.statItem}>Total Devices: {orgImpactData.totalDevicesCollected.toLocaleString()}</Text>
                  <Text style={styles.statItem}>Monthly Average: 540 devices</Text>
                  <Text style={styles.statItem}>Recycled Materials: 85.2 tonnes</Text>
                  <Text style={styles.statItem}>Most Common: Smartphones (42%)</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Device Age Distribution</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: ['< 1 yr', '1-2 yrs', '2-3 yrs', '3-5 yrs', '5+ yrs'],
                  datasets: [
                    {
                      data: [10, 22, 35, 25, 8],
                      color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
                      strokeWidth: 2
                    }
                  ],
                  legend: ['Device Age (%)']
                }}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
              />
            </View>
          </View>
        );
        
      case 'impact':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Environmental Impact</Text>
            <View style={styles.statsContainer}>
              <View style={styles.impactStatCard}>
                <MaterialCommunityIcons name="molecule-co2" size={32} color="#2ecc71" />
                <Text style={styles.impactStatValue}>{orgImpactData.carbonReduction.toLocaleString()} t</Text>
                <Text style={styles.impactStatLabel}>CO₂ Reduced</Text>
              </View>
              
              <View style={styles.impactStatCard}>
                <MaterialCommunityIcons name="water" size={32} color="#3498db" />
                <Text style={styles.impactStatValue}>4.8M L</Text>
                <Text style={styles.impactStatLabel}>Water Saved</Text>
              </View>
              
              <View style={styles.impactStatCard}>
                <MaterialCommunityIcons name="battery-charging" size={32} color="#f39c12" />
                <Text style={styles.impactStatValue}>3.2M kWh</Text>
                <Text style={styles.impactStatLabel}>Energy Saved</Text>
              </View>
              
              <View style={styles.impactStatCard}>
                <MaterialCommunityIcons name="trash-can" size={32} color="#e74c3c" />
                <Text style={styles.impactStatValue}>85.2 t</Text>
                <Text style={styles.impactStatLabel}>Landfill Diverted</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Carbon Reduction Trend</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={carbonReductionData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
            
            <Text style={styles.sectionTitle}>Materials Recovered</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={[
                  {
                    name: 'Aluminum',
                    population: 28,
                    color: '#95a5a6',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  },
                  {
                    name: 'Copper',
                    population: 22,
                    color: '#e67e22',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  },
                  {
                    name: 'Gold',
                    population: 5,
                    color: '#f1c40f',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  },
                  {
                    name: 'Plastics',
                    population: 32,
                    color: '#3498db',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  },
                  {
                    name: 'Others',
                    population: 13,
                    color: '#9966FF',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  }
                ]}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
              />
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.wideStatCard}>
                <View style={styles.statHeader}>
                  <MaterialCommunityIcons name="earth" size={24} color="#27ae60" />
                  <Text style={styles.statHeaderText}>Contribution to E-Waste Solution</Text>
                </View>
                <View style={styles.wideStatContent}>
                  <Text style={styles.statItem}>% of India's E-Waste Handled: 0.36%</Text>
                  <Text style={styles.statItem}>Year-over-Year Growth: 42%</Text>
                  <Text style={styles.statItem}>Partner Organizations: {orgImpactData.recyclingPartners}</Text>
                  <Text style={styles.statItem}>Awareness Events Conducted: 128</Text>
                </View>
              </View>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Organization Analytics</Text>
      </View> */}
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'devices' && styles.activeTab]}
          onPress={() => setActiveTab('devices')}
        >
          <Text style={[styles.tabText, activeTab === 'devices' && styles.activeTabText]}>Devices</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'impact' && styles.activeTab]}
          onPress={() => setActiveTab('impact')}
        >
          <Text style={[styles.tabText, activeTab === 'impact' && styles.activeTabText]}>Impact</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
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
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginVertical: 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    width: '30%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  wideStatCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#2c3e50',
  },
  wideStatContent: {
    padding: 16,
  },
  statItem: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
  },
  appStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  impactStatCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 16,
  },
  impactStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#2c3e50',
  },
  impactStatLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 30,
  }
});

export default OrgAnalyticsScreen;