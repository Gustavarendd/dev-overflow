'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProfileFormSchema } from '@/lib/validations';
import { updateUser } from '@/lib/actions/user.action';
import { toast } from '../ui/use-toast';

interface Props {
  mongoUser: string;
}

const EditProfileForm = ({ mongoUser }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedUserDetails = mongoUser ? JSON.parse(mongoUser) : '';

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: parsedUserDetails.name || '',
      username: parsedUserDetails.username || '',
      bio: parsedUserDetails.bio || '',
      location: parsedUserDetails.location || '',
      portfolioWebsite: parsedUserDetails.portfolioWebsite || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileFormSchema>) => {
    setIsSubmitting(true);

    try {
      await updateUser({
        clerkId: parsedUserDetails.clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          bio: values.bio,
          location: values.location,
          portfolioWebsite: values.portfolioWebsite,
        },
        path: pathname,
      });
      router.push(`/profile/${parsedUserDetails.clerkId}`);
      toast({
        title: 'Profile updated',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 w-full gap-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Full Name<span className="text-primary-500"> *</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username<span className="text-primary-500"> *</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio Link
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  type="url"
                  placeholder="https://www.example.com"
                  className="no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col sm:col-span-2">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio{' '}
                <span className="small-medium text-light-400">
                  (max 150 characters)
                </span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Textarea
                  className="no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[98px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end sm:col-span-2">
          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
