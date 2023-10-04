'use server';

import User from '@/database/user.model';
import { connectDB } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';

export async function getUserById(params: any) {
  try {
    connectDB();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectDB();

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectDB();
    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectDB();
    const { clerkId } = params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error('User not found');
    }

    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   '_id',
    // );

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    throw error;
  }
}