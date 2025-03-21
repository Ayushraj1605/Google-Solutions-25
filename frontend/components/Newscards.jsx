import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { images } from '../constants';

const LeftContent = (props) => <Avatar.Icon {...props} icon={images.logo} size={40} />;

const NewsCards = ({ 
  title,
  subtitle,
  imageUrl,
  headline,
  body,
  onShare,
  onReadMore 
}) => (
  <Card style={styles.container} mode="elevated">
    <Card.Title
      title={title}
      subtitle={subtitle}
      left={LeftContent}
      titleStyle={styles.title}
      subtitleStyle={styles.subtitle}
    />
    <Card.Cover
      source={{ uri: imageUrl }}
      style={styles.cover}
    />
    <Card.Content>
      <Text style={styles.headline}>{headline}</Text>
      <Text style={styles.body}>{body}</Text>
    </Card.Content>
    <Card.Actions>
      <Button mode="outlined" style={styles.buttonOutline} onPress={onShare}>
        Share
      </Button>
      <Button mode="contained" style={styles.buttonContained} onPress={onReadMore}>
        Read More
      </Button>
    </Card.Actions>
  </Card>
);

export default NewsCards;

const styles = StyleSheet.create({
  container: {
    width: '98%',
    maxWidth: 420,
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cover: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
  },
  body: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  buttonOutline: {
    borderColor: '#4CAF50',
    color: '#4CAF50',
  },
  buttonContained: {
    backgroundColor: '#4CAF50',
  },
});
