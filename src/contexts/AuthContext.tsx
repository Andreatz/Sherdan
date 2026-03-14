import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, checkIsAdmin } from '../utils/supabase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  let mounted = true;

  const syncAuthState = async (session: any) => {
    if (!mounted) return;












    setIsLoading(true);

    try {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const adminStatus = await checkIsAdmin(currentUser.id);
        if (mounted) setIsAdmin(adminStatus);
      } else {
        if (mounted) setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error syncing auth state:', error);
      if (mounted) {
        setUser(null);
        setIsAdmin(false);
      }
    } finally {
      if (mounted) setIsLoading(false);
    }
  };

  supabase.auth.getSession().then(({ data: { session } }) => {
    void syncAuthState(session);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    void syncAuthState(session);
  });

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          is_admin: false,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
