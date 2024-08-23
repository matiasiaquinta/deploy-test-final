import { useEffect, useState } from "react";
import Layout from "../components/ui/Layout";
import { getAlumnosPagosRequest } from "../api/alumnos";

const Reportes = () => {
    const [totalRecaudado, setTotalRecaudado] = useState(0);
    const [mesSeleccionado, setMesSeleccionado] = useState(1);
    const [añoSeleccionado, setAñoSeleccionado] = useState(
        new Date().getFullYear()
    );

    const handleMesChange = (event) => {
        setMesSeleccionado(parseInt(event.target.value, 10));
    };

    const handleAñoChange = (event) => {
        setAñoSeleccionado(parseInt(event.target.value, 10));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { totalRecaudado } = await getAlumnosPagosRequest(
                    mesSeleccionado,
                    añoSeleccionado
                );

                /*                 
                console.log("mes", mesSeleccionado);
                console.log("año", añoSeleccionado);
                console.log("total", totalRecaudado);
                */

                // Actualizar estados
                setTotalRecaudado(totalRecaudado);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchData();
    }, [mesSeleccionado, añoSeleccionado]); // Dependencias para volver a cargar los datos cuando cambien

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-3xl uppercase text-center font-bold ">
                    Reportes
                </h1>

                <hr className="w-52 m-auto border-2 border-paleta_3 mt-2 mb-6" />

                <label htmlFor="mes" className="block text-lg font-medium mb-2">
                    Seleccionar mes:
                </label>
                <select
                    id="mes"
                    value={mesSeleccionado}
                    onChange={handleMesChange}
                    className="block w-full border text-black border-gray-300 rounded-md p-2 mb-4"
                >
                    <option value={1}>Enero</option>
                    <option value={2}>Febrero</option>
                    <option value={3}>Marzo</option>
                    <option value={4}>Abril</option>
                    <option value={5}>Mayo</option>
                    <option value={6}>Junio</option>
                    <option value={7}>Julio</option>
                    <option value={8}>Agosto</option>
                    <option value={9}>Septiembre</option>
                    <option value={10}>Octubre</option>
                    <option value={11}>Noviembre</option>
                    <option value={12}>Diciembre</option>
                </select>

                <label htmlFor="año" className="block text-lg font-medium mb-2">
                    Seleccionar año:
                </label>
                <select
                    id="año"
                    value={añoSeleccionado}
                    onChange={handleAñoChange}
                    className="block w-full border text-black border-gray-300 rounded-md p-2 mb-4"
                >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    {/* Añadir más años según sea necesario */}
                </select>

                <div className="text-lg text-center flex flex-col gap-4">
                    Total recaudado en{" "}
                    {new Date(0, mesSeleccionado - 1).toLocaleString("es-ES", {
                        month: "long",
                    })}{" "}
                    {añoSeleccionado}:
                    <span className="text-3xl font-bold">
                        ${totalRecaudado.toLocaleString("es-ES")}
                    </span>
                </div>
            </div>
        </Layout>
    );
};

export default Reportes;
