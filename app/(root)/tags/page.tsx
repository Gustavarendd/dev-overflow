import Filter from '@/components/shared/Filter';
import LocalSearch from '@/components/shared/search/LocalSearch';
import { TagFilters } from '@/constants/filters';
import { getAllTags } from '@/lib/actions/tag.action';
import TagCard from '@/components/cards/TagCard';
import NoResult from '@/components/shared/NoResult';
import Link from 'next/link';

export default async function Page() {
  const result = await getAllTags({});

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by tag name..."
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map(tag => (
            <TagCard
              key={tag._id}
              tag={tag}
            />
          ))
        ) : (
          <NoResult
            title="No tags found"
            description="It looks like there is no tags"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </section>
    </>
  );
}
