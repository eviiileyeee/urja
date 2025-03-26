import React, { useEffect } from 'react';
import { useLandRecords } from '../context/LandRecordContext';
import { useAuth } from '../context/AuthContext';
import { ROLES, LAND_RECORD_STATUS } from '../utils/constants';

const LandRecordList = () => {
  const { landRecords, loading, error, fetchLandRecords, updateLandRecordStatus } = useLandRecords();
  const { user } = useAuth();

  useEffect(() => {
    fetchLandRecords();
  }, [fetchLandRecords]);

  const handleStatusUpdate = async (recordId, status) => {
    try {
      await updateLandRecordStatus(recordId, status);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Market Value
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  {user?.role === ROLES.GOVERNMENT && (
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {landRecords.map((record) => (
                  <tr key={record._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {record.location}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {record.area} sq.m
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      ${record.marketValue.toLocaleString()}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === LAND_RECORD_STATUS.VERIFIED 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-yellow-200 text-yellow-800'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    {user?.role === ROLES.GOVERNMENT && (
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {record.status === LAND_RECORD_STATUS.UNDER_DISPUTE && (
                          <button
                            onClick={() => handleStatusUpdate(record._id, LAND_RECORD_STATUS.VERIFIED)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandRecordList;