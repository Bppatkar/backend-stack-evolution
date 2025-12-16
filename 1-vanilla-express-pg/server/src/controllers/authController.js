import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Please provide email, password and name',
      });
    }

    const userExists = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, name)
      VALUES ($1,$2,$3)
      RETURNING id, email,name, created_at`,
      [email, hashedPass, name]
    );

    const newUser = result.rows[0];

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );


    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Server error during registration',
      details: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const user = result.rows[0];
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error during login',
      details: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT id, email, name, created_at FROM users WHERE id = $1`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User Profile Fetched Successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Server error fetching profile',
    });
  }
};
