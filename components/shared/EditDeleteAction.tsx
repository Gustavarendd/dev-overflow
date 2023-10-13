'use client';
import { deleteAnswer } from '@/lib/actions/answer.action';
import { deleteQuestion } from '@/lib/actions/question.action';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    if (type === 'Question') {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
      toast({
        title: 'Question deleted',
      });
    } else if (type === 'Answer') {
      deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
      toast({
        title: 'Answer deleted',
      });
    }
  };

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };

  return (
    <div className="flex gap-3 items-center justify-end max-sm:w-full">
      {type === 'Question' && (
        <Image
          src={'/assets/icons/edit.svg'}
          alt="Edit"
          height={14}
          width={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src={'/assets/icons/trash.svg'}
        alt="Delete"
        height={14}
        width={14}
        onClick={handleDelete}
        className="cursor-pointer"
      />
    </div>
  );
};

export default EditDeleteAction;
