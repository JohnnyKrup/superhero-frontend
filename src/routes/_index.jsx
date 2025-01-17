import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import PropTypes from "prop-types";

const Home = () => {
  const [heroes, setHeroes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch 5 random heroes
  const fetchRandomHeroes = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/api/superheroapi/random?count=5"
      );
      setHeroes(response.data);
    } catch (error) {
      console.error("Error fetching heroes:", error);
      // Set fallback heroes if everything fails
      setHeroes(
        Array(5).fill({
          name: "Mystery Hero",
          imageUrl: "/api/placeholder/400/528?text=Hero+Not+Found",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomHeroes();
  }, []);

  console.log("heroes", heroes);

  const HeroImage = ({ image, name, className }) => (
    <div className="relative group">
      <img
        src={image?.url}
        alt={name}
        className={`aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg ${
          className || ""
        }`}
        onError={(e) => {
          e.target.src = `/api/placeholder/400/528?text=${
            name || "Hero Not Found"
          }`;
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-xl flex items-end justify-center">
        <span className="text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {name}
        </span>
      </div>
    </div>
  );

  HeroImage.propTypes = {
    image: PropTypes.shape({
      url: PropTypes.string,
    }),
    name: PropTypes.string,
    className: PropTypes.string,
  };

  return (
    <div className="relative isolate">
      {/* Background pattern */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
      >
        {/* ... (SVG pattern code remains the same) ... */}
      </svg>

      <div className="overflow-hidden">
        <div className="pb-32 pt-12 sm:pt-24 lg:pt-16">
          <div className="mx-auto gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            {/* Content section */}
            <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-1xl">
              <h1 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
                Welcome to SuperheroDB
              </h1>
              <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none">
                Your ultimate site for superhero brawls. Discover, and explore
                your favorite superheroes from across the multiverse and let
                them fight.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a
                  href="/superheroes"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Explore Heroes
                </a>
                <a
                  href="/auth/login"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Login
                </a>
                <button
                  onClick={fetchRandomHeroes}
                  className="text-sm/6 font-semibold text-gray-900 hover:text-indigo-600"
                  disabled={isLoading}
                >
                  Refresh Heroes <span aria-hidden="true">↻</span>
                </button>
              </div>
            </div>

            {/* Image grid section */}
            <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
              {/* First column */}
              <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 aspect-[2/3] rounded-xl" />
                ) : (
                  heroes[0] && (
                    <HeroImage image={heroes[0].image} name={heroes[0].name} />
                  )
                )}
              </div>

              {/* Second column */}
              <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                {isLoading ? (
                  <>
                    <div className="animate-pulse bg-gray-200 aspect-[2/3] rounded-xl" />
                    <div className="animate-pulse bg-gray-200 aspect-[2/3] rounded-xl" />
                  </>
                ) : (
                  <>
                    {heroes[1] && (
                      <HeroImage
                        image={heroes[1].image}
                        name={heroes[1].name}
                      />
                    )}
                    {heroes[2] && (
                      <HeroImage
                        image={heroes[2].image}
                        name={heroes[2].name}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Third column */}
              <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                {isLoading ? (
                  <>
                    <div className="animate-pulse bg-gray-200 aspect-[2/3] rounded-xl" />
                    <div className="animate-pulse bg-gray-200 aspect-[2/3] rounded-xl" />
                  </>
                ) : (
                  <>
                    {heroes[3] && (
                      <HeroImage
                        image={heroes[3].image}
                        name={heroes[3].name}
                      />
                    )}
                    {heroes[4] && (
                      <HeroImage
                        image={heroes[4].image}
                        name={heroes[4].name}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
