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
    const { searchQuery, page = 1, pageSize = 20, filter } = params;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'unanswered':
        query.answers = { $size: 0 };
        break;
      case 'recommended':
        sortOptions = { upvotes: -1 };
        break;
      case 'frequent':
        sortOptions = { views: -1 };
        break;

      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const skipAmount = (page - 1) * pageSize;

    const questions = await Question.find(query)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
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

    await Interaction.create({
      user: author,
      action: 'ask_question',
      question: question._id,
      tags: tagDocuments,
    });

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 5 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
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
    let repForAuthor = 0;
    let repForUpvoter = 0;

    if (hasUpVoted) {
      updatedQuery = {
        $pull: { upvotes: userId },
      };
      repForAuthor = -10;
      repForUpvoter = -1;
    } else if (hasDownVoted) {
      updatedQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
      repForAuthor = 12;
      repForUpvoter = 2;
    } else {
      updatedQuery = {
        $addToSet: { upvotes: userId },
      };
      repForAuthor = 10;
      repForUpvoter = 1;
    }

    const question = await Question.findByIdAndUpdate(
      questionId,
      updatedQuery,
      { new: true },
    );

    if (!question) {
      throw new Error('Question not found');
    }

    if (JSON.stringify(question.author).replaceAll(`"`, '') !== userId) {
      // Increment author rep
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: repForAuthor },
      });

      // Increment upvoters rep
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: repForUpvoter },
      });
    }

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
    let repForAuthor = 0;
    let repForDownvoter = 0;

    if (hasDownVoted) {
      updatedQuery = {
        $pull: { downvotes: userId },
      };
      repForAuthor = 2;
      repForDownvoter = 1;
    } else if (hasUpVoted) {
      updatedQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
      repForAuthor = -12;
      repForDownvoter = -2;
    } else {
      updatedQuery = { $addToSet: { downvotes: userId } };
      repForAuthor = -2;
      repForDownvoter = -1;
    }

    const question = await Question.findByIdAndUpdate(
      questionId,
      updatedQuery,
      { new: true },
    );

    if (!question) {
      throw new Error('Question not found');
    }
    if (JSON.stringify(question.author).replaceAll(`"`, '') !== userId) {
      // Decrement author rep
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: repForAuthor },
      });

      // Decrement downvoters rep
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: repForDownvoter },
      });
    }

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

    const question = await Question.findById(questionId);

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } },
    );

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: -5 },
    });

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
