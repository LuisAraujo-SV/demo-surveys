'use client';

import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api';
import { formatDate, formatPoints } from '@/lib/utils';

interface Survey {
  title: string;
  category: string;
  points: number;
}

interface SurveyResponse {
  id: number;
  survey: Survey;
  points_earned: number;
  created_at: string;
}

interface ApiResponse {
  id: number;
  survey: Survey;
  points_earned: number;
  created_at: string;
}

export default function HistoryPage() {
  const { data: history, isLoading } = useQuery<SurveyResponse[]>({
    queryKey: ['survey-history'],
    queryFn: async () => {
      const response = await userApi.getHistory() as ApiResponse[];
      return response.map((item) => ({
        id: item.id,
        survey: item.survey,
        points_earned: item.points_earned,
        created_at: item.created_at
      }));
    }
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Survey History</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the surveys you've completed and points earned.
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Survey
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Points Earned
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Completed On
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {!history || history.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center text-sm text-gray-500"
                      >
                        You haven't completed any surveys yet.
                      </td>
                    </tr>
                  ) : (
                    history.map((entry) => (
                      <tr key={entry.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {entry.survey.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {entry.survey.category}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {formatPoints(entry.points_earned)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(entry.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 