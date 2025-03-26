import Joi from 'joi';
import { ROLES } from '../config/constants.js';

export const registerSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().trim().lowercase().required(),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase, one lowercase, one number, and one special character'
    }),
  role: Joi.string().valid(...Object.values(ROLES)).required(),
  
  // Conditional validation based on role
  aadhaar: Joi.string().when('role', {
    is: ROLES.OWNER,
    then: Joi.string().length(12).pattern(/^[0-9]{12}$/).required(),
    otherwise: Joi.forbidden()
  }),
  govtId: Joi.string().when('role', {
    is: ROLES.GOVERNMENT,
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  bankId: Joi.string().when('role', {
    is: ROLES.BANK,
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().required()
});

export const landRecordSchema = Joi.object({
  location: Joi.string().trim().required(),
  area: Joi.number().positive().required(),
  marketValue: Joi.number().positive().required()
});