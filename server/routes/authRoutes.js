import express from 'express';
import AuthController from '../controllers/authController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';
import ValidationMiddleware from '../middleware/validationMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.post(
  '/register', 
  ValidationMiddleware.validateRegistration, 
  AuthController.register
);

router.post(
  '/login', 
  ValidationMiddleware.validateLogin, 
  AuthController.login
);

router.post('/logout', 
  AuthMiddleware.authenticate, 
  AuthController.logout
);

router.get(
  '/profile', 
  AuthMiddleware.authenticate, 
  AuthController.getProfile
);

export default router;