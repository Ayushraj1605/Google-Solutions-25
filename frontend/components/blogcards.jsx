import { React, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
  Dimensions,
  ActivityIndicator,
  Modal,
  ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// const BlogCard = ({
//   title = "The Future of E-Waste Management",
//   subtitle = "March 13, 2025 • By GreenTech Insights",
//   imageUri = null,
//   description = "As the global demand for electronics rises...",
//   avatarSource = null,
//   category = "Environment",
//   readTime = "5 min read",
//   onCardPress = null,
//   onShare = () => console.log('Share pressed'),
//   onReadMore = () => console.log('Read More pressed'),
//   onBookmark = () => console.log('Bookmark pressed'),
// }) => {
//   // State management
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isImageLoading, setIsImageLoading] = useState(imageUri ? true : false);
//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);
//   const [commentCount, setCommentCount] = useState(Math.floor(Math.random() * 20));
//   const [commentVisible, setCommentVisible] = useState(false);
//   const [comments, setComments] = useState([
//     { id: 1, user: 'EcoExpert', text: 'Great insights on e-waste management!', time: '2 hours ago' },
//     { id: 2, user: 'GreenTech', text: 'We need more articles like this to raise awareness.', time: '1 day ago' }
//   ]);

//   // Check if description is long enough to need "Read More"
//   const needsReadMore = description.length > 150;

//   // Animation values
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;

//   // Handle image loading
//   useEffect(() => {
//     if (!isImageLoading) {
//       Animated.timing(opacityAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [isImageLoading, opacityAnim]);

//   // Update image loading state when imageUri changes
//   useEffect(() => {
//     if (imageUri) {
//       setIsImageLoading(true);
//     }
//   }, [imageUri]);

//   // Action handlers
//   const handleBookmarkPress = () => {
//     setIsBookmarked(!isBookmarked);
//     onBookmark();
//   };

//   const handleReadMorePress = () => {
//     setIsExpanded(!isExpanded);
//     onReadMore();
//   };

//   const handleLike = () => {
//     setLiked(!liked);
//     setLikeCount(liked ? likeCount - 1 : likeCount + 1);
//   };

//   const showCommentModal = () => setCommentVisible(true);
//   const hideCommentModal = () => setCommentVisible(false);

//   // Handle button press with feedback
//   const handleButtonPress = (action) => {
//     return () => {
//       Animated.sequence([
//         Animated.timing(scaleAnim, {
//           toValue: 0.95,
//           duration: 100,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleAnim, {
//           toValue: 1,
//           duration: 100,
//           useNativeDriver: true,
//         })
//       ]).start();
//       action();
//     };
//   };

//   // Default avatar if not provided
//   const defaultAvatar = require('../assets/svg/logo');

//   // Card wrapper component decides if card is pressable
//   const CardWrapper = onCardPress
//     ? ({ children }) => (
//       <TouchableOpacity
//         activeOpacity={0.9}
//         onPress={onCardPress}
//         style={{ width: '100%' }}
//       >
//         {children}
//       </TouchableOpacity>
//     )
//     : ({ children }) => <View style={{ width: '100%' }}>{children}</View>;

//   return (
//     <CardWrapper>
//       <Animated.View
//         style={[
//           styles.cardContainer,
//           { transform: [{ scale: scaleAnim }] }
//         ]}
//       >
//         {/* Card Header */}
//         <View style={styles.orderHeader}>
//           <View style={styles.orderInfo}>
//             <Text style={styles.orderId}>{title}</Text>
//             <Text style={styles.orderDate}>{subtitle}</Text>
//           </View>
//           <TouchableOpacity 
//             style={styles.bookmarkButton}
//             onPress={handleButtonPress(handleBookmarkPress)}
//           >
//             <MaterialCommunityIcons 
//               name={isBookmarked ? "bookmark" : "bookmark-outline"} 
//               size={24} 
//               color={isBookmarked ? "#f39c12" : "#7f8c8d"} 
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Category and Read Time */}
//         <View style={styles.metaContainer}>
//           <View style={styles.categoryPill}>
//             <Text style={styles.categoryText}>{category}</Text>
//           </View>
//           <View style={styles.readTimePill}>
//             <MaterialCommunityIcons name="clock-outline" size={12} color="#7f8c8d" />
//             <Text style={styles.readTimeText}>{readTime}</Text>
//           </View>
//         </View>

