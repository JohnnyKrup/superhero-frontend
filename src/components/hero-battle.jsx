import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import PropTypes from "prop-types";
import {
  Shield,
  Swords,
  Trophy,
  Brain,
  Dumbbell,
  Zap,
  Timer,
} from "lucide-react";
import { Button } from "./controls/button";

// Stat icon mapping
const StatIcon = ({ type, className = "w-4 h-4" }) => {
  const icons = {
    strength: Dumbbell,
    power: Zap,
    speed: Swords,
    intelligence: Brain,
    durability: Shield,
    combat: Swords,
  };

  const Icon = icons[type] || Shield;
  return <Icon className={className} />;
};

StatIcon.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
};

// Hero Stats Display Component
const HeroStats = ({ hero, isAiHero = false }) => {
  const stats = isAiHero ? hero.stats : hero.powerstats;

  const statsList = [
    { key: "combat", label: "Combat", isOffensive: true },
    { key: "strength", label: "Strength", isOffensive: true },
    { key: "power", label: "Power", isOffensive: true },
    { key: "speed", label: "Speed", isOffensive: true },
    { key: "durability", label: "Durability", isOffensive: false },
    { key: "intelligence", label: "Intelligence", isOffensive: false },
  ];

  return (
    <div className="space-y-1">
      {statsList.map(({ key, label, isOffensive }) => (
        <div key={key} className="flex justify-between text-sm items-center">
          <span className="flex items-center gap-2">
            <StatIcon
              type={key}
              className={`w-4 h-4 ${
                isOffensive ? "text-red-400" : "text-blue-400"
              }`}
            />
            {label}:
          </span>
          <span>{stats?.[key] || "0"}</span>
        </div>
      ))}
    </div>
  );
};

HeroStats.propTypes = {
  hero: PropTypes.object.isRequired,
  isAiHero: PropTypes.bool,
};

