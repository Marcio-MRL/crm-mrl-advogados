
-- Criar um tipo enum para os tipos de evento, para consistência
CREATE TYPE public.event_type AS ENUM ('audiencia', 'reuniao', 'prazo', 'outro');

-- Criar a tabela para armazenar os eventos da agenda
CREATE TABLE public.calendar_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    client TEXT,
    type public.event_type NOT NULL,
    participants TEXT[],
    sync_with_google BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT "end_time_after_start_time" CHECK (end_time >= start_time)
);

-- Comentários para clareza
COMMENT ON TABLE public.calendar_events IS 'Armazena os eventos da agenda dos usuários.';
COMMENT ON COLUMN public.calendar_events.type IS 'Tipo do evento, usando um enum para garantir a consistência dos dados.';

-- Habilitar Row Level Security
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para que usuários possam gerenciar apenas seus próprios eventos
CREATE POLICY "Users can view their own calendar events"
ON public.calendar_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar events"
ON public.calendar_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events"
ON public.calendar_events FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events"
ON public.calendar_events FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para atualizar o campo updated_at automaticamente
CREATE TRIGGER handle_calendar_events_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();
