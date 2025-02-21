import React from 'react';
import {
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import Cards from './devicecards';

const AddDeviceButton = ({
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
}) => {
  const [isExtended, setIsExtended] = React.useState(true);

  const isIOS = Platform.OS === 'ios';

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };

  return (
    <SafeAreaView className="w-full h-full items-center bg-white">
      <ScrollView onScroll={onScroll} contentContainerStyle={{ alignItems: 'center' }} className="flex w-full h-full">
        {[...new Array(10).keys()].map((_, i) => (
          <Cards />
        ))}
      </ScrollView>
      <AnimatedFAB
        icon={'plus'}
        label={'  Add Device'}
        extended={isExtended}
        onPress={() => console.log('Pressed')}
        visible={visible}
        animateFrom={'left'}
        iconMode={'static'}
        color="white"
        uppercaseLabel={false}
        labelStyle={{ color: '#FFFFFF' }}
        style={[styles.fabStyle, style, fabStyle]}
      />
    </SafeAreaView>
  );
};

export default AddDeviceButton;

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 16,
    left: 16,
    position: 'absolute',
    backgroundColor: "#609966",
  },
});