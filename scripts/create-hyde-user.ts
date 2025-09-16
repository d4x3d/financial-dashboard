import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Get the Convex URL from environment variables
const convexUrl =
  process.env.VITE_CONVEX_URL || "https://acrobatic-butterfly-784.convex.cloud";

// Create a Convex client
const client = new ConvexHttpClient(convexUrl);

function generateAccountNumber(length = 12): string {
  const digits = "0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += digits[Math.floor(Math.random() * digits.length)];
  }
  return out;
}

async function createHydeUser() {
  try {
    console.log(
      'Creating normal user "Hyde Mark" with checking account and transactions...'
    );

    const userId = "hyde12";
    const fullName = "Hyde Mark";
    const email = "hyde.mark@mail.com";
    const password = "Hyde#206!";

    // Check if user already exists
    console.log("Checking if user already exists...");
    const existing = await client.query(api.users.getUser, { userId });
    if (existing) {
      console.log(
        `User "${userId}" already exists. Aborting creation to avoid duplicates.`
      );
      console.log(`Existing user _id: ${existing._id}`);
      return;
    }

    // Create the normal user (non-admin)
    const createdUserId = await client.mutation(api.admin.createUser, {
      userId,
      password,
      fullName,
      email,
      isAdmin: false,
    });
    console.log(`User created successfully with ID: ${createdUserId}`);

    // Create a checking account with zero initial balance
    const accountNumber = generateAccountNumber(12);
    const accountId = await client.mutation(api.admin.createAccount, {
      userId,
      displayName: "Hyde Mark Checking",
      accountType: "checking",
      accountNumber,
      balance: 0,
    });
    console.log(
      `Checking account created successfully with ID: ${accountId} and number: ${accountNumber}`
    );

    // Create only deposits totaling 450,000 (all positives => all green in UI)
    const credits = [
      { amount: 50000, description: "Initial deposit" },
      { amount: 85000, description: "Payroll deposit" },
      { amount: 40000, description: "Refund" },
      { amount: 100000, description: "Incoming wire" },
      { amount: 25000, description: "Cash deposit" },
      { amount: 75000, description: "Bonus payout" },
      { amount: 50000, description: "Investment proceeds" },
      { amount: 25000, description: "Side income" },
    ];

    for (const tx of credits) {
      await client.mutation(api.admin.addBalance, {
        accountId,
        amount: tx.amount,
        description: tx.description,
        isPositive: true,
        isVisible: true,
      });
    }

    console.log(
      "Finished seeding transactions. Final balance should be 450000."
    );
    console.log("Credentials:");
    console.log(`Username: ${userId}`);
    console.log(`Password: ${password}`);
    console.log(`Account Number: ${accountNumber}`);
    console.log("User and account setup completed successfully!");
  } catch (error) {
    console.error("Error creating Hyde Mark user:", error);
  }
}

// Run the function
createHydeUser();
