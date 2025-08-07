'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CheckCircleFillIcon, ChevronDownIcon } from './icons';

const personas = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard conversational assistant',
  },
  {
    id: 'patchy',
    name: 'Patchy the Pirate',
    description: 'Arrr! A swashbuckling sea captain',
  },
  {
    id: 'marvin',
    name: 'Marvin the Paranoid Android',
    description: 'Depressed robot with a brain the size of a planet',
  },
];

export function PersonaSelector({
  persona,
  setPersona,
  className,
}: {
  persona: string;
  setPersona: (persona: string) => void;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);

  const selectedPersona = useMemo(
    () => personas.find((p) => p.id === persona),
    [persona],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          data-testid="persona-selector"
          variant="outline"
          className="md:px-2 md:h-[34px]"
        >
          {selectedPersona?.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {personas.map((personaOption) => (
          <DropdownMenuItem
            data-testid={`persona-selector-item-${personaOption.id}`}
            key={personaOption.id}
            onSelect={() => {
              console.log('PersonaSelector - changing persona from', persona, 'to', personaOption.id);
              setPersona(personaOption.id);
              setOpen(false);
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={personaOption.id === persona}
          >
            <div className="flex flex-col gap-1 items-start">
              <div>{personaOption.name}</div>
              <div className="text-xs text-muted-foreground">
                {personaOption.description}
              </div>
            </div>
            <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCircleFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
