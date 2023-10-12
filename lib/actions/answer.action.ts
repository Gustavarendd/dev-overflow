'use server';
import Answer from '@/database/answer.model';
import Question from '@/database/question.model';
import { connectDB } from '../mongoose';
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Interaction from '@/database/interaction.model';
import User from '@/database/user.model';

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectDB();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });

    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    await Interaction.create({
      user: author,
      action: 'answer',
      question,
      answer: newAnswer._id,
      tags: questionObject.tags,
    });
    if (JSON.stringify(questionObject.author).replaceAll(`"`, '') !== author) {
      await User.findByIdAndUpdate(author, {
        $inc: { reputation: 10 },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllAnswers(params: GetAnswersParams) {
  try {
    connectDB();

    const { questionId, sortBy, page = 1, pageSize = 10 } = params;

    let sortOptions = {};

    switch (sortBy) {
      case 'highestUpvotes':
        sortOptions = { upvotes: -1 };
        break;
      case 'lowestUpvotes':
        sortOptions = { upvotes: 1 };
        break;
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'old':
        sortOptions = { createdAt: 1 };
        break;

      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const skipAmount = (page - 1) * pageSize;

    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id clerkId name picture')
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const isNext = totalAnswers > skipAmount + answers.length;

    return { answers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectDB();

    const { answerId, userId, hasDownVoted, hasUpVoted, path } = params;

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
      updatedQuery = { $addToSet: { upvotes: userId } };
      repForAuthor = 10;
      repForUpvoter = 1;
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updatedQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error('Answer not found');
    }
    if (JSON.stringify(answer.author).replaceAll(`"`, '') !== userId) {
      // Increment author rep
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: repForAuthor },
      });

      // Increment voters rep
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

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectDB();

    const { answerId, userId, hasDownVoted, hasUpVoted, path } = params;

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

    const answer = await Answer.findByIdAndUpdate(answerId, updatedQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error('Answer not found');
    }
    if (JSON.stringify(answer.author).replaceAll(`"`, '') !== userId) {
      // Decrement author rep
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: repForAuthor },
      });

      // Decrement voters rep
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

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectDB();
    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);
    const question = await Question.findOne({ _id: answer.question });
    if (!answer) {
      throw new Error('Answer not found');
    }

    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } },
    );
    await Interaction.deleteMany({ answer: answerId });

    if (JSON.stringify(answer.author) !== JSON.stringify(question.author)) {
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: -10 },
      });
    }

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
