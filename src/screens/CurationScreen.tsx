// src/screens/CurationScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';

const CurationScreen = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const { data, error } = await supabase
                    .from('playlists')
                    .select('id, name, description, created_at')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setPlaylists(data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylists();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#FF5A75" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Curated Playlists</Text>
            <FlatList
                data={playlists}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.playlistContainer}>
                        <Text style={styles.playlistName}>{item.name}</Text>
                        <Text style={styles.playlistDescription}>{item.description}</Text>
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFB347',
        textAlign: 'center',
        marginBottom: 20,
    },
    playlistContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FFB347',
    },
    playlistName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF5A75',
    },
    playlistDescription: {
        fontSize: 14,
        color: '#FFFFFF',
    },
});

export default CurationScreen;