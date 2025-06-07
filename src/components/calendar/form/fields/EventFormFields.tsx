
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventFormFieldsProps {
  title: string;
  description: string;
  date: Date;
  location: string;
  client: string;
  type: 'audiencia' | 'reuniao' | 'prazo' | 'outro';
  syncWithGoogle: boolean;
  isDatePickerOpen: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onLocationChange: (location: string) => void;
  onClientChange: (client: string) => void;
  onTypeChange: (type: 'audiencia' | 'reuniao' | 'prazo' | 'outro') => void;
  onSyncWithGoogleChange: (sync: boolean) => void;
  onDatePickerOpenChange: (open: boolean) => void;
}

export function EventFormFields({
  title,
  description,
  date,
  location,
  client,
  type,
  syncWithGoogle,
  isDatePickerOpen,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onLocationChange,
  onClientChange,
  onTypeChange,
  onSyncWithGoogleChange,
  onDatePickerOpenChange
}: EventFormFieldsProps) {
  return (
    <>
      <div className="col-span-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Digite o título do evento"
        />
      </div>

      <div className="col-span-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descrição do evento"
          rows={3}
        />
      </div>

      <div>
        <Label>Data</Label>
        <Popover open={isDatePickerOpen} onOpenChange={onDatePickerOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  onDateChange(selectedDate);
                  onDatePickerOpenChange(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select
          value={type}
          onValueChange={onTypeChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="audiencia">🏛️ Audiência</SelectItem>
            <SelectItem value="reuniao">👥 Reunião</SelectItem>
            <SelectItem value="prazo">⏰ Prazo</SelectItem>
            <SelectItem value="outro">📝 Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-2">
        <Label htmlFor="location">Local</Label>
        <div className="relative">
          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Local do evento"
            className="pl-8"
          />
        </div>
      </div>

      <div className="col-span-2">
        <Label htmlFor="client">Cliente</Label>
        <Input
          id="client"
          value={client}
          onChange={(e) => onClientChange(e.target.value)}
          placeholder="Nome do cliente (opcional)"
        />
      </div>

      <div className="col-span-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="syncWithGoogle"
          checked={syncWithGoogle}
          onChange={(e) => onSyncWithGoogleChange(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="syncWithGoogle">Sincronizar com Google Calendar</Label>
      </div>
    </>
  );
}
