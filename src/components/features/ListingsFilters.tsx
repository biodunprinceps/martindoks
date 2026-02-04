'use client';

import { useState } from 'react';
import { PropertyType } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ListingsFiltersProps {
  typeFilter: PropertyType | 'all';
  onTypeChange: (type: PropertyType | 'all') => void;
  bedroomsFilter: number | 'all';
  onBedroomsChange: (bedrooms: number | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  locationFilter: string;
  onLocationChange: (location: string) => void;
}

export function ListingsFilters({
  typeFilter,
  onTypeChange,
  bedroomsFilter,
  onBedroomsChange,
  searchQuery,
  onSearchChange,
  locationFilter,
  onLocationChange,
}: ListingsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeFilters = [
    { value: 'all' as const, label: 'All Types', icon: '🏠' },
    { value: 'sale' as const, label: 'For Sale', icon: '💰' },
    { value: 'rent' as const, label: 'For Rent', icon: '🔑' },
    { value: 'land' as const, label: 'Lands', icon: '🌍' },
  ];

  const bedroomOptions = [
    { value: 'all' as const, label: 'Any' },
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
    { value: 5, label: '5+' },
  ];

  const hasActiveFilters = bedroomsFilter !== 'all' || locationFilter;

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search properties by name, location, or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-4 py-6 text-base border-2 focus:border-primary transition-colors"
        />
      </div>

      {/* Quick Type Filters */}
      <div className="flex flex-wrap gap-3">
        {typeFilters.map((filter) => (
          <motion.button
            key={filter.value}
            onClick={() => onTypeChange(filter.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300',
              'border-2 shadow-sm',
              typeFilter === filter.value
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5'
            )}
          >
            <span className="text-lg">{filter.icon}</span>
            <span>{filter.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {isExpanded ? 'Hide' : 'Show'} Advanced Filters
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onBedroomsChange('all');
              onLocationChange('');
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/50 rounded-lg p-6 space-y-6 border border-border">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  type="text"
                  placeholder="Enter location..."
                  value={locationFilter}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="border-2 focus:border-primary"
                />
              </div>

              {/* Bedrooms Filter */}
              <div>
                <label className="block text-sm font-medium mb-3">Bedrooms</label>
                <div className="flex flex-wrap gap-2">
                  {bedroomOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={bedroomsFilter === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onBedroomsChange(option.value)}
                      className={cn(
                        'rounded-full',
                        bedroomsFilter === option.value && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

