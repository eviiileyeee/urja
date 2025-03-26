import api from './api';

export const landRecordService = {
  async createLandRecord(recordData) {
    const response = await api.post('/land-records', recordData);
    return response.data;
  },

  async getLandRecords() {
    const response = await api.get('/land-records');
    return response.data.data.landRecords;
  },

  async updateLandRecordStatus(recordId, status) {
    const response = await api.patch(`/land-records/${recordId}/status`, { status });
    return response.data;
  }
};