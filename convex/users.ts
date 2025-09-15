
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const authenticate = mutation({
  args: { userId: v.string(), password: v.string() },
  handler: async (ctx, { userId, password }) => {
    // This is a placeholder for actual authentication logic.
    // In a real app, you would hash and compare passwords.
    const user = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (user) {
      // @ts-ignore
      if (user.password === password) {
        return user;
      }
    }
    return null;
  },
});

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();
  },
});
