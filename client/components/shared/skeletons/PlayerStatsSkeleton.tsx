import React from 'react';

const PlayerStatsSkeleton: React.FC = () => {
  return (
    <div className="col-span-3 w-full pt-10 bg-slate-100 dark:bg-[#0F1E39] rounded-lg shadow-lg animate-pulse">
      <div className="flex flex-row h-40 w-full gap-8 justify-between px-8">
        <div className="flex items-center mb-4">
          <div className="rounded-full overflow-hidden mr-4 bg-gray-300 dark:bg-gray-700" style={{ width: 128, height: 128 }}></div>
          <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-36 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
        <div className="flex flex-row gap-8 h-40 py-10">
          <div className="flex flex-col">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          </div>
          <div className="flex flex-col">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          </div>
          <div className="flex flex-col">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          </div>
          <div className="flex flex-col">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-20">
        <div className="w-[250px] h-[75px] bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default PlayerStatsSkeleton;