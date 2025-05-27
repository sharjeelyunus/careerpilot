import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import Search from '@/components/Search';

interface FilterOptions {
  type: { value: string; label: string }[];
  techstack: { value: string; label: string }[];
  level: { value: string; label: string }[];
}

interface Filters {
  type: string[];
  techstack: string[];
  level: string[];
}

interface SearchSectionProps {
  filterOptions: FilterOptions;
  filters: Filters;
  onFilterChange: (key: 'type' | 'techstack' | 'level', value: string) => void;
  onRemoveFilter: (key: 'type' | 'techstack' | 'level', value: string) => void;
}

const SearchSection = ({
  filterOptions,
  filters,
  onFilterChange,
  onRemoveFilter,
}: SearchSectionProps) => {
  return (
    <motion.div
      className='mb-12 bg-dark-200/30 rounded-2xl p-6 border border-primary-200/10'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className='flex flex-col md:flex-row md:items-center gap-4 mb-4'>
        <div className='flex items-center gap-2'>
          <SearchIcon className='w-5 h-5 text-primary-200' />
          <h2 className='text-xl font-bold'>Find Interviews</h2>
        </div>
      </div>
      <Search
        filterOptions={filterOptions}
        onSearchChange={() => {}}
        onFilterChange={onFilterChange}
        onRemoveFilter={onRemoveFilter}
        filters={filters}
      />
    </motion.div>
  );
};

export default SearchSection; 