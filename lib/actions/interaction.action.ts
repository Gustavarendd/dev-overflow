'use server';

import Question from '@/database/question.model';
import { connectDB } from '../mongoose';
import { ViewQuestionParams } from './shared.types';
import Interaction from '@/database/interaction.model';

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    connectDB();
    const { questionId, userId } = params;

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: 'view',
      });
      if (existingInteraction) {
        return console.log('User has already viewed this question');
      }
      await Interaction.create({
        user: userId,
        question: questionId,
        action: 'view',
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
