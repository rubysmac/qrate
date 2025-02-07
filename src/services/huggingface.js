// src/services/huggingface.js
import axios from 'axios';
import { supabase } from './supabase';
import { HUGGINGFACE_API_KEY } from '@env';


const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';

export const fetchPostsWithAI = async () => {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*, users(username, profile_pic, recognition_score)');
        
        if (error) throw error;

        const postTexts = posts.map(post => post.caption).filter(Boolean);
        if (postTexts.length === 0) return posts;

        const response = await axios.post(HUGGINGFACE_API_URL, {
            inputs: postTexts
        }, {
            headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` }
        });

        const rankedPosts = posts.map((post, index) => ({
            ...post,
            ai_score: response.data[index] || 0
        })).sort((a, b) => b.ai_score - a.ai_score);
        
        return rankedPosts;
    } catch (error) {
        console.error('Error fetching AI-ranked posts:', error);
        return [];
    }
};
