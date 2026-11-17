import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'devflow_jwt_secret_fallback'
      );

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return sendError(res, 'User no longer exists', 401);
      }

      return next();
    } catch (error) {
      return sendError(res, 'Not authorized, token failed or expired', 401);
    }
  }

  if (!token) {
    return sendError(res, 'Not authorized, no token provided', 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`,
        403
      );
    }
    next();
  };
};
