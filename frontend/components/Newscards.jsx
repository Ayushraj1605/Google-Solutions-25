import * as React from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';

const LeftContent = props => (
  <Avatar.Image
    {...props}
    source={props.avatarSource || require('../assets/svg/logo')}
    size={48}
    style={styles.avatar}
  />
);

const NewsCards = ({ 
  title = "Global E-Waste Surges to Record High",
  subtitle = "March 13, 2025 • By EcoWatch",
  imageUri = 'https://source.unsplash.com/700x400/?ewaste,environment',
  description = "A new report reveals that global electronic waste reached an all-time high in 2025, with over 60 million tons discarded. Experts call for immediate action through recycling, upcycling, and sustainable tech production.",
  avatarSource = null,
  category = "Environment",
  readTime = "5 min read",
  onShare = () => console.log('Share pressed'),
  onReadMore = () => console.log('Read More pressed'),
  onCardPress = null,
  onBookmark = () => console.log('Bookmark pressed')
}) => {
  // Add states for expanded content and bookmark
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  
  // Animation values (similar to BlogCard)
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  // Handle press animation
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  // Handle bookmark toggle
  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark();
  };
  
  // Handle read more toggle
  const handleReadMorePress = () => {
    setIsExpanded(!isExpanded);
    onReadMore();
  };
  
  // Handle button press with feedback
  const handleButtonPress = (action) => {
    return () => {
      // Visual feedback
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
      // Execute the action
      action();
    };
  };
  
  // Card wrapper component decides if card is pressable
  const CardWrapper = onCardPress 
    ? ({ children }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onCardPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ width: '100%' }}
        >
          {children}
        </TouchableOpacity>
      ) 
    : ({ children }) => <View style={{ width: '100%' }}>{children}</View>;

  return (
    <CardWrapper>
      <Animated.View style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        <Card mode="elevated" style={styles.card}>
          <View style={styles.header}>
            <LeftContent avatarSource={avatarSource} />
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.bookmarkButton} 
              onPress={handleButtonPress(handleBookmarkPress)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text style={[styles.bookmarkIcon, isBookmarked && styles.bookmarkedIcon]}>
                {isBookmarked ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Category and Read Time */}
          <View style={styles.metaContainer}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            <Text style={styles.readTime}>{readTime}</Text>
          </View>
          
          <Card.Cover
            source={{ uri: imageUri }}
            style={styles.cover}
          />
          
          <Card.Content style={styles.content}>
            <Text 
              style={styles.description}
              numberOfLines={isExpanded ? null : 4} // Remove line limit when expanded
            >
              {description}
            </Text>
          </Card.Content>
          
          <Card.Actions style={styles.actions}>
            <Button
              mode="outlined"
              textColor="#555"
              style={styles.shareButton}
              labelStyle={styles.buttonLabel}
              onPress={handleButtonPress(onShare)}
            >
              Share
            </Button>
            <Button
              mode="contained"
              buttonColor="#4CAF50"
              textColor="#fff"
              style={styles.readMoreButton}
              labelStyle={styles.buttonLabel}
              onPress={handleButtonPress(handleReadMorePress)}
            >
              {isExpanded ? "Show Less" : "Read More"}
            </Button>
          </Card.Actions>
        </Card>
      </Animated.View>
    </CardWrapper>
  );
};

export default NewsCards;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 16,
  },
  card: {
    borderRadius: 16,
    elevation: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  avatar: {
    backgroundColor: '#E0F7FA',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bookmarkIcon: {
    fontSize: 24,
    color: '#aaa',
  },
  bookmarkedIcon: {
    color: '#FFD700',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  categoryPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  readTime: {
    fontSize: 12,
    color: '#757575',
  },
  cover: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 12,
    height: 200,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
  },
  shareButton: {
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    minWidth: 100,
  },
  readMoreButton: {
    borderRadius: 8,
    minWidth: 120,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
  }
});