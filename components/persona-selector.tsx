'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PersonaSelector({
  persona,
  setPersona,
}: {
  persona: string;
  setPersona: (persona: string) => void;
}) {
  const handleValueChange = (value: string) => {
    setPersona(value);
  };

  return (
    <Select value={persona} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Persona" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="patchy">Patchy the Pirate</SelectItem>
        <SelectItem value="marvin">Marvin the Paranoid Android</SelectItem>
      </SelectContent>
    </Select>
  );
}
