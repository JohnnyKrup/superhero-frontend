import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import HeroBattle from "../components/hero-battle";
import HeroProgress from "../components/hero-progress";
import StatUpdateToast from "../components/stat-update-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const Battle = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStats, setPreviousStats] = useState(null);
  const [currentStats, setCurrentStats] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  // Fetch initial stats when battle starts
  useEffect(() => {
    const fetchInitialStats = async () => {
      try {
        const response = await axiosInstance.get("/api/dashboard");
        setPreviousStats(response.data);
      } catch (error) {
        console.error("Failed to fetch initial stats:", error);
      }
    };
    fetchInitialStats();
  }, []);

  // Handle battle completion
  const handleBattleComplete = async () => {
    try {
      // Fetch updated stats after battle
      const response = await axiosInstance.get("/api/dashboard");
      setCurrentStats(response.data);
      setShowToast(true);

      // Hide toast after 5 seconds
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error("Failed to fetch updated stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-gray-300 hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>

            <div className="flex items-center">
              <span className="text-sm text-gray-400">Battle Arena</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Hero Battle Arena
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Select your team of heroes and battle against other players!
            </p>
          </div>
          {/* Hero ProgressBar */}
          <HeroProgress currentStep={currentStep} />
          {/* Hero Battle Component */}
          <div className="mt-1">
            <HeroBattle
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onBattleComplete={handleBattleComplete}
            />
          </div>
        </div>
      </div>

      {/* Stats update toast */}
      {showToast && previousStats && currentStats && (
        <StatUpdateToast stats={currentStats} previousStats={previousStats} />
      )}
    </div>
  );
};

export default Battle;
