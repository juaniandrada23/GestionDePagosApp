import React from 'react';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingModalProps {
  open: boolean;
  text?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ open, text = 'Cargando...' }) => (
  <Modal open={open} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="bg-white px-8 py-6 rounded-2xl shadow-lg flex flex-col items-center gap-3 outline-none">
      <CircularProgress sx={{ color: '#006989' }} />
      <p className="text-sm font-medium text-gray-600">{text}</p>
    </div>
  </Modal>
);

export default LoadingModal;
