import React from "react";

const LeaderBoardSkeleton = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-slate-100 dark:bg-[#0F1E39] rounded-lg shadow-lg">
      <h1 className="text-xl text-center font-bold mb-4 checkDarkTheme-Text">Leader Board</h1>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center rounded-lg p-3 border bg-white dark:bg-gray-800 animate-pulse">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="w-10 h-4 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderBoardSkeleton;
