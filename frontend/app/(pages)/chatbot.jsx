import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! 👋 I\'m your personal assistant. How can I help you today?', isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // Handle keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        scrollToBottom();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // For typing indicator animation
  useEffect(() => {
    let animation;
    if (isTyping) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      typingAnimation.setValue(0);
    }

    return () => {
      animation?.stop();
    };
  }, [isTyping, typingAnimation]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response after a short delay
    setTimeout(() => {
      setIsTyping(false);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return 'Hi there! 😊 How can I assist you today?';
    } else if (input.includes('help')) {
      return 'I can answer questions about plants, gardening tips, sustainability practices, or assist with your orders. What would you like to know?';
    } else if (input.includes('thank')) {
      return "You're welcome! 🌿 Always happy to help. Is there anything else you'd like to know?";
    } else if (input.includes('bye') || input.includes('goodbye')) {
      return 'Goodbye! Have a wonderful day ahead! 🌱';
    } else if (input.includes('plant') || input.includes('garden')) {
      return "Plants need proper sunlight, water, and care. Would you like specific tips for indoor or outdoor plants?";
    } else {
      return "I'm still learning about that topic. Could you ask in a different way or try another question about plants or gardening?";
    }
  };

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    
    if (!isCloseToBottom && messages.length > 4) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <View style={styles.messageContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/icons/search.png')}
            style={styles.botAvatar}
          />
        </View>
        <View style={[styles.messageBubble, styles.botMessageBubble, styles.typingIndicator]}>
          <Animated.View style={[styles.typingDot, { opacity: typingAnimation }]} />
          <Animated.View style={[styles.typingDot, { opacity: typingAnimation, marginLeft: 4 }]} />
          <Animated.View style={[styles.typingDot, { opacity: typingAnimation, marginLeft: 4 }]} />
        </View>
      </View>
    );
  };

  const renderDate = (timestamp, index) => {
    // Only show date for the first message or if it's a different day
    if (index === 0 || shouldShowDate(messages[index-1]?.timestamp, timestamp)) {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Today</Text>
        </View>
      );
    }
    return null;
  };

  const shouldShowDate = (prevTimestamp, currentTimestamp) => {
    // Logic to determine if date should be shown
    // For this demo, we'll just return false
    return false;
  };

  const renderMessage = ({ item, index }) => (
    <>
      {renderDate(item.timestamp, index)}
      <View style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.botMessageContainer
      ]}>
        {!item.isUser && (
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/icons/search.png')}
              style={styles.botAvatar}
            />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.userMessageBubble : styles.botMessageBubble
        ]}>
          <Text style={item.isUser ? styles.userMessageText : styles.botMessageText}>
            {item.text}
          </Text>
          <Text style={styles.timestampText}>{item.timestamp}</Text>
        </View>
        {item.isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.userAvatarContainer}>
              <Ionicons name="person" size={20} color="#fff" />
            </View>
          </View>
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#609966" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Green Assistant</Text>
            <View style={styles.onlineIndicator}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Welcome banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeText}>
            Ask me anything about plants, gardening, or sustainability!
          </Text>
        </View>

        {/* Chat messages */}
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            onScroll={handleScroll}
            scrollEventThrottle={400}
            ListFooterComponent={renderTypingIndicator}
          />
          
          {showScrollButton && (
            <TouchableOpacity 
              style={styles.scrollButton}
              onPress={scrollToBottom}
            >
              <Ionicons name="chevron-down" size={24} color="#609966" />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick reply suggestions */}
        {!keyboardVisible && (
          <View style={styles.quickRepliesContainer}>
            <ScrollableQuickReplies 
              replies={["Plant care tips", "Indoor plants", "Gardening help", "Sustainability"]}
              onSelectReply={(reply) => setInputText(reply)}
            />
          </View>
        )}

        {/* Input area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color="#609966" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message Green Assistant..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          {inputText.trim() === '' ? (
            <TouchableOpacity style={styles.voiceButton}>
              <Ionicons name="mic-outline" size={24} color="#609966" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Scrollable Quick Replies Component
const ScrollableQuickReplies = ({ replies, onSelectReply }) => {
  return (
    <FlatList
      horizontal
      data={replies}
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.quickReplyButton}
          onPress={() => onSelectReply(item)}
        >
          <Text style={styles.quickReplyText}>{item}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.quickRepliesList}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoidingView: {
    flex: 1,
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: '#E2F0CB',
  },
  menuButton: {
    padding: 8,
  },
  welcomeBanner: {
    backgroundColor: '#EAF7E3',
    padding: 12,
    borderRadius: 8,
    margin: 12,
    marginTop: 8,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#609966',
  },
  welcomeText: {
    fontSize: 14,
    color: '#2E5A27',
    lineHeight: 20,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  messagesList: {
    padding: 16,
    paddingTop: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    marginHorizontal: 4,
  },
  userAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#609966',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  botMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    marginLeft: 4,
  },
  userMessageBubble: {
    backgroundColor: '#E1F5EA',
    borderBottomRightRadius: 4,
    marginRight: 4,
  },
  botMessageText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 22,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E1F5EA',
  },
  timestampText: {
    fontSize: 10,
    color: '#9CA3AF',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    width: 70,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#609966',
  },
  scrollButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  quickRepliesContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EDF1F5',
  },
  quickRepliesList: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  quickReplyButton: {
    backgroundColor: '#EAF7E3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#D1E7C9',
  },
  quickReplyText: {
    color: '#2E5A27',
    fontSize: 14,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EDF1F5',
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  voiceButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginLeft: 4,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#609966',
    borderRadius: 20,
    marginLeft: 8,
  },
});