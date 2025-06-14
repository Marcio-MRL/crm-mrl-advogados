
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'master' | 'admin' | 'advogado' | 'leitor';
  allowedRoles?: ('master' | 'admin' | 'advogado' | 'leitor')[];
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  allowedRoles = ['master', 'admin', 'advogado', 'leitor']
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAccess = async () => {
      if (authLoading) return;

      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao verificar perfil:', error);
          navigate('/auth');
          return;
        }

        setUserProfile(profile);

        // Verificar status do usuário
        if (profile.status === 'pending_approval') {
          navigate('/auth');
          return;
        }

        if (profile.status === 'inactive') {
          navigate('/auth');
          return;
        }

        // Verificar permissões de role
        const userRole = profile.role === 'editor' ? 'advogado' : profile.role;
        
        if (requiredRole && userRole !== requiredRole) {
          navigate('/');
          return;
        }

        if (allowedRoles && !allowedRoles.includes(userRole)) {
          navigate('/');
          return;
        }

      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    checkUserAccess();
  }, [user, authLoading, navigate, requiredRole, allowedRoles]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="animate-pulse text-center">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  return <>{children}</>;
}