//         {/* Card Content - Image and Text */}
//         <View style={styles.contentContainer}>
//           {/* Image */}
//           {imageUri && (
//             <View style={styles.imageWrapper}>
//               <Animated.View style={[styles.imageContainer, { opacity: opacityAnim }]}>
//                 <Image
//                   source={{ uri: imageUri }}
//                   style={styles.coverImage}
//                   resizeMode="cover"
//                   onLoadStart={() => setIsImageLoading(true)}
//                   onLoadEnd={() => setIsImageLoading(false)}
//                   onError={() => setIsImageLoading(false)}
//                 />
//               </Animated.View>

//               {isImageLoading && (
//                 <View style={styles.loaderContainer}>
//                   <ActivityIndicator size="small" color="#2ecc71" />
//                 </View>
//               )}
//             </View>
//           )}

//           {/* Description Text */}
//           <View style={styles.textContent}>
//             <Text 
//               style={styles.description} 
//               numberOfLines={isExpanded ? null : 4}
//             >
//               {description}
//             </Text>

//             {/* Inline Read More link that only appears if content is long enough */}
//             {needsReadMore && !isExpanded && (
//               <TouchableOpacity 
//                 onPress={handleButtonPress(handleReadMorePress)}
//                 style={styles.inlineReadMore}
//               >
//                 <Text style={styles.inlineReadMoreText}>Read more</Text>
//               </TouchableOpacity>
//             )}

//             {/* Show Less link that only appears when expanded */}
//             {isExpanded && (
//               <TouchableOpacity 
//                 onPress={handleButtonPress(handleReadMorePress)}
//                 style={styles.inlineReadMore}
//               >
//                 <Text style={styles.inlineReadMoreText}>Show less</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Social Actions */}


//         {/* Card Footer */}
//         <View style={styles.orderFooter}>
//           <TouchableOpacity style={styles.socialButton} onPress={handleLike}>
//             <MaterialCommunityIcons 
//               name={liked ? "heart" : "heart-outline"} 
//               size={20} 
//               color={liked ? "#e74c3c" : "#7f8c8d"} 
//             />
//             <Text style={styles.socialButtonText}>{likeCount}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.socialButton} onPress={showCommentModal}>
//             <MaterialCommunityIcons name="comment-outline" size={20} color="#7f8c8d" />
//             <Text style={styles.socialButtonText}>{commentCount}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.socialButton} onPress={handleButtonPress(onShare)}>
//             <MaterialCommunityIcons name="share-outline" size={20} color="#7f8c8d" />
//             <Text style={styles.socialButtonText}>Share </Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>

//       {/* Comments Modal */}
//       <Modal
//         visible={commentVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={hideCommentModal}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Comments</Text>
//               <TouchableOpacity 
//                 style={styles.closeButton} 
//                 onPress={hideCommentModal}
//               >
//                 <Text style={styles.closeButtonText}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.commentsList}>
//               {comments.map(comment => (
//                 <View key={comment.id} style={styles.commentItem}>
//                   <View style={styles.commentUserCircle}>
//                     <Text style={styles.commentUserInitial}>{comment.user.charAt(0)}</Text>
//                   </View>
//                   <View style={styles.commentContent}>
//                     <View style={styles.commentHeader}>
//                       <Text style={styles.commentUser}>{comment.user}</Text>
//                       <Text style={styles.commentTime}>{comment.time}</Text>
//                     </View>
//                     <Text style={styles.commentText}>{comment.text}</Text>
//                   </View>
//                 </View>
//               ))}
//             </ScrollView>

//             <View style={styles.commentInputContainer}>
//               <View style={styles.commentInput}>
//                 <MaterialCommunityIcons name="pencil" size={20} color="#7f8c8d" style={styles.commentInputIcon} />
//                 <Text style={styles.commentInputText}>Add a comment...</Text>
//               </View>
//               <TouchableOpacity style={styles.commentSendButton}>
//                 <MaterialCommunityIcons name="send" size={20} color="#2ecc71" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </CardWrapper>
//   );
// };

// BlogCard component remains mostly the same, just simplified for this use case

// BlogCard component remains mostly the same, just simplified for this use case


