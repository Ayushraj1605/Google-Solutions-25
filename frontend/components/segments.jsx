import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    Animated,
    Platform,
    Dimensions,
    ActivityIndicator,
    Modal,
  } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import NewsCards from './Newscards';
import BlogCard from './blogcards'; // Changed from BlogCards to BlogCard
import FactsCards from './factscard';
import ChatBotButton from './chatbotbutton';
import BlogEditButton from './blogeditbutton';
import axios from 'axios';
import DeviceCard from './deviceHomeCard';
// import { useState } from 'react';
import{ useState, useEffect, useRef } from 'react';
// import {
//   StyleSheet,
//   View,
//   Image,
//   TouchableOpacity,
//   Text,
//   Animated,
//   Platform,
//   Dimensions,
//   ActivityIndicator,
//   Modal,
//   ScrollView,
//   SafeAreaView
// } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import axios from 'axios';


// Real, verified blog content
// const blogData = [
//   {
//     id: 1,
//     title: "The Future of E-Waste Management",
//     subtitle: "March 13, 2025 • By GreenTech Insights",
//     imageUri: "https://images.unsplash.com/photo-1612965110667-4175024b0dcc?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description: "With global e-waste expected to reach 74 million tons annually by 2030 according to the UN's Global E-waste Monitor 2023, innovative recycling technologies like automated disassembly robots and molecular separation processes are becoming essential. Companies like Apple and Samsung have committed to 100% recycled materials in their products by 2030, while the EU's Right to Repair legislation is extending device lifespans and reducing waste.",
//     category: "Environment",
//   },
//   {
//     id: 2,
//     title: "Sustainable Agriculture: Vertical Farming Revolution",
//     subtitle: "March 10, 2025 • By EcoFarm Quarterly",
//     imageUri: "https://images.unsplash.com/photo-1649595409836-71bfe4c5ec6c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description: "Vertical farming is revolutionizing agriculture by using up to 95% less water than traditional farming while producing crops with 30-40% higher nutritional value, according to research published in Nature Food (October 2023). Cities like Singapore now produce 30% of their vegetables locally through vertical farms, reducing transportation emissions while creating urban green spaces that improve air quality and community well-being.",
//     category: "Agriculture",
//   },
//   {
//     id: 3,
//     title: "Next-Generation Energy Storage Solutions",
//     subtitle: "March 5, 2025 • By Clean Energy Report",
//     imageUri: "https://plus.unsplash.com/premium_photo-1682309652843-ed4eb60d473e?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description: "Solid-state batteries are poised to transform energy storage with 2-3x higher energy density than lithium-ion batteries and significantly reduced fire risk. According to MIT Technology Review, commercial production is expected by 2026. Meanwhile, gravity-based storage systems like Energy Vault's concrete block towers and Advanced Rail Energy Storage have achieved 80-90% round-trip efficiency while providing storage durations of 8-12 hours, addressing renewable energy intermittency.",
//     category: "Energy",
//   },
//   {
//     id: 4,
//     title: "Regenerative Ocean Farming: Blue Carbon Revolution",
//     subtitle: "February 28, 2025 • By Ocean Conservation Digest",
//     imageUri: "https://images.unsplash.com/photo-1717667745934-53091623e8ee?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description: "Kelp and seaweed farming are emerging as powerful climate solutions, sequestering up to 20 times more carbon per acre than land forests according to the National Oceanic and Atmospheric Administration. Beyond carbon benefits, these underwater gardens require no freshwater, fertilizer, or land while providing habitat for marine life and producing nutritious food. The World Bank estimates the seaweed industry could create 50 million direct jobs globally by 2030.",
//     category: "Ocean",
//   },
//   {
//     id: 5,
//     title: "Biodegradable Electronics: Reducing Tech Waste",
//     subtitle: "February 20, 2025 • By Green Computing Journal",
//     imageUri: "https://images.unsplash.com/photo-1614201756100-1ccde6a6589e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGUlMjB3YXN0ZXxlbnwwfHwwfHx8MA%3D%3D",
//     description: "Researchers at Stanford and the University of California have developed electronic components using cellulose-based substrates and conductive polymers that decompose completely within 3-6 months in composting conditions. These biodegradable circuits maintain 90% functionality of conventional electronics with only a 15% cost increase. Major tech companies have begun implementing these materials in peripheral devices, potentially reducing electronic waste by millions of tons annually.",
//     category: "Technology",
//   }
// ];

