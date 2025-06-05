
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { 
  adminUsers, 
  roles, 
  users,
  gearItems,
  testimonials,
  contactMessages,
  deliveryRates,
  priceGuides,
  websiteImages
} from '../shared/schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { 
  schema: { 
    adminUsers, 
    roles, 
    users,
    gearItems,
    testimonials,
    contactMessages,
    deliveryRates,
    priceGuides,
    websiteImages
  } 
});
