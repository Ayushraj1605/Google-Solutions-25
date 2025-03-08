import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import NewsCards from './Newscards';
import BlogCards from './blogcards';
import FactsCards from './factscard';

const Segments = ({ name }) => {
  const [value, setValue] = React.useState('');

  return (
    <SafeAreaView style={styles.container} showsVerticalScrollIndicator={false}>
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
            <ScrollView className='p-2 w-full overflow-hidden' showsVerticalScrollIndicator={false}>
              <BlogCards></BlogCards>
              <BlogCards></BlogCards>
            </ScrollView>
          </Text>
        ) : value === 'News' ? (
          <Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <NewsCards></NewsCards>
              <NewsCards></NewsCards>
              <NewsCards></NewsCards>
            </ScrollView>
          </Text>
        ) : value === 'Facts' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <FactsCards></FactsCards>
            <FactsCards></FactsCards>
            <FactsCards></FactsCards>
            <FactsCards></FactsCards>
          </ScrollView>
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