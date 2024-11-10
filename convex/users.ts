import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
export const getAuthenticatedUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), userId))
      .unique();
  },
});
