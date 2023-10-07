'use server';

import { FilterQuery } from 'mongoose';
import User from '@/database/user.model';
import { connectDB } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';
import Tag from '@/database/tag.model';
import Answer from '@/database/answer.model';

export async function getUserById(params: GetUserByIdParams) {
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

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectDB();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    throw error;
  }
}

export async function getQuestionsByUser(params: GetUserStatsParams) {
  try {
    connectDB();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate('tags', '_id name')
      .populate('author', '_id clerkId name picture');

    return { totalQuestions, questions: userQuestions };
  } catch (error) {
    throw error;
  }
}

export async function getAnswersByUser(params: GetUserStatsParams) {
  try {
    connectDB();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .populate('author', '_id clerkId name picture')
      .populate('question', '_id title');

    return { totalAnswers, answers: userAnswers };
  } catch (error) {
    throw error;
  }
}
