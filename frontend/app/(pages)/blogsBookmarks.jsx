import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Sample data for blogs and bookmarks
const SAMPLE_BLOGS = [
  {
    id: '1',
    title: 'Growing Herbs Indoors: A Beginner\'s Guide',
    excerpt: 'Learn how to grow fresh herbs right in your kitchen with minimal effort.',
    author: 'You',
    date: 'Mar 15, 2025',
    readTime: '4 min read',
    // image: require('../../assets/icons/herb.png'),
    likes: 24,
    comments: 5
  },
  {
    id: '2',
    title: 'Sustainable Gardening Practices for Urban Spaces',
    excerpt: 'How to create an eco-friendly garden in limited urban environments.',
    author: 'You',
    date: 'Feb 28, 2025',
    readTime: '6 min read',
    // image: require('../../assets/icons/urban-garden.png'),
    likes: 42,
    comments: 8
  },
  {
    id: '3',
    title: 'The Benefits of Native Plants in Your Garden',
    excerpt: 'Why choosing native plant species can improve your garden\'s health and local ecosystem.',
    author: 'You',
    date: 'Jan 12, 2025',
    readTime: '5 min read',
    // image: require('../../assets/icons/native-plant.png'),
    likes: 36,
    comments: 12
  }
];

const SAMPLE_BOOKMARKS = [
  {
    id: '4',
    title: 'Water Conservation Techniques for Gardens',
    excerpt: 'Smart irrigation methods to keep your garden thriving while saving water.',
    author: 'Emma Green',
    date: 'Mar 22, 2025',
    readTime: '7 min read',
    // image: require('../../assets/icons/water.png'),
    likes: 78,
    comments: 15
  },
  {
    id: '5',
    title: 'Creating a Butterfly Garden: Plants and Design',
    excerpt: 'How to attract butterflies and create a haven for pollinators in your backyard.',
    author: 'Michael Wong',
    date: 'Mar 10, 2025',
    readTime: '8 min read',
    // image: require('../../assets/icons/butterfly.png'),
    likes: 65,
    comments: 21
  },
  {
    id: '6',
    title: 'Vertical Gardening: Maximize Your Small Space',
    excerpt: 'Innovative ways to grow upward when you don\'t have much ground space.',
    author: 'Sophia Martinez',
    date: 'Feb 18, 2025',
    readTime: '5 min read',
    // image: require('../../assets/icons/vertical.png'),
    likes: 93,
    comments: 27
  },
  {
    id: '7',
    title: 'Organic Pest Control for Vegetable Gardens',
    excerpt: 'Natural solutions to keep pests away without harmful chemicals.',
    author: 'Jordan Taylor',
    date: 'Feb 5, 2025',
    readTime: '6 min read',
    // image: require('../../assets/icons/pest.png'),
    likes: 57,
    comments: 19
  }
];

export default function MyBlogsAndBookmarksScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  
  // Filter data based on search query
  const filteredBookmarks = SAMPLE_BOOKMARKS.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredBlogs = SAMPLE_BLOGS.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSearchBar = () => {
    if (showSearchBar) {
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setShowSearchBar(false));
    } else {
      setShowSearchBar(true);
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBlogPress = (blog) => {
    // Navigate to blog detail screen
    console.log('Navigating to blog:', blog.id);
    // router.push(`/blog/${blog.id}`);
    alert(`Opening blog: ${blog.title}`);
  };

  const renderBlogItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.blogCard}
      onPress={() => handleBlogPress(item)}
      activeOpacity={0.7}
    >
      <Image source={item.image} style={styles.blogImage} />
      <View style={styles.blogContent}>
        <Text style={styles.blogTitle}>{item.title}</Text>
        <Text style={styles.blogExcerpt} numberOfLines={2}>{item.excerpt}</Text>
        <View style={styles.blogMeta}>
          <Text style={styles.authorText}>
            {activeTab === 'bookmarks' ? `By ${item.author}` : 'By You'}
          </Text>
          <View style={styles.blogStats}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.readTimeText}>{item.readTime}</Text>
          </View>
        </View>
        <View style={styles.interactionBar}>
          <View style={styles.interactionItem}>
            <Ionicons name="heart-outline" size={16} color="#609966" />
            <Text style={styles.interactionText}>{item.likes}</Text>
          </View>
          <View style={styles.interactionItem}>
            <Ionicons name="chatbubble-outline" size={16} color="#609966" />
            <Text style={styles.interactionText}>{item.comments}</Text>
          </View>
          <TouchableOpacity style={styles.interactionItem}>
            <Ionicons name="share-social-outline" size={16} color="#609966" />
          </TouchableOpacity>
          {activeTab === 'bookmarks' && (
            <TouchableOpacity style={styles.interactionItem}>
              <Ionicons name="bookmark" size={16} color="#609966" />
            </TouchableOpacity>
          )}
          {activeTab === 'myblogs' && (
            <TouchableOpacity style={styles.interactionItem}>
              <Ionicons name="create-outline" size={16} color="#609966" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNoResults = () => (
    <View style={styles.noResultsContainer}>
      <Ionicons name={activeTab === 'bookmarks' ? 'bookmark-outline' : 'document-text-outline'} size={60} color="#C5E1A5" />
      <Text style={styles.noResultsTitle}>
        {searchQuery ? 'No matches found' : activeTab === 'bookmarks' ? 'No bookmarks yet' : 'No blogs yet'}
      </Text>
      <Text style={styles.noResultsText}>
        {searchQuery 
          ? 'Try a different search term'
          : activeTab === 'bookmarks' 
            ? 'Bookmark blogs that interest you to read later'
            : 'Start writing to share your green journey'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.noResultsButton}>
          <Text style={styles.noResultsButtonText}>
            {activeTab === 'bookmarks' ? 'Explore Blogs' : 'Create Blog'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const currentData = activeTab === 'bookmarks' ? filteredBookmarks : filteredBlogs;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#609966" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {!showSearchBar ? (
          <>
            <Text style={styles.headerTitle}>My Collection</Text>
            <View style={styles.headerRightButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={toggleSearchBar}
              >
                <Ionicons name="search" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Animated.View 
            style={[
              styles.searchBarContainer, 
              {
                flex: searchAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                }),
                opacity: searchAnimation
              }
            ]}
          >
            <Ionicons name="search" size={20} color="#609966" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search blogs and bookmarks..."
              placeholderTextColor="#96B6A2"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={toggleSearchBar}>
              <Ionicons name="close" size={20} color="#609966" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Tab selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'bookmarks' && styles.activeTabButton]}
          onPress={() => setActiveTab('bookmarks')}
        >
          <Ionicons 
            name={activeTab === 'bookmarks' ? 'bookmark' : 'bookmark-outline'} 
            size={18} 
            color={activeTab === 'bookmarks' ? '#609966' : '#666'} 
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>
            Bookmarks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'myblogs' && styles.activeTabButton]}
          onPress={() => setActiveTab('myblogs')}
        >
          <Ionicons 
            name={activeTab === 'myblogs' ? 'document-text' : 'document-text-outline'} 
            size={18} 
            color={activeTab === 'myblogs' ? '#609966' : '#666'} 
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'myblogs' && styles.activeTabText]}>
            My Blogs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Blog list */}
      <View style={styles.contentContainer}>
        {currentData.length > 0 ? (
          <FlatList
            data={currentData}
            renderItem={renderBlogItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          renderNoResults()
        )}
      </View>

      {/* Floating Action Button */}
      {activeTab === 'myblogs' && (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => alert('Create a new blog')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#609966',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40, // Offset the back button to center title
  },
  headerRightButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginLeft: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#609966',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#609966',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContainer: {
    padding: 12,
  },
  blogCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  blogImage: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
  },
  blogContent: {
    flex: 1,
    padding: 12,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  blogExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  blogMeta: {
    marginBottom: 10,
  },
  authorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#609966',
    marginBottom: 2,
  },
  blogStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bulletPoint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 6,
  },
  readTimeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  interactionBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  interactionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 280,
  },
  noResultsButton: {
    backgroundColor: '#609966',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  noResultsButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#609966',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});