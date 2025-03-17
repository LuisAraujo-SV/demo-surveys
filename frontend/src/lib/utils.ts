import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPoints(points: number) {
  return `${points} ${points === 1 ? 'point' : 'points'}`;
} 

export const categories = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Entertainment',
  'Sports',
  'Fashion',
  'Other',
];