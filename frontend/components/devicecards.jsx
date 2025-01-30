import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import {images} from '../constants'

const LeftContent = props => <Avatar.Icon {...props} icon={images.logo} />

const Cards = () => (
    <Card style={styles.container}>
        {/* <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} /> */}
        <Card.Content>
            <Text variant="titleLarge">Card title</Text>
            <Text variant="bodyMedium">Card content</Text>
        </Card.Content>
        {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
        <Card.Actions>
            <Button style={styles.button1}>View Details</Button>
            <Button style={styles.button2}>Recycle</Button>
        </Card.Actions>
    </Card>
);

export default Cards

const styles = StyleSheet.create({
    container:{
        width: '98%', // Responsive width
        maxWidth: 420,
        marginBottom: 10,
        backgroundColor: 'white',
    },  
    button1:{
        color: 'black',
    },
    button2:{
        backgroundColor: '#609966',
        color: 'black',
    },
})