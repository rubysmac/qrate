// src/screens/PostSongScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabase';

const PostSongScreen = ({ navigation, route }) => {
    const { userId } = route.params;
    const [songId, setSongId] = useState('');
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePostSong = async () => {
        if (!songId) {
            Alert.alert('Error', 'Please enter a song ID');
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase.from('posts').insert([
                {
                    user_id: userId,
                    type: 'recommendation',
                    song_id: songId,
                    caption,
                },
            ]);
            if (error) throw error;
            
            // Insert into recognition_points to grant initial posting points
            await supabase.from('recognition_points').insert([
                {
                    user_id: userId,
                    post_id: data[0].id,
                    action: 'post',
                    points: 10,
                },
            ]);
            
            Alert.alert('Success', 'Your song recommendation has been posted!');
            navigation.goBack();
        } catch (error) {
            console.error('Error posting song:', error);
            Alert.alert('Error', 'Failed to post the song');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recommend a Song</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Song ID (Spotify/Apple Music)"
                value={songId}
                onChangeText={setSongId}
            />
            <TextInput
                style={styles.input}
                placeholder="Add a caption (optional)"
                value={caption}
                onChangeText={setCaption}
            />
            <Button title={loading ? 'Posting...' : 'Post Song'} onPress={handlePostSong} disabled={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#1C1B33',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFB347',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#FF5A75',
        borderRadius: 5,
        marginBottom: 15,
        color: '#FFFFFF',
    },
});

export default PostSongScreen;
