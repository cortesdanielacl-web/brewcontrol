import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { createProfile } from './profileService';

export interface SignUpMetadata {
  breweryName: string;
  masterBrewer: string;
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data.user, error };
}

async function resolveUserAfterSignUp(
  signUpUser: User | null,
  signUpSession: Session | null,
): Promise<User | null> {
  if (signUpUser?.id) {
    return signUpUser;
  }

  if (signUpSession?.user?.id) {
    return signUpSession.user;
  }

  const session = await getSession();
  if (session?.user?.id) {
    return session.user;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.id) {
    return null;
  }

  return data.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  metadata: SignUpMetadata,
): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        brewery_name: metadata.breweryName,
        master_brewer: metadata.masterBrewer,
      },
    },
  });

  if (error) {
    return { user: null, error };
  }

  const user = await resolveUserAfterSignUp(data.user, data.session);

  if (!user?.id) {
    return { user: null, error: null };
  }

  const { error: profileError } = await createProfile({
    userId: user.id,
    breweryName: metadata.breweryName,
    masterBrewer: metadata.masterBrewer,
  });

  if (profileError) {
    return {
      user,
      error: {
        name: 'ProfileCreationError',
        message: `Cuenta creada, pero no se pudo guardar el perfil: ${profileError.message}`,
        status: profileError.code ? Number(profileError.code) || 500 : 500,
      } as AuthError,
    };
  }

  return { user, error: null };
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export function onAuthStateChange(
  callback: (session: Session | null) => void,
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => subscription.unsubscribe();
}
