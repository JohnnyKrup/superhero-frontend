import React, { useState } from "react";
import { HeroSearch } from "../components/hero-search";
import { HeroCard } from "../components/hero-card";
import { HeroNavigation } from "../components/hero-navigation";

const SuperheroList = () => {
  const [heroes, setHeroes] = useState([]);
  const [selectedHero, setSelectedHero] = useState(null);
  const [currentHeroId, setCurrentHeroId] = useState(null);

  const handleSearch = (results) => {
    setHeroes(results || []);
    const firstHero = results?.[0];
    if (firstHero) {
      setSelectedHero(firstHero);
      setCurrentHeroId(firstHero.id);
    } else {
      setSelectedHero(null);
      setCurrentHeroId(null);
    }
  };

  const handleSelectHero = (hero) => {
    setSelectedHero(hero);
  };

  const handleNavigate = async (heroId) => {
    try {
      setCurrentHeroId(heroId);
      const response = await fetch(`/api/superheroapi/${heroId}`);
      const hero = await response.json();
      setSelectedHero(hero);
      setHeroes([]);
    } catch (error) {
      console.error("Error fetching hero:", error);
    }
  };

  console.log("heroes", heroes);
  console.log("selectedHero", selectedHero);
  console.log("currentHeroId", currentHeroId);

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Super Heroes
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600">
            Check out all the superheroes in our database. You can search for a
            specific hero or browse through the list below.
          </p>
          <div className="mt-3">
            <HeroNavigation
              currentId={currentHeroId}
              onNavigate={handleNavigate}
            />
          </div>
        </div>

        <div className="mt-8">
          <HeroSearch onSearch={handleSearch} />
        </div>

        {heroes.length > 0 && !selectedHero && (
          <div className="mt-6 grid gap-4">
            {heroes.map((hero) => (
              <div
                key={hero.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectHero(hero)}
              >
                {hero.name}
              </div>
            ))}
          </div>
        )}

        {selectedHero && (
          <div className="mt-6">
            <HeroCard hero={selectedHero} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperheroList;
