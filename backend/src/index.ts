require('dotenv').config();
import { seedData } from './firebase/seed';

async function main() {
  try {
    console.log('Starting to seed data...');
    await seedData();
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

main(); 