import React, { useState } from 'react';
import SyncIcon from '../../assets/icons/sync.svg?react';

interface SyncButtonProps {
  onSync: () => Promise<void>;
  lastSyncTime?: Date;
  isLoading?: boolean;
}

export const SyncButton: React.FC<SyncButtonProps> = ({ 
  onSync, 
  lastSyncTime,
  isLoading = false
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Use external loading state if provided, otherwise use internal state
  const syncInProgress = isLoading || isSyncing;

  const handleSync = async () => {
    if (!isLoading) {
      setIsSyncing(true);
    }
    try {
      await onSync();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      if (!isLoading) {
        setIsSyncing(false);
      }
    }
  };

  const formatLastSync = (date: Date | undefined): string => {
    if (!date) return 'Never synced';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getSyncStatusColor = (): string => {
    if (!lastSyncTime) return 'text-gray-500';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSyncTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 5) return 'text-green-600';
    if (diffInMinutes < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              syncInProgress ? 'bg-blue-500 animate-pulse' : 
              lastSyncTime ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm font-medium text-gray-700">
              Order Sync Status
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Last sync: <span className={getSyncStatusColor()}>{formatLastSync(lastSyncTime)}</span>
          </div>
        </div>
        
        <button
          onClick={handleSync}
          disabled={syncInProgress}
          className={`user-guide-sync-orders px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
            syncInProgress
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          <SyncIcon 
            className={`w-4 h-4 ${syncInProgress ? 'animate-spin' : ''}`} 
          />
          {syncInProgress ? 'Syncing...' : 'Sync Orders'}
        </button>
      </div>
      
      {syncInProgress && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            Synchronizing order details with server...
          </div>
        </div>
      )}
    </div>
  );
};
