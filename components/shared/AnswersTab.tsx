import { getAnswersByUser } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import AnswerCard from '../cards/AnswerCard';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}
const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getAnswersByUser({ userId, page: 1 });

  return (
    <>
      {result.answers.length > 0 ? (
        result.answers.map(answer => (
          <AnswerCard
            key={answer._id}
            _id={answer._id}
            clerkId={clerkId}
            title={answer.question.title}
            questionId={answer.question._id}
            author={answer.author}
            upVotes={answer.upvotes}
            createdAt={answer.createdAt}
          />
        ))
      ) : (
        <p>User has no answers</p>
      )}
    </>
  );
};

export default AnswersTab;
