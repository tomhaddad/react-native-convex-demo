import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// DEMO:: query
export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

// DEMO:: mutation
export const createMessage = mutation({
  args: { content: v.string(), expires: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    return await ctx.db.insert("messages", {
      content: args.content,
      userId,
      expiresAt: args.expires ? Date.now() + 1000 * 30 : undefined,
    });
  },
});
