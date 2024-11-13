import { query } from "./_generated/server";

// DEMO:: query
export const getFeatures = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("features").first();
  },
});
