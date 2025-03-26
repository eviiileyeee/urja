import TokenService from '../services/tokenService.js';
import { AppError } from '../utils/errorHandler.js';
import User from '../models/user.js';

const authMiddleware = {
  // General authentication middleware
  async authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Please provide a valid token', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = TokenService.verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new AppError('User not found', 401));
      }

      req.user = user;
      next();
    } catch (error) {
      next(new AppError('Authentication failed', 401));
    }
  },

  // Role-based authorization middleware
  authorize(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      if (!roles.includes(req.user.role)) {
        return next(new AppError('You are not authorized to access this resource', 403));
      }

      next();
    };
  },

  // Owner-specific access middleware
  async ownerAccess(req, res, next) {
    try {
      const recordId = req.params.id;
      const landRecord = await LandRecord.findById(recordId);

      if (!landRecord) {
        return next(new AppError('Land record not found', 404));
      }

      if (landRecord.owner.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only access your own land records', 403));
      }

      next();
    } catch (error) {
      next(new AppError('Error accessing land record', 500));
    }
  }
};

export default authMiddleware;