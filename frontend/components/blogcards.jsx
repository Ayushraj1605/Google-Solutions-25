import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { images } from '../constants';

const LeftContent = (props) => <Avatar.Icon {...props} icon={images.logo} size={40} />;

const BlogCards = () => (
  <Card style={styles.container} mode="elevated">
    <Card.Title
      title="Breaking News"
      subtitle="Today’s Update"
      left={LeftContent}
      titleStyle={styles.title}
      subtitleStyle={styles.subtitle}
    />
    <Card.Cover
      source={{ uri: 'https://picsum.photos/700' }}
      style={styles.cover}
    />
    <Card.Content>
      <Text style={styles.headline}>Headline of the Day</Text>
      <Text style={styles.body}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo reiciendis
        debitis consequuntur perspiciatis eius nihil voluptas iusto explicabo
        nam! Maxime quasi laudantium rem iste reiciendis quia aliquid esse culpa
        incidunt.
      </Text>
    </Card.Content>
    <Card.Actions>
      <Button mode="outlined" style={styles.buttonOutline} onPress={() => {}}>
        Share
      </Button>
      <Button mode="contained" style={styles.buttonContained} onPress={() => {}}>
        Read More
      </Button>
    </Card.Actions>
  </Card>
);

export default BlogCards;

const styles = StyleSheet.create({
  container: {
    width: '95%',
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
