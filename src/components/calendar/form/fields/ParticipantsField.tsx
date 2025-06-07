
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';

interface ParticipantsFieldProps {
  participants: string[];
  onParticipantsChange: (participants: string[]) => void;
}

export function ParticipantsField({ participants, onParticipantsChange }: ParticipantsFieldProps) {
  const [participantInput, setParticipantInput] = useState('');

  const addParticipant = () => {
    if (participantInput.trim() && !participants.includes(participantInput.trim())) {
      onParticipantsChange([...participants, participantInput.trim()]);
      setParticipantInput('');
    }
  };

  const removeParticipant = (participant: string) => {
    onParticipantsChange(participants.filter(p => p !== participant));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addParticipant();
    }
  };

  return (
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
      
      {participants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {participants.map((participant, index) => (
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
  );
}
