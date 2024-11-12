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

// DEMO:: mutation + scheduled action
export const createMessage = mutation({
  args: {
    content: v.string(),
    expires: v.optional(v.boolean()),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { content, expires, storageId } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    const id = await ctx.db.insert("messages", {
      content,
      userId,
      expiresAt: expires ? Date.now() + 1000 * 30 : undefined,
      storageId,
    });
    // DEMO:: scheduled action
    if (expires) {
      await ctx.scheduler.runAfter(30000, internal.messages.expireMessage, {
        id,
      });
    }
  },
});

export const expireMessage = internalMutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// DEMO:: file upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// DEMO:: get file url
export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
