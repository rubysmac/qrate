// src/services/supabase.ts
import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch Posts with Recognition Scores
export const fetchPosts = async () => {
    const { data, error } = await supabase
        .from('posts')
        .select('*, users(username, profile_pic, recognition_score)')
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
};

// Fetch User Profile (Including Music Personality)
export const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) throw error;
    return data;
};