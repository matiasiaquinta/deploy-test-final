import { useState } from 'react';
import { Popup } from './PopUp';
import PropTypes from 'prop-types';

export function Card({ alumno }) {
  const [openViewMoreModal, setOpenViewMoreModal] = useState(false);
  const handleOpenViewMoreModal = () => {
    setOpenViewMoreModal(true);
  };
  const handleCloseViewMoreModal = () => {
    setOpenViewMoreModal(false);
  };
  return (
    <div className="flex justify-center items-center my-8">
      <div className="bg-slate-400 rounded-lg shadow-md p-6 max-w-sm text-center">
        <h2 className="text-xl font-bold text-gray-800">{alumno.nombre}</h2>
        <p className="text-gray-600 mt-4">
          Fecha de último pago: {alumno.fechaComienzo}
        </p>
        <button
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleOpenViewMoreModal}
        >
          Ver más
        </button>
        {openViewMoreModal && (
          <Popup alumno={alumno} onClose={handleCloseViewMoreModal} />
        )}
      </div>
    </div>
  );
}

Card.propTypes = {
  alumno: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    mail: PropTypes.string,
    telefono: PropTypes.string,
    deporte: PropTypes.string,
    plan: PropTypes.string,
    fechaComienzo: PropTypes.string,
    precioEfectivo: PropTypes.string,
    precioTransferencia: PropTypes.string,
    abono: PropTypes.bool,
  }).isRequired,
};
