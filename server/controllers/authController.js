import AuthService from '../services/authService.js';
import { AppError } from '../utils/errorHandler.js';

class AuthController {
  async register(req, res, next) {
    try {
      const { user, token } = await AuthService.register(req.body);
      
      res.status(201).json({
        status: 'success',
        token,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);

      res.status(200).json({
        status: 'success',
        token,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await AuthService.getUserProfile(req.user._id);
      
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    // In a stateless JWT system, logout is typically handled client-side by removing the token
    try {
      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();