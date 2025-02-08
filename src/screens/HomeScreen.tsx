import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { supabase } from "../services/supabaseClient";
import { fetchPostsWithAI } from '../services/huggingface';

const HomeScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current; // ✅ useRef for performance

    // ✅ Memoized function to prevent stale state issues
    const loadPosts = useCallback(async () => {
        try {
            const data = await fetchPostsWithAI(); // Fetch AI-ranked posts
            setPosts(data);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }, [fadeAnim]); // ✅ Add dependencies

    useEffect(() => {
        const channel = supabase
            .channel("recognition_points_changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "recognition_points" },
                () => {
                    loadPosts(); // ✅ Always use the latest function reference
                }
            )
            .subscribe();

        loadPosts(); // Initial load

        return () => {
            supabase.removeChannel(channel); // ✅ Correct cleanup method
        };
    }, [loadPosts]); // ✅ Add `loadPosts` dependency

    if (loading) return <ActivityIndicator size="large" color="#FF5A75" />;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
            <FlatList
                data={posts}
                keyExtractor={(item) => String(item.id)} // ✅ Ensure key is a string
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        <View style={styles.userInfo}>
                            <Image source={{ uri: item.users.profile_pic }} style={styles.profilePic} />
                            <View>
                                <Text style={styles.username}>{item.users.username}</Text>
                                <Text style={styles.recognitionScore}>Recognition Score: {item.users.recognition_score}</Text>
                            </View>
                        </View>
                        <Text style={styles.caption}>{item.caption}</Text>
                    </View>
                )}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#1C1B33',
    },
    postContainer: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#FFB347',
        paddingBottom: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
        color: '#FFB347',
    },
    recognitionScore: {
        fontSize: 12,
        color: '#FF5A75',
    },
    caption: {
        marginTop: 5,
        color: '#FFFFFF',
    },
});

export default HomeScreen;
