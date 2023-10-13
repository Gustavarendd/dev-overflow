import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="flex min-h-[56px] grow items-center rounded-[10px]" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
          <Skeleton
            key={item}
            className="w-full max-xs:min-w-full xs:w-[260px] h-[260px]"
          />
        ))}
      </div>
    </>
  );
};

export default Loading;
