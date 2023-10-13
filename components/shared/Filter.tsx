'use client';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils';

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramFilter = searchParams.get('filter');

  const onChangeHandler = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'filter',
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        defaultValue={paramFilter || undefined}
        onValueChange={value => onChangeHandler(value)}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5 focus:ring-0 ring-offset-0 focus:ring-offset-0`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none background-light900_dark300">
          <SelectGroup>
            {filters.map(filter => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                onClick={() => onChangeHandler(filter.value)}
                className="focus:bg-light-800 dark:focus:bg-dark-400 cursor-pointer"
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
