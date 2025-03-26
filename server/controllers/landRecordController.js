import LandRecord from '../models/landRecord.js';
import { AppError } from '../utils/errorHandler.js';
import { ROLES, LAND_RECORD_STATUS } from '../config/constants.js';

class LandRecordController {
  async createLandRecord(req, res, next) {
    try {
      const landRecord = new LandRecord({
        ...req.body,
        owner: req.user._id
      });

      await landRecord.save();

      res.status(201).json({
        status: 'success',
        data: { landRecord }
      });
    } catch (error) {
      next(error);
    }
  }

  async getLandRecords(req, res, next) {
    try {
      let query = {};

      // Role-based filtering
      if (req.user.role === ROLES.OWNER) {
        query.owner = req.user._id;
      } else if (req.user.role === ROLES.BANK) {
        // Bank can only see verified records
        query.status = LAND_RECORD_STATUS.VERIFIED;
      }

      const landRecords = await LandRecord.find(query).populate('owner', 'name email');

      res.status(200).json({
        status: 'success',
        results: landRecords.length,
        data: { landRecords }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLandRecordStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const landRecord = await LandRecord.findById(id);

      if (!landRecord) {
        return next(new AppError('Land record not found', 404));
      }

      // Only government officials can change status
      if (req.user.role !== ROLES.GOVERNMENT) {
        return next(new AppError('Only government officials can update record status', 403));
      }

      landRecord.status = status;
      landRecord.verifiedBy = req.user._id;

      await landRecord.save();

      res.status(200).json({
        status: 'success',
        data: { landRecord }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LandRecordController();