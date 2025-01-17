import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import PropTypes from "prop-types";
import { Sword, Shield, Heart } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const HeroSelectionGrid = ({ onHeroSelect, selectedHeroes = [] }) => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        // Get 9 random heroes for selection
        const response = await axiosInstance.get(
          "/api/superheroapi/random?count=9"
        );
        setHeroes(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load heroes");
        setLoading(false);
        console.error("Error fetching heroes:", err);
      }
    };

    fetchHeroes();
  }, []);

  console.log("heroes", heroes);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading heroes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold text-indigo-400">
            Choose Your Team
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white">
            Select Your Heroes
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Pick three heroes to form your team. Choose wisely - each hero
            brings unique powers to the battle!
          </p>
        </div>

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {heroes.map((hero) => {
            const isSelected = selectedHeroes.some(
              (selected) => selected.id === hero.id
            );

            return (
              <div
                key={hero.id}
                className={classNames(
                  isSelected
                    ? "bg-white/5 ring-2 ring-indigo-500"
                    : "ring-1 ring-white/10",
                  "rounded-3xl p-8 xl:p-10",
                  "transition-all duration-200 hover:ring-2 hover:ring-indigo-400",
                  selectedHeroes.length < 3 || isSelected
                    ? "cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                )}
                onClick={() => {
                  if (selectedHeroes.length < 3 || isSelected) {
                    onHeroSelect(hero);
                  }
                }}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-white">
                    {hero.name}
                  </h3>
                  {isSelected && (
                    <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold text-white">
                      Selected
                    </p>
                  )}
                </div>

                <img
                  src={hero?.url || "/api/placeholder/400/300"}
                  alt={hero.name}
                  className="mt-4 h-48 w-full object-cover rounded-xl"
                />

                <p className="mt-4 text-sm leading-6 text-gray-300">
                  {hero.biography?.alignment === "good" ? "Hero" : "Villain"} •{" "}
                  {hero.appearance?.race || "Unknown Race"}
                </p>

                <div className="mt-6 space-y-4">
                  {/* Power Stats */}
                  <div className="flex items-center gap-x-2">
                    <Sword className="h-5 w-5 flex-none text-indigo-400" />
                    <span className="text-sm text-gray-300">
                      Combat: {hero.powerstats?.combat || "??"}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Shield className="h-5 w-5 flex-none text-indigo-400" />
                    <span className="text-sm text-gray-300">
                      Defense: {hero.powerstats?.durability || "??"}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Heart className="h-5 w-5 flex-none text-indigo-400" />
                    <span className="text-sm text-gray-300">
                      Power: {hero.powerstats?.power || "??"}
                    </span>
                  </div>
                </div>

                <button
                  className={classNames(
                    "mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    isSelected
                      ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                      : selectedHeroes.length < 3
                      ? "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedHeroes.length < 3 || isSelected) {
                      onHeroSelect(hero);
                    }
                  }}
                  disabled={selectedHeroes.length >= 3 && !isSelected}
                >
                  {isSelected
                    ? "Remove Hero"
                    : selectedHeroes.length >= 3
                    ? "Team Full"
                    : "Select Hero"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

HeroSelectionGrid.propTypes = {
  onHeroSelect: PropTypes.func.isRequired,
  selectedHeroes: PropTypes.array,
};

export default HeroSelectionGrid;
