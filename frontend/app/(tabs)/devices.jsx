import React from 'react'
import '../../global.css'
import Cards from '../../components/devicecards'
import SearchBar from '../../components/searchbar'
import {View, StyleSheet, Platform, ScrollView } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

const Devices = ({
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
}) => {
  const navigation = useNavigation();
  const [isExtended, setIsExtended] = React.useState(true);

  const isIOS = Platform.OS === 'ios';

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };

  const handlePress = () => {
    router.push('/deviceinfo');
  };
  
  return (
    <View className="w-full h-full items-center bg-white">
      <SearchBar />
      <ScrollView onScroll={onScroll} contentContainerStyle={{ alignItems: 'center' }} className="flex w-full h-full">
        {[...new Array(10).keys()].map((_, i) => (
          <Cards />
        ))}
      </ScrollView>
      <AnimatedFAB
        icon={'plus'}
        label={'  Add Device'}
        extended={isExtended}
        onPress={() => handlePress()}
        visible={visible}
        animateFrom={'left'}
        iconMode={'static'}
        color="white"
        uppercaseLabel={false}
        labelStyle={{ color: '#FFFFFF' }}
        style={[styles.fabStyle, style, fabStyle]}
      />
    </View>
  )
}
export default Devices

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 16,
    left: 16,
    position: 'absolute',
    backgroundColor: "#609966",
  },
});