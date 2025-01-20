import { Animated, Text, View, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import '../../global.css';
import { images } from '../../constants';

const Loader = () => {
  const [glowValue, setGlowValue] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animated.loop(
      Animated.sequence([
        Animated.timing(glowValue, {
          toValue: 1.2,  // Light up the glow effect (scale)
          duration: 500, // Duration of light up effect
          useNativeDriver: true,
        }),
        Animated.timing(glowValue, {
          toValue: 1,  // Fade the glow back
          duration: 500, // Duration of fade effect
          useNativeDriver: true,
        }),
      ])
    // ).start();
  }, []);

  return (
    <View className="w-full h-full justify-center items-center bg-black">
      <Animated.Image
        key="loader-image" // Provide a unique key
        source={images.Logo}
        resizeMode="contain"
        className="w-60 h-60 rounded-xl shadow-lg"
        style={{
          // Applying Tailwind classes and dynamic styles
          shadowColor: '#00FF00',  // Green glow color
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 15,
          elevation: 10,
          transform: [{ scale: glowValue }],  // Scale for glowing effect
        }}
      />
      {/* <Text className="text-white mt-4">Loading...</Text> */}
    </View>
  );
};

export default Loader;
