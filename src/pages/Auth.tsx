
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle } from 'lucide-react';
import { AuthStatusHandler } from '@/components/auth/AuthStatusHandler';
import { useAuthValidation } from '@/hooks/useAuthValidation';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { isValid, reason, performRedirect } = useAuthValidation();

  useEffect(() => {
    // Se usuário está válido, redirecionar para dashboard
    if (isValid) {
      navigate('/');
      return;
    }

    // Se deve fazer redirect mas a razão não é aprovação pendente
    if (reason && reason !== 'pending_approval' && reason !== 'not_authenticated') {
      // Força logout para casos de domínio inválido, conta suspensa, etc.
      supabase.auth.signOut();
    }
  }, [isValid, reason, navigate]);

  // Se está aguardando aprovação, mostrar tela específica
  if (reason === 'pending_approval') {
    return <AuthStatusHandler reason={reason}>{null}</AuthStatusHandler>;
  }

  const validateEmail = (email: string) => {
    if (!email.endsWith('@mrladvogados.com.br')) {
      return 'O email deve pertencer ao domínio @mrladvogados.com.br';
    }
    return null;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    return null;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const emailError = validateEmail(email);
    if (emailError) {
      toast({
        title: "Erro",
        description: emailError,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        let message = 'Ocorreu um erro ao tentar fazer login';
        
        if (error.message.includes('Invalid login credentials')) {
          message = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          message = 'Confirme seu email antes de fazer login';
        }
        
        throw new Error(message);
      }
      
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError) {
      toast({
        title: "Erro",
        description: emailError,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (passwordError) {
      toast({
        title: "Erro",
        description: passwordError,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Erro",
        description: "Nome e sobrenome são obrigatórios",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        let message = 'Ocorreu um erro ao tentar se cadastrar';
        
        if (error.message.includes('User already registered')) {
          message = 'Este email já está cadastrado. Tente fazer login.';
        }
        
        throw new Error(message);
      }
      
      toast({
        title: "Cadastro realizado",
        description: "Verifique seu email para confirmar o cadastro. Após a confirmação, aguarde a aprovação do administrador.",
      });
      
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-lawblue-800">MRL Advogados</CardTitle>
          <CardDescription>
            Sistema de gestão jurídica
          </CardDescription>
        </CardHeader>
        
        <Alert className="mx-6 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Acesso restrito ao domínio @mrladvogados.com.br. Novos usuários precisam de aprovação do administrador.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 mb-4 mx-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input 
                    id="email-login"
                    type="email" 
                    placeholder="seu.email@mrladvogados.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Senha</Label>
                  <Input 
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-lawblue-600 hover:bg-lawblue-700"
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Entrar'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">Nome</Label>
                    <Input 
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Sobrenome</Label>
                    <Input 
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input 
                    id="email-register"
                    type="email" 
                    placeholder="seu.email@mrladvogados.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Senha</Label>
                  <Input 
                    id="password-register"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500">Mínimo de 6 caracteres</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-lawblue-600 hover:bg-lawblue-700"
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Cadastrar'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
