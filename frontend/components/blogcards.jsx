import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import {images} from '../constants';
import '../global.css';

const LeftContent = props => <Avatar.Icon {...props} icon={images.logo} />

const Cards = () => (
    <Card style={styles.container}>
        <Card.Content>
            <Text className="text-4xl mb-1" >Lorem ipsum dolor sit.</Text>
            <Text variant="bodyMedium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo reiciendis debitis consequuntur perspiciatis eius nihil voluptas iusto explicabo nam! Maxime quasi laudantium rem iste reiciendis quia aliquid esse culpa incidunt.</Text>
        </Card.Content>
    </Card>
)

export default Cards

const styles = StyleSheet.create({
    container:{
        width: '100%', // Responsive width
        maxWidth: 420,
        padding: 2,
        marginBottom: 10,
        backgroundColor: 'white',
        fontFamily: 'Roboto',
    },  
    button1:{
        color: 'black',
    },
    button2:{
        color: 'black',
        backgroundColor:'green'
    },
})