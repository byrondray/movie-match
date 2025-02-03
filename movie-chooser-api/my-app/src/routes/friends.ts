import { Hono } from 'hono';
import { getDB } from '../db/client';
import { friends } from '../db/schema/friends';
import { users } from '../db/schema/user';
import { and, eq, or } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

const db = getDB();

const friendsRouter = new Hono()
  .post('/add', async (c) => {
    try {
      const rawBody = await c.req.text();

      const body = JSON.parse(rawBody);

      if (!body || !body.userId || !body.friendId) {
        return c.json({ error: 'userId and friendId are required' }, 400);
      }

      const { userId, friendId } = body;

      if (userId === friendId) {
        return c.json({ error: "You can't add yourself as a friend" }, 400);
      }

      const existingFriendship = await db
        .select()
        .from(friends)
        .where(
          or(
            and(eq(friends.userId, userId), eq(friends.friendId, friendId)),
            and(eq(friends.userId, friendId), eq(friends.friendId, userId))
          )
        );

      if (existingFriendship.length > 0) {
        return c.json({ error: 'Friendship already exists' }, 400);
      }

      await db.insert(friends).values([
        {
          id: uuid(),
          userId,
          friendId,
        },
        {
          id: uuid(),
          userId: friendId,
          friendId: userId,
        },
      ]);

      return c.json({ success: true, message: 'Friend added successfully' });
    } catch (error) {
      console.error('Error adding friend:', error);

      if (error instanceof SyntaxError) {
        return c.json({ error: 'Invalid JSON payload' }, 400);
      }
      return c.json({ error: 'Failed to add friend' }, 500);
    }
  })

  .get('/list/:userId', async (c) => {
    const userId = c.req.param('userId');

    if (!userId) {
      return c.json({ error: 'userId is required' }, 400);
    }

    try {
      const userFriends = await db
        .select({ friends: users })
        .from(friends)
        .leftJoin(users, eq(users.id, friends.friendId))
        .where(eq(friends.userId, userId));

      return c.json({ success: true, friends: userFriends });
    } catch (error) {
      console.error('Error fetching friends:', error);
      return c.json({ error: 'Failed to fetch friends' }, 500);
    }
  })
  .get('/get-by-email/:email', async (c) => {
    const email = c.req.param('email');

    if (!email) {
      return c.json({ error: 'email is required' }, 400);
    }

    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        return c.json({ error: 'No user found with this email' }, 404);
      }

      return c.json({ success: true, user });
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return c.json({ error: 'Failed to fetch user by email' }, 500);
    }
  });

export default friendsRouter;
