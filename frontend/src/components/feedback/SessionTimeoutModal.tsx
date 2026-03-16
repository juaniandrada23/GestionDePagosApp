import React from 'react';
import { MdAccessTime } from 'react-icons/md';
import Modal from '@/components/shared/Modal';
import { BTN_CANCEL, BTN_PRIMARY } from '@/config/constants';
import { useIdleTimer } from '@/hooks/useIdleTimer';

const noop = () => {};

const SessionTimeoutModal: React.FC = () => {
  const { showWarning, secondsLeft, extendSession, doLogout } = useIdleTimer();

  return (
    <Modal
      open={showWarning}
      onClose={noop}
      title="Sesión a punto de expirar"
      subtitle={`Tu sesión se cerrará en ${secondsLeft} segundos por inactividad.`}
      icon={<MdAccessTime className="text-xl text-[#006989]" />}
      footer={
        <>
          <button type="button" onClick={doLogout} className={BTN_CANCEL}>
            Cerrar sesión
          </button>
          <button type="button" onClick={extendSession} className={BTN_PRIMARY}>
            Extender sesión
          </button>
        </>
      }
    />
  );
};

export default SessionTimeoutModal;
