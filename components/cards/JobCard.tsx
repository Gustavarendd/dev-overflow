'use client';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type JobCardProps = {
  title: string;
  city: string;
  country: string;
  description: string;
  jobType: string;
  maxSalary?: number | null;
  minSalary?: number | null;
  companyLogo: string;
  jobAction: string;
  allCountries: {
    name: string;
    flags: {
      svg: string;
    };

    cca2: string;
  }[];
};

const JobCard = ({
  title,
  city,
  country,
  description,
  jobType,
  maxSalary,
  minSalary,
  companyLogo,
  jobAction,
  allCountries,
}: JobCardProps) => {
  const flag = allCountries.filter(item => item.cca2 === country)[0].flags.svg;
  return (
    <div className="card-wrapper flex flex-col md:flex-row gap-5 p-9 sm:px-11 rounded-[10px] border-light-800 border dark:border-none">
      <div className="min-w-[64px]">
        {companyLogo ? (
          <Image
            loading="lazy"
            src={companyLogo}
            alt="Company Logo"
            className="object-contain bg-light-800 dark:bg-light-700 rounded-xl p-1"
            width={64}
            height={64}
          />
        ) : (
          <Image
            src={'/assets/images/site-logo.svg'}
            width={64}
            height={64}
            alt="Dev Overflow"
          />
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="job-title">
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </div>
          <div className="flex whitespace-nowrap gap-2">
            <div className="flex gap-2 background-light800_dark300 rounded-full px-4 py-2">
              <Image
                loading="lazy"
                src={flag}
                className="object-contain"
                alt="Clock"
                width={15}
                height={15}
              />
              <p className="text-dark200_light800 text-center text-sm font-medium">
                {city ? `${city}, ${country}` : country}
              </p>
            </div>
          </div>
        </div>
        <div className="company-description">
          <p className="text-dark300_light700 body-regular line-clamp-2">
            {description}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <Image
                loading="lazy"
                src="/assets/icons/clock-2.svg"
                className="object-contain"
                alt="Clock"
                width={20}
                height={20}
              />
              <p className="text-light-500 body-medium">{jobType}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                loading="lazy"
                src="/assets/icons/currency-dollar-circle.svg"
                className="object-contain"
                alt="Salary Range Icon"
                width={20}
                height={20}
              />
              <p className="text-light-500 body-medium">
                {minSalary && maxSalary
                  ? `${formatNumber(minSalary)} - ${formatNumber(maxSalary)}`
                  : 'Not disclosed'}
              </p>
            </div>
          </div>

          <Link
            href={jobAction}
            className="flex gap-2 items-center"
          >
            <span className="text-sm font-semibold text-primary-500">
              View job
            </span>

            <Image
              loading="lazy"
              src="/assets/icons/arrow-up-right.svg"
              alt="Job Action Icon"
              width={15}
              height={15}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
