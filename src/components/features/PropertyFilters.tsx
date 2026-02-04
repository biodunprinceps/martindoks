'use client';

import { PropertyStatus, PropertyType } from '@/types/property';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PropertyFiltersProps {
  activeFilter: PropertyStatus | 'all';
  onFilterChange: (filter: PropertyStatus | 'all') => void;
  typeFilter?: PropertyType | 'all';
  onTypeChange?: (type: PropertyType | 'all') => void;
  sectorFilter?: 'commercial' | 'residential' | 'all';
  onSectorChange?: (sector: 'commercial' | 'residential' | 'all') => void;
}

export function PropertyFilters({
  activeFilter,
  onFilterChange,
  typeFilter = 'all',
  onTypeChange,
  sectorFilter = 'all',
  onSectorChange,
}: PropertyFiltersProps) {
  const statusFilters = [
    { value: 'all' as const, label: 'All Status' },
    { value: 'ongoing' as const, label: 'Ongoing' },
    { value: 'completed' as const, label: 'Completed' },
    { value: 'upcoming' as const, label: 'Upcoming' },
  ];

  const typeFilters = [
    { value: 'all' as const, label: 'All Types' },
    { value: 'construction' as const, label: 'Construction' },
    { value: 'rent' as const, label: 'For Rent' },
    { value: 'sale' as const, label: 'For Sale' },
  ];

  const sectorFilters = [
    { value: 'all' as const, label: 'All Sectors' },
    { value: 'commercial' as const, label: 'Commercial' },
    { value: 'residential' as const, label: 'Residential' },
  ];

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-wrap gap-2">
        {typeFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={typeFilter === filter.value ? 'default' : 'outline'}
            onClick={() => onTypeChange?.(filter.value)}
            className={cn(
              'rounded-full',
              typeFilter === filter.value && 'bg-primary text-primary-foreground'
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? 'default' : 'outline'}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'rounded-full',
              activeFilter === filter.value && 'bg-primary text-primary-foreground'
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {onSectorChange && (
        <div className="flex flex-wrap gap-2">
          {sectorFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={sectorFilter === filter.value ? 'default' : 'outline'}
              onClick={() => onSectorChange(filter.value)}
              className={cn(
                'rounded-full',
                sectorFilter === filter.value && 'bg-primary text-primary-foreground'
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

