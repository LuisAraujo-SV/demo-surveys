'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { surveyApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { use } from 'react';
import { useAuth } from '@/providers/AuthProvider';

interface SurveyResponse {
  [key: string]: string | string[];
}

interface Survey {
  id: number;
  title: string;
  category: string;
  points: number;
}

interface HistoryEntry {
  id: number;
  survey: Survey;
  points_earned: number;
  created_at: string;
}

export default function SurveyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, checkAuth } = useAuth();
  const { id } = use(params);
  const surveyId = parseInt(id);

  const { data: survey, isLoading } = useQuery({
    queryKey: ['survey', surveyId],
    queryFn: () => surveyApi.getById(surveyId),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SurveyResponse>();

  const submitMutation = useMutation({
    mutationFn: async (data: SurveyResponse) => {
      const answers = Object.entries(data).map(([key, value]) => ({
        question_id: parseInt(key),
        answer: value,
      }));
      const result = await surveyApi.submit({ surveyId, answers });
      return result;
    },
    onSuccess: async (data) => {
      // 1. Update user profile in cache with new points
      if (user && survey) {
        queryClient.setQueryData(['user-profile'], {
          ...user,
          points: user.points + survey.points,
        });

        // 2. Update surveys list cache to remove the completed survey
        const updateSurveysList = (oldSurveys: Survey[] | undefined) => {
          if (!oldSurveys) return [];
          return oldSurveys.filter(s => s.id !== surveyId);
        };

        // Update both dashboard and surveys list caches
        queryClient.setQueryData(['surveys'], updateSurveysList);

        // 3. Add to survey history cache
        const oldHistory = (queryClient.getQueryData(['survey-history']) as HistoryEntry[]) || [];
        queryClient.setQueryData(['survey-history'], [
          {
            id: Date.now(),
            survey: survey,
            points_earned: survey.points,
            created_at: new Date().toISOString(),
          },
          ...oldHistory,
        ]);
      }

      // 4. Invalidate and refetch relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['surveys'] }),
        queryClient.invalidateQueries({ queryKey: ['survey-history'] }),
        checkAuth(), // Refresh auth state to get updated points
      ]);

      router.push('/dashboard/history');
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Survey not found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          The survey you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="text-sm font-semibold text-blue-600 hover:text-blue-500"
          >
            Go back
            <span aria-hidden="true"> &rarr;</span>
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: SurveyResponse) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {survey.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{survey.description}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
              {survey.points} points
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {survey.questions.map((question) => (
          <div key={question.id} className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <label
                htmlFor={`${question.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                {question.text}
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {question.type === 'text' && (
                <div className="mt-2">
                  <input
                    type="text"
                    id={`${question.id}`}
                    {...register(`${question.id}`, {
                      required: question.required && 'This field is required',
                    })}
                    className={cn(
                      'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                      errors[question.id] && 'border-red-300'
                    )}
                  />
                  {errors[question.id] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[question.id]?.message as string}
                    </p>
                  )}
                </div>
              )}

              {question.type === 'single_choice' && question.options && (
                <div className="mt-2 space-y-4">
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        id={`${question.id}-${option}`}
                        type="radio"
                        value={option}
                        {...register(`${question.id}`, {
                          required: question.required && 'Please select an option',
                        })}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`${question.id}-${option}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                  {errors[question.id] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[question.id]?.message as string}
                    </p>
                  )}
                </div>
              )}

              {question.type === 'multiple_choice' && question.options && (
                <div className="mt-2 space-y-4">
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        id={`${question.id}-${option}`}
                        type="checkbox"
                        value={option}
                        {...register(`${question.id}`, {
                          required: question.required && 'Please select at least one option',
                        })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`${question.id}-${option}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                  {errors[question.id] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[question.id]?.message as string}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {submitMutation.isError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Failed to submit survey
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  Please try again later.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-3 rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || submitMutation.isPending}
            className={cn(
              'rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
              (isSubmitting || submitMutation.isPending) &&
                'opacity-50 cursor-not-allowed'
            )}
          >
            {isSubmitting || submitMutation.isPending
              ? 'Submitting...'
              : 'Submit Survey'}
          </button>
        </div>
      </form>
    </div>
  );
} 