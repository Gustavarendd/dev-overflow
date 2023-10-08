'use server';

import Question from '@/database/question.model';
import User from '@/database/user.model';
import Tag from '@/database/tag.model';
import { connectDB } from '../mongoose';
import {
  CreateQuestionParams,
  GetQuestionsParams,
  GetQuestionByIdParams,
  QuestionVoteParams,
  DeleteQuestionParams,
  EditQuestionParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Answer from '@/database/answer.model';
import Interaction from '@/database/interaction.model';
import { FilterQuery } from 'mongoose';

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectDB();
    const { searchQuery } = params;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$for = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    const questions = await Question.find(query)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectDB();

    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, 'i') },
        },
        {
          $setOnInsert: { name: tag },
          $push: { questions: question._id },
        },
        {
          upsert: true,
          new: true,
        },
      );
      tagDocuments.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);
  } catch (error) {}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectDB();
    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture',
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectDB();

    const { questionId, userId, hasDownVoted, hasUpVoted, path } = params;

    let updatedQuery = {};

    if (hasUpVoted) {
      updatedQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasDownVoted) {
      updatedQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updatedQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(
      questionId,
      updatedQuery,
      { new: true },
    );

    if (!question) {
      throw new Error('Question not found');
    }

    // Increment author rep

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectDB();

    const { questionId, userId, hasDownVoted, hasUpVoted, path } = params;

    let updatedQuery = {};

    if (hasDownVoted) {
      updatedQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasUpVoted) {
      updatedQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updatedQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(
      questionId,
      updatedQuery,
      { new: true },
    );

    if (!question) {
      throw new Error('Question not found');
    }

    // Decrement author rep

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectDB();
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } },
    );

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectDB();
    const { questionId, title, content, path } = params;

    const question = await Question.findById({ _id: questionId }).populate(
      'tags',
    );
    if (!question) {
      throw new Error('Question not found');
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    connectDB();

    const hotQuestions = await Question.find({})
      .sort({ upvotes: -1, views: -1 })
      .limit(5);

    return hotQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
