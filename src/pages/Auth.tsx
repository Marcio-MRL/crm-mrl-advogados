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
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/27ce3e50-3cad-44f4-a295-b4890ec2ce52.png" 
              alt="MRL Advogados" 
              className="h-18 w-auto"
            />
          </div>
          <CardDescription className="text-xs text-gray-600">
            Sistema de gestão jurídica
          </CardDescription>
        </CardHeader>
        
        <div className="px-6 pb-6">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-3 w-3 text-blue-600" />
            <AlertDescription className="text-xs leading-relaxed text-blue-800">
              <strong>Acesso restrito</strong> ao domínio @mrladvogados.com.br. 
              Novos usuários precisam de aprovação do administrador.
            </AlertDescription>
          </Alert>
        </div>
        
        <Tabs defaultValue="login" className="px-6">
          <TabsList className="grid grid-cols-2 mb-4 w-full">
            <TabsTrigger value="login" className="text-xs">Login</TabsTrigger>
            <TabsTrigger value="register" className="text-xs">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-0">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-3 p-0">
                <div className="space-y-1">
                  <Label htmlFor="email-login" className="text-xs">Email</Label>
                  <Input 
                    id="email-login"
                    type="email" 
                    placeholder="seu.email@mrladvogados.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-login" className="text-xs">Senha</Label>
                  <Input 
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-xs h-8"
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-6 px-0">
                <Button 
                  type="submit" 
                  className="w-full bg-lawblue-600 hover:bg-lawblue-700 text-xs h-8"
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Entrar'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="mt-0">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-3 p-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="first-name" className="text-xs">Nome</Label>
                    <Input 
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="last-name" className="text-xs">Sobrenome</Label>
                    <Input 
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="text-xs h-8"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email-register" className="text-xs">Email</Label>
                  <Input 
                    id="email-register"
                    type="email" 
                    placeholder="seu.email@mrladvogados.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-register" className="text-xs">Senha</Label>
                  <Input 
                    id="password-register"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="text-xs h-8"
                  />
                  <p className="text-xs text-gray-500">Mínimo de 6 caracteres</p>
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-6 px-0">
                <Button 
                  type="submit" 
                  className="w-full bg-lawblue-600 hover:bg-lawblue-700 text-xs h-8"
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
