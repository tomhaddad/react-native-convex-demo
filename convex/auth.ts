import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

// DEMO:: auth
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Google({ clientId: process.env.GOOGLE_CLIENT_ID! })],
});
