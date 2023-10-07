import { getQuestionsByUser } from '@/lib/actions/user.action';
import QuestionCard from '../cards/QuestionCard';
import { SearchParamsProps } from '@/types';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}
const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getQuestionsByUser({ userId, page: 1 });

  return (
    <>
      {result.questions.length > 0 ? (
        result.questions.map(question => (
          <QuestionCard
            key={question._id}
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
        ))
      ) : (
        <p>User has no questions</p>
      )}
    </>
  );
};

export default QuestionsTab;
