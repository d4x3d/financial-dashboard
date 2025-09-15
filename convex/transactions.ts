
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getTransactionsByAccountId = query({
  args: { accountId: v.id('accounts') },
  handler: async (ctx, { accountId }) => {
    return await ctx.db
      .query('transactions')
      .filter((q) => q.eq(q.field('fromAccountId'), accountId))
      .collect();
  },
});

export const createTransaction = mutation({
  args: {
    fromAccountId: v.id('accounts'),
    toAccountId: v.optional(v.id('accounts')),
    amount: v.number(),
    description: v.optional(v.string()),
    recipientName: v.optional(v.string()),
    recipientAccountNumber: v.optional(v.string()),
    recipientRoutingNumber: v.optional(v.string()),
    recipientBankName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { fromAccountId, amount } = args;

    const fromAccount = await ctx.db.get(fromAccountId);

    if (!fromAccount) {
      throw new Error('From account not found');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }

    await ctx.db.patch(fromAccountId, { balance: fromAccount.balance - amount });

    if (args.toAccountId) {
      const toAccount = await ctx.db.get(args.toAccountId);
      if (toAccount) {
        await ctx.db.patch(args.toAccountId, { balance: toAccount.balance + amount });
      }
    }

    await ctx.db.insert('transactions', {
      ...args,
      status: 'completed',
    });
  },
});
