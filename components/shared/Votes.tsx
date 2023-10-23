'use client';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import {
  downvoteQuestion,
  upvoteQuestion,
} from '@/lib/actions/question.action';
import { usePathname } from 'next/navigation';
import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.action';
import { toggleSaveQuestion } from '@/lib/actions/user.action';
import { useEffect } from 'react';
import { viewQuestion } from '@/lib/actions/interaction.action';
import { toast } from '../ui/use-toast';

interface Props {
  upvotes: number;
  downvotes: number;
  userId: string;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  itemId: string;
  type: string;
  hasSaved?: boolean;
}

const Votes = ({
  upvotes,
  downvotes,
  userId,
  hasUpVoted,
  hasDownVoted,
  itemId,
  type,
  hasSaved,
}: Props) => {
  const pathname = usePathname();

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });
    toast({
      title: `Question ${
        hasSaved ? 'removed from' : 'saved to'
      } your collection`,
      variant: hasSaved ? 'destructive' : 'default',
    });
  };

  const handleVote = async (action: string) => {
    if (!userId)
      return toast({
        title: 'Please log in',
        description: 'You have to log in first',
      });
    if (action === 'upVote') {
      if (type === 'Question') {
        await upvoteQuestion({
          userId: JSON.parse(userId),
          questionId: JSON.parse(itemId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
        toast({
          title: `Upvote ${hasUpVoted ? 'removed' : 'added'}`,
          variant: hasUpVoted ? 'destructive' : 'default',
        });
      } else if (type === 'Answer') {
        await upvoteAnswer({
          userId: JSON.parse(userId),
          answerId: JSON.parse(itemId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
        toast({
          title: `Upvote ${hasUpVoted ? 'removed' : 'added'}`,
          variant: hasUpVoted ? 'destructive' : 'default',
        });
      }
      return;
    }
    if (action === 'downVote') {
      if (type === 'Question') {
        await downvoteQuestion({
          userId: JSON.parse(userId),
          questionId: JSON.parse(itemId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
        toast({
          title: `Downvote ${hasDownVoted ? 'removed' : 'added'}`,
          variant: hasDownVoted ? 'destructive' : 'default',
        });
      } else if (type === 'Answer') {
        await downvoteAnswer({
          userId: JSON.parse(userId),
          answerId: JSON.parse(itemId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
        toast({
          title: `Downvote ${hasDownVoted ? 'removed' : 'added'}`,
          variant: hasDownVoted ? 'destructive' : 'default',
        });
      }
      return;
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            alt="Up vote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote('upVote')}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            alt="Down vote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote('downVote')}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === 'Question' && (
        <Image
          src={
            hasSaved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          alt="Star"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
