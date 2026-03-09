"use client";

import {
  getWeatherIcon,
  getWeatherDescription,
  type WeatherData,
  type ForecastDay,
} from "@/lib/weather";

export function CurrentWeather({
  weather,
  location,
}: {
  weather: WeatherData;
  location: string;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white shadow-xl">
      <div className="mb-2 text-sm font-medium uppercase tracking-wider opacity-80">
        Current Weather
      </div>
      <div className="mb-1 text-lg font-semibold">{location}</div>
      <div className="flex items-center gap-6">
        <span className="text-7xl">{getWeatherIcon(weather.weatherCode)}</span>
        <div>
          <div className="text-6xl font-light">
            {Math.round(weather.temperature)}°C
          </div>
          <div className="mt-1 text-lg opacity-90">
            {getWeatherDescription(weather.weatherCode)}
          </div>
          <div className="mt-1 text-sm opacity-75">
            Wind: {weather.windSpeed} km/h
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForecastList({ forecast }: { forecast: ForecastDay[] }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
      <h3 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {forecast.map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800"
          >
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {new Date(day.date + "T12:00:00").toLocaleDateString("en", {
                weekday: "short",
              })}
            </div>
            <div className="my-2 text-2xl">
              {getWeatherIcon(day.weatherCode)}
            </div>
            <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {Math.round(day.tempMax)}°
            </div>
            <div className="text-xs text-zinc-400">
              {Math.round(day.tempMin)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
