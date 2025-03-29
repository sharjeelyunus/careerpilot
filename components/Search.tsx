import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FilterOptions {
  type: { value: string; label: string }[];
  techstack: { value: string; label: string }[];
  level: { value: string; label: string }[];
}

interface SearchProps {
  filterOptions: FilterOptions;
  onSearchChange: (search: string) => void;
  onFilterChange: (key: 'type' | 'techstack' | 'level', value: string) => void;
  onRemoveFilter: (key: 'type' | 'techstack' | 'level', value: string) => void;
  filters: {
    type: string[];
    techstack: string[];
    level: string[];
  };
}

const Search = ({
  filterOptions,
  onSearchChange,
  onFilterChange,
  onRemoveFilter,
  filters,
}: SearchProps) => {
  const [search, setSearch] = useState('');
  const [openType, setOpenType] = useState(false);
  const [openTechStack, setOpenTechStack] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange(value);
  };

  return (
    <div className='flex flex-col gap-4 w-full items-center justify-center'>
      <Input
        placeholder='Search interviews...'
        value={search}
        onChange={handleSearchChange}
        className='w-[70%]'
      />
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-wrap gap-4 w-full items-center justify-center'>
          <Popover open={openType} onOpenChange={setOpenType}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={openType}
                className='w-[200px] justify-between'
              >
                {filters.type.length > 0
                  ? `${filters.type.length} selected`
                  : 'Select Type'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
              <Command>
                <CommandInput placeholder='Search type...' />
                <CommandEmpty>No type found.</CommandEmpty>
                <CommandGroup>
                  {filterOptions?.type.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => onFilterChange('type', option.value)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          filters.type.includes(option.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openTechStack} onOpenChange={setOpenTechStack}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={openTechStack}
                className='w-[200px] justify-between'
              >
                {filters.techstack.length > 0
                  ? `${filters.techstack.length} selected`
                  : 'Select Tech Stack'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
              <Command>
                <CommandInput placeholder='Search tech stack...' />
                <CommandEmpty>No tech stack found.</CommandEmpty>
                <CommandGroup>
                  {filterOptions?.techstack.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => onFilterChange('techstack', option.value)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          filters.techstack.includes(option.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openLevel} onOpenChange={setOpenLevel}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={openLevel}
                className='w-[200px] justify-between'
              >
                {filters.level.length > 0
                  ? `${filters.level.length} selected`
                  : 'Select Level'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
              <Command>
                <CommandInput placeholder='Search level...' />
                <CommandEmpty>No level found.</CommandEmpty>
                <CommandGroup>
                  {filterOptions?.level.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => onFilterChange('level', option.value)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          filters.level.includes(option.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        {filters.type.map((value) => (
          <Badge
            key={`type-${value}`}
            variant='secondary'
            className='cursor-pointer'
            onClick={() => onRemoveFilter('type', value)}
          >
            {filterOptions?.type.find((opt) => opt.value === value)?.label} ×
          </Badge>
        ))}
        {filters.techstack.map((value) => (
          <Badge
            key={`techstack-${value}`}
            variant='secondary'
            className='cursor-pointer'
            onClick={() => onRemoveFilter('techstack', value)}
          >
            {filterOptions?.techstack.find((opt) => opt.value === value)?.label}{' '}
            ×
          </Badge>
        ))}
        {filters.level.map((value) => (
          <Badge
            key={`level-${value}`}
            variant='secondary'
            className='cursor-pointer'
            onClick={() => onRemoveFilter('level', value)}
          >
            {filterOptions?.level.find((opt) => opt.value === value)?.label} ×
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Search; 