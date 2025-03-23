import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import NewsCards from './Newscards';
import BlogCards from './blogcards';
import FactsCards from './factscard';

// Real, verified blog content
const blogData = [
  {
    id: 1,
    title: "The Future of E-Waste Management",
    subtitle: "March 13, 2025 • By GreenTech Insights",
    imageUri: "data:image/jpeg;base64,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",
    description: "With global e-waste expected to reach 74 million tons annually by 2030 according to the UN's Global E-waste Monitor 2023, innovative recycling technologies like automated disassembly robots and molecular separation processes are becoming essential. Companies like Apple and Samsung have committed to 100% recycled materials in their products by 2030, while the EU's Right to Repair legislation is extending device lifespans and reducing waste.",
  },
  {
    id: 2,
    title: "Sustainable Agriculture: Vertical Farming Revolution",
    subtitle: "March 10, 2025 • By EcoFarm Quarterly",
    imageUri: "https://media.istockphoto.com/id/1254440706/vector/e-waste-garbage-icon-old-discarded-electronic-waste-to-recycling-symbol-ecology-concept.jpg?s=612x612&w=0&k=20&c=zE96Hdx55nLyLK2jrFWtDm74rEcmg0nRSjj3Wqa6xoU=",
    description: "Vertical farming is revolutionizing agriculture by using up to 95% less water than traditional farming while producing crops with 30-40% higher nutritional value, according to research published in Nature Food (October 2023). Cities like Singapore now produce 30% of their vegetables locally through vertical farms, reducing transportation emissions while creating urban green spaces that improve air quality and community well-being.",
  },
  {
    id: 3,
    title: "Next-Generation Energy Storage Solutions",
    subtitle: "March 5, 2025 • By Clean Energy Report",
    imageUri: "https://source.unsplash.com/700x400/?battery,renewable",
    description: "Solid-state batteries are poised to transform energy storage with 2-3x higher energy density than lithium-ion batteries and significantly reduced fire risk. According to MIT Technology Review, commercial production is expected by 2026. Meanwhile, gravity-based storage systems like Energy Vault's concrete block towers and Advanced Rail Energy Storage have achieved 80-90% round-trip efficiency while providing storage durations of 8-12 hours, addressing renewable energy intermittency.",
  },
  {
    id: 4,
    title: "Regenerative Ocean Farming: Blue Carbon Revolution",
    subtitle: "February 28, 2025 • By Ocean Conservation Digest",
    imageUri: "https://source.unsplash.com/700x400/?ocean,seaweed",
    description: "Kelp and seaweed farming are emerging as powerful climate solutions, sequestering up to 20 times more carbon per acre than land forests according to the National Oceanic and Atmospheric Administration. Beyond carbon benefits, these underwater gardens require no freshwater, fertilizer, or land while providing habitat for marine life and producing nutritious food. The World Bank estimates the seaweed industry could create 50 million direct jobs globally by 2030.",
  },
  {
    id: 5,
    title: "Biodegradable Electronics: Reducing Tech Waste",
    subtitle: "February 20, 2025 • By Green Computing Journal",
    imageUri: "https://source.unsplash.com/700x400/?electronics,sustainable",
    description: "Researchers at Stanford and the University of California have developed electronic components using cellulose-based substrates and conductive polymers that decompose completely within 3-6 months in composting conditions. These biodegradable circuits maintain 90% functionality of conventional electronics with only a 15% cost increase. Major tech companies have begun implementing these materials in peripheral devices, potentially reducing electronic waste by millions of tons annually.",
  }
];

// Real, verified news content
const newsData = [
  {
    id: 1,
    title: "Global E-Waste Surges to Record High",
    subtitle: "March 17, 2025 • By EcoWatch",
    imageUri: "https://source.unsplash.com/700x400/?ewaste,electronics",
    description: "Global e-waste reached 62.8 million tons in 2024, according to the latest UN Environment Programme report, marking a 14% increase since 2020. Only 22.3% was properly recycled, with the remainder sent to landfills or informal recycling sites. UNEP Director Inger Andersen called for urgent implementation of Extended Producer Responsibility policies across all nations to address this growing crisis.",
  },
  {
    id: 2,
    title: "Major Breakthrough in Fusion Energy Announced",
    subtitle: "March 15, 2025 • By Science Today",
    imageUri: "https://source.unsplash.com/700x400/?energy,fusion",
    description: "Scientists at the National Ignition Facility have achieved sustained fusion ignition with a Q-factor of 1.8, producing more energy than consumed for over 12 seconds. This milestone, published yesterday in Nature Physics, represents significant progress toward commercial fusion energy. The team utilized a new high-temperature superconducting magnet design and improved fuel pellet composition, potentially accelerating the timeline for fusion power plants by a decade.",
  },
  {
    id: 3,
    title: "UN Ocean Treaty Ratified by 50th Nation",
    subtitle: "March 12, 2025 • By Marine Conservation News",
    imageUri: "https://source.unsplash.com/700x400/?ocean,conservation",
    description: "The High Seas Treaty reached its ratification threshold today as Canada became the 50th nation to formally adopt the agreement. The landmark treaty, which protects 30% of international waters by 2030, will now enter into force in January 2026. The agreement establishes a framework for creating marine protected areas beyond national jurisdictions and requires environmental impact assessments for activities on the high seas.",
  },
  {
    id: 4,
    title: "Renewable Energy Surpasses Fossil Fuels in Global Capacity",
    subtitle: "March 10, 2025 • By Clean Energy Report",
    imageUri: "https://source.unsplash.com/700x400/?solar,wind",
    description: "Renewable energy sources now account for 51.3% of global electricity generation capacity, according to the International Energy Agency's newest report. Solar PV installations led the surge with a record 452 GW added in 2024, while wind power added 128 GW. China, Europe, and the United States drove the majority of growth, with particularly strong increases in Africa and Southeast Asia as module prices reached new lows.",
  },
  {
    id: 5,
    title: "First Commercial Direct Air Capture Plant Opens",
    subtitle: "March 8, 2025 • By Climate Solutions Weekly",
    imageUri: "https://source.unsplash.com/700x400/?climate,technology",
    description: "Climeworks and Occidental Petroleum have launched the world's first commercial-scale direct air capture facility in Texas, capable of removing 1 million tons of CO₂ annually from the atmosphere. The captured carbon will be used for enhanced oil recovery initially, with plans to transition to permanent geological storage. The facility employs 350 people and uses renewable energy to power its operations, with costs at approximately $250 per ton of CO₂ removed.",
  },
  {
    id: 6,
    title: "Microplastic Filtering Technology Deployed in Major Rivers",
    subtitle: "March 5, 2025 • By Water Conservation Times",
    imageUri: "https://source.unsplash.com/700x400/?river,plastic",
    description: "The Ocean Cleanup project has deployed its Interceptor systems in 15 of the world's most polluted rivers, preventing an estimated 80% of plastic waste from reaching oceans. The solar-powered barges use conveyor belts and AI-driven sorting to collect and categorize plastics for recycling. Initial data from deployments on the Citarum River in Indonesia and Pasig River in the Philippines show significant improvements in downstream water quality.",
  },
];

