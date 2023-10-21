import Filter from '@/components/shared/Filter';
import LocalSearch from '@/components/shared/search/LocalSearch';

import { SearchParamsProps } from '@/types';
import Pagination from '@/components/shared/Pagination';
import { Metadata } from 'next';
import NoResult from '@/components/shared/NoResult';
import { fetchJobs } from '@/app/api/JSearch/route';
import JobCard from '@/components/cards/JobCard';
import { getAllLocations } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Dev Overflow | Jobs',
  description: 'Jobs page of Dev Overflow',
  icons: {
    icon: '/assets/images/site-logo.svg',
  },
};

export default async function Page({ searchParams }: SearchParamsProps) {
  const { result, isNext } = await fetchJobs({
    searchQuery: searchParams.q,
    filter: searchParams.location,
    page: searchParams.page ? +searchParams.page : 1,
  });

  const locations = await getAllLocations();

  const locationFilter = locations?.map((location: any) => ({
    name: location.name.common,
    value: location.name.common,
  }));

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/jobs"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Job title, keywords, or company"
          otherClasses="flex-1"
        />
        <Filter
          filters={locationFilter}
          location
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex flex-col gap-6">
        {result.data.length > 0 ? (
          result.data.map((job: any) => (
            <JobCard
              key={job.job_id}
              title={job.job_title}
              city={job.job_city}
              country={job.job_country}
              description={job.job_description}
              jobType={job.job_employment_type}
              companyLogo={job.employer_logo}
              jobAction={job.job_apply_link}
              minSalary={job.job_min_salary}
              maxSalary={job.job_max_salary}
              allCountries={locations}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={isNext}
      />
    </>
  );
}