// Main Component
const HeroBattle = ({ currentStep, onStepChange, onBattleComplete }) => {
  const navigate = useNavigate();
  const [availableHeroes, setAvailableHeroes] = useState([]);
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [aiTeam, setAiTeam] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomHeroes();
  }, []);

  const fetchRandomHeroes = async () => {
    try {
      // Uses axiosInstance which automatically:
      // - Includes the base URL
      // - Adds authorization headers
      // - Handles 401 errors consistently
      const response = await axiosInstance.get(
        "/api/superheroapi/random?count=4"
      );
      setAvailableHeroes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching heroes:", error);
      setLoading(false);
    }
  };

  const handleHeroSelect = (hero) => {
    if (selectedHeroes.find((h) => h.id === hero.id)) {
      setSelectedHeroes(selectedHeroes.filter((h) => h.id !== hero.id));
    } else if (selectedHeroes.length < 2) {
      setSelectedHeroes([...selectedHeroes, hero]);
    }
  };

  const startBattle = async () => {
    try {
      onStepChange(1);
      const response = await axiosInstance.post("/api/battle/start", {
        playerTeam: selectedHeroes.map((hero) => hero.id),
      });
      console.log("Battle started:", response.data);
      setAiTeam(response.data.aiTeam);
      setTimeout(() => {
        simulateBattle(response.data);
      }, 1500);
    } catch (error) {
      console.error("Error starting battle:", error);
    }
  };

  const simulateBattle = async (initialBattleData) => {
    try {
      console.log("Simulating battle...");

      const response = await axiosInstance.post("/api/battle/simulate", {
        playerTeam: selectedHeroes.map((hero) => hero.id),
        aiTeam: initialBattleData.aiTeam.map((hero) => hero.id),
      });
      console.log("Battle result:", response.data);
      setBattleResult(response.data);
      onStepChange(2);
      // Call onBattleComplete to update stats on the parent component
      onBattleComplete(response.data);
    } catch (error) {
      console.error("Error simulating battle:", error.response?.data || error);
    }
  };

  const renderHeroSelection = () => (
    <>
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {availableHeroes.map((hero) => (
            <div
              key={hero.id}
              onClick={() => handleHeroSelect(hero)}
              className={`relative rounded-lg p-4 cursor-pointer transition-all
                ${
                  selectedHeroes.find((h) => h.id === hero.id)
                    ? "ring-2 ring-indigo-500 bg-indigo-900/50"
                    : "hover:bg-gray-800 border-gray-700"
                }`}
            >
              <img
                src={
                  hero.image?.url ||
                  `/api/placeholder/200/300?text=${hero.name}`
                }
                alt={hero.name}
                className="w-full h-80 object-cover rounded"
              />
              <h3 className="mt-2 text-center font-medium">{hero.name}</h3>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex justify-center">
        <Shield className="w-16 h-16 animate-pulse text-indigo-600" />
      </div>
    </>
  );

  const renderBattleView = () => (
    <div className="mt-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Your Team</h3>
          <div className="grid grid-cols-2 gap-4">
            {selectedHeroes.map((hero) => (
              <div key={hero.id} className="text-center">
                <img
                  src={
                    hero.image?.url ||
                    `/api/placeholder/200/300?text=${hero.name}`
                  }
                  alt={hero.name}
                  className="w-full h-80 object-cover rounded"
                />
                <p className="mt-2 font-medium">{hero.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Opponent Team</h3>
          <div className="grid grid-cols-2 gap-4">
            {aiTeam.map((hero) => (
              <div key={hero.id} className="text-center">
                <img
                  src={
                    hero.imageUrl ||
                    `/api/placeholder/200/300?text=${hero.name}`
                  }
                  alt={hero.name}
                  className="w-full h-80 object-cover rounded"
                />
                <p className="mt-2 font-medium">{hero.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Swords className="w-16 h-16 animate-pulse text-indigo-600" />
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="mt-8">
      <Trophy
        className={`w-16 h-16 mx-auto ${
          battleResult?.result?.victory ? "text-yellow-400" : "text-gray-400"
        }`}
      />
      <h2 className="mt-4 text-2xl font-bold text-center">
        {battleResult?.result?.victory ? "Victory!" : "Defeat"}
      </h2>

      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* Player Team */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Your Team</h3>
          <div className="grid grid-cols-2 gap-4">
            {selectedHeroes.map((hero) => (
              <div key={hero.id} className="bg-gray-800 rounded-lg p-4">
                <img
                  src={
                    hero.image?.url ||
                    `/api/placeholder/200/300?text=${hero.name}`
                  }
                  alt={hero.name}
                  className="w-full h-48 object-cover rounded"
                />
                <div className="mt-4 space-y-2">
                  <p className="font-medium text-center">{hero.name}</p>
                  <HeroStats hero={hero} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 rounded-lg p-4 mt-4">
            <p className="text-center font-medium">Team Stats</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-red-400" />
                <p>
                  Offensive Score:{" "}
                  {battleResult?.teamStats?.player?.offensiveScore?.toFixed(
                    2
                  ) || "0"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <p>
                  Defensive Score:{" "}
                  {battleResult?.teamStats?.player?.defensiveScore || "0"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-green-400" />
                <p>
                  Survival Time:{" "}
                  {battleResult?.result?.team1SurvivalTime?.toFixed(2) || "0"}s
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Team */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Opponent Team</h3>
          <div className="grid grid-cols-2 gap-4">
            {aiTeam.map((hero) => (
              <div key={hero.id} className="bg-gray-800 rounded-lg p-4">
                <img
                  src={
                    hero.imageUrl ||
                    `/api/placeholder/200/300?text=${hero.name}`
                  }
                  alt={hero.name}
                  className="w-full h-48 object-cover rounded"
                />
                <div className="mt-4 space-y-2">
                  <p className="font-medium text-center">{hero.name}</p>
                  <HeroStats hero={hero} isAiHero={true} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 rounded-lg p-4 mt-4">
            <p className="text-center font-medium">Team Stats</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-red-400" />
                <p>
                  Offensive Score:{" "}
                  {battleResult?.teamStats?.ai?.offensiveScore?.toFixed(2) ||
                    "0"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <p>
                  Defensive Score:{" "}
                  {battleResult?.teamStats?.ai?.defensiveScore || "0"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-green-400" />
                <p>
                  Survival Time:{" "}
                  {battleResult?.result?.team2SurvivalTime?.toFixed(2) || "0"}s
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button onClick={() => navigate("/dashboard")} variant="secondary">
          Return to Dashboard
        </Button>
        <Button
          onClick={() => {
            onStepChange(0);
            setSelectedHeroes([]);
            setAiTeam([]);
            setBattleResult(null);
            fetchRandomHeroes();
          }}
        >
          New Battle
        </Button>
      </div>
    </div>
  );

  console.log("selectedHeroes", selectedHeroes);
  console.log("aiTeam", aiTeam);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      {currentStep === 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Your Heroes</h2>
          <p className="text-gray-300 mb-4">Choose 2 heroes for your team</p>
          {renderHeroSelection()}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={startBattle}
              disabled={selectedHeroes.length !== 2}
              className="px-6 py-2"
              color="white"
            >
              Start Battle
            </Button>
          </div>
        </div>
      )}

      {currentStep === 1 && renderBattleView()}
      {currentStep === 2 && renderResults()}
    </div>
  );
};

HeroBattle.propTypes = {
  currentStep: PropTypes.number.isRequired,
  onStepChange: PropTypes.func.isRequired,
  onBattleComplete: PropTypes.func.isRequired,
};

export default HeroBattle;
