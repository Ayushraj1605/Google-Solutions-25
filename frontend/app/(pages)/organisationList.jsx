import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Platform,
    StatusBar
} from 'react-native';
import { router } from 'expo-router';

export default function OrganisationList() {
    // State management
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Dummy organizations list
    const organizations = [
        {
            id: 1,
            name: 'Organization 1',
            description: 'Organization 1 description',
            memberCount: 57,
            category: 'Technology'
        },
        {
            id: 2,
            name: 'Organization 2',
            description: 'Organization 2 description',
            memberCount: 124,
            category: 'Healthcare'
        },
        {
            id: 3,
            name: 'Organization 3',
            description: 'Organization 3 description',
            memberCount: 36,
            category: 'Education'
        },
    ];

    // Handle submission
    const handleSubmit = () => {
        if (selectedOrg) {
            setIsLoading(true);
            // Simulate API call with timeout
            setTimeout(() => {
                setIsLoading(false);
                // Show success and navigate
                alert('Submission successful!');
                router.push('/devices');
            }, 1500);
        } else {
            alert('Please select an organization');
        }
    };

    // Custom card component
    const OrganizationCard = ({ item, onSelect, isSelected }) => (
        <TouchableOpacity
            style={[styles.customCard, isSelected && styles.selectedCard]}
            onPress={() => onSelect(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <View style={styles.selectionArea}>
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                    </View>
                </View>

                <View style={styles.infoArea}>
                    <Text style={styles.orgName}>{item.name}</Text>
                    <Text style={styles.description}>{item.description}</Text>

                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Category</Text>
                            <Text style={styles.metaValue}>{item.category}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Members</Text>
                            <Text style={styles.metaValue}>{item.memberCount}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

            <View style={styles.container}>
                <Text style={styles.title}>Select Organization</Text>

                <FlatList
                    data={organizations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <OrganizationCard
                            item={item}
                            onSelect={setSelectedOrg}
                            isSelected={selectedOrg?.id === item.id}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />

                {/* Fixed submit button container */}
                <View style={styles.submitContainer}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !selectedOrg && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!selectedOrg || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.submitText}>Continue</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginVertical: 24,
        paddingHorizontal: 4,
    },
    listContainer: {
        paddingBottom: 100, // Space for the fixed button
    },
    customCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#609966',
        shadowColor: '#609966',
        shadowOpacity: 0.2,
        elevation: 4,
    },
    cardContent: {
        flexDirection: 'row',
    },
    selectionArea: {
        paddingRight: 16,
        justifyContent: 'center',
    },
    radioOuter: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#CCCCCC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: '#609966',
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#609966',
    },
    infoArea: {
        flex: 1,
    },
    orgName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: '#666666',
        marginBottom: 12,
        lineHeight: 22,
    },
    metaContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    metaItem: {
        marginRight: 24,
    },
    metaLabel: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#609966',
    },
    submitContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    submitButton: {
        backgroundColor: '#609966',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    submitText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    }
});