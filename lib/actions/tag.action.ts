'use server';

import User from '@/database/user.model';
import { connectDB } from '../mongoose';
import { GetAllTagsParams, GetTopInteractedTagsParams } from './shared.types';
import Tag from '@/database/tag.model';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectDB();
    const { userId, limit = 3 } = params;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return [
      { _id: '1', name: 'tag1' },
      { _id: '2', name: 'tag2' },
      { _id: '3', name: 'tag3' },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectDB();
    const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const tags = await Tag.find({});

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}