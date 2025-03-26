import User from '../models/user.js';
import TokenService from './tokenService.js';
import { AppError } from '../utils/errorHandler.js';

class AuthService {
  async register(userData) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate token
    const token = TokenService.generateToken(user);

    return { user, token };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.active) {
      throw new AppError('User account is deactivated', 403);
    }

    const token = TokenService.generateToken(user);

    return { user, token };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}

export default new AuthService();