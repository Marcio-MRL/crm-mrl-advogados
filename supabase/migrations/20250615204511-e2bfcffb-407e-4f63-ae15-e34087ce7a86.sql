
-- Adiciona a coluna para armazenar o ID do evento do Google
ALTER TABLE public.calendar_events
ADD COLUMN google_event_id TEXT;

-- Adiciona um comentário para explicar o propósito da coluna
COMMENT ON COLUMN public.calendar_events.google_event_id IS 'Stores the unique ID of the event from Google Calendar for synchronization purposes.';

-- Garante que não haverá eventos duplicados do Google para o mesmo usuário
ALTER TABLE public.calendar_events
ADD CONSTRAINT unique_google_event_id_per_user UNIQUE (user_id, google_event_id);
