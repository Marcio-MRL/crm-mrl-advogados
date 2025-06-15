
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReports } from '@/hooks/useReports';
import { reportFormSchema, ReportFormValues } from './schemas/reportFormSchema';
import { Form } from "@/components/ui/form";
import { NameField } from './form/NameField';
import { TypeField } from './form/TypeField';
import { FormatField } from './form/FormatField';
import { DateRangeField } from './form/DateRangeField';
import { OptionsFields } from './form/OptionsFields';
import { DescriptionField } from './form/DescriptionField';
import { FormActions } from './form/FormActions';

interface ReportGeneratorFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReportGeneratorForm({ onSuccess, onCancel }: ReportGeneratorFormProps) {
  const { addReport, isCreating } = useReports();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      name: '',
      type: 'financeiro',
      format: 'pdf',
      dateRange: 'last_30_days',
      includeCharts: true,
      includeDetails: true,
      description: '',
    },
  });

  const onSubmit = async (data: ReportFormValues) => {
    addReport({
      name: data.name,
      type: data.type,
      format: data.format,
      date_range: data.dateRange,
      include_charts: data.includeCharts,
      include_details: data.includeDetails,
      description: data.description || null,
    }, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameField />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TypeField />
          <FormatField />
        </div>
        <DateRangeField />
        <OptionsFields />
        <DescriptionField />
        <FormActions onCancel={onCancel} isCreating={isCreating} />
      </form>
    </Form>
  );
}
