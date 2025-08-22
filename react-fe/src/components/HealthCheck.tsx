import React, { useState, useEffect } from 'react';
import { healthAPI } from '../services/api';

const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<string>('');

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      setStatus('checking');
      const response = await healthAPI.check();
      setStatus('healthy');
      setLastCheck(new Date(response.timestamp).toLocaleTimeString());
    } catch (error) {
      setStatus('error');
      setLastCheck(new Date().toLocaleTimeString());
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`px-3 py-2 rounded-lg shadow-lg text-sm flex items-center space-x-2 ${
        status === 'healthy' 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : status === 'error'
          ? 'bg-red-100 text-red-800 border border-red-200'
          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          status === 'healthy' ? 'bg-green-500' :
          status === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
        }`}></div>
        <span>
          {status === 'healthy' && 'Backend Connected'}
          {status === 'error' && 'Backend Offline'}
          {status === 'checking' && 'Checking...'}
        </span>
        {lastCheck && (
          <span className="text-xs opacity-70">
            {lastCheck}
          </span>
        )}
      </div>
    </div>
  );
};

export default HealthCheck;
