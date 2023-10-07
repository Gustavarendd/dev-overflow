import { formatNumber } from '@/lib/utils';
import Image from 'next/image';

interface StatsCardProps {
  type: string;
  value: number;
}

const StatsCard = ({ type, value }: StatsCardProps) => {
  return (
    <div className="light-border background-light900_dark-300 flex flex-wrap items-center justify-start gap-4 rounded-md p-6 shadow-light300 border dark:shadow-dark-200">
      <Image
        src={`/assets/icons/${type}-medal.svg`}
        alt={type}
        width={40}
        height={50}
      />
      <div>
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="body-medium text-dark400_light700 capitalize">
          {type} Badges
        </p>
      </div>
    </div>
  );
};

interface Props {
  totalQuestions: number;
  totalAnswers: number;
}

const Stats = ({ totalQuestions, totalAnswers }: Props) => {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-5 mt-5">
        <div className="light-border background-light900_dark-300 flex flex-wrap items-center justify-evenly gap-4 rounded-md p-6 shadow-light300 border dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {totalQuestions ? formatNumber(totalQuestions) : 0}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {totalAnswers ? formatNumber(totalAnswers) : 0}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>
        <StatsCard
          type="gold"
          value={2}
        />
        <StatsCard
          type="silver"
          value={2}
        />
        <StatsCard
          type="bronze"
          value={2}
        />
      </div>
    </div>
  );
};

export default Stats;
