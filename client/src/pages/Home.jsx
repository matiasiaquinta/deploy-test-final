/*
    DASHBOARD

*/

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAlumnosStatsRequest } from "../api/alumnos";
import Layout from "../components/ui/Layout";
import { FaArrowRight } from "react-icons/fa";

const Home = () => {
    const [totalAlumnos, setTotalAlumnos] = useState(0);
    const [abonaron, setAbonaron] = useState(0);
    const [noAbonaron, setNoAbonaron] = useState(0);
    const [alumnosNoAbonaron, setAlumnosNoAbonaron] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Función para obtener los datos de la API
        const fetchData = async () => {
            try {
                const {
                    totalAlumnos,
                    abonaron,
                    noAbonaron,
                    alumnosNoAbonaron,
                } = await getAlumnosStatsRequest();

                // Agregar console.log para ver los valores recibidos
                /*                 console.log("Datos recibidos:", {
                    totalAlumnos,
                    abonaron,
                    noAbonaron,
                    alumnosNoAbonaron,
                }); */

                // Actualizar estados
                setTotalAlumnos(totalAlumnos);
                setAbonaron(abonaron);
                setNoAbonaron(noAbonaron);
                setAlumnosNoAbonaron(alumnosNoAbonaron);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Layout>
            <div className="mt-10 text-white">
                <div className="text-center text-xl uppercase text-black block relative w-full before:h-1 before:bg-paleta_3 before:absolute before:w-full before:left-0 before:top-1/2 before:translate-y-1/2 before:z-0">
                    <span className="relative z-10 bg-white px-2">
                        Información
                    </span>
                </div>

                <div
                    className="bg-paleta_2 my-2 p-4 rounded-md shadow-md hover:bg-paleta_1"
                    onClick={() => navigate("/alumnos")}
                >
                    <span className="text-2xl font-bold mr-2">
                        {totalAlumnos}
                    </span>
                    <span>Alumnos Registrados</span>
                </div>

                <div
                    className="bg-paleta_2 my-2 p-4 rounded-md shadow-md hover:bg-paleta_1"
                    onClick={() =>
                        navigate("/alumnos", { state: { abono: false } })
                    }
                >
                    <span className="text-2xl font-bold mr-2">
                        {noAbonaron}
                    </span>
                    <span>Faltan Abonar</span>
                </div>

                <div
                    className="bg-paleta_2 my-2 p-4 rounded-md shadow-md hover:bg-paleta_1"
                    onClick={() =>
                        navigate("/alumnos", { state: { abono: true } })
                    }
                >
                    <span className="text-2xl font-bold mr-2">{abonaron}</span>
                    <span>Ya Abonaron</span>
                </div>

                <div className="mt-10 text-center text-xl uppercase text-black block relative w-full before:h-1 before:bg-paleta_3 before:absolute before:w-full before:left-0 before:top-1/2 before:translate-y-1/2 before:z-0">
                    <span className="relative z-10 bg-white px-2">Atajos</span>
                </div>

                <div
                    className="bg-paleta_2 my-2 p-4 rounded-md shadow-md hover:bg-paleta_1 text-xl flex items-center justify-between px-8"
                    onClick={() => navigate("/alumnos")}
                >
                    <span>Crear Alumno</span>
                    <FaArrowRight className="text-xl" />
                </div>

                <div
                    className="bg-paleta_2 my-2 p-4 rounded-md shadow-md hover:bg-paleta_1 text-xl flex items-center justify-between px-8"
                    onClick={() => navigate("/reportes")}
                >
                    <span>Ver Reportes</span>
                    <FaArrowRight className="text-xl" />
                </div>
            </div>
        </Layout>
    );
};

export default Home;
