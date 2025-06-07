
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Event } from '@/types/event';

interface EventFormProps {
  event?: Event | null;
  onSave: (event: Event) => void;
  onCancel: () => void;
}

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<Event>({
    title: '',
    description: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    client: '',
    type: 'reuniao',
    participants: [],
    syncWithGoogle: true
  });
  
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [participantInput, setParticipantInput] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: event.date || new Date(),
        participants: event.participants || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: new Date(),
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        client: '',
        type: 'reuniao',
        participants: [],
        syncWithGoogle: true
      });
    }
  }, [event]);

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error("Horário de início deve ser anterior ao horário de fim");
      return;
    }

    const eventToSave: Event = {
      ...formData,
      id: event?.id || Date.now().toString(),
    };

    onSave(eventToSave);
    
    if (formData.syncWithGoogle) {
      toast.success("Evento salvo e sincronizado com Google Calendar!");
    } else {
      toast.success("Evento salvo com sucesso!");
    }
  };

  const addParticipant = () => {
    if (participantInput.trim() && !formData.participants.includes(participantInput.trim())) {
      setFormData({
        ...formData,
        participants: [...formData.participants, participantInput.trim()]
      });
      setParticipantInput('');
    }
  };

  const removeParticipant = (participant: string) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter(p => p !== participant)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addParticipant();
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Digite o título do evento"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descrição do evento"
            rows={3}
          />
        </div>

        <div>
          <Label>Data</Label>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : "Selecione a data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => {
                  if (date) {
                    setFormData({ ...formData, date });
                    setIsDatePickerOpen(false);
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
            value={formData.type}
            onValueChange={(value: 'audiencia' | 'reuniao' | 'prazo' | 'outro') => 
              setFormData({ ...formData, type: value })
            }
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

        <div>
          <Label htmlFor="startTime">Horário de Início</Label>
          <div className="relative">
            <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="pl-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="endTime">Horário de Fim</Label>
          <div className="relative">
            <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="pl-8"
            />
          </div>
        </div>

        <div className="col-span-2">
          <Label htmlFor="location">Local</Label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Local do evento"
              className="pl-8"
            />
          </div>
        </div>

        <div className="col-span-2">
          <Label htmlFor="client">Cliente</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            placeholder="Nome do cliente (opcional)"
          />
        </div>

        <div className="col-span-2">
          <Label>Participantes</Label>
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Email do participante"
                className="pl-8"
              />
            </div>
            <Button type="button" onClick={addParticipant}>
              Adicionar
            </Button>
          </div>
          
          {formData.participants.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.participants.map((participant, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {participant}
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="syncWithGoogle"
            checked={formData.syncWithGoogle}
            onChange={(e) => setFormData({ ...formData, syncWithGoogle: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="syncWithGoogle">Sincronizar com Google Calendar</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          {event ? 'Atualizar' : 'Criar'} Evento
        </Button>
      </div>
    </div>
  );
}
