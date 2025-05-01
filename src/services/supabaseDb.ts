import { supabase } from './supabase';

// Define interfaces for our database tables
export interface User {
  id?: string;
  userid: string;
  password?: string;
  fullName?: string; // This maps to 'fullname' in the database
  email?: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Account {
  id?: string;
  userId?: string;
  userid: string;
  password?: string; // Make password optional since some Supabase schemas might not have it
  displayName?: string;
  accountNumber: string;
  routingNumber?: string;
  balance: number;
  accountType: string;
  createdAt: Date;
  transactions?: Transaction[];
}

export interface Transaction {
  id?: string;
  fromAccountId: string | null;
  toAccountId?: string | null;
  recipientName?: string;
  recipientEmail?: string;
  recipientAccountNumber?: string;
  recipientRoutingNumber?: string;
  recipientBankName?: string;
  amount: number;
  description?: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  isPositive?: boolean; // Simple flag to determine if transaction should show as positive or negative
  isVisible?: boolean; // Whether this transaction should be visible to the user
}

// Database service class
class SupabaseDB {
  // Initialize tables if they don't exist
  async initializeTables() {
    // In a real implementation, we would create tables if they don't exist
    // For now, we'll just log that we're checking tables
    console.log('Checking if tables exist in Supabase...');

    // Check if we can access the tables
    try {
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: accountsCount, error: accountsError } = await supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true });

