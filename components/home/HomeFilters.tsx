'use client';
import { HomePageFilters } from '@/constants/filters';
import React, { useState } from 'react';
import { Button } from '../ui/button';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';

const HomeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeFilter, setActiveFilter] = useState('');

  const handleFilterChange = (value: string) => {
    if (activeFilter !== value) {
      setActiveFilter(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: value.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActiveFilter('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: null,
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 flex-wrap gap-3 md:flex hidden">
      {HomePageFilters.map(filter => (
        <Button
          key={filter.value}
          onClick={() => handleFilterChange(filter.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            activeFilter === filter.value
              ? 'bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400'
              : ' bg-light-800 text-light-500 hover:bg-light-700 dark:text-light-500 dark:bg-dark-300 dark:hover:bg-dark-200'
          }`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
