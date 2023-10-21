import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="flex min-h-[56px] grow items-center rounded-[10px]" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
      </div>
      <div className="mt-12 flex flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
          <Skeleton
            key={item}
            className="h-48 w-full rounded-xl"
          />
        ))}
      </div>
    </>
  );
};

export default Loading;
