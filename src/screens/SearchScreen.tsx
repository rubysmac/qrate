// src/screens/SearchScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length > 2) {
            fetchSearchResults();
        } else {
            setResults([]);
        }
    }, [query]);

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, username, profile_pic, music_personality')
                .ilike('username', `%${query}%`);
            if (error) throw error;
            setResults(data);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search users by username..."
                placeholderTextColor="gray"
                value={query}
                onChangeText={setQuery}
            />
            {loading && <ActivityIndicator size="large" color="#FF5A75" />}
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.userContainer}>
                        <Image source={{ uri: item.profile_pic }} style={styles.profilePic} />
                        <View>
                            <Text style={styles.username}>{item.username}</Text>
                            <Text style={styles.musicPersonality}>{item.music_personality}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#1C1B33',
    },
    input: {
        height: 40,
        borderColor: '#FF5A75',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: '#FFFFFF',
        marginBottom: 10,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FFB347',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFB347',
    },
    musicPersonality: {
        fontSize: 14,
        color: '#FFFFFF',
    },
});

export default SearchScreen;
