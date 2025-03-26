import { registerSchema, loginSchema, landRecordSchema } from '../utils/validationSchemas.js';
import { AppError } from '../utils/errorHandler.js';

const validationMiddleware = {
  validateRegistration(req, res, next) {
    const { error } = registerSchema.validate(req.body);
    
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    
    next();
  },

  validateLogin(req, res, next) {
    const { error } = loginSchema.validate(req.body);
    
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    
    next();
  },

  validateLandRecord(req, res, next) {
    const { error } = landRecordSchema.validate(req.body);
    
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    
    next();
  }
};

export default validationMiddleware;