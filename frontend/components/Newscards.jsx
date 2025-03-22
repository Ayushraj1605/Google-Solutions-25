import * as React from 'react';
import { StyleSheet, View } from 'react-native';
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
  onShare = () => console.log('Share pressed'),
  onReadMore = () => console.log('Read More pressed')
}) => (
  <Card style={styles.container} mode="elevated">
    <Card.Title
      title={title}
      subtitle={subtitle}
      left={(props) => <LeftContent {...props} avatarSource={avatarSource} />}
      titleStyle={styles.title}
      subtitleStyle={styles.subtitle}
    />
    <Card.Cover
      source={{ uri: imageUri }}
      style={styles.cover}
    />
    <Card.Content style={styles.content}>
      <Text variant="bodyMedium" style={styles.description}>
        {description}
      </Text>
    </Card.Content>
    <Card.Actions style={styles.actions}>
      <Button
        mode="outlined"
        textColor="#333"
        style={styles.buttonOutlined}
        labelStyle={styles.buttonLabel}
        onPress={onShare}
      >
        Share
      </Button>
      <Button
        mode="contained"
        buttonColor="#4CAF50"
        textColor="#fff"
        style={styles.buttonContained}
        labelStyle={styles.buttonLabel}
        onPress={onReadMore}
      >
        Read More
      </Button>
    </Card.Actions>
  </Card>
);

export default NewsCards;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
  },
  avatar: {
    backgroundColor: '#E0F7FA',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
  },
  cover: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  buttonOutlined: {
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonContained: {
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 14,
    paddingHorizontal: 8,
  },
});