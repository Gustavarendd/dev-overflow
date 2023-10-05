import Link from 'next/link';

interface Props {
  tag: {
    _id: string;
    name: string;
    description: string;
    questions: string[];
  };
}

const TagCard = async ({ tag }: Props) => {
  return (
    <Link
      href={`/tags/${tag._id}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border p-8 rounded-2xl flex items-center justify-center flex-col border">
        <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
          <p className="paragraph-semibold text-dark300_light900">{tag.name}</p>
        </div>
        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {tag.questions.length}+
          </span>
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
