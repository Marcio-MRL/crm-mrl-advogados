
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock } from 'lucide-react';

interface TimeFieldsProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

export function TimeFields({ 
  startTime, 
  endTime, 
  onStartTimeChange, 
  onEndTimeChange 
}: TimeFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="startTime">Horário de Início</Label>
        <div className="relative">
          <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
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
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
    </>
  );
}
