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

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectDB();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllAnswers(params: GetAnswersParams) {
  try {
    connectDB();

    const { questionId, sortBy, page, pageSize } = params;

    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id clerkId name picture')
      .sort({ createdAt: -1 });

    return { answers };
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

    const answer = await Answer.findByIdAndUpdate(answerId, updatedQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error('Answer not found');
    }

    // Increment author rep

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

    const answer = await Answer.findByIdAndUpdate(answerId, updatedQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error('Answer not found');
    }

    // Increment author rep

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
    if (!answer) {
      throw new Error('Answer not found');
    }

    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } },
    );
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
