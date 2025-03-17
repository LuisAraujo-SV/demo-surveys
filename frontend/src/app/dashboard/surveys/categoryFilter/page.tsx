import { useState } from 'react';
import clsx from 'clsx';
import { categories } from '@/lib/utils';

interface CategoryFilterProps {
  onChange: (value: string) => void;
}

const CategoryFilter = ({ onChange }: CategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    onChange(value); // Send value to parent component
  };

  return (
    <div className="w-full sm:w-auto">
      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-0">
        Filter by Category
      </label>
      <select
        id="category"
        name="category"
        value={selectedCategory}
        onChange={handleCategoryChange}
        className={clsx(
          'w-full sm:w-60 p-2 rounded-md border border-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
          'dark:bg-gray-800 dark:text-white dark:border-gray-600'
        )}
      >
        <option value="All">All</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
