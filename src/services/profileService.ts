import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

export interface CreateProfileInput {
  userId: string;
  breweryName: string;
  masterBrewer: string;
}

export interface UpdateProfileInput {
  breweryName: string;
  masterBrewer: string;
}

export async function getProfileByUserId(
  userId: string,
): Promise<{ profile: UserProfile | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return { profile: data, error };
}

export async function createProfile(
  input: CreateProfileInput,
): Promise<{ profile: UserProfile | null; error: PostgrestError | null }> {
  const { profile: existing, error: fetchError } = await getProfileByUserId(input.userId);

  if (fetchError) {
    return { profile: null, error: fetchError };
  }

  if (existing) {
    return { profile: existing, error: null };
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: input.userId,
      brewery_name: input.breweryName,
      master_brewer: input.masterBrewer,
      role: 'user',
      active: true,
    })
    .select()
    .single();

  return { profile: data, error };
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<{ profile: UserProfile | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      brewery_name: input.breweryName,
      master_brewer: input.masterBrewer,
    })
    .eq('id', userId)
    .select()
    .single();

  return { profile: data, error };
}
