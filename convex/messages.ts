import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

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
    const id = await ctx.db.insert("messages", {
      content: args.content,
      userId,
      expiresAt: args.expires ? Date.now() + 1000 * 30 : undefined,
    });
    // DEMO:: scheduled action
    await ctx.scheduler.runAfter(30000, internal.messages.expireMessage, {
      id,
    });
  },
});

export const expireMessage = internalMutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
