import { Animated, Text, View, Easing, Platform } from 'react-native';
import React, { useEffect, useRef } from 'react';
import '../../global.css';
import Logo from '../../assets/svg/logo';

const Loader = () => {
  // Animation values
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0.7)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Pulsing scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Text fading animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle rotation animation for dynamic feel
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow effect animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Cleanup animations on unmount
    return () => {
      scaleValue.stopAnimation();
      opacityValue.stopAnimation();
      rotateValue.stopAnimation();
      glowOpacity.stopAnimation();
    };
  }, []);

  // Convert rotation value to degrees
  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Create two shadow views for more dynamic glow effect
  const renderGlowEffect = () => {
    if (Platform.OS === 'android') {
      // Android doesn't support multiple shadows well, use elevated view
      return null;
    }

    return (
      <>
        <Animated.View 
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: 'transparent',
            opacity: glowOpacity,
            // COLOR PART: Main outer glow color
            shadowColor: '#00FF00',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 25,
          }}
        />
        <Animated.View 
          style={{
            position: 'absolute',
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: 'transparent',
            opacity: glowOpacity,
            // COLOR PART: Inner glow color (brighter green)
            shadowColor: '#39FF14',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 15,
          }}
        />
      </>
    );
  };

  return (
    // COLOR PART: Main background color - changed from black to green
    <View className="w-full h-full justify-center items-center" style={{ backgroundColor: '#1A4D2E' }}>
      {/* Glow effect layers */}
      {renderGlowEffect()}
      
      {/* Logo with animations */}
      <Animated.View
        style={{
          transform: [
            // { scale: scaleValue },
            // { rotate: spin }
          ],
          // COLOR PART: Logo shadow color
          shadowColor: '#00FF00',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        <Logo width={350} height={350} />
      </Animated.View>
      
      {/* Loading text with pulse animation */}
      <Animated.Text 
        // COLOR PART: Text color
        style={{
          color: '#FFFFFF',
          marginTop: 32,
          fontSize: 18,
          fontWeight: '600',
          letterSpacing: 2,
          opacity: opacityValue,
        }}
      >
        Loading...
      </Animated.Text>

      {/* Optional: Additional decorative elements */}
      {/* COLOR PART: Decorative element background color */}
      <View style={{ 
        position: 'absolute', 
        bottom: 40, 
        backgroundColor: '#2E8B57', 
        paddingHorizontal: 20, 
        paddingVertical: 8, 
        borderRadius: 20,
        opacity: 0.7
      }}>
        <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>E-Waste Management</Text>
      </View>
    </View>
  );
};

export default Loader;