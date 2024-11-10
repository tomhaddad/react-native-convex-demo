import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  messages: defineTable({
    content: v.string(),
    author: v.string(),
    createdAt: v.number(),
  }),
});

export default schema;
