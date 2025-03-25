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
import { LineChart, PieChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const AnalyticsScreen = () => {
  const [activeTab, setActiveTab] = useState('personal');
  
  // Simplified data focusing on key metrics
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
  
  const pieChartData = [
    {
      name: 'Your Impact',
      population: 1.5,
      color: '#27ae60',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Potential',
      population: 98.5,
      color: '#bdc3c7',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ];
  
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
                <MaterialCommunityIcons name="tree" size={28} color="#27ae60" />
                <Text style={styles.statValue}>4</Text>
                <Text style={styles.statLabel}>Trees Equivalent</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Your Recycling Journey</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={personalImpactData}
                width={width - 40}
                height={200}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
            
            <View style={styles.motivationCard}>
              <MaterialCommunityIcons name="star" size={24} color="#f39c12" />
              <Text style={styles.motivationText}>You're in the top 10% of eco-friendly users this month!</Text>
            </View>
          </View>
        );
        
      case 'impact':
        return (
          <View style={styles.tabContent}>
            <View style={styles.impactStatsContainer}>
              <View style={styles.wideStatCard}>
                <View style={styles.statHeader}>
                  <MaterialCommunityIcons name="earth" size={24} color="#3498db" />
                  <Text style={styles.statHeaderText}>Your Environmental Impact</Text>
                </View>
                <View style={styles.wideStatContent}>
                  <Text style={styles.statItem}>• Saved 85kg of CO₂ emissions</Text>
                  <Text style={styles.statItem}>• Prevented 5kg of toxic materials</Text>
                  <Text style={styles.statItem}>• Conserved 1200L of water</Text>
                  <Text style={styles.statItem}>• Equivalent to planting 4 trees</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Your Contribution to Change</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={width - 40}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
              />
            </View>
            
            <View style={styles.motivationCard}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#f39c12" />
              <Text style={styles.motivationText}>Every device recycled reduces e-waste by up to 1.5kg. Recycle 3 more devices to earn your next certificate!</Text>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark"/>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Impact</Text>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
            onPress={() => setActiveTab('personal')}
          >
            <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'impact' && styles.activeTab]}
            onPress={() => setActiveTab('impact')}
          >
            <Text style={[styles.tabText, activeTab === 'impact' && styles.activeTabText]}>Environmental Impact</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderTabContent()}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // direction: 'ltr',
    // backgroundColor: '#f5f6fa',
  },
  container: {
    // marginTop: 60,
    paddingTop: 42,
    // backgroundColor: 'red',
    flex: 1,
  },
  header: {
    backgroundColor: 'blue',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // paddingTop: 50,
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
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    width: '31%',
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
  impactStatsContainer: {
    marginTop: 8,
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
  motivationCard: {
    backgroundColor: '#fff8e1',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  motivationText: {
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 12,
    flex: 1,
  },
  bottomSpacer: {
    height: 30,
  }
});

export default AnalyticsScreen;