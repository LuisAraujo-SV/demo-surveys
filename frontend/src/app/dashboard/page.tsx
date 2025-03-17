'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { surveyApi } from '@/lib/api';
import Link from 'next/link';
import { formatPoints } from '@/lib/utils';

const DashboardPage = () => {
  const { user } = useAuth();

  const { data: surveys, isLoading: surveysLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: () => surveyApi.getAll(),
  });

  if (surveysLoading) {
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Welcome back, {user?.name}!
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>You have earned {formatPoints(user?.points || 0)} so far.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {surveys?.length === 0 ? (
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold">No surveys available at the moment.</h3>
          </div>
        ) : (
          surveys?.map((survey) => (
            <div key={survey.id} className="bg-white p-4 rounded-md shadow-md">
              <h3 className="text-xl font-semibold">{survey.title}</h3>
              <p className="mt-2 text-gray-600">{survey.description}</p>
              <div className="flex items-center space-x-3 mt-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  {survey.points} points
                </span>
                <Link
                  href={`/dashboard/surveys/${survey.id}`}
                  className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Take Survey
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;