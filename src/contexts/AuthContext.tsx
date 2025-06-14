
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
      console.log('AuthContext: Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role, status, first_name, last_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthContext: Error fetching profile:', error.message, error.details);
        return null;
      }

      console.log('AuthContext: Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('AuthContext: Exception fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('AuthContext: Refreshing profile for user:', user.id);
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('AuthContext: Auth state changed:', event, {
          hasSession: !!currentSession,
          userEmail: currentSession?.user?.email,
          userId: currentSession?.user?.id
        });
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('AuthContext: User authenticated, fetching profile...');
          // Usar timeout para evitar deadlock
          setTimeout(async () => {
            try {
              const profile = await fetchUserProfile(currentSession.user.id);
              console.log('AuthContext: Setting profile:', profile);
              setUserProfile(profile);
              setLoading(false);
            } catch (error) {
              console.error('AuthContext: Error in profile fetch timeout:', error);
              setLoading(false);
            }
          }, 100);
        } else {
          console.log('AuthContext: No user, clearing profile and setting loading false');
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    console.log('AuthContext: Checking for existing session');
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('AuthContext: Existing session check:', {
        hasSession: !!currentSession,
        userEmail: currentSession?.user?.email,
        userId: currentSession?.user?.id
      });
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log('AuthContext: Existing session found, fetching profile...');
        setTimeout(async () => {
          try {
            const profile = await fetchUserProfile(currentSession.user.id);
            console.log('AuthContext: Setting profile from existing session:', profile);
            setUserProfile(profile);
            setLoading(false);
          } catch (error) {
            console.error('AuthContext: Error in existing session profile fetch:', error);
            setLoading(false);
          }
        }, 100);
      } else {
        console.log('AuthContext: No existing session, setting loading false');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('AuthContext: Signing out...');
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

  console.log('AuthContext: Current state:', {
    hasUser: !!user,
    hasProfile: !!userProfile,
    loading,
    userEmail: user?.email,
    profileStatus: userProfile?.status,
    profileRole: userProfile?.role
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
