import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="h-[140px] w-[140px] rounded-full" />
          <div className="mt-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="mt-2 h-7 w-20" />

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              <Skeleton className="h-7 grow" />
              <Skeleton className="h-7 grow" />
              <Skeleton className="h-7 grow" />
            </div>
            <Skeleton className=" mt-5 h-20 w-full" />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <Skeleton className="h-7 w-14" />
        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          <Skeleton className="h-28 rounded-md" />
          <Skeleton className="h-28 rounded-md" />
          <Skeleton className="h-28 rounded-md" />
          <Skeleton className="h-28 rounded-md" />
        </div>
      </div>
      <div className="mt-10 flex gap-1">
        <div className="flex flex-1 flex-col">
          <div className="flex">
            <Skeleton className="h-11 w-24 rounded-r-none" />
            <Skeleton className="h-11 w-24 rounded-l-none" />
          </div>
          <div className="mt-5 flex w-full flex-col gap-6">
            {[1, 2, 3, 4, 5].map(item => (
              <Skeleton
                key={item}
                className="h-48 w-full rounded-xl"
              />
            ))}
          </div>
        </div>
        <div className="flex min-w-[278px] flex-col max-lg:hidden">
          <Skeleton className="h-7 w-10" />
          <div className="mt-7 flex flex-col gap-4">
            <Skeleton className="h-7" />
            <Skeleton className="h-7" />
            <Skeleton className="h-7" />
            <Skeleton className="h-7" />
            <Skeleton className="h-7" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