      const { count: transactionsCount, error: transactionsError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      console.log('Tables status:', {
        users: usersError ? 'Error' : 'OK',
        accounts: accountsError ? 'Error' : 'OK',
        transactions: transactionsError ? 'Error' : 'OK'
      });
    } catch (error) {
      console.error('Error checking tables:', error);
    }
  }

  // User management methods
  async getUserByUserid(userid: string): Promise<User | null> {
    // First check if the user exists to avoid the 406 error
    const { data: checkData, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('userid', userid);

    if (checkError) {
      console.error('Error checking for user:', checkError);
      return null;
    }

    // If no user found, return null
    if (!checkData || checkData.length === 0) {
      console.log(`No user found with userid: ${userid}`);
      return null;
    }

    // If user exists, get the single record
    const data = checkData[0];
    if (!data) {
      return null;
    }

    // Convert snake_case back to camelCase for our application
    if (data) {
      // Create a basic user object with required fields
      const user: any = {
        id: data.id,
        userid: data.userid,
        password: data.password,
        isAdmin: data.is_admin || false,
        createdAt: data.created_at
      };

      // Try different possible name field variations
      if ('fullname' in data) {
        user.fullName = data.fullname;
      } else if ('full_name' in data) {
        user.fullName = data.full_name;
      } else if ('name' in data) {
        user.fullName = data.name;
      } else if ('display_name' in data) {
        user.fullName = data.display_name;
      }

      // Add email if it exists
      if ('email' in data) {
        user.email = data.email;
      }

      return user as User;
    }

    return null;
  }

  async createUser(user: User): Promise<string | null> {
    // First, check the structure of the users table
    try {
      const { data: tableInfo, error: tableError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (tableError) {
        console.error('Error checking users table structure:', tableError);
      } else {
        console.log('Users table structure:', tableInfo);

        // Create a basic user object with required fields
        const basicUser = {
          userid: user.userid,
          password: user.password,
          is_admin: user.isAdmin || false,
          created_at: user.createdAt || new Date()
        };

        // If the table exists, try to determine the name field
        if (tableInfo && tableInfo.length > 0) {
          const sampleRow = tableInfo[0];

          // Try different possible name field variations
          if ('fullname' in sampleRow) {
            (basicUser as any).fullname = user.fullName;
          } else if ('full_name' in sampleRow) {
            (basicUser as any).full_name = user.fullName;
          } else if ('name' in sampleRow) {
            (basicUser as any).name = user.fullName;
          } else if ('display_name' in sampleRow) {
            (basicUser as any).display_name = user.fullName;
          }

          // Add email if the column exists
          if ('email' in sampleRow) {
            (basicUser as any).email = user.email || '';
          }
        } else {
          // If we can't determine the structure, use all possible variations
          (basicUser as any).name = user.fullName;
          (basicUser as any).fullname = user.fullName;
          (basicUser as any).full_name = user.fullName;
          (basicUser as any).display_name = user.fullName;
          (basicUser as any).email = user.email || '';
        }

        console.log('Creating user with data:', basicUser);

        const { data, error } = await supabase
          .from('users')
          .insert([basicUser])
          .select();

        if (error) {
          console.error('Error creating user:', error);
          return null;
        }

        return data?.[0]?.id || null;
      }
    } catch (error) {
      console.error('Error during user creation:', error);
    }

    // Fallback approach - try with minimal fields
    const minimalUser = {
      userid: user.userid,
      password: user.password
    };

    console.log('Trying minimal user creation:', minimalUser);

    const { data, error } = await supabase
      .from('users')
      .insert([minimalUser])
      .select();

    if (error) {
      console.error('Error creating minimal user:', error);
      return null;
    }

    return data?.[0]?.id || null;
  }

  async authenticateUser(userid: string, password: string): Promise<User | Account | null> {
    // First try to authenticate as a user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('userid', userid)
      .eq('password', password)
      .single();

    if (userData && !userError) {
      // Create a basic user object with required fields
      const user: any = {
        id: userData.id,
        userid: userData.userid,
        password: userData.password,
        isAdmin: userData.is_admin || false,
        createdAt: userData.created_at
      };

      // Try different possible name field variations
      if ('fullname' in userData) {
        user.fullName = userData.fullname;
      } else if ('full_name' in userData) {
        user.fullName = userData.full_name;
      } else if ('name' in userData) {
        user.fullName = userData.name;
      } else if ('display_name' in userData) {
        user.fullName = userData.display_name;
      }

      // Add email if it exists
      if ('email' in userData) {
        user.email = userData.email;
      }

      return user as User;
    }

    // If not found, try to authenticate as an account
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('userid', userid)
      .eq('password', password)
      .single();

    if (accountData && !accountError) {
      // Convert snake_case back to camelCase
      return {
        id: accountData.id,
        userid: accountData.userid,
        password: accountData.password,
        displayName: accountData.display_name,
        accountNumber: accountData.account_number,
        routingNumber: accountData.routing_number,
        balance: accountData.balance,
        accountType: accountData.account_type,
        createdAt: accountData.created_at
      } as Account;
    }

    return null;
  }

  // Account management methods
  async getAccounts(): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*');

    if (error) {
      console.error('Error getting accounts:', error);
      return [];
    }

    // Convert snake_case back to camelCase for our application
    const accounts = data.map(item => {
      return {
        id: item.id,
        userid: item.userid,
        password: item.password,
        displayName: item.display_name,
        accountNumber: item.account_number,
        routingNumber: item.routing_number,
        balance: item.balance,
        accountType: item.account_type,
        createdAt: item.created_at
      } as Account;
    });

    return accounts;
  }

  async getAccountByUserid(userid: string): Promise<Account | null> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('userid', userid)
      .single();

    if (error) {
      console.error('Error getting account:', error);
      return null;
    }

    // Convert snake_case back to camelCase for our application
    if (data) {
      return {
        id: data.id,
        userid: data.userid,
        password: data.password,
        displayName: data.display_name,
        accountNumber: data.account_number,
        routingNumber: data.routing_number,
        balance: data.balance,
        accountType: data.account_type,
        createdAt: data.created_at
      } as Account;
    }

    return null;
  }

  async getAccountById(id: string): Promise<Account | null> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting account:', error);
      return null;
    }

    // Convert snake_case back to camelCase for our application
    if (data) {
      return {
        id: data.id,
        userid: data.userid,
        password: data.password,
        displayName: data.display_name,
        accountNumber: data.account_number,
        routingNumber: data.routing_number,
        balance: data.balance,
        accountType: data.account_type,
        createdAt: data.created_at
      } as Account;
    }

    return null;
  }

  async createAccount(account: Account): Promise<string | null> {
    console.log('Creating account with data:', account);

    // Convert camelCase to snake_case
    const snakeCaseAccount = {
      userid: account.userid,
      display_name: account.displayName,
      account_number: account.accountNumber,
      account_type: account.accountType,
      balance: account.balance,
      created_at: account.createdAt,
      routing_number: account.routingNumber
    };

    console.log('Converted to snake_case:', snakeCaseAccount);

    // Insert with snake_case column names
    const { data, error } = await supabase
      .from('accounts')
      .insert([snakeCaseAccount])
      .select();

    if (error) {
      console.error('Error creating account:', error);
      return null;
    }

    return data?.[0]?.id || null;
  }

  async updateAccountBalance(accountId: string, newBalance: number): Promise<boolean> {
    // Use snake_case column names
    const { error } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId);

    if (error) {
      console.error('Error updating account balance:', error);
      return false;
    }

    return true;
  }

  async deleteAccount(accountId: string): Promise<boolean> {
    // First delete related transactions - use snake_case column names
    const { error: transactionError } = await supabase
      .from('transactions')
      .delete()
      .or(`from_account_id.eq.${accountId},to_account_id.eq.${accountId}`);

    if (transactionError) {
      console.error('Error deleting transactions:', transactionError);
      return false;
    }

    // Then delete the account
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', accountId);

    if (error) {
      console.error('Error deleting account:', error);
      return false;
    }

    return true;
  }

  // Transaction management methods
  // Helper method to determine if a transaction should be positive
  private determineIsPositive(transaction: Transaction): boolean {
    // Check description for specific keywords
    if (transaction.description) {
      // Tax and fee transactions are always negative
      if (transaction.description.includes('Tax') ||
          transaction.description.includes('tax') ||
          transaction.description.includes('Fee') ||
          transaction.description.includes('fee')) {
        return false;
      }
      // Admin deposits are always positive
      if (transaction.description.includes('added by admin')) {
        return true;
      }
      // Admin deductions are always negative
      if (transaction.description.includes('deducted by admin')) {
        return false;
      }
    }

    // Check transaction structure
    if (transaction.fromAccountId === null && transaction.toAccountId) {
      return true; // Deposit (money coming in)
    }
    if (transaction.fromAccountId && transaction.toAccountId === null) {
      return false; // Withdrawal (money going out)
    }

    // Default to positive
    return true;
  }

  async createTransaction(transaction: Transaction): Promise<string | null> {
    // Check if toAccountId is an external account (not in our system)
    // If it's a string that's not a UUID, it's likely an external account number
    const isExternalAccount = transaction.toAccountId &&
      typeof transaction.toAccountId === 'string' &&
      !transaction.toAccountId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    console.log('Transaction check:', {
      toAccountId: transaction.toAccountId,
      isExternalAccount
    });

    // Convert camelCase to snake_case
    const snakeCaseTransaction = {
      from_account_id: transaction.fromAccountId,
      // Only include to_account_id if it's a valid internal account ID
      to_account_id: isExternalAccount ? null : transaction.toAccountId,
      recipient_name: transaction.recipientName,
      recipient_email: transaction.recipientEmail,
      // Always store the account number as a string in recipient_account_number
      recipient_account_number: isExternalAccount ? transaction.toAccountId : transaction.recipientAccountNumber,
      recipient_routing_number: transaction.recipientRoutingNumber,
      recipient_bank_name: transaction.recipientBankName,
      amount: transaction.amount,
      description: transaction.description || 'Transaction',
      status: transaction.status,
      created_at: transaction.createdAt,
      approved_at: transaction.approvedAt,
      approved_by: transaction.approvedBy,
      // Add new fields
      is_positive: transaction.isPositive !== undefined ? transaction.isPositive : this.determineIsPositive(transaction),
      is_visible: transaction.isVisible !== undefined ? transaction.isVisible : true
    };

    console.log('Transaction is_positive determined as:', snakeCaseTransaction.is_positive);

    console.log('Converted transaction to snake_case:', snakeCaseTransaction);

    const { data, error } = await supabase
      .from('transactions')
      .insert([snakeCaseTransaction])
      .select();

    if (error) {
      console.error('Error creating transaction:', error);
      return null;
    }

    return data?.[0]?.id || null;
  }

  async getTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
    console.log('getTransactionsByAccountId called with accountId:', accountId);

    // First, get the account to find its account number
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError) {
      console.error('Error getting account data:', accountError);
      return [];
    }

    const accountNumber = accountData?.account_number;
    const userid = accountData?.userid;
    console.log('Looking for transactions for account:', { accountId, accountNumber, userid });

    // Get ALL transactions from the database
    const { data: allTransactions, error: allError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('Error getting all transactions:', allError);
      return [];
    }

    console.log('All transactions in database:', allTransactions);

    // Filter transactions client-side to include ALL possible matches
    // This ensures we don't miss any transactions due to database schema issues
    const relevantTransactions = allTransactions.filter(transaction => {
      // Check all possible ways this account could be involved in a transaction
      return (
        // As sender
        transaction.from_account_id === accountId ||

        // As recipient (direct account ID)
        transaction.to_account_id === accountId ||

        // As recipient (by account number)
        (transaction.recipient_account_number &&
         transaction.recipient_account_number === accountNumber) ||

        // As recipient (by name - fuzzy match)
        (transaction.recipient_name &&
         (transaction.recipient_name.includes(userid) ||
          (accountData.display_name && transaction.recipient_name.includes(accountData.display_name))))
      );
    });

    console.log('Filtered relevant transactions:', relevantTransactions);

    // Convert snake_case back to camelCase for our application
    const transactions = relevantTransactions.map(item => {
      return {
        id: item.id,
        fromAccountId: item.from_account_id,
        toAccountId: item.to_account_id,
        recipientName: item.recipient_name,
        recipientEmail: item.recipient_email,
        recipientAccountNumber: item.recipient_account_number,
        recipientRoutingNumber: item.recipient_routing_number,
        recipientBankName: item.recipient_bank_name,
        amount: item.amount,
        description: item.description,
        status: item.status,
        createdAt: item.created_at,
        approvedAt: item.approved_at,
        approvedBy: item.approved_by,
        isPositive: item.is_positive, // Map the is_positive field
        isVisible: item.is_visible // Map the is_visible field
      } as Transaction;
    });

    // Filter out invisible transactions
    const visibleTransactions = transactions.filter(t => t.isVisible !== false);

    console.log('Returning visible transactions:', visibleTransactions);
    return visibleTransactions;
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting pending transactions:', error);
      return [];
    }

    // Convert snake_case back to camelCase for our application
    const transactions = data.map(item => {
      return {
        id: item.id,
        fromAccountId: item.from_account_id,
        toAccountId: item.to_account_id,
        recipientName: item.recipient_name,
        recipientEmail: item.recipient_email,
        recipientAccountNumber: item.recipient_account_number,
        recipientRoutingNumber: item.recipient_routing_number,
        recipientBankName: item.recipient_bank_name,
        amount: item.amount,
        description: item.description,
        status: item.status,
        createdAt: item.created_at,
        approvedAt: item.approved_at,
        approvedBy: item.approved_by
      } as Transaction;
    });

    return transactions;
  }

  async approveTransaction(transactionId: string, adminId: string): Promise<boolean> {
    // Get the transaction
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (transactionError || !transactionData) {
      console.error('Error getting transaction:', transactionError);
      return false;
    }

    const transaction = transactionData as Transaction;

    // Update transaction status
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'completed',
        approvedAt: new Date(),
        approvedBy: adminId
      })
      .eq('id', transactionId);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return false;
    }

    // Update account balances
    if (transaction.fromAccountId) {
      const { data: fromAccountData, error: fromAccountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', transaction.fromAccountId)
        .single();

      if (!fromAccountError && fromAccountData) {
        const fromAccount = fromAccountData as Account;
        await this.updateAccountBalance(
          transaction.fromAccountId,
          fromAccount.balance - transaction.amount
        );
      }
    }

    if (transaction.toAccountId) {
      const { data: toAccountData, error: toAccountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', transaction.toAccountId)
        .single();

      if (!toAccountError && toAccountData) {
        const toAccount = toAccountData as Account;
        await this.updateAccountBalance(
          transaction.toAccountId,
          toAccount.balance + transaction.amount
        );
      }
    }

    return true;
  }

  async rejectTransaction(transactionId: string, adminId: string): Promise<boolean> {
    const { error } = await supabase
      .from('transactions')
      .update({
        status: 'rejected',
        approvedAt: new Date(),
        approvedBy: adminId
      })
      .eq('id', transactionId);

    if (error) {
      console.error('Error rejecting transaction:', error);
      return false;
    }

    return true;
  }
}

// Create and export a single instance of the database
export const db = new SupabaseDB();

// Initialize tables when the app starts
db.initializeTables().catch(console.error);
