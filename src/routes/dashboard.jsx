import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axios";
import heroImage from "../images/Superheros.webp";
import { Swords } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { id: 1, name: "Total Matches Played", value: "0" },
    { id: 2, name: "Total Wins", value: "0" },
    { id: 3, name: "Win Ratio", value: "0" },
    { id: 4, name: "Current Streak", value: "0" },
    { id: 5, name: "Most Used Hero", value: "unknown" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching stats...");

        const response = await axiosInstance.get(`/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Stats response:", response.data);

        if (response.data) {
          setStats([
            {
              id: 1,
              name: "Total Matches Played",
              value: response.data.matchesPlayed,
            },
            {
              id: 2,
              name: "Total Wins",
              value: response.data.wins,
            },
            {
              id: 3,
              name: "Win Ratio",
              value: `${response.data.winRatio}%`,
            },
            {
              id: 4,
              name: "Current Streak",
              value: response.data.currentStreak,
            },
            {
              id: 5,
              name: "Most Used Hero",
              value: response.data.mostUsedHero,
            },
          ]);
        }
      } catch (error) {
        console.error(
          "Failed to fetch stats:",
          error.response?.data || error.message
        );
      }
    };

    fetchStats();
  }, []);

  // console.log("user", user);
  // console.log(
  //   "Token validation: ",
  //   atob(localStorage.getItem("token").split(".")[1])
  // );

  return (
    <div className="relative bg-white">
      <img
        alt="Superhero Silhouette"
        src={heroImage}
        className="h-56 w-full rounded-lg bg-gray-50 object-cover lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-1/2 lg:rounded-r-none"
      />
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="px-6 pb-24 pt-16 sm:pb-32 sm:pt-20 lg:col-start-2 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl lg:mr-0 lg:max-w-lg">
            <h2 className="text-base font-semibold text-indigo-600">
              Dashboard
            </h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Welcome back, {user?.username || "Hero"}
            </p>
            <p className="mt-6 text-lg text-gray-600">
              Track your progress in this clash of superheroes game. View your
              stats and most common hero traits below.
            </p>

            {/* New Battle Button */}
            <div className="mt-8">
              <button
                onClick={() => navigate("/battle")}
                className="inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors"
              >
                <Swords className="h-6 w-6" />
                Start New Battle
              </button>
            </div>

            <dl className="mt-16 grid max-w-xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 xl:mt-16">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6"
                >
                  <dt className="text-sm text-gray-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Recent Battles Section */}
            <div className="mt-16">
              <h3 className="text-xl font-semibold text-gray-900">
                Recent Battles
              </h3>
              <div className="mt-4 space-y-4">
                {/* You can add a list of recent battles here */}
                <p className="text-gray-600">
                  Your recent battle history will appear here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
