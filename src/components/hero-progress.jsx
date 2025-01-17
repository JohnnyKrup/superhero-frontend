import React from "react";
import PropTypes from "prop-types";
import { CheckIcon } from "lucide-react";

const steps = [
  { id: "01", name: "Select", status: "upcoming" },
  { id: "02", name: "Fight", status: "upcoming" },
  { id: "03", name: "Results", status: "upcoming" },
];

const HeroProgress = ({ currentStep }) => {
  const getStepStatus = (index) => {
    if (index < currentStep) return "complete";
    if (index === currentStep) return "current";
    return "upcoming";
  };

  return (
    <nav aria-label="Progress" className="my-8">
      <ol
        role="list"
        className="divide-y divide-gray-700 rounded-md border border-gray-700 md:flex md:divide-y-0"
      >
        {steps.map((step, stepIdx) => {
          const status = getStepStatus(stepIdx);

          return (
            <li key={step.name} className="relative md:flex md:flex-1">
              <div className="flex items-center px-6 py-4 text-sm font-medium">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    status === "complete"
                      ? "bg-indigo-600"
                      : status === "current"
                      ? "border-2 border-indigo-600"
                      : "border-2 border-gray-300"
                  }`}
                >
                  {status === "complete" ? (
                    <CheckIcon className="h-6 w-6 text-white" />
                  ) : (
                    <span
                      className={
                        status === "current"
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }
                    >
                      {step.id}
                    </span>
                  )}
                </span>
                <span
                  className={`ml-4 ${
                    status === "complete"
                      ? "text-indigo-600"
                      : status === "current"
                      ? "text-indigo-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>

              {stepIdx !== steps.length - 1 && (
                <div className="absolute right-0 top-0 hidden h-full w-5 md:block">
                  <svg
                    className="h-full w-full text-gray-700"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentColor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

HeroProgress.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default HeroProgress;
