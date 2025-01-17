import React from "react";
import PropTypes from "prop-types";

export const ProgressBar = ({ value = 0, label = "", showLabel = true }) => (
  <div>
    {showLabel && (
      <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
    )}
    <div className="overflow-hidden rounded-full bg-gray-200">
      <div
        style={{ width: `${value}%` }}
        className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
      />
    </div>
  </div>
);

ProgressBar.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  showLabel: PropTypes.bool,
};
