"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

const GUEST_EMAIL = process.env.GUEST_EMAIL!;
const GUEST_PASSWORD = process.env.GUEST_PASSWORD!;

export const guestLogin = async (callbackUrl?: string | null) => {
  try {
    const existingUser = await getUserByEmail(GUEST_EMAIL);
    if (!existingUser) {
      return {
        error: "Guest account not configured. Please contact administrator.",
      };
    }

    await signIn("credentials", {
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Logged in as guest successfully!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.name) {
        case "CredentialsSignin":
          return { error: "Invalid guest credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
