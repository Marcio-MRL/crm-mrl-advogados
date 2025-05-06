
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="glass-card rounded-lg p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-lawblue-800 mb-2">404</h1>
        <p className="text-2xl font-medium text-lawblue-600 mb-6">Página não encontrada</p>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild className="bg-lawblue-500 hover:bg-lawblue-600">
          <Link to="/" className="flex items-center">
            <ArrowLeft size={16} className="mr-2" /> Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
