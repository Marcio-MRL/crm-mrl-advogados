
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TablesInsert } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type ReportInsertPayload = Omit<TablesInsert<'reports'>, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'created_by' | 'status'>;

const fetchReports = async () => {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching reports:", error);
        throw new Error(error.message);
    }
    return data;
};

const createReport = async (reportData: ReportInsertPayload) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");
    
    const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single();
    const createdBy = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : user.email;

    const { data, error } = await supabase
        .from('reports')
        .insert([{ ...reportData, user_id: user.id, created_by: createdBy, status: 'concluido' }])
        .select()
        .single();
    
    if (error) {
        console.error("Error creating report:", error);
        throw new Error(error.message);
    }
    return data;
};

export function useReports() {
    const queryClient = useQueryClient();

    const { data: reports, isLoading, error } = useQuery({
        queryKey: ['reports'],
        queryFn: fetchReports,
    });

    const { mutate: addReport, isPending: isCreating } = useMutation({
        mutationFn: createReport,
        onSuccess: () => {
            toast.success('Relatório gerado e salvo com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
        onError: (error) => {
            toast.error(`Erro ao salvar relatório: ${error.message}`);
        },
    });

    return {
        reports: reports || [],
        isLoading,
        error,
        addReport,
        isCreating,
    };
}
