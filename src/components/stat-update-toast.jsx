import React from "react";
import PropTypes from "prop-types";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

const StatUpdateToast = ({ stats, previousStats }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center space-x-2">
        {stats.currentStreak > previousStats.currentStreak ? (
          <>
            <TrendingUpIcon className="text-green-500" />
            <span>Streak increased to {stats.currentStreak}!</span>
          </>
        ) : (
          <>
            <TrendingDownIcon className="text-red-500" />
            <span>Streak reset to 0</span>
          </>
        )}
      </div>
      <div className="mt-2 text-sm text-gray-600">
        New win ratio: {stats.winRatio}%
      </div>
    </div>
  );
};

StatUpdateToast.propTypes = {
  stats: PropTypes.object,
  previousStats: PropTypes.object,
};

export default StatUpdateToast;
