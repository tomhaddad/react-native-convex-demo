import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

// DEMO:: schema
const schema = defineSchema({
  ...authTables,
  features: defineTable({
    chatEnabled: v.boolean(),
  }),
  messages: defineTable({
    content: v.string(),
    userId: v.id("users"),
    expiresAt: v.optional(v.number()),
    storageId: v.optional(v.id("_storage")),
  }),
});

export default schema;
