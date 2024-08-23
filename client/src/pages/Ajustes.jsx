import { Link } from "react-router-dom";
import Layout from "../components/ui/Layout";
import {
    FaArrowRight,
    FaFutbol,
    FaListAlt,
    FaTasks,
    FaUser,
} from "react-icons/fa";

const Ajustes = () => {
    return (
        <Layout>
            <h1 className="mt-4 text-3xl uppercase text-center font-bold ">
                Ajustes
            </h1>
            <hr className="w-52 m-auto border-2 border-paleta_3 mt-2 mb-6" />

            <div>
                <Link
                    to="/reportes"
                    className="flex items-center justify-between text-2xl rounded py-4 bg-paleta_2 text-white w-full mt-10 px-9"
                >
                    <div className="flex items-center">
                        <FaListAlt className="mr-4" />
                        <span>Reportes</span>
                    </div>
                    <FaArrowRight />
                </Link>

                <Link
                    to="/planes"
                    className="flex items-center justify-between text-2xl rounded py-4 bg-paleta_2 text-white w-full mt-4 px-9"
                >
                    <div className="flex items-center">
                        <FaTasks className="mr-4" />
                        <span>Planes</span>
                    </div>
                    <FaArrowRight />
                </Link>

                <Link
                    //to="/"
                    className="flex items-center justify-between text-2xl rounded py-4 bg-gray-400 text-white w-full mt-4 px-9"
                >
                    <div className="flex items-center">
                        <FaFutbol className="mr-4" />
                        <span>Deportes</span>
                    </div>
                    <FaArrowRight />
                </Link>

                <Link
                    //to="/"
                    className="flex items-center justify-between text-2xl rounded py-4 bg-gray-400 text-white w-full mt-4 px-9"
                >
                    <div className="flex items-center">
                        <FaUser className="mr-4" />
                        <span>Perfil</span>
                    </div>
                    <FaArrowRight />
                </Link>
            </div>
        </Layout>
    );
};

export default Ajustes;
