import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { BsFileTextFill } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import type { Pago } from '@/types/pago';

interface Props {
  pago: Pago;
}

const BotonVerDescripcion: React.FC<Props> = ({ pago }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        className="p-2 rounded-lg text-[#006989] hover:bg-[#006989]/10 transition-colors"
        onClick={() => setModalOpen(true)}
        title="Ver descripción"
      >
        <BsFileTextFill className="text-lg" />
      </button>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        PaperProps={{
          sx: { borderRadius: '16px', maxWidth: '440px', width: '100%', overflow: 'hidden' },
        }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <h2 className="text-base font-semibold text-gray-800">Descripción del pago</h2>
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <MdClose className="text-lg" />
          </button>
        </div>
        <div className="px-6 pb-6">
          {pago.descripcion ? (
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
              {pago.descripcion}
            </p>
          ) : (
            <div className="text-center py-6">
              <BsFileTextFill className="text-3xl text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Este pago no posee descripción</p>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default BotonVerDescripcion;
