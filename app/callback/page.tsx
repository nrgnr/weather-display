"use client";

import { useEffect } from "react";
import { handleCallbackAction } from "../actions";

export default function Callback() {
  useEffect(() => {
    handleCallbackAction(window.location.href);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg text-zinc-500">Signing in...</p>
    </div>
  );
}
