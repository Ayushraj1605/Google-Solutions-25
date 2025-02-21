import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import Cards from './blogcards';
import NewsCards from './Newscards';

const Segments = ({name}) => {
  const [value, setValue] = React.useState('');

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'Blogs',
            label: 'Blogs',
          },
          {
            value: 'News',
            label: 'News',
          },
          {
            value: 'Facts',
            label: 'Facts',
          },
        ]}
        style={styles.buttons}
      />
      
        <View className="items-center pt-4 w-full h-full">
          {value === 'Blogs' ? (
            <Text>
              <ScrollView className='p-2 w-full overflow-hidden'> 
                <Cards></Cards>
                <Cards></Cards>
                <Cards></Cards>
              </ScrollView>
            </Text>
          ) : value === 'News' ? (
            <Text>
              <ScrollView>
                <NewsCards></NewsCards>
                <NewsCards></NewsCards>
                <NewsCards></NewsCards>
              </ScrollView>
            </Text>
          ) : value === 'Facts' ? (
            <Text>Displaying Facts</Text>
          ) : null}
        </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
    // backgroundColor: 'white',
  },
  buttons: {
    width: '100%',
    justifyContent: 'center',
  },
});

export default Segments;