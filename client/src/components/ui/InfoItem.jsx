/*
    Cree este componente porque sino habia muchisimo codigo en AlumnoCard.jsx
    Esto contiene toda la información dentro de cada CARD -> ej: Nombre: Pedro.
*/

export const InfoItem = ({ label, value }) => {
    return (
        <div className="flex flex-col items-center w-full">
            <span className="bg-paleta_1 uppercase font-bold text-sm p-2 text-center text-white w-full">
                {label}
            </span>
            <p className="text-black py-4 text-center text-xl w-full border-2 border-gray-500 border-t-0">
                {value}
            </p>
        </div>
    );
};
