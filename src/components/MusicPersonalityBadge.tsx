// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchUserProfile } from '../services/supabase';

const ProfileScreen = ({ route }) => {
    const { userId } = route.params;
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchUserProfile(userId);
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [userId]);

    if (loading) return <ActivityIndicator size="large" color="#FF5A75" />;

    return (
        <View style={styles.container}>
            <Image source={{ uri: profile.profile_pic }} style={styles.profileImage} />
            <Text style={styles.username}>{profile.username}</Text>
            <Text style={styles.musicPersonality}>{profile.music_personality || 'Discovering...'}</Text>
            <Text style={styles.recognitionScore}>Recognition Score: {profile.recognition_score}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1C1B33',
        padding: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFB347',
    },
    musicPersonality: {
        fontSize: 16,
        color: '#FF5A75',
        marginVertical: 5,
    },
    recognitionScore: {
        fontSize: 14,
        color: '#FFFFFF',
    },
});

export default ProfileScreen;
