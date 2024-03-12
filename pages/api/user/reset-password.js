import { connectToDatabase } from '../../../db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { password, confirmPassword, token } = req.body;

    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
      const db = connectToDatabase();

      // Find user by forget password token
      const users = await db.collection('users').where('forget_password_token', '==', token).get();

      if (users.docs.length < 1) {
        return res.status(404).json({ message: 'Invalid or expired token' });
      }

      const user = { id: users.docs[0].id, ...users.docs[0].data() };

      // Update user's password
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.collection('users').doc(user.id).update({ password: hashedPassword, forget_password_token: null });

      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}