import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

// Get the Convex URL from environment variables
const convexUrl = process.env.VITE_CONVEX_URL || 'https://dapper-jay-663.convex.cloud';

// Create a Convex client
const client = new ConvexHttpClient(convexUrl);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create the admin user
    const userId = await client.mutation(api.admin.createUser, {
      userId: 'admin',
      password: 'admin123',
      isAdmin: true,
    });

    console.log(`Admin user created successfully with ID: ${userId}`);
    
    // Also create an admin account
    const accountId = await client.mutation(api.admin.createAccount, {
      userId: 'admin',
      displayName: 'Admin Account',
      accountType: 'checking',
      accountNumber: 'ADMIN001',
      balance: 10000,
    });

    console.log(`Admin account created successfully with ID: ${accountId}`);
    
    console.log('Admin setup completed successfully!');
    console.log('Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function
createAdminUser();