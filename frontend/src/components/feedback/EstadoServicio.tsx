import React, { useState, useEffect } from 'react';
import { MdWifiOff, MdClose } from 'react-icons/md';
import { env } from '@/config/env';
import { SERVER_CHECK_INTERVAL_MS } from '@/config/constants';

const EstadoServicio: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await fetch(`${env.API_URL}/health`);
        setVisible(false);
      } catch {
        setVisible(true);
      }
    };
    checkServer();
    const intervalId = setInterval(checkServer, SERVER_CHECK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 animate-slide-up">
      <div className="flex items-center gap-3 pl-4 pr-3 py-3 bg-gray-900 text-white rounded-xl shadow-lg shadow-black/20 max-w-sm">
        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <MdWifiOff className="text-red-400 text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Sin conexion al servidor</p>
          <p className="text-xs text-gray-400 mt-0.5">Reintentando automaticamente...</p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <MdClose className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EstadoServicio;
