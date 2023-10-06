'use server';

import { FilterQuery } from 'mongoose';
import User from '@/database/user.model';
import { connectDB } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';
import Tag from '@/database/tag.model';

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

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectDB();

    const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await User.find({}).sort({ createdAt: -1 });
    // .populate({ path: 'tags', model: Tag })

    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectDB();

    const { questionId, userId, path } = params;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let updatedQuery = {};
    if (user.savedQuestions.includes(questionId)) {
      updatedQuery = {
        $pull: { savedQuestions: questionId },
      };
    } else {
      updatedQuery = { $addToSet: { savedQuestions: questionId } };
    }

    await User.findByIdAndUpdate(userId, updatedQuery, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestion(params: GetSavedQuestionsParams) {
  try {
    connectDB();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: 'savedQuestions',
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: 'author', model: User, select: '_id clerkId name picture' },
        { path: 'tags', model: Tag, select: '_id name' },
      ],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const savedQuestions = user.savedQuestions;

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
