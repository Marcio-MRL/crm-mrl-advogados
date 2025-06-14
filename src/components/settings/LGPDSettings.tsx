
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLGPDConsents } from '@/hooks/useLGPDConsents';
import { useDataExport } from '@/hooks/useDataExport';
import { 
  Shield, 
  Download, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export function LGPDSettings() {
  const { consents, loading: consentsLoading, updateConsent } = useLGPDConsents();
  const { exports, loading: exportLoading, requestDataExport, fetchExports, downloadExport } = useDataExport();

  const consentTypes = [
    {
      type: 'data_processing',
      label: 'Processamento de Dados',
      description: 'Consentimento para processar seus dados pessoais conforme nossa política de privacidade'
    },
    {
      type: 'marketing',
      label: 'Comunicações de Marketing',
      description: 'Receber comunicações promocionais e informações sobre novos serviços'
    },
    {
      type: 'analytics',
      label: 'Análise e Métricas',
      description: 'Uso de dados para análise de performance e melhoria dos serviços'
    },
    {
      type: 'cookies',
      label: 'Cookies e Tecnologias Similares',
      description: 'Uso de cookies para melhorar a experiência do usuário'
    }
  ];

  const getConsentStatus = (type: string) => {
    const consent = consents.find(c => c.consent_type === type);
    return consent?.consent_given || false;
  };

  const handleConsentChange = async (type: string, given: boolean) => {
    await updateConsent(type, given);
  };

  const handleDataExport = async () => {
    await requestDataExport('lgpd_request');
    await fetchExports();
  };

  React.useEffect(() => {
    fetchExports();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Consentimentos LGPD
          </CardTitle>
          <CardDescription>
            Gerencie seus consentimentos de dados conforme a Lei Geral de Proteção de Dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {consentTypes.map((item) => (
            <div key={item.type} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{item.label}</h4>
                  <Badge variant={getConsentStatus(item.type) ? "default" : "secondary"}>
                    {getConsentStatus(item.type) ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <Switch
                checked={getConsentStatus(item.type)}
                onCheckedChange={(checked) => handleConsentChange(item.type, checked)}
                disabled={consentsLoading}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Portabilidade de Dados
          </CardTitle>
          <CardDescription>
            Solicite uma cópia de todos os seus dados ou exporte informações específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleDataExport}
              disabled={exportLoading}
              className="bg-lawblue-500 hover:bg-lawblue-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Solicitar Exportação Completa
            </Button>
          </div>

          {exports.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-3">Histórico de Exportações</h4>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {exports.map((exportItem) => (
                      <div key={exportItem.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-blue-100">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Exportação {exportItem.export_type}</span>
                              {exportItem.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {exportItem.status === 'processing' && <Clock className="h-4 w-4 text-yellow-500" />}
                              {exportItem.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(exportItem.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        {exportItem.status === 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadExport(exportItem)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Direitos LGPD
          </CardTitle>
          <CardDescription>
            Seus direitos conforme a Lei Geral de Proteção de Dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Direito de Acesso</h4>
              <p className="text-sm text-gray-500 mb-3">
                Solicite informações sobre como seus dados são processados
              </p>
              <Button variant="outline" size="sm">
                Solicitar Acesso
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Direito de Retificação</h4>
              <p className="text-sm text-gray-500 mb-3">
                Corrija dados pessoais incorretos ou incompletos
              </p>
              <Button variant="outline" size="sm">
                Solicitar Correção
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Direito de Exclusão</h4>
              <p className="text-sm text-gray-500 mb-3">
                Solicite a exclusão de seus dados pessoais
              </p>
              <Button variant="outline" size="sm">
                Solicitar Exclusão
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Direito de Oposição</h4>
              <p className="text-sm text-gray-500 mb-3">
                Objete ao processamento de seus dados
              </p>
              <Button variant="outline" size="sm">
                Registrar Oposição
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
