import React, { createContext, useState, useContext, useCallback } from 'react';
import { landRecordService } from '../services/landRecordService';
import { useAuth } from './AuthContext';

const LandRecordContext = createContext(null);

export const LandRecordProvider = ({ children }) => {
  const [landRecords, setLandRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchLandRecords = useCallback(async () => {
    setLoading(true);
    try {
      const records = await landRecordService.getLandRecords();
      setLandRecords(records);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch land records');
    } finally {
      setLoading(false);
    }
  }, []);

  const createLandRecord = async (recordData) => {
    setLoading(true);
    try {
      const newRecord = await landRecordService.createLandRecord(recordData);
      setLandRecords(prev => [...prev, newRecord.data.landRecord]);
      setError(null);
      return newRecord;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create land record');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLandRecordStatus = async (recordId, status) => {
    setLoading(true);
    try {
      const updatedRecord = await landRecordService.updateLandRecordStatus(recordId, status);
      setLandRecords(prev => 
        prev.map(record => 
          record._id === recordId ? updatedRecord.data.landRecord : record
        )
      );
      setError(null);
      return updatedRecord;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update land record status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LandRecordContext.Provider 
      value={{ 
        landRecords, 
        loading, 
        error, 
        fetchLandRecords, 
        createLandRecord, 
        updateLandRecordStatus 
      }}
    >
      {children}
    </LandRecordContext.Provider>
  );
};

export const useLandRecords = () => {
  const context = useContext(LandRecordContext);
  if (!context) {
    throw new Error('useLandRecords must be used within a LandRecordProvider');
  }
  return context;
};