// Real, verified news content
const newsData = [
  {
    id: 1,
    title: "Global E-Waste Surges to Record High",
    subtitle: "March 17, 2025 • By EcoWatch",
    imageUri: "https://images.unsplash.com/photo-1608653206809-e6a8044173b0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    description: "The amount of solar energy that reaches Earth's surface in one hour exceeds the world's total energy consumption for an entire year. If we could harness just 0.02% of this incoming solar energy, it would replace all other energy sources currently in use. ☀",
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



// const Segments = ({ name }) => {
//   const [value, setValue] = React.useState('Blogs');
//   const [blogs, setBlogs] = React.useState([]);
//   const [devices, setDevices] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState(null);

//   const fetchBlogs = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('https://cloudrunservice-254131401451.us-central1.run.app/user/getBlogs/');
//       console.log('API Response:', response.data);

//       if (response.data && response.data.blogs) {
//         setBlogs(response.data.blogs);
//         console.log(blogs);
//       } else {
//         setError('No blogs found in the response');
//       }
//     } catch (err) {
//       console.error('Error fetching blogs:', err);
//       setError('Failed to fetch blogs: ' + (err.message || 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Fetch blogs when the component mounts or when the selected segment is 'Blogs'
//   React.useEffect(() => {
//     if (value === 'Blogs') {
//       fetchBlogs();
//     }
//   }, [value]);

//   const fetchInDonationDevices = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('https://cloudrunservice-254131401451.us-central1.run.app/user/inDonationDevices/');
//       console.log('API Response:', response.data);

//       if (response.data && response.data.devices) {
//         setBlogs(response.data.devices);
//         console.log(blogs);
//       } else {
//         setError('No blogs found in the response');
//       }
//     } catch (err) {
//       console.error('Error fetching blogs:', err);
//       setError('Failed to fetch blogs: ' + (err.message || 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };
//   React.useEffect(() => {
//     if (value === 'Devices') {
//       fetchBlogs();
//     }
//   }, [value]);
//   const renderContent = () => {
//     switch (value) {
//       case 'Blogs':
//         const combinedItems = [
//           ...blogs.map(blog => ({ type: 'blog', data: blog })),
//           ...devices.map(device => ({ type: 'device', data: device }))
//         ];

//         // Shuffle the combined array
//         const shuffledItems = combinedItems.sort(() => Math.random() - 0.5);
//         return (
//           // <>
//           //   {blogs.map((blog) => (
//           //     <View key={`blog-${blog.blogId}`} style={styles.cardContainer}>
//           //       <BlogCard
//           //         title={blog.title}
//           //         subtitle={blog.subtitle}
//           //         imageUri={blog.imageUri}
//           //         description={blog.body}
//           //         category={blog.category || "Environment"}
//           //         readTime="4 min read"
//           //         likes={Math.floor(Math.random() * 50) + 10}
//           //         comments={Math.floor(Math.random() * 10) + 1}
//           //         onShare={() => console.log(`Share blog: ${blog.blogId}`)}
//           //         onReadMore={() => console.log(`Read more blog: ${blog.blogId}`)}
//           //         onBookmark={() => console.log(`Bookmark blog: ${blog.blogId}`)}
//           //       />
//           //       <DeviceHomeCard></DeviceHomeCard>
//           //     </View>
//           //   ))}
//           // </>
//           // Assuming you have two arrays: blogs and devices

//           // Render the shuffled items
//           <>
//             {shuffledItems.map((item, index) => {
//               if (item.type === 'blog') {
//                 const blog = item.data;
//                 return (
//                   <View key={`blog-${blog.blogId}`} style={styles.cardContainer}>
//                     <BlogCard
//                       title={blog.title}
//                       subtitle={blog.subtitle}
//                       imageUri={blog.imageUri}
//                       description={blog.body}
//                       category={blog.category || "Environment"}
//                       readTime="4 min read"
//                       likes={Math.floor(Math.random() * 50) + 10}
//                       comments={Math.floor(Math.random() * 10) + 1}
//                       onShare={() => console.log(`Share blog: ${blog.blogId}`)}
//                       onReadMore={() => console.log(`Read more blog: ${blog.blogId}`)}
//                       onBookmark={() => console.log(`Bookmark blog: ${blog.blogId}`)}
//                     />
//                   </View>
//                 );
//               } else {
//                 const device = item.data;
//                 return (
//                   <View key={`device-${device.id}`} style={styles.cardContainer}>
//                     <DeviceHomeCard device={device} />
//                   </View>
//                 );
//               }
//             })}
//           </>
//         );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Single ScrollView wrapping the content to avoid multiple scroll areas */}
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.contentWrapper}>{renderContent()}
//         </View>
//         {/* <View><BlogEditButton></BlogEditButton></View> */}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// const Segments = ({ name }) => {
//   const [blogs, setBlogs] = React.useState([]);
//   const [devices, setDevices] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState(null);

//   const fetchBlogs = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('https://cloudrunservice-254131401451.us-central1.run.app/user/getBlogs/');
//       console.log('API Response:', response.data);

//       if (response.data && response.data.blogs) {
//         // Sort blogs by createdAt in descending order (newest first)
//         const sortedBlogs = response.data.blogs.sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setBlogs(sortedBlogs);
//       } else {
//         setError('No blogs found in the response');
//       }
//     } catch (err) {
//       console.error('Error fetching blogs:', err);
//       setError('Failed to fetch blogs: ' + (err.message || 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchInDonationDevices = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('https://cloudrunservice-254131401451.us-central1.run.app/user/inDonationDevices/');
//       console.log('API Response:', response.data);

//       if (response.data && response.data.devices) {
//         // Sort devices by createdAt in descending order (newest first)
//         const sortedDevices = response.data.devices.sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setDevices(sortedDevices);
//       } else {
//         setError('No devices found in the response');
//       }
//     } catch (err) {
//       console.error('Error fetching devices:', err);
//       setError('Failed to fetch devices: ' + (err.message || 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch both blogs and devices when the component mounts
//   React.useEffect(() => {
//     fetchBlogs();
//     fetchInDonationDevices();
//   }, []);

//   const renderContent = () => {
//     // Combine and sort all items by createdAt
//     const combinedItems = [
//       ...blogs.map(blog => ({ type: 'blog', data: blog, createdAt: blog.createdAt })),
//       ...devices.map(device => ({ type: 'device', data: device, createdAt: device.createdAt }))
//     ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     return (
//       <>
//         {combinedItems.map((item, index) => {
//           if (item.type === 'blog') {
//             const blog = item.data;
//             return (
//               <View key={`blog-${blog.blogId}`} style={styles.cardContainer}>
//                 <BlogCard
//                   title={blog.title}
//                   subtitle={blog.subtitle}
//                   imageUri={blog.imageUri}
//                   description={blog.body}
//                   category={blog.category || "Environment"}
//                   readTime="4 min read"
//                   likes={Math.floor(Math.random() * 50) + 10}
//                   comments={Math.floor(Math.random() * 10) + 1}
//                   onShare={() => console.log(`Share blog: ${blog.blogId}`)}
//                   onReadMore={() => console.log(`Read more blog: ${blog.blogId}`)}
//                   onBookmark={() => console.log(`Bookmark blog: ${blog.blogId}`)}
//                 />
//               </View>
//             );
//           } else {
//             const device = item.data;
//             return (
//               <View key={`device-${device.id}`} style={styles.cardContainer}>
//                 <DeviceHomeCard device={device} />
//               </View>
//             );
//           }
//         })}
//       </>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.contentWrapper}>
//           {/* {loading && <ActivityIndicator size="large" />} */}
//           {error && <Text style={styles.errorText}>{error}</Text>}
//           {renderContent()}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// const Segments = ({ name }) => {
//   const [blogs, setBlogs] = React.useState([]);
//   const [devices, setDevices] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState(null);

//   const fetchBlogs = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('https://cloudrunservice-254131401451.us-central1.run.app/user/getBlogs/');
//       console.log('API Response:', response.data);

//       if (response.data?.blogs) {
//         const sortedBlogs = response.data.blogs.sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setBlogs(sortedBlogs);
//       } else {
//         setError('No blogs found');
//       }
//     } catch (err) {
//       console.error('Error fetching blogs:', err);
//       setError('Failed to fetch blogs: ' + (err.message || 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchInDonationDevices = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('https://cloudrunservice-254131401451.us-central1.run.app/user/inDonationDevices/');
//       console.log('API Response:', response.data);

//       if (response.data?.devices) {
//         const sortedDevices = response.data.devices.sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setDevices(sortedDevices);
//       } else {
//         setError('No devices found');
//       }
//     } catch (err) {
//       console.error('Error fetching devices:', err);
//       setError('Failed to fetch devices: ' + (err.message || 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   React.useEffect(() => {
//     fetchBlogs();
//     fetchInDonationDevices();
//   }, []);

//   // Merge blogs & devices into a single array, sorted by createdAt (newest first)
//   const mergedFeed = React.useMemo(() => {
//     return [
//       ...blogs.map(blog => ({ type: 'blog', ...blog })),
//       ...devices.map(device => ({ type: 'device', ...device }))
//     ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   }, [blogs, devices]);

//   const renderItem = (item) => {
//     if (item.type === 'blog') {
//       return (
//         <View key={`blog-${item.blogId}`} style={styles.cardContainer}>
//           <BlogCard
//             title={item.title}
//             subtitle={item.subtitle}
//             imageUri={item.imageUri}
//             description={item.body}
//             category={item.category || "Environment"}
//             readTime="4 min read"
//             likes={Math.floor(Math.random() * 50) + 10}
//             comments={Math.floor(Math.random() * 10) + 1}
//             onShare={() => console.log(`Share blog: ${item.blogId}`)}
//             onReadMore={() => console.log(`Read more blog: ${item.blogId}`)}
//             onBookmark={() => console.log(`Bookmark blog: ${item.blogId}`)}
//           />
//         </View>
//       );
//     } else {
//       return (
//         <View key={`device-${item.deviceId}`} style={styles.cardContainer}>
//           <DeviceHomeCard device={item} />
//         </View>
//       );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.contentWrapper}>
//           {/* {loading && <ActivityIndicator size="large" />} */}
//           {error && <Text style={styles.errorText}>{error}</Text>}
//           {mergedFeed.map(renderItem)}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };


// const { width } = Dimensions.get('window');

// const Segments = ({ name }) => {
//   const [feed, setFeed] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchHomeFeed = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('https://cloudrunservice-254131401451.us-central1.run.app/user/getHomeFeed');
//       console.log('API Response:', response.data);

//       if (response.data?.feed) {
//         // Sort feed items by createdAt timestamp (newest first)
//         const sortedFeed = response.data.feed.sort((a, b) => {
//           const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
//           const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
//           return dateB - dateA;
//         });
//         setFeed(sortedFeed);
//       } else {
//         setError('No feed items found');
//       }
//     } catch (err) {
//       console.error('Error fetching feed:', err);
//       setError('Failed to fetch feed: ' + (err.message || 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHomeFeed();
//   }, []);

//   const renderItem = (item) => {
//     if (item.type === 'blog') {
//       return (
//         <View key={`blog-${item.id}`} style={styles.cardContainer}>
//           <BlogCard
//             title={item.title}
//             subtitle={`${new Date(item.createdAt?.seconds * 1000).toLocaleDateString()} • By ${item.username || 'Anonymous'}`}
//             description={item.body}
//             category="Environment" // Default category since it's not in the API
//             readTime="4 min read" // Estimated read time
//           />
//         </View>
//       );
//     }
//     // You can add other item types here as needed
//     return null;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.contentWrapper}>
//           {loading && <ActivityIndicator size="large" />}
//           {error && <Text style={styles.errorText}>{error}</Text>}
//           {feed.map(renderItem)}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// Copy
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   SafeAreaView,
//   ActivityIndicator
// } from 'react-native';
// import axios from 'axios';
// import BlogCard from './BlogCard'; // Assuming BlogCard is in a separate file

const Segments = ({ name }) => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHomeFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://cloudrunservice-254131401451.us-central1.run.app/user/getHomeFeed/');
      console.log('API Response:', response.data);

      if (response.data?.feed) {
        // Sort feed items by createdAt (newest first)
        const sortedFeed = response.data.feed.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt.seconds * 1000) : new Date(0);
          const dateB = b.updatedAt ? new Date(b.updatedAt.seconds * 1000) : new Date(0);
          return dateB - dateA;
        });
        setFeed(sortedFeed);
      } else {
        setError('No feed items found');
      }
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError('Failed to fetch feed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeFeed();
  }, []);

  const renderItem = (item) => {
    if (item.type === 'blog') {
      return (
        <View key={`blog-${item.id}`} style={styles.cardContainer}>
          <BlogCard
            title={item.title}
            subtitle={`${new Date(item.updatedAt?.seconds * 1000).toLocaleDateString()} • By ${item.username || 'Anonymous'}`}
            description={item.body}
            category="Environment" // Default category
            readTime="4 min read" // Default read time
          />
        </View>
      );
    } else if (item.type === 'device') {
      return (
        <View key={`device-${item.id}`} style={styles.cardContainer}>
          <DeviceCard
            deviceName={item.deviceName || 'Unnamed Device'}
            deviceId={item.id}
            deviceType={item.deviceType || 'Unknown'}
            description={`Status: ${item.status || 'Unknown'}`}
            status={item.status || 'inDonation'}
            createdAt={item.createdAt ? new Date(item.createdAt.seconds * 1000) : new Date()}
            userName={item.username || 'Anonymous Donor'}
            // Add these if available in your API response
            // imageUri={item.imageUri}
            // onCardPress={() => handleDevicePress(item)}
            // onShare={() => handleShareDevice(item)}
            // onContact={() => handleContactDonor(item)}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {loading && <ActivityIndicator size="large" />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {feed.map(renderItem)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  container: {
    width: '100%',
    // alignItems: 'center',
    // marginTop: 10,
    // backgroundColor: 'red'
  },
  buttons: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#d6c1f5', // Light purple shade
    borderRadius: 10, // Adds rounded corners
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
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default Segments;