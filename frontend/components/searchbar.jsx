import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
        <View style={styles.wrapper}>
            <Searchbar
                placeholder="Search for devices"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                inputStyle={styles.input}
                iconColor="#888"
                placeholderTextColor="#aaa"
            />
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#f2f4f7', // Light background to contrast the search bar
    },
    searchBar: {
        backgroundColor: '#fff',
        borderRadius: 16,
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    input: {
        fontSize: 16,
        color: '#333',
    },
});
