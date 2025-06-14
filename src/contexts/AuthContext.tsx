
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserProfile = {
  role: string;
  status: string;
  first_name?: string;
  last_name?: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role, status, first_name, last_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('User authenticated, fetching profile...');
          // Usar timeout para evitar deadlock
          setTimeout(async () => {
            try {
              const profile = await fetchUserProfile(currentSession.user.id);
              setUserProfile(profile);
              setLoading(false);
            } catch (error) {
              console.error('Error fetching profile:', error);
              setLoading(false);
            }
          }, 100);
        } else {
          console.log('No user, clearing profile');
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    console.log('Checking for existing session');
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Existing session:', currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        setTimeout(async () => {
          try {
            const profile = await fetchUserProfile(currentSession.user.id);
            setUserProfile(profile);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
          }
        }, 100);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('Signing out...');
    await supabase.auth.signOut();
    setUserProfile(null);
  };

  const value = {
    session,
    user,
    userProfile,
    signOut,
    loading,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
