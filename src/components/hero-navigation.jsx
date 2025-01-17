import React from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import { Button } from "./controls/button";

export const HeroNavigation = ({ currentId, onNavigate }) => {
  const MAX_HERO_ID = 731;
  const numericId = currentId ? parseInt(currentId, 10) : null;

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onNavigate(numericId - 1)}
        disabled={!numericId || numericId === 1}
        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon className="h-5 w-5" />
        Back
      </Button>
      <Button
        onClick={() => onNavigate(numericId ? numericId + 1 : 1)}
        disabled={numericId === MAX_HERO_ID}
        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRightIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};

HeroNavigation.propTypes = {
  currentId: PropTypes.number,
  onNavigate: PropTypes.func,
};
