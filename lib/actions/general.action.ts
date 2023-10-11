'use server';
import { connectDB } from '../mongoose';
import { SearchParams } from './shared.types';
import Question from '@/database/question.model';
import Answer from '@/database/answer.model';
import User from '@/database/user.model';
import Tag from '@/database/tag.model';

const SearchableTypes = ['question', 'answer', 'user', 'tag'];

export async function globalSearch(params: SearchParams) {
  try {
    connectDB();

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: 'i' };

    let results: any = [];

    const modelsAndTypes = [
      { model: Question, searchField: 'title', type: 'question' },
      { model: Answer, searchField: 'content', type: 'answer' },
      { model: User, searchField: 'name', type: 'user' },
      { model: Tag, searchField: 'name', type: 'tag' },
    ];

    const typeLowerCase = type?.toLowerCase();
    if (!typeLowerCase || !SearchableTypes.includes(typeLowerCase)) {
      // Search all types
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResult = await model
          .find({
            [searchField]: regexQuery,
          })
          .limit(2);

        results.push(
          ...queryResult.map(result => ({
            title:
              type === 'answer'
                ? `Answers containing "${query}"`
                : result[searchField],
            type,
            id:
              type === 'user'
                ? result.clerkId
                : type === 'answer'
                ? result.question
                : result._id,
          })),
        );
      }
    } else {
      // Search only the specified type
      const modelInfo = modelsAndTypes.find(
        modelInfo => modelInfo.type === typeLowerCase,
      );
      if (!modelInfo) {
        throw new Error('Invalid type');
      }

      const queryResult = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);

      results = queryResult.map(result => ({
        title:
          type === 'answer'
            ? `Answers containing "${query}"`
            : result[modelInfo.searchField],
        type,
        id:
          type === 'user'
            ? result.clerkId
            : type === 'answer'
            ? result.question
            : result._id,
      }));
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
