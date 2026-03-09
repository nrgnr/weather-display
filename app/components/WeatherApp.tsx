"use client";

import { useState, useEffect } from "react";
import { type GeoResult, type WeatherData, type ForecastDay } from "@/lib/weather";
import { CurrentWeather, ForecastList } from "./WeatherCard";
import { LocationSearch } from "./LocationSearch";

const DEFAULT_LOCATION: GeoResult = {
  name: "New York",
  lat: 40.7128,
  lon: -74.006,
  country: "US",
  admin1: "New York",
};

export function WeatherApp() {
  const [location, setLocation] = useState<GeoResult>(DEFAULT_LOCATION);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/weather?lat=${location.lat}&lon=${location.lon}`
        );
        const data = await res.json();
        setWeather(data.current);
        setForecast(data.forecast);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      }
      setLoading(false);
    }
    load();
  }, [location]);

  const locationLabel = `${location.name}${location.admin1 ? `, ${location.admin1}` : ""}, ${location.country}`;

  return (
    <div className="flex flex-col gap-6">
      <LocationSearch onSelect={setLocation} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      ) : weather ? (
        <>
          <CurrentWeather weather={weather} location={locationLabel} />
          <ForecastList forecast={forecast} />
        </>
      ) : (
        <p className="text-center text-zinc-500">
          Could not load weather data.
        </p>
      )}
    </div>
  );
}
