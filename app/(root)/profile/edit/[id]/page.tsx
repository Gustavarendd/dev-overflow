import EditProfileForm from '@/components/forms/EditProfileForm';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId || userId !== params.id) {
    redirect('/sign-in');
  }
  const mongoUser = await getUserById({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <EditProfileForm mongoUser={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};

export default Page;
