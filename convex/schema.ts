
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
    isAdmin: v.boolean(),
  }).index('by_userId', ['userId']),
  accounts: defineTable({
    userId: v.string(),
    displayName: v.optional(v.string()),
    accountNumber: v.string(),
    routingNumber: v.optional(v.string()),
    balance: v.number(),
    accountType: v.string(),
  }).index('by_userId', ['userId']),
  transactions: defineTable({
    fromAccountId: v.optional(v.id('accounts')),
    toAccountId: v.optional(v.id('accounts')),
    recipientName: v.optional(v.string()),
    recipientEmail: v.optional(v.string()),
    recipientAccountNumber: v.optional(v.string()),
    recipientRoutingNumber: v.optional(v.string()),
    recipientBankName: v.optional(v.string()),
    amount: v.number(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal('pending'),
      v.literal('completed'),
      v.literal('rejected')
    ),
    approvedAt: v.optional(v.string()),
    approvedBy: v.optional(v.string()),
    isPositive: v.optional(v.boolean()),
    isVisible: v.optional(v.boolean()),
  }),
});