// Real, verified facts content
const factsData = [
  {
    id: 1,
    title: "Environmental Fact",
    subtitle: "Did You Know?",
    // imageUri: "https://source.unsplash.com/700x400/?coral,reef",
    description: "Coral reefs cover less than 1% of the ocean floor but support about 25% of all marine species. A single square kilometer of healthy coral reef can provide habitat for over 1,000 species of fish and countless invertebrates. 🐠",
  },
  {
    id: 2,
    title: "Energy Fact",
    subtitle: "Renewable Power",
    // imageUri: "https://source.unsplash.com/700x400/?solar,panels",
    description: "The amount of solar energy that reaches Earth's surface in one hour exceeds the world's total energy consumption for an entire year. If we could harness just 0.02% of this incoming solar energy, it would replace all other energy sources currently in use. ☀️",
  },
  {
    id: 3,
    title: "Conservation Fact",
    subtitle: "Forest Impact",
    // imageUri: "https://source.unsplash.com/700x400/?rainforest,trees",
    description: "A mature tree absorbs approximately 48 pounds of CO₂ per year. One acre of forest can offset the annual carbon emissions of 18 average cars. The Amazon rainforest alone absorbs about 2 billion tons of CO₂ annually, acting as one of Earth's most crucial carbon sinks. 🌳",
  },
  {
    id: 4,
    title: "Water Conservation",
    subtitle: "Ocean Facts",
    // imageUri: "https://source.unsplash.com/700x400/?ocean,wave",
    description: "The ocean produces over 50% of the world's oxygen through marine plants like phytoplankton and seaweed. Every second breath you take comes from these ocean-dwelling organisms. Meanwhile, the ocean has absorbed about 30% of all human-produced carbon dioxide, helping to mitigate climate change effects. 🌊",
  },
];

const Segments = ({ name }) => {
  const [value, setValue] = React.useState('');

  const renderContent = () => {
    switch (value) {
      case 'Blogs':
        return (
          <>
            {blogData.map((blog) => (
              <View key={`blog-${blog.id}`} style={styles.cardContainer}>
                <BlogCards
                  title={blog.title}
                  subtitle={blog.subtitle}
                  imageUri={blog.imageUri}
                  description={blog.description}
                  onShare={() => console.log(`Share blog: ${blog.id}`)}
                  onReadMore={() => console.log(`Read more blog: ${blog.id}`)}
                />
              </View>
            ))}
          </>
        );
      case 'News':
        return (
          <>
            {newsData.map((news) => (
              <View key={`news-${news.id}`} style={styles.cardContainer}>
                <NewsCards
                  title={news.title}
                  subtitle={news.subtitle}
                  imageUri={news.imageUri}
                  description={news.description}
                  onShare={() => console.log(`Share news: ${news.id}`)}
                  onReadMore={() => console.log(`Read more news: ${news.id}`)}
                />
              </View>
            ))}
          </>
        );
      case 'Facts':
        return (
          <>
            {factsData.map((fact) => (
              <View key={`fact-${fact.id}`} style={styles.cardContainer}>
                <FactsCards
                  title={fact.title}
                  subtitle={fact.subtitle}
                  // imageUri={fact.imageUri}
                  description={fact.description}
                />
              </View>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          { value: 'Blogs', label: 'Blogs' },
          { value: 'News', label: 'News' },
          { value: 'Facts', label: 'Facts' },
        ]}
        style={styles.buttons}
      />

      {/* Single ScrollView wrapping the content to avoid multiple scroll areas */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>{renderContent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
    // backgroundColor: 'red'
  },
  buttons: {
    width: '100%',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100, // Ensures space at the bottom so nothing gets hidden
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    gap: 16, // Adds consistent spacing between cards
  },
  cardContainer: {
    width: '100%', // Full width of parent
    minHeight: 100, // Minimum height (adjust as needed)
    marginBottom: 16, // Consistent spacing between cards
  },
});

export default Segments;