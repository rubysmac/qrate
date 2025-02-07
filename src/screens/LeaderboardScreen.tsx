// src/screens/LeaderboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';

const LeaderboardScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('username, profile_pic, recognition_score')
                    .order('recognition_score', { ascending: false })
                    .limit(10);
                if (error) throw error;
                setUsers(data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#FF5A75" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Top Recognized Curators</Text>
            <FlatList
                data={users}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.userContainer}>
                        <Text style={styles.rank}>{index + 1}</Text>
                        <Image source={{ uri: item.profile_pic }} style={styles.profilePic} />
                        <View>
                            <Text style={styles.username}>{item.username}</Text>
                            <Text style={styles.score}>Recognition Score: {item.recognition_score}</Text>
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
        backgroundColor: '#1C1B33',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFB347',
        textAlign: 'center',
        marginBottom: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF5A75',
    },
    rank: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF5A75',
        marginRight: 10,
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
    score: {
        fontSize: 14,
        color: '#FFFFFF',
    },
});

export default LeaderboardScreen;
