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
              <BlogCards 
              title={"EcoMinded27"}
              imageUrl={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnS1o3mO3S_Nkfw1WAGaRJ6KaOGgODpfoOsA&s"}
              body={"This app completely transformed how I handle old electronics! The pickup scheduling feature saved me so much time, and I love getting rewards points for each item I recycle. The tracking dashboard showing my environmental impact makes me feel like I'm actually making a difference. Five stars!"}></BlogCards>
              <BlogCards 
              title={"TechRecycler"}
              imageUrl={"data:image/jpeg;base64,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"}
              body={"As someone who regularly upgrades devices for work, this app is a game-changer. The barcode scanning feature instantly tells me how to properly dispose of each component, and the nearby drop-off locator is incredibly accurate. The app even reminded me about the battery recycling event in my neighborhood that I would have missed otherwise!"}></BlogCards>
              <BlogCards
              title={"GreenParent"}
              imageUrl={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s"}
              body={"Our family had a drawer full of old phones and tablets we didn't know what to do with until we found this app. The kids love the gamification elements - earning virtual badges for recycling milestones has turned responsible e-waste disposal into a fun activity! The educational content about environmental impact is presented in a way that even my 10-year-old understands. Would definitely recommend to other families."}></BlogCards>
            </ScrollView>
          </Text>
        ) : value === 'News' ? (
          <Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <NewsCards 
              title={"E-Waste News"}
              subtitle={"Latest Update"}
              headline={"China announces plans for major renewable projects to tackle climate change"}
              body={"China said on Wednesday it would develop a package of major projects to tackle climate change as it moved towards peak carbon emissions and carbon neutrality."}
              imageUrl={"https://etimg.etb2bimg.com/thumb/118739294.cms?width=400&height=300"}
              ></NewsCards>
              <NewsCards
              title={"E-Waste News"}
              subtitle={"Latest Update"}
              headline={"Record carbon emissions highlight urgency of Global Greenhouse Gas Watch"}
              body={"Global carbon emissions from fossil fuels reached a record high in 2024 and there is still “no sign” that the world has reached a peak, according to new research by the Global Carbon Project – one of the contributors to WMO’s United in Science reports.  "}
              imageUrl={"https://wmo.int/sites/default/files/styles/featured_image_x1_768x512/public/2024-11/thumbnails_7.jpg?h=d1cb525d&itok=cFMxdgac"}
              ></NewsCards>
              <NewsCards
              title={"E-Waste News"}
              subtitle={"Latest Update"}
              headline={"WMO Statement on the State of the Global Climate in 2021"}
              body={"The year 2021 was the fifth warmest year on record, according to the World Meteorological Organization. The global average temperature was 1.29°C above the pre-industrial baseline, according to the WMO State of the Global Climate report.  "}
              imageUrl={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ1n_VCVrtAajiHo2klxumVM8lUQgPmTPUQ&s"}>
              </NewsCards>
            </ScrollView>
          </Text>
        ) : value === 'Facts' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <FactsCards
            body={"E-waste is the fastest growing waste stream globally, with approximately 50-60 million metric tons generated annually."}></FactsCards>
            <FactsCards
            body={"Less than 20% of e-waste is formally recycled worldwide, with the remainder ending up in landfills or being informally processed."}
            ></FactsCards>
            <FactsCards
            body={"E-waste contains valuable materials like gold, silver, copper, and rare earth elements that can be recovered through proper recycling."}
            ></FactsCards>
            <FactsCards
            body={"Extended Producer Responsibility (EPR) programs in various countries make manufacturers responsible for the end-of-life management of their products."}
            ></FactsCards>
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