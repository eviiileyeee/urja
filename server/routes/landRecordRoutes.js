import express from 'express';
import LandRecordController from '../controllers/landRecordController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';
import ValidationMiddleware from '../middleware/validationMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.post(
  '/', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(ROLES.OWNER),
  ValidationMiddleware.validateLandRecord,
  LandRecordController.createLandRecord
);

router.get(
  '/', 
  AuthMiddleware.authenticate,
  LandRecordController.getLandRecords
);

router.patch(
  '/:id/status', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(ROLES.GOVERNMENT),
  LandRecordController.updateLandRecordStatus
);

export default router;