import { getAnswersByUser } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import AnswerCard from '../cards/AnswerCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}
const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getAnswersByUser({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.answers.length > 0 ? (
        result.answers.map(answer => (
          <div
            key={answer._id}
            className="mt-5"
          >
            <AnswerCard
              _id={answer._id}
              clerkId={clerkId}
              title={answer.question.title}
              questionId={answer.question._id}
              author={answer.author}
              upVotes={answer.upvotes}
              createdAt={answer.createdAt}
            />
          </div>
        ))
      ) : (
        <p>User has no answers</p>
      )}
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
};

export default AnswersTab;
