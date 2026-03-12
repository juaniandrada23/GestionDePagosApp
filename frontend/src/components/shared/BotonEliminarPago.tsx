import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { pagosService } from '@/services/pagos.service';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import AppSnackbar from '@/components/feedback/AppSnackbar';
import { useMobileScreen } from '@/hooks/useMobileScreen';
import type { Pago } from '@/types/pago';

interface Props {
  pago: Pago;
  actualizarPagos: () => void;
}

const BotonEliminarPago: React.FC<Props> = ({ pago, actualizarPagos }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const isMobile = useMobileScreen();

  const borrarPago = () => {
    setModalOpen(false);
    setSnackbarOpen(false);
    pagosService
      .eliminar(pago.idPago)
      .then(() => {
        actualizarPagos();
        setSnackbarMessage('Pago borrado correctamente');
        setSnackbarOpen(true);
      })
      .catch(() => {});
  };

  return (
    <>
      <button
        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        onClick={() => setModalOpen(true)}
        title="Eliminar pago"
      >
        <MdDelete className="text-lg" />
      </button>
      <ConfirmDialog
        open={modalOpen}
        title="Confirmar borrado de pago"
        message={`¿Está seguro de que quiere borrar el pago "${pago.idPago}"?`}
        onConfirm={borrarPago}
        onCancel={() => setModalOpen(false)}
        destructive
      />
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        isMobile={isMobile}
      />
    </>
  );
};

export default BotonEliminarPago;
