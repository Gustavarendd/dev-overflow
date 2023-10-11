'use client';

import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils';
import { useState } from 'react';
import page from '@/app/(root)/(home)/page';

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChangePageHandler = (direction: string) => {
    const nextPageNumber =
      direction === 'next' ? pageNumber + 1 : pageNumber - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };
  if (!isNext && pageNumber === 1) return null;
  return (
    <div className="flex-center w-full mt-10 gap-2">
      <Button
        className="min-h-[36px] light-border-2 border btn shadow-sm"
        onClick={() => onChangePageHandler('prev')}
        disabled={pageNumber === 1}
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>

      <div className="flex-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        className="min-h-[36px] light-border-2 border btn shadow-sm"
        onClick={() => onChangePageHandler('next')}
        disabled={!isNext}
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
