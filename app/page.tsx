import { getUser } from "./actions";
import { SignInButton, SignOutButton } from "./components/AuthButton";
import { WeatherApp } from "./components/WeatherApp";

export default async function Home() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            Weather Display
          </h1>
          {user.isAuthenticated ? (
            <SignOutButton name={user.claims?.name} />
          ) : (
            <SignInButton />
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        {user.isAuthenticated ? (
          <WeatherApp />
        ) : (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <div className="text-6xl">🌤️</div>
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
              Welcome to Weather Display
            </h2>
            <p className="max-w-md text-zinc-500">
              Sign in to search cities and view current weather with a 5-day
              forecast.
            </p>
            <SignInButton />
          </div>
        )}
      </main>
    </div>
  );
}
