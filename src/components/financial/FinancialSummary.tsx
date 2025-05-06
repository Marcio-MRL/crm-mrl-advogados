
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

export function FinancialSummary() {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Saldo Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">R$ 157.430,86</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Atualizado em 06/05/2025</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Receitas (Mês)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold text-green-600">R$ 48.350,00</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">+12% em relação ao mês anterior</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Despesas (Mês)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <ArrowDownRight className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-bold text-red-600">R$ 32.768,45</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">-3% em relação ao mês anterior</p>
        </CardContent>
      </Card>
    </>
  );
}
