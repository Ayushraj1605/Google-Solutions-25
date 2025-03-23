import * as React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  Text, 
  Animated, 
  Platform,
  Dimensions,
  ActivityIndicator 
} from 'react-native';

const { width } = Dimensions.get('window');

const BlogCard = ({
  title = "The Future of E-Waste Management",
  subtitle = "March 13, 2025 • By GreenTech Insights",
  imageUri = null,
  description = "As the global demand for electronics rises, so does the challenge of e-waste management. Innovative recycling solutions, sustainable production, and community-driven initiatives are shaping a future where technology and environmental responsibility go hand in hand.",
  avatarSource = null,
  category = "Environment",
  readTime = "5 min read",
  onShare = () => console.log('Share pressed'),
  onReadMore = () => console.log('Read More pressed'),
  onBookmark = () => console.log('Bookmark pressed'),
  isBookmarked = false,
  onCardPress = null,
}) => {
  // Animation values
  const [isImageLoading, setIsImageLoading] = React.useState(imageUri ? true : false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

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

  // Handle image loading
  React.useEffect(() => {
    if (!isImageLoading) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isImageLoading, opacityAnim]);

  // Update image loading state when imageUri changes
  React.useEffect(() => {
    if (imageUri) {
      setIsImageLoading(true);
    }
  }, [imageUri]);

  // Fix for the require statement using a dynamic path
  const defaultAvatar = require('../assets/svg/logo');

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

  return (
    <CardWrapper>
      <Animated.View 
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        {/* Card Header with Avatar and Title */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={avatarSource || defaultAvatar}
              style={styles.avatar}
              // Add default image in case of error
              defaultSource={defaultAvatar}
            />
          </View>
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
            onPress={handleButtonPress(onBookmark)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            accessibilityLabel={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            accessibilityRole="button"
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

        {/* Card Image - Only render if imageUri is provided */}
        {imageUri && (
          <View style={styles.imageWrapper}>
            <Animated.View style={[styles.imageContainer, { opacity: opacityAnim }]}>
              <Image 
                source={{ uri: imageUri }}
                style={styles.coverImage}
                resizeMode="cover"
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
                // Add error handling
                onError={() => setIsImageLoading(false)}
              />
            </Animated.View>
            
            {isImageLoading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color="#4CAF50" />
              </View>
            )}
          </View>
        )}

        {/* Card Content */}
        <View style={styles.content}>
          <Text style={styles.description} numberOfLines={4}>
            {description}
          </Text>
        </View>

        {/* Card Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={handleButtonPress(onShare)}
            activeOpacity={0.7}
            accessibilityLabel="Share article"
            accessibilityRole="button"
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.readMoreButton} 
            onPress={handleButtonPress(onReadMore)}
            activeOpacity={0.7}
            accessibilityLabel="Read more"
            accessibilityRole="button"
          >
            <Text style={styles.readMoreButtonText}>Read More</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F7FA',
  },
  titleContainer: {
    flex: 1,
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
  imageWrapper: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  coverImage: {
    width: '100%',
    height: '100%',
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  shareButtonText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
  },
  readMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  readMoreButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BlogCard;