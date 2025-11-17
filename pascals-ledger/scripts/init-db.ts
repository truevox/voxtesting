/**
 * Database initialization script
 * Run with: npx ts-node scripts/init-db.ts
 */

import { initializeDatabase, closePool } from '../src/lib/db';

async function main() {
  console.log('🚀 Starting database initialization...\n');

  try {
    await initializeDatabase();
    console.log('\n✅ Database initialized successfully!');
    console.log('\nCreated tables:');
    console.log('  - users');
    console.log('  - hashes');
    console.log('  - pec_rolling_hashes');
    console.log('  - hash_storage_locations');
    console.log('  - payment_transactions');
    console.log('\n🎉 Ready to go! Run "npm run dev" to start the server.\n');
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

main();
