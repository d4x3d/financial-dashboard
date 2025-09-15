
import { query } from './_generated/server';
import { v } from 'convex/values';

export const getAccount = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('accounts')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();
  },
});
