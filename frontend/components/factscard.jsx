import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
import '../global.css';

const LeftContent = (props) => (
  <Avatar.Image
    {...props}
    source={props.avatarSource || require('../assets/svg/logo')}
    size={48}
    style={styles.avatar}
  />
);

const FactsCards = ({
  title = "Fun Fact",
  subtitle = "Did You Know?",
  imageUri = 'https://source.unsplash.com/700x400/?knowledge,education',
  description = "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible. 🍯",
  avatarSource = null
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
  </Card>
);

export default FactsCards;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
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
});