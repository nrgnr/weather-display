export interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  location: string;
}

export interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

const weatherDescriptions: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight showers",
  81: "Moderate showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ hail",
  99: "Thunderstorm w/ heavy hail",
};

const weatherIcons: Record<number, string> = {
  0: "\u2600\uFE0F",
  1: "\uD83C\uDF24\uFE0F",
  2: "\u26C5",
  3: "\u2601\uFE0F",
  45: "\uD83C\uDF2B\uFE0F",
  48: "\uD83C\uDF2B\uFE0F",
  51: "\uD83C\uDF26\uFE0F",
  53: "\uD83C\uDF26\uFE0F",
  55: "\uD83C\uDF27\uFE0F",
  61: "\uD83C\uDF27\uFE0F",
  63: "\uD83C\uDF27\uFE0F",
  65: "\uD83C\uDF27\uFE0F",
  71: "\uD83C\uDF28\uFE0F",
  73: "\uD83C\uDF28\uFE0F",
  75: "\uD83C\uDF28\uFE0F",
  80: "\uD83C\uDF26\uFE0F",
  81: "\uD83C\uDF27\uFE0F",
  82: "\u26C8\uFE0F",
  95: "\u26A1",
  96: "\u26A1",
  99: "\u26A1",
};

export function getWeatherDescription(code: number): string {
  return weatherDescriptions[code] || "Unknown";
}

export function getWeatherIcon(code: number): string {
  return weatherIcons[code] || "\u2753";
}

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<{ current: WeatherData; forecast: ForecastDay[] }> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`,
    { next: { revalidate: 600 } }
  );

  if (!res.ok) throw new Error("Failed to fetch weather");
  const data = await res.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      location: "",
    },
    forecast: data.daily.time.map((date: string, i: number) => ({
      date,
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      weatherCode: data.daily.weather_code[i],
    })),
  };
}

export interface GeoResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  admin1?: string;
}

export async function searchLocation(query: string): Promise<GeoResult[]> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((r: Record<string, unknown>) => ({
    name: r.name as string,
    lat: r.latitude as number,
    lon: r.longitude as number,
    country: r.country as string,
    admin1: r.admin1 as string | undefined,
  }));
}
