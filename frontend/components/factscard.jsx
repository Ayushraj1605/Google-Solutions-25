import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
import { images } from '../constants';
import '../global.css';

const LeftContent = (props) => <Avatar.Icon {...props} icon={images.logo} />;

const FactsCards = () => (
    <Card style={styles.container}>
        <Card.Content>
            <Text className="text-4xl mb-1">Did You Know?</Text>
            <Text variant="bodyMedium">Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.</Text>
        </Card.Content>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
    </Card>
);

export default FactsCards;

const styles = StyleSheet.create({
    container: {
        width: '98%',
        maxWidth: 420,
        padding: 2,
        marginBottom: 10,
        backgroundColor: 'white',
        fontFamily: 'Roboto',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    }
});