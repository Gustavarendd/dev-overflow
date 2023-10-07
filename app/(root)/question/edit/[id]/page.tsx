import QuestionForm from '@/components/forms/QuestionForm';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }
  const mongoUser = await getUserById({ userId });

  const result = await getQuestionById({ questionId: params.id });

  if (result.author.clerkId !== userId) {
    redirect('/');
  }

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <QuestionForm
          type="Edit"
          questionDetails={JSON.stringify(result)}
          mongoUserId={JSON.stringify(mongoUser._id)}
        />
      </div>
    </>
  );
};

export default Page;
