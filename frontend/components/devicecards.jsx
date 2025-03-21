import {React, useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { Logo } from '../assets/svg/logo';
import { router } from 'expo-router';

const LeftContent = props => (
  <Avatar.Image
    {...props}
    source={Logo}
    size={48}
    style={styles.avatar}
  />
);

const Cards = ({ data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecyclePress = () => {
    setIsSubmitting(true);
    router.push('/recycleform');
    setIsSubmitting(false);
  };
  return (
    <Card style={styles.container} mode="elevated">
      <Card.Title
        title={data?.deviceName || "Eco-Friendly Recycling"}
        subtitle={data?.deviceType || "Make the world greener"}
        left={LeftContent}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
      />
      <Card.Cover
        source={{ uri: data?.imageUrl || 'https://picsum.photos/700' }}
        style={styles.cover}
      />
      <Card.Content style={styles.content}>
        <Text variant="bodyMedium" style={styles.description}>
          Device ID: {data.deviceId}
        </Text>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          mode="outlined"
          textColor="#333"
          style={styles.buttonOutlined}
          labelStyle={styles.buttonLabel}
        >
          View Details
        </Button>
        <Button
          mode="contained"
          buttonColor={data.recycleStatus ? '#888' : '#34C759'}
          textColor="#fff"
          style={styles.buttonContained}
          labelStyle={styles.buttonLabel}
          onPress={!data.recycleStatus ? handleRecyclePress : null}
          disabled={data.recycleStatus || isSubmitting}
        >
          {isSubmitting ? "Loading..." : (data.recycleStatus ? "Recycle in Progress" : "Recycle")}
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default Cards;

const styles = StyleSheet.create({
  container: {
    width: '95%',
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
