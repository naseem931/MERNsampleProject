import jwt from 'jsonwebtoken';

export const generateToken = (userId, role = 'member') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'devflow_jwt_secret_fallback',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    }
  );
};
