'use server';

import User from '@/database/user.model';
import { connectDB } from '../mongoose';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from './shared.types';
import Tag, { ITag } from '@/database/tag.model';
import { FilterQuery } from 'mongoose';
import Question from '@/database/question.model';
import Interaction from '@/database/interaction.model';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectDB();
    const { userId, limit = 3 } = params;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const topInteractedTags = await Interaction.aggregate([
      { $match: { user: user._id } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',

          totalTags: { $sum: 1 },
        },
      },
      { $sort: { totalTags: -1 } },
      { $limit: limit },
    ]);

    const tagIds = topInteractedTags.map(tag =>
      JSON.stringify(tag._id).replace(/"/g, ''),
    );

    const tags = await Tag.find({ _id: { $in: tagIds } });

    const tagsWithTotal = tags.map(tag => {
      const total = topInteractedTags.find(
        topTag => topTag._id.toString() === tag._id.toString(),
      );
      return { ...tag.toJSON(), total: total?.totalTags };
    });
    return tagsWithTotal;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectDB();
    const { page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
    }

    let sortOptions = {};

    switch (filter) {
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'old':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { questions: -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;

      default:
        break;
    }
    const skipAmount = (page - 1) * pageSize;

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectDB();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const skipAmount = (page - 1) * pageSize;

    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
      options: {
        skip: skipAmount,
        limit: pageSize,
        sort: { createdAt: -1 },
      },
      populate: [
        { path: 'author', model: User, select: '_id clerkId name picture' },
        { path: 'tags', model: Tag, select: '_id name' },
      ],
    });
    if (!tag) {
      throw new Error('Tag not found');
    }
    const totalTagQuestions = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
    });

    const isNext = totalTagQuestions.questions.length > pageSize + skipAmount;

    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopularTags() {
  try {
    connectDB();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, questions: { $size: '$questions' } } },
      { $sort: { questions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
