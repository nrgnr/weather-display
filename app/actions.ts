"use server";

import {
  signIn,
  signOut,
  getLogtoContext,
  handleSignIn,
} from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn(logtoConfig, {
    redirectUri: `${logtoConfig.baseUrl}/callback`,
  });
}

export async function signOutAction() {
  await signOut(logtoConfig, logtoConfig.baseUrl);
}

export async function handleCallbackAction(url: string) {
  await handleSignIn(logtoConfig, new URL(url));
  redirect("/");
}

export async function getUser() {
  const context = await getLogtoContext(logtoConfig, {
    fetchUserInfo: true,
  });
  return context;
}
