import Link from 'next/link';
import Metric from '../shared/Metric';
import { formatNumber, getTimestamp } from '@/lib/utils';
import { SignedIn } from '@clerk/nextjs';
import EditDeleteAction from '../shared/EditDeleteAction';

interface Props {
  _id: string;
  clerkId?: string | null;
  questionId: string;
  title: string;
  author: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
  };
  upVotes: string[];
  createdAt: Date;
}

const AnswerCard = ({
  _id,
  clerkId,
  questionId,
  title,
  author,
  upVotes,
  createdAt,
}: Props) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${questionId}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction
              type="Answer"
              itemId={JSON.stringify(_id)}
            />
          )}
        </SignedIn>
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="User"
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex gap-4">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatNumber(upVotes.length)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
