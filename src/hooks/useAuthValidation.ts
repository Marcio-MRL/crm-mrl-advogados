
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useAuthValidation() {
  const { user, userProfile, loading } = useAuth();
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    reason?: string;
    shouldRedirect: boolean;
    redirectTo?: string;
  }>({
    isValid: false,
    shouldRedirect: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useAuthValidation: Starting validation with:', {
      loading,
      hasUser: !!user,
      userEmail: user?.email,
      hasProfile: !!userProfile,
      profileStatus: userProfile?.status
    });

    if (loading) {
      console.log('useAuthValidation: Still loading, skipping validation');
      return;
    }

    // Usuário não autenticado
    if (!user) {
      console.log('useAuthValidation: No user authenticated');
      setValidationState({
        isValid: false,
        reason: 'not_authenticated',
        shouldRedirect: true,
        redirectTo: '/auth'
      });
      return;
    }

    console.log('useAuthValidation: User found, validating email domain:', user.email);
    
    // Verificar domínio do email
    if (user.email && !user.email.endsWith('@mrladvogados.com.br')) {
      console.log('useAuthValidation: Invalid domain for email:', user.email);
      setValidationState({
        isValid: false,
        reason: 'invalid_domain',
        shouldRedirect: true,
        redirectTo: '/auth'
      });
      return;
    }

    console.log('useAuthValidation: Email domain valid, checking profile');

    // MUDANÇA IMPORTANTE: Aguardar mais tempo para o perfil carregar
    // Se o usuário existe mas ainda não temos perfil, aguardar um pouco mais
    if (!userProfile) {
      console.log('useAuthValidation: No profile found, but user exists - waiting longer');
      
      // Só considerar "no_profile" após um tempo maior
      const timer = setTimeout(() => {
        if (!userProfile && user) {
          console.log('useAuthValidation: Profile still not found after timeout');
          setValidationState({
            isValid: false,
            reason: 'no_profile',
            shouldRedirect: true,
            redirectTo: '/auth'
          });
        }
      }, 2000); // Aguardar 2 segundos para o perfil carregar

      return () => clearTimeout(timer);
    }

    console.log('useAuthValidation: Profile found, checking status:', userProfile.status);

    // Verificar status do usuário
    switch (userProfile.status) {
      case 'pending_approval':
        console.log('useAuthValidation: User pending approval');
        setValidationState({
          isValid: false,
          reason: 'pending_approval',
          shouldRedirect: false
        });
        break;
      case 'inactive':
        console.log('useAuthValidation: User account suspended');
        setValidationState({
          isValid: false,
          reason: 'account_suspended',
          shouldRedirect: true,
          redirectTo: '/auth'
        });
        break;
      case 'active':
        console.log('useAuthValidation: User is valid and active');
        setValidationState({
          isValid: true,
          shouldRedirect: false
        });
        break;
      default:
        console.log('useAuthValidation: Unknown status:', userProfile.status);
        setValidationState({
          isValid: false,
          reason: 'unknown_status',
          shouldRedirect: true,
          redirectTo: '/auth'
        });
    }
  }, [user, userProfile, loading]);

  const performRedirect = () => {
    console.log('useAuthValidation: Performing redirect to:', validationState.redirectTo);
    if (validationState.shouldRedirect && validationState.redirectTo) {
      navigate(validationState.redirectTo);
    }
  };

  console.log('useAuthValidation: Current validation state:', validationState);

  return {
    ...validationState,
    performRedirect,
    loading
  };
}
