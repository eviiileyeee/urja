import mongoose from 'mongoose';
import { LAND_RECORD_STATUS } from '../config/constants.js';

const LandRecordSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: Number,
    required: true
  },
  marketValue: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(LAND_RECORD_STATUS),
    default: LAND_RECORD_STATUS.UNDER_DISPUTE
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('LandRecord', LandRecordSchema);