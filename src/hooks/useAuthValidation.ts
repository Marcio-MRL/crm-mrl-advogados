
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
    if (loading) {
      console.log('AuthValidation: Still loading...');
      return;
    }

    console.log('AuthValidation: Validating user:', user?.email, 'Profile:', userProfile);

    // Usuário não autenticado
    if (!user) {
      console.log('AuthValidation: No user authenticated');
      setValidationState({
        isValid: false,
        reason: 'not_authenticated',
        shouldRedirect: true,
        redirectTo: '/auth'
      });
      return;
    }

    // Verificar domínio do email
    if (user.email && !user.email.endsWith('@mrladvogados.com.br')) {
      console.log('AuthValidation: Invalid domain');
      setValidationState({
        isValid: false,
        reason: 'invalid_domain',
        shouldRedirect: true,
        redirectTo: '/auth'
      });
      return;
    }

    // Verificar se tem perfil
    if (!userProfile) {
      console.log('AuthValidation: No profile found');
      setValidationState({
        isValid: false,
        reason: 'no_profile',
        shouldRedirect: true,
        redirectTo: '/auth'
      });
      return;
    }

    // Verificar status do usuário
    console.log('AuthValidation: Profile status:', userProfile.status);
    switch (userProfile.status) {
      case 'pending_approval':
        setValidationState({
          isValid: false,
          reason: 'pending_approval',
          shouldRedirect: false
        });
        break;
      case 'inactive':
        setValidationState({
          isValid: false,
          reason: 'account_suspended',
          shouldRedirect: true,
          redirectTo: '/auth'
        });
        break;
      case 'active':
        console.log('AuthValidation: User is valid and active');
        setValidationState({
          isValid: true,
          shouldRedirect: false
        });
        break;
      default:
        setValidationState({
          isValid: false,
          reason: 'unknown_status',
          shouldRedirect: true,
          redirectTo: '/auth'
        });
    }
  }, [user, userProfile, loading]);

  const performRedirect = () => {
    console.log('AuthValidation: Performing redirect to:', validationState.redirectTo);
    if (validationState.shouldRedirect && validationState.redirectTo) {
      navigate(validationState.redirectTo);
    }
  };

  return {
    ...validationState,
    performRedirect,
    loading
  };
}
