import { getQuestionsByUser } from '@/lib/actions/user.action';
import QuestionCard from '../cards/QuestionCard';
import { SearchParamsProps } from '@/types';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}
const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getQuestionsByUser({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.questions.length > 0 ? (
        result.questions.map(question => (
          <div
            key={question._id}
            className="mt-5"
          >
            <QuestionCard
              _id={question._id}
              clerkId={clerkId}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upVotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          </div>
        ))
      ) : (
        <p>User has no questions</p>
      )}
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
};

export default QuestionsTab;
