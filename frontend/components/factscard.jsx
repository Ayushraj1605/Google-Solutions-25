import * as React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Platform,
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

const FactsCard = ({
  title = "Fun Fact",
  subtitle = "Did You Know?",
  imageUri = 'https://source.unsplash.com/700x400/?knowledge,education',
  description = "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible. 🍯",
  avatarSource = null,
  factNumber = "#42",
  category = "Science",
  onShare = () => {},
  onPress = () => {}
}) => {
  // Animation setup
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  // Toggle reveal for long descriptions
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpand = () => setExpanded(!expanded);
  
  // Check if description is long enough to need expansion
  const isLongDescription = description.length > 120;
  const displayDescription = expanded || !isLongDescription 
    ? description 
    : description.substring(0, 120) + '...';

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      {/* Fact number badge */}
      <View style={styles.factNumberContainer}>
        <Text style={styles.factNumber}>{factNumber}</Text>
      </View>
      
      {/* Header with category pill */}
      <View style={styles.headerContainer}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      {/* Title container */}
      <View style={styles.titleRow}>
        <View style={styles.avatarContainer}>
          <Image 
            source={avatarSource || require('../assets/svg/logo')}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {/* Image section with gradient overlay */}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>
      )}
      
      {/* Description section */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          {displayDescription}
        </Text>
        
        {/* Show read more button for long descriptions */}
        {isLongDescription && (
          <TouchableOpacity onPress={toggleExpand} style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>
              {expanded ? 'Show less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Footer with share button */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={onShare} style={styles.shareButton}>
          <Text style={styles.shareText}>Share this fact</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  factNumberContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF9500',
    borderBottomLeftRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    zIndex: 1,
  },
  factNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  categoryPill: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
    color: '#00838F',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F7FA',
    borderWidth: 2,
    borderColor: '#B2EBF2',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  imageContainer: {
    height: 180,
    marginTop: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.2)',
    backgroundGradient: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
  },
  descriptionContainer: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  readMoreButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#00ACC1',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  shareButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  shareText: {
    color: '#555',
    fontWeight: '500',
    fontSize: 14,
  }
});

export default FactsCard;