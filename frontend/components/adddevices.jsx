import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  View,
  Dimensions
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Cards from './devicecards';

const PlusIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 4V20M4 12H20" 
      stroke={color} 
      strokeWidth={2.5} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const AddDeviceButton = ({ style }) => {
  const [isExtended, setIsExtended] = useState(true);
  const scrollThreshold = 20;
  const buttonWidth = useRef(new Animated.Value(170)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  const buttonPosition = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(0.3)).current;

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    const shouldBeExtended = currentScrollPosition <= scrollThreshold;
    
    if (shouldBeExtended !== isExtended) {
      setIsExtended(shouldBeExtended);
    }
  };

  useEffect(() => {
    const animations = [
      Animated.timing(buttonWidth, {
        toValue: isExtended ? 170 : 56,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(labelOpacity, {
        toValue: isExtended ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPosition, {
        toValue: isExtended ? 0 : 10,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: isExtended ? 0.3 : 0.5,
        duration: 250,
        useNativeDriver: false,
      })
    ];

    Animated.parallel(animations).start();
  }, [isExtended]);

  const handlePress = () => {
    // Show pressed state animation
    Animated.sequence([
      Animated.timing(buttonOpacity, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    console.log('Add device pressed');
  };

  const renderCards = () => {
    return Array(10).fill().map((_, index) => (
      <Cards key={`card-${index}`} />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        onScroll={onScroll} 
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {renderCards()}
      </ScrollView>
      
      <Animated.View
        style={[
          styles.fabContainer,
          {
            width: buttonWidth,
            shadowOpacity: shadowOpacity,
          },
          style
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePress}
          style={styles.touchable}
        >
          <Animated.View 
            style={[
              styles.buttonContent, 
              { opacity: buttonOpacity, transform: [{ translateX: buttonPosition }] }
            ]}
          >
            <PlusIcon color="#FFFFFF" size={24} />
            <Animated.Text 
              style={[
                styles.buttonLabel,
                { opacity: labelOpacity }
              ]}
              numberOfLines={1}
            >
              Add Device
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 80, // Space for FAB
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#609966',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddDeviceButton;