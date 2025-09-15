
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    // This is a placeholder for actual authentication logic.
    // In a real app, you would hash and compare passwords.
    const admin = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), email))
      .first();

    if (admin) {
      if (admin.password === password && admin.isAdmin) {
        return admin;
      }
    }
    return null;
  },
});

export const getAccounts = query(async (ctx) => {
  return await ctx.db.query('accounts').collect();
});

export const getUsers = query(async (ctx) => {
  return await ctx.db.query('users').collect();
});

export const createUser = mutation({
  args: {
    userId: v.string(),
    password: v.string(),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('users', args);
  },
});

export const createAccount = mutation({
  args: {
    userId: v.string(),
    displayName: v.optional(v.string()),
    accountType: v.string(),
    accountNumber: v.string(),
    balance: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('accounts', args);
  },
});

export const addBalance = mutation({
  args: {
    accountId: v.id('accounts'),
    amount: v.number(),
    description: v.string(),
    isPositive: v.boolean(),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { accountId, amount } = args;
    const account = await ctx.db.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    await ctx.db.patch(accountId, { balance: account.balance + amount });
    await ctx.db.insert('transactions', {
      fromAccountId: undefined,
      toAccountId: accountId,
      amount,
      status: 'completed',
      description: args.description,
      isPositive: args.isPositive,
      isVisible: args.isVisible,
    });
  },
});

export const deductBalance = mutation({
  args: {
    accountId: v.id('accounts'),
    amount: v.number(),
    description: v.string(),
    isPositive: v.boolean(),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { accountId, amount } = args;
    const account = await ctx.db.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    if (account.balance < amount) {
      throw new Error('Insufficient funds');
    }
    await ctx.db.patch(accountId, { balance: account.balance - amount });
    await ctx.db.insert('transactions', {
      fromAccountId: accountId,
      toAccountId: undefined,
      amount,
      status: 'completed',
      description: args.description,
      isPositive: args.isPositive,
      isVisible: args.isVisible,
    });
  },
});

export const deleteAccount = mutation({
  args: { accountId: v.id('accounts') },
  handler: async (ctx, { accountId }) => {
    const transactions = await ctx.db
      .query('transactions')
      .filter((q) => q.or(q.eq(q.field('fromAccountId'), accountId), q.eq(q.field('toAccountId'), accountId)))
      .collect();
    for (const transaction of transactions) {
      await ctx.db.delete(transaction._id);
    }
    await ctx.db.delete(accountId);
  },
});

export const deleteUser = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_userId', (q) => q.eq('userId', user.userId))
      .collect();
    for (const account of accounts) {
      await ctx.db.delete(account._id);
    }
    await ctx.db.delete(userId);
  },
});

export const getPendingTransactions = query(async (ctx) => {
  return await ctx.db
    .query('transactions')
    .filter((q) => q.eq(q.field('status'), 'pending'))
    .collect();
});

export const approveTransaction = mutation({
  args: { transactionId: v.id('transactions') },
  handler: async (ctx, { transactionId }) => {
    const transaction = await ctx.db.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    await ctx.db.patch(transactionId, { status: 'completed' });
  },
});

export const rejectTransaction = mutation({
  args: { transactionId: v.id('transactions') },
  handler: async (ctx, { transactionId }) => {
    await ctx.db.patch(transactionId, { status: 'rejected' });
  },
});

export const updateAccountBalance = mutation({
  args: { accountId: v.id('accounts'), balance: v.number() },
  handler: async (ctx, { accountId, balance }) => {
    await ctx.db.patch(accountId, { balance });
  },
});
