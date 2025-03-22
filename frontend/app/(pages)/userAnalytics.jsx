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
// import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
// const navigtion = useNavigation();
const AnalyticsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('personal');
  
  // Hard-coded data for visualization
  const personalImpactData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2, 5, 3, 7, 4, 9],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Devices Recycled']
  };
  
  const carbonReductionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 65, 40, 80],
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['CO₂ Reduction (kg)']
  };
  
  const indiaEwasteData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        data: [3200, 3500, 3800, 4100, 4350],
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['E-Waste Generated (thousand tonnes)']
  };
  
  const globalEwasteData = {
    labels: ['Asia', 'America', 'Europe', 'Africa', 'Oceania'],
    datasets: [
      {
        data: [24700, 13100, 12000, 2900, 700],
        color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['E-Waste by Region (thousand tonnes)']
  };
  
  const pieChartData = [
    {
      name: 'Smartphones',
      population: 35,
      color: '#FF6384',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Computers',
      population: 25,
      color: '#36A2EB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'TVs',
      population: 15,
      color: '#FFCE56',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Peripherals',
      population: 10,
      color: '#4BC0C0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Others',
      population: 15,
      color: '#9966FF',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ];
  
  const appImpactData = {
    totalDevicesRecycled: 15789,
    totalUsersContributing: 3254,
    carbonReduction: 1250,
    certificatesIssued: 4231
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
      case 'personal':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Your Recycling History</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={personalImpactData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
            
            <Text style={styles.sectionTitle}>Your Carbon Footprint Reduction</Text>
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
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="recycle" size={28} color="#2ecc71" />
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Devices Recycled</Text>
              </View>
              
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="leaf" size={28} color="#3498db" />
                <Text style={styles.statValue}>85 kg</Text>
                <Text style={styles.statLabel}>CO₂ Saved</Text>
              </View>
              
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="certificate" size={28} color="#f39c12" />
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Certificates</Text>
              </View>
            </View>
          </View>
        );
        
      case 'india':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>India's E-Waste Generation</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={indiaEwasteData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
            
            <Text style={styles.sectionTitle}>E-Waste Composition</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
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
                  <MaterialCommunityIcons name="alert-circle" size={24} color="#e74c3c" />
                  <Text style={styles.statHeaderText}>Critical Stats</Text>
                </View>
                <View style={styles.wideStatContent}>
                  <Text style={styles.statItem}>Annual E-Waste: 4.35 million tonnes</Text>
                  <Text style={styles.statItem}>Recycled Formally: ~22%</Text>
                  <Text style={styles.statItem}>CO₂ Emissions: 12.5 million tonnes</Text>
                  <Text style={styles.statItem}>Growing at: 8% annually</Text>
                </View>
              </View>
            </View>
          </View>
        );
        
      case 'global':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Global E-Waste Distribution</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={globalEwasteData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                verticalLabelRotation={30}
              />
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.wideStatCard}>
                <View style={styles.statHeader}>
                  <MaterialCommunityIcons name="earth" size={24} color="#3498db" />
                  <Text style={styles.statHeaderText}>Global Impact</Text>
                </View>
                <View style={styles.wideStatContent}>
                  <Text style={styles.statItem}>Annual E-Waste: 53.4 million tonnes</Text>
                  <Text style={styles.statItem}>Recycled Properly: ~17.4%</Text>
                  <Text style={styles.statItem}>Value of Raw Materials: $57 billion</Text>
                  <Text style={styles.statItem}>CO₂ Equivalent: 98 million tonnes</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Annual Growth Trend</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                  datasets: [
                    {
                      data: [50, 53.4, 56.8, 59.4, 62.0, 64.7],
                      color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                      strokeWidth: 2
                    }
                  ],
                  legend: ['E-Waste (million tonnes)']
                }}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        );
        
      case 'app':
        return (
          <View style={styles.tabContent}>
            <View style={styles.appStatsContainer}>
              <View style={styles.appStatCard}>
                <MaterialCommunityIcons name="devices" size={32} color="#3498db" />
                <Text style={styles.appStatValue}>{appImpactData.totalDevicesRecycled.toLocaleString()}</Text>
                <Text style={styles.appStatLabel}>Devices Recycled</Text>
              </View>
              
              <View style={styles.appStatCard}>
                <MaterialCommunityIcons name="account-group" size={32} color="#9b59b6" />
                <Text style={styles.appStatValue}>{appImpactData.totalUsersContributing.toLocaleString()}</Text>
                <Text style={styles.appStatLabel}>Active Users</Text>
              </View>
              
              <View style={styles.appStatCard}>
                <MaterialCommunityIcons name="molecule-co2" size={32} color="#2ecc71" />
                <Text style={styles.appStatValue}>{appImpactData.carbonReduction.toLocaleString()} t</Text>
                <Text style={styles.appStatLabel}>CO₂ Reduced</Text>
              </View>
              
              <View style={styles.appStatCard}>
                <MaterialCommunityIcons name="certificate-outline" size={32} color="#f39c12" />
                <Text style={styles.appStatValue}>{appImpactData.certificatesIssued.toLocaleString()}</Text>
                <Text style={styles.appStatLabel}>Certificates</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>App Contribution to India's E-Waste Problem</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={[
                  {
                    name: 'App Impact',
                    population: 1.5,
                    color: '#27ae60',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  },
                  {
                    name: 'Remaining',
                    population: 98.5,
                    color: '#bdc3c7',
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
            
            <Text style={styles.sectionTitle}>Monthly Growth in User Contributions</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    {
                      data: [210, 280, 340, 390, 450, 520],
                      color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                      strokeWidth: 2
                    }
                  ],
                  legend: ['Devices Recycled per Month']
                }}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Environmental Analytics</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
          onPress={() => setActiveTab('personal')}
        >
          <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>Personal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'india' && styles.activeTab]}
          onPress={() => setActiveTab('india')}
        >
          <Text style={[styles.tabText, activeTab === 'india' && styles.activeTabText]}>India</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'global' && styles.activeTab]}
          onPress={() => setActiveTab('global')}
        >
          <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>Global</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'app' && styles.activeTab]}
          onPress={() => setActiveTab('app')}
        >
          <Text style={[styles.tabText, activeTab === 'app' && styles.activeTabText]}>App Impact</Text>
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
    marginTop: 16,
  },
  appStatCard: {
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
  appStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#2c3e50',
  },
  appStatLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 30,
  }
});

export default AnalyticsScreen;