// BlogCard component remains mostly the same, just simplified for this use case
const BlogCard = ({
  title,
  subtitle,
  description,
  category,
  readTime,
}) => {
  // State management
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);
  const [commentCount, setCommentCount] = useState(Math.floor(Math.random() * 20));
  const [commentVisible, setCommentVisible] = useState(false);
  
  // Check if description is long enough to need "Read More"
  const needsReadMore = description && description.length > 150;

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Action handlers
  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleReadMorePress = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const showCommentModal = () => setCommentVisible(true);
  const hideCommentModal = () => setCommentVisible(false);

  // Handle button press with feedback
  const handleButtonPress = (action) => {
    return () => {
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
      action();
    };
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
      {/* Card Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{title}</Text>
          <Text style={styles.orderDate}>{subtitle}</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={handleButtonPress(handleBookmarkPress)}
        >
          <MaterialCommunityIcons 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isBookmarked ? "#f39c12" : "#7f8c8d"} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Category and Read Time */}
      <View style={styles.metaContainer}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <View style={styles.readTimePill}>
          <MaterialCommunityIcons name="clock-outline" size={12} color="#7f8c8d" />
          <Text style={styles.readTimeText}>{readTime}</Text>
        </View>
      </View>
      
      {/* Card Content - Text */}
      <View style={styles.contentContainer}>
        {/* Description Text */}
        <View style={styles.textContent}>
          <Text 
            style={styles.description} 
            numberOfLines={isExpanded ? null : 4}
          >
            {description}
          </Text>
          
          {/* Inline Read More link that only appears if content is long enough */}
          {needsReadMore && !isExpanded && (
            <TouchableOpacity 
              onPress={handleButtonPress(handleReadMorePress)}
              style={styles.inlineReadMore}
            >
              <Text style={styles.inlineReadMoreText}>Read more</Text>
            </TouchableOpacity>
          )}
          
          {/* Show Less link that only appears when expanded */}
          {isExpanded && (
            <TouchableOpacity 
              onPress={handleButtonPress(handleReadMorePress)}
              style={styles.inlineReadMore}
            >
              <Text style={styles.inlineReadMoreText}>Show less</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Card Footer */}
      <View style={styles.orderFooter}>
        <TouchableOpacity style={styles.socialButton} onPress={handleLike}>
          <MaterialCommunityIcons 
            name={liked ? "heart" : "heart-outline"} 
            size={20} 
            color={liked ? "#e74c3c" : "#7f8c8d"} 
          />
          <Text style={styles.socialButtonText}>{likeCount}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialButton} onPress={showCommentModal}>
          <MaterialCommunityIcons name="comment-outline" size={20} color="#7f8c8d" />
          <Text style={styles.socialButtonText}>{commentCount}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialButton} onPress={handleButtonPress(() => console.log('Share pressed'))}>
          <MaterialCommunityIcons name="share-outline" size={20} color="#7f8c8d" />
          <Text style={styles.socialButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
      
      {/* Comments Modal */}
      <Modal
        visible={commentVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideCommentModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={hideCommentModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentsList}>
              {/* Sample comments - you would replace with actual comments */}
              <View style={styles.commentItem}>
                <View style={styles.commentUserCircle}>
                  <Text style={styles.commentUserInitial}>U</Text>
                </View>
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>User</Text>
                    <Text style={styles.commentTime}>Just now</Text>
                  </View>
                  <Text style={styles.commentText}>This is a sample comment.</Text>
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.commentInputContainer}>
              <View style={styles.commentInput}>
                <MaterialCommunityIcons name="pencil" size={20} color="#7f8c8d" style={styles.commentInputIcon} />
                <Text style={styles.commentInputText}>Add a comment...</Text>
              </View>
              <TouchableOpacity style={styles.commentSendButton}>
                <MaterialCommunityIcons name="send" size={20} color="#2ecc71" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};



const styles = StyleSheet.create({
  cardContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  orderDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryPill: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
    color: '#2ecc71',
    fontWeight: '600',
  },
  readTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  contentContainer: {
    paddingBottom: 12,
  },
  imageWrapper: {
    marginHorizontal: 12,
    borderRadius: 8,
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
  textContent: {
    paddingHorizontal: 12,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  inlineReadMore: {
    marginTop: 4,
    paddingVertical: 2,
  },
  inlineReadMoreText: {
    color: '#2ecc71',
    fontWeight: '600',
    fontSize: 14,
  },
  socialActions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  socialButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // justifyContent:"space-around",
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F7FA',
  },
  authorText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingRight: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  commentsList: {
    maxHeight: '70%',
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentUserCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  commentUserInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  commentTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  commentText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  commentInputIcon: {
    marginRight: 8,
  },
  commentInputText: {
    color: '#95a5a6',
    fontSize: 14,
  },
  commentSendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BlogCard;