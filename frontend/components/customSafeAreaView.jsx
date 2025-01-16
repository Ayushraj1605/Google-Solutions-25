import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import '../global.css'

const CustomSafeAreaView = ({ children, style, ...props }) => {
  const insets = useSafeAreaInsets();

  const defaultStyle = {
    paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
    flex: 1,
    ...style,
  };

  return (
    <View style={defaultStyle} {...props}>
      {children}
    </View>
  );
};

export default CustomSafeAreaView;
