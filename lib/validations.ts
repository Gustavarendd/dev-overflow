import * as z from 'zod';

export const QuestionsFormSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(5),
});

export const AnswerFormSchema = z.object({
  answer: z.string().min(100),
});

export const EditProfileFormSchema = z.object({
  name: z.string().min(5),
  username: z.string().min(6),
  portfolioWebsite: z.string(),
  location: z.string().min(1),
  bio: z.string().min(1),
});
