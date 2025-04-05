// components/orgOrders/DateFilter.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

const DateFilter = ({
  selectedDate,
  markedDates = {}, // Add default empty object
  onDateSelect
}) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const formatDate = (date) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getMarkedDates = () => {
    if (!selectedDate) return {};

    const formattedMarkedDates = {};

    // Add the currently selected date if valid
    if (selectedDate instanceof Date && !isNaN(selectedDate)) {
      const dateString = selectedDate.toISOString().split('T')[0];
      formattedMarkedDates[dateString] = {
        selected: true,
        selectedColor: '#2ecc71'
      };
    }

    // Add other dates with their statuses if markedDates exists
    if (markedDates && typeof markedDates === 'object') {
      Object.keys(markedDates).forEach(date => {
        const status = markedDates[date];
        formattedMarkedDates[date] = {
          ...formattedMarkedDates[date],
          dotColor: status === 'completed' ? '#2ecc71' : '#e74c3c',
          marked: true
        };
      });
    }

    return formattedMarkedDates;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dateSelector}
        onPress={() => setCalendarVisible(true)}
      >
        <View style={styles.dateDisplay}>
          <MaterialCommunityIcons name="calendar" size={24} color="#2ecc71" />
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-down" size={24} color="#7f8c8d" />
      </TouchableOpacity>

      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setCalendarVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>

            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#2ecc71' }]} />
                <Text style={styles.legendText}>All Orders Completed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
                <Text style={styles.legendText}>Pending Orders</Text>
              </View>
            </View>

            <Calendar
              current={selectedDate.toISOString().split('T')[0]}
              markedDates={getMarkedDates()}
              onDayPress={(day) => {
                onDateSelect(new Date(day.timestamp));
                setCalendarVisible(false);
              }}
              theme={{
                todayTextColor: '#2ecc71',
                selectedDayBackgroundColor: '#2ecc71',
                arrowColor: '#2ecc71',
              }}
            />

            <View style={styles.calendarFooter}>
              <TouchableOpacity
                style={styles.todayButton}
                onPress={() => {
                  onDateSelect(new Date());
                  setCalendarVisible(false);
                }}
              >
                <Text style={styles.todayButtonText}>Go to Today</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  calendarFooter: {
    marginTop: 16,
    alignItems: 'center',
  },
  todayButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  todayButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  }
});

export default DateFilter;