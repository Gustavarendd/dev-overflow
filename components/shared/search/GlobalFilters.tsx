'use client';

import { GlobalSearchFilters } from '@/constants/filters';
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(
    searchParams.get('type') || '',
  );

  const handleFilterChange = (value: string) => {
    if (activeFilter !== value) {
      setActiveFilter(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: value.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActiveFilter('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: null,
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter: any) => (
          <button
            key={filter.value}
            type="button"
            className={`light-border-2 small-medium dark:text-light-900 rounded-full px-5 py-2 capitalize ${
              filter.value === activeFilter
                ? 'bg-primary-500 text-light-900 '
                : 'bg-light-700 dark:bg-dark-500 hover:text-primary-500 dark:hover:text-primary-500'
            }`}
            onClick={() => handleFilterChange(filter.value)}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
