import React from "react";
import { ProgressBar } from "./controls/progressbar";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
// import { StarIcon as StarOutline} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

export const HeroCard = ({ hero }) => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl lg:max-w-7xl">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex justify-between">
              <h1 className="text-xl font-medium text-gray-900">{hero.name}</h1>
            </div>

            {/* Rating */}
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarSolid
                    key={rating}
                    size={20}
                    className={
                      hero.powerstats?.combat > rating * 20
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-700">
                Combat Rating: {hero.powerstats?.combat}
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
            <img
              src={hero.image?.url || "/api/placeholder/600/400"}
              alt={hero.name}
              className="rounded-lg"
            />
          </div>

          {/* Stats */}
          <div className="mt-8 lg:col-span-5">
            <div className="space-y-6">
              {hero.powerstats &&
                Object.entries(hero.powerstats).map(([stat, value]) => (
                  <div key={stat}>
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-medium text-gray-900 capitalize">
                        {stat}
                      </h2>
                      <span className="text-sm text-gray-500">{value}</span>
                    </div>
                    <ProgressBar value={parseInt(value)} />
                    {/* <Progress value={parseInt(value)} className="mt-2" /> */}
                  </div>
                ))}
            </div>

            {/* Details */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-sm font-medium text-gray-900">
                Character Details
              </h2>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Full Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {hero.biography?.["full-name"]}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Race</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {hero.appearance?.race}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Publisher
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {hero.biography?.publisher}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeroCard.propTypes = {
  hero: PropTypes.object.isRequired,
};
