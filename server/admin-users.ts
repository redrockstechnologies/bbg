
import { Request, Response } from 'express';
import { db } from '../lib/database';
import { adminUsers, roles } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export async function createAdminUser(req: Request, res: Response) {
  try {
    const userData = req.body;
    const result = await db.insert(adminUsers).values(userData).returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
}

export async function getAdminUsers(req: Request, res: Response) {
  try {
    const users = await db.select().from(adminUsers);
    res.json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
}

export async function checkUserExists(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const user = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ exists: true });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Failed to check user' });
  }
}

export async function activateUser(req: Request, res: Response) {
  try {
    const { email } = req.body;
    await db.update(adminUsers)
      .set({ hasPassword: true })
      .where(eq(adminUsers.email, email));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({ error: 'Failed to activate user' });
  }
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const user = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}

export async function createRole(req: Request, res: Response) {
  try {
    const roleData = req.body;
    const result = await db.insert(roles).values(roleData).returning();
    res.json(result[0]);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
}

export async function getRoles(req: Request, res: Response) {
  try {
    const allRoles = await db.select().from(roles);
    res.json(allRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
}
