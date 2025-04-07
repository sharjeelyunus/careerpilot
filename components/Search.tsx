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
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  onFilterChange,
  filters,
  onRemoveFilter,
}: SearchProps) => {
  const [openType, setOpenType] = useState(false);
  const [openTechStack, setOpenTechStack] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  return (
    <div className='flex flex-col gap-6 w-full'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-center'>
        <div className='flex flex-wrap gap-3 w-full items-center justify-center'>
          <Popover open={openType} onOpenChange={setOpenType}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={openType}
                className={cn(
                  'w-[180px] justify-between transition-all duration-200',
                  filters.type.length > 0 && 'border-primary-200/50 bg-primary-200/5'
                )}
              >
                {filters.type.length > 0
                  ? `${filters.type.length} selected`
                  : 'Select Type'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0 border-primary-200/20 bg-dark-300/90 backdrop-blur-sm'>
              <Command className='bg-transparent'>
                <CommandInput placeholder='Search type...' className='border-primary-200/20' />
                <CommandEmpty>No type found.</CommandEmpty>
                <CommandGroup>
                  {filterOptions?.type.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => onFilterChange('type', option.value)}
                      className='hover:bg-primary-200/10 cursor-pointer'
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 text-primary-200',
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
                className={cn(
                  'w-[180px] justify-between transition-all duration-200',
                  filters.techstack.length > 0 && 'border-primary-200/50 bg-primary-200/5'
                )}
              >
                {filters.techstack.length > 0
                  ? `${filters.techstack.length} selected`
                  : 'Select Tech Stack'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0 border-primary-200/20 bg-dark-300/90 backdrop-blur-sm'>
              <Command className='bg-transparent'>
                <CommandInput placeholder='Search tech stack...' className='border-primary-200/20' />
                <CommandEmpty>No tech stack found.</CommandEmpty>
                <CommandGroup>
                  {filterOptions?.techstack.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => onFilterChange('techstack', option.value)}
                      className='hover:bg-primary-200/10 cursor-pointer'
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 text-primary-200',
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
                className={cn(
                  'w-[180px] justify-between transition-all duration-200',
                  filters.level.length > 0 && 'border-primary-200/50 bg-primary-200/5'
                )}
              >
                {filters.level.length > 0
                  ? `${filters.level.length} selected`
                  : 'Select Level'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0 border-primary-200/20 bg-dark-300/90 backdrop-blur-sm'>
              <Command className='bg-transparent'>
                <CommandInput placeholder='Search level...' className='border-primary-200/20' />
                <CommandEmpty>No level found.</CommandEmpty>
                <CommandGroup>
                  {filterOptions?.level.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => onFilterChange('level', option.value)}
                      className='hover:bg-primary-200/10 cursor-pointer'
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 text-primary-200',
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

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div 
            className='flex flex-col gap-3'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className='flex items-center gap-2'>
              <Filter className='w-4 h-4 text-primary-200' />
              <span className='text-light-100/70 text-sm font-medium'>Active Filters:</span>
            </div>
            <div className='flex flex-wrap gap-2'>
              {Object.entries(filters).map(([key, values]) =>
                values.map((value) => (
                  <motion.div
                    key={`${key}-${value}`}
                    className='bg-primary-200/10 text-primary-200 text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-primary-200/20 shadow-sm'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className='font-medium'>{value}</span>
                    <button
                      onClick={() => onRemoveFilter(key as keyof typeof filters, value)}
                      className='ml-1 text-primary-200 hover:text-light-100 transition-colors duration-200'
                    >
                      <X className='w-3.5 h-3.5' />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
