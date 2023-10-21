type FilterProps = {
  searchQuery?: string;
  page?: number;

  filter?: string;
};

export async function fetchJobs(filters: FilterProps) {
  try {
    const { searchQuery = 'developer', page = 1, filter } = filters;
    let query;
    if (filter) {
      query = `${searchQuery} ${filter}`;
    } else {
      query = searchQuery;
    }

    const headers = {
      'X-RapidAPI-Key': `${process.env.RAPID_API_KEY}`,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    };

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${query}&country=${filter}&page=${page}`,
      { headers: headers },
    );

    const result = await response.json();

    const isNext = result.data.length >= 10;

    return { result, isNext };
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching jobs');
  }
}
