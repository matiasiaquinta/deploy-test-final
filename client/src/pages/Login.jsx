import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import sfLogo from "../assets/sfLogo.png";

export function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { signin, errors: signinErrors, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const onSubmit = handleSubmit((data) => {
        signin(data);
    });

    //para redireccionar la pagina
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

    return (
        <div className="flex h-screen items-center justify-center text-black">
            <div className="bg-cyan-500 w-4/5 m-auto p-10 rounded-md">
                <div className="pb-4">
                    <img
                        src={sfLogo}
                        alt=""
                        width={150}
                        className="rounded-md m-auto"
                    />
                </div>
                <div className="text-2xl text-center mb-6">
                    <span>Bienvenido a </span>
                    <span className="block font-bold">Sin Fronteras Club</span>
                </div>

                {signinErrors.map((error, i) => (
                    <div
                        className="bg-red-500 font-bold p-2 text-white text-center my-2"
                        key={i}
                    >
                        {error}
                    </div>
                ))}
                <h1 className="text-lg text-center">Iniciar Sesión</h1>
                <form onSubmit={onSubmit}>
                    <input
                        type="email"
                        {...register("email", { required: true })}
                        placeholder="Email"
                        className="w-full bg-white px-4 py-2 my-2 rounded-md"
                    />
                    {errors.email && (
                        <p className="text-red-500 font-bold">
                            Ingrese un email
                        </p>
                    )}
                    <input
                        type="password"
                        {...register("password", { required: true })}
                        placeholder="Password"
                        className="w-full bg-white px-4 py-2 my-2 rounded-md"
                    />
                    {errors.password && (
                        <p className="text-red-500 font-bold">
                            Ingrese una contraseña
                        </p>
                    )}

                    <button
                        type="submit"
                        className="bg-cyan-800 text-white px-5 py-2 rounded-md flex m-auto mt-4"
                    >
                        Ingresar
                    </button>
                </form>
                {/* 
                <p className="flex gap-x-2">
                    ¿No tenes cuenta?{" "}
                    <Link to="/register" className="">
                        Registrate
                    </Link>
                </p>
                 */}
            </div>
        </div>
    );
}
