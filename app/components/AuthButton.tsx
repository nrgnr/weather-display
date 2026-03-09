"use client";

import { signInAction, signOutAction } from "../actions";

export function SignInButton() {
  return (
    <button
      onClick={() => signInAction()}
      className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
    >
      Sign In
    </button>
  );
}

export function SignOutButton({ name }: { name?: string | null }) {
  return (
    <div className="flex items-center gap-3">
      {name && (
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {name}
        </span>
      )}
      <button
        onClick={() => signOutAction()}
        className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        Sign Out
      </button>
    </div>
  );
}
