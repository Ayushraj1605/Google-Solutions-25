import * as React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    console.log(searchQuery);

    return (
        <View style={styles.container}>

            <Searchbar
                placeholder="Search for devices"
                onChangeText={setSearchQuery}
                value={searchQuery}
                // Make the Searchbar take full width of the container
                style={{ backgroundColor: 'white', width: '100%' }}
                inputStyle={styles.input} // Styling the inner text input
            />
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        width: '90%',
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 30,   

        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 0,

        // Android Shadow
        elevation: 10,
    },

    input: {
        fontSize: 16, // Adjust text size
        color: '#333', // Text color
        paddingLeft: 10, // Better padding
    }
});
