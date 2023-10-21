import React from 'react';
import RenderTag from './RenderTag';
import { getTopInteractedTags } from '@/lib/actions/tag.action';

type Props = {
  tags: {
    _id: string;
    name: string;
    total: number;
  }[];
};

const TopTags = async ({ tags }: Props) => {
  return (
    <div>
      <h3 className="h3-bold">Top Tags</h3>
      <div className="mt-7 flex flex-col gap-4">
        {tags.length > 0 &&
          tags.map(tag => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.total}
              showCount
            />
          ))}
      </div>
    </div>
  );
};

export default TopTags;
