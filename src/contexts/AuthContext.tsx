import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import {
  getSession,
  onAuthStateChange,
  signInWithEmail,
  signOut as authSignOut,
  signUpWithEmail,
  type SignUpMetadata,
} from '../services/authService';
import { getProfileByUserId } from '../services/profileService';
import type { UserProfile, UserRole } from '../types';

function parseUserRole(role: string | null | undefined): UserRole {
  return role === 'admin' ? 'admin' : 'user';
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    metadata: SignUpMetadata,
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  const loading = !sessionChecked || (!!session?.user && role === null);

  useEffect(() => {
    let mounted = true;

    getSession()
      .then((initialSession) => {
        if (mounted) setSession(initialSession);
      })
      .catch((error) => {
        console.error('Error al restaurar la sesión:', error);
      })
      .finally(() => {
        if (mounted) setSessionChecked(true);
      });

    const unsubscribe = onAuthStateChange((nextSession) => {
      setSession(nextSession);
      setSessionChecked(true);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;

    if (!userId) {
      setProfile(null);
      setRole(null);
      return;
    }

    setProfile(null);
    setRole(null);

    let mounted = true;

    getProfileByUserId(userId)
      .then(({ profile: fetchedProfile, error }) => {
        if (!mounted) return;

        if (error) {
          console.error('Error al cargar el perfil del usuario:', error);
          setProfile(null);
          setRole('user');
          return;
        }

        setProfile(fetchedProfile);
        setRole(parseUserRole(fetchedProfile?.role));
      })
      .catch((error) => {
        if (!mounted) return;
        console.error('Error al cargar el perfil del usuario:', error);
        setProfile(null);
        setRole('user');
      });

    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await signInWithEmail(email, password);
    return { error };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, metadata: SignUpMetadata) => {
      const { error } = await signUpWithEmail(email, password, metadata);
      return { error };
    },
    [],
  );

  const signOut = useCallback(async () => {
    const { error } = await authSignOut();
    return { error };
  }, []);

  const isAdmin = role === 'admin';

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      profile,
      role,
      isAdmin,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [session, profile, role, isAdmin, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
