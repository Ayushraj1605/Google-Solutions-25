import React from 'react'
import '../../global.css'
import Cards from '../../components/devicecards'
import SearchBar from '../../components/searchbar'
// import AddDeviceButton from '../../components/adddevices'
import {
  View,
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

const devices = ({
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
    <View className="w-full h-full items-center bg-white">
      <SearchBar />
      <ScrollView onScroll={onScroll} contentContainerStyle={{ alignItems: 'center' }} className="flex w-full h-full">
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
      </ScrollView>
      <AnimatedFAB
        icon={'plus'}
        label={'  Add Device'}
        extended={isExtended}
        onPress={() => console.log('Pressed')}
        visible={visible}
        animateFrom={'left'}
        iconMode={'static'}
        iconColor="#FFFFFF"
        labelStyle={styles.fabLabel}
        style={[styles.fabStyle, style, fabStyle]}
      />
    </View>
  )
}

export default devices

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 16,
    left: 16,
    position: 'absolute',
    backgroundColor: "#609966",
    shadowColor: "#000",
    color: "#FFFFFF",
  },
  fabLabel: